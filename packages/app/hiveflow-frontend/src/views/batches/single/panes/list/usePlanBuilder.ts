import { useState, useMemo, useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useBatchContext } from '../../context';

// ── Draft item type ──────────────────────────────────────────────────
export interface DraftItem {
    key: string;
    parentKey: string | null;
    parentServerId: string | null;
    title: string;
    startDate: string;
    endDate: string;
    estimatedHours: string;
}

let keyCounter = 0;
export const nextKey = () => `draft-${Date.now()}-${++keyCounter}`;

// ── Flat tree item (server or draft) ────────────────────────────────
export interface FlatItem {
    id: string;
    isDraft: boolean;
    parentId: string | null;
    depth: number;
    isLast: boolean;
    connectors: boolean[];
    item: any;
}

export function flattenTree(
    serverItems: any[],
    draftItems: DraftItem[],
    deletedIds?: Set<string>,
): FlatItem[] {
    const draftByParent = new Map<string | null, DraftItem[]>();
    for (const d of draftItems) {
        const pid = d.parentServerId || d.parentKey;
        const list = draftByParent.get(pid) || [];
        list.push(d);
        draftByParent.set(pid, list);
    }

    const result: FlatItem[] = [];

    function walk(serverChildren: any[], parentId: string | null, depth: number, parentConnectors: boolean[]) {
        const localDrafts = draftByParent.get(parentId) || [];
        const all = [
            ...serverChildren
                .filter((s) => !deletedIds?.has(s.id))
                .map((s) => ({ kind: 'server' as const, data: s })),
            ...localDrafts.map((d) => ({ kind: 'draft' as const, data: d })),
        ];

        for (let i = 0; i < all.length; i++) {
            const { kind, data } = all[i];
            const isLast = i === all.length - 1;
            const connectors = [...parentConnectors, !isLast];
            const id = kind === 'server' ? data.id : data.key;

            result.push({ id, isDraft: kind === 'draft', parentId, depth, isLast, connectors, item: data });

            const childDrafts = draftByParent.get(id) || [];
            if (kind === 'server') {
                walk(data.children || [], data.id, depth + 1, connectors);
            } else if (childDrafts.length > 0) {
                walk([], id, depth + 1, connectors);
            }
        }
    }

    walk(serverItems, null, 0, []);
    return result;
}

// ── Edit state types ────────────────────────────────────────────────
export interface ItemEdits {
    scheduledStart?: string | null;
    scheduledEnd?: string | null;
    estimatedHours?: string | null;
    parentItemId?: string | null;
    notes?: string | null;
}

export interface TaskEdits {
    title?: string;
    description?: string;
}

// ── Hook ────────────────────────────────────────────────────────────
export function usePlanBuilder() {
    const { batchId, projectId, items, refetch: refetchBatch } = useBatchContext();

    const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
    const [itemEdits, setItemEdits] = useState<Map<string, ItemEdits>>(new Map());
    const [taskEdits, setTaskEdits] = useState<Map<string, TaskEdits>>(new Map());
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);

    const flat = useMemo(
        () => flattenTree(items || [], draftItems, deletedIds),
        [items, draftItems, deletedIds],
    );

    // ── Whether there are any unsaved local changes ──────────
    const hasPendingChanges = draftItems.length > 0 || itemEdits.size > 0 || taskEdits.size > 0 || deletedIds.size > 0;

    // ── Mutations ──────────────────────────────────────────
    const [addItem] = useMutation(
        gql`mutation AddBatchItem($batchId: ID!, $input: PlanBatchItemInput!) {
            addPlanBatchItem(batchId: $batchId, input: $input) { id }
        }`,
        { refetchQueries: ['GetBatchDetail'] },
    );
    const [createProjectTask] = useMutation(
        gql`mutation CreateProjectTask($input: ProjectTaskInput!) {
            createProjectTask(input: $input) { id title }
        }`,
    );
    const [updateProjectTask] = useMutation(
        gql`mutation UpdateProjectTask($id: ID!, $input: ProjectTaskInput!) {
            updateProjectTask(id: $id, input: $input) { id }
        }`,
    );
    const [updateItem] = useMutation(
        gql`mutation UpdateBatchItem($id: ID!, $input: PlanBatchItemUpdateInput!) {
            updatePlanBatchItem(id: $id, input: $input) { id }
        }`,
    );
    const [removeItem] = useMutation(
        gql`mutation RemoveBatchItem($id: ID!) {
            removePlanBatchItem(id: $id) { id }
        }`,
        { refetchQueries: ['GetBatchDetail'] },
    );

    // ── Draft CRUD ─────────────────────────────────────────
    const addDraft = (title: string, start: string, end: string, hours: string, parentKey: string | null, parentServerId: string | null, key?: string) => {
        const k = key || nextKey();
        setDraftItems((prev) => [...prev, {
            key: k, parentKey, parentServerId,
            title: title.trim(), startDate: start, endDate: end, estimatedHours: hours,
        }]);
        return k;
    };

    const updateDraft = (key: string, patch: Partial<DraftItem>) => {
        setDraftItems((prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)));
    };

    const deleteDraft = (key: string) => {
        // Also delete any children recursively
        const removeKeys = new Set<string>([key]);
        let changed = true;
        while (changed) {
            changed = false;
            for (const d of draftItems) {
                if (!removeKeys.has(d.key) && d.parentKey && removeKeys.has(d.parentKey)) {
                    removeKeys.add(d.key);
                    changed = true;
                }
            }
        }
        setDraftItems((prev) => prev.filter((d) => !removeKeys.has(d.key)));
    };

    const indentDraft = (key: string, flatList: FlatItem[]) => {
        const idx = flatList.findIndex((f) => f.id === key);
        if (idx <= 0) return;
        const prevSibling = flatList[idx - 1];
        if (prevSibling.id === key) return;

        setDraftItems((prev) =>
            prev.map((d) => {
                if (d.key !== key) return d;
                return {
                    ...d,
                    parentKey: prevSibling.isDraft ? prevSibling.id : null,
                    parentServerId: prevSibling.isDraft ? null : prevSibling.id,
                };
            }),
        );
    };

    const outdentDraft = (key: string, flatList: FlatItem[]) => {
        const item = draftItems.find((d) => d.key === key);
        if (!item || (!item.parentKey && !item.parentServerId)) return;

        const parentId = item.parentServerId || item.parentKey;
        const parent = flatList.find((f) => f.id === parentId);
        if (!parent || !parent.parentId) {
            setDraftItems((prev) =>
                prev.map((d) => (d.key === key ? { ...d, parentKey: null, parentServerId: null } : d)),
            );
            return;
        }

        const grandparent = flatList.find((f) => f.id === parent.parentId);
        if (!grandparent) return;

        setDraftItems((prev) =>
            prev.map((d) => {
                if (d.key !== key) return d;
                return {
                    ...d,
                    parentKey: grandparent.isDraft ? grandparent.id : null,
                    parentServerId: grandparent.isDraft ? null : grandparent.id,
                };
            }),
        );
    };

    // ── Server-item edit queue ─────────────────────────────
    const editItemField = useCallback((itemId: string, field: string, value: string) => {
        setItemEdits((prev) => {
            const next = new Map(prev);
            const current = next.get(itemId) || {};
            next.set(itemId, { ...current, [field]: value || null });
            return next;
        });
    }, []);

    const editTaskField = useCallback((taskId: string, field: string, value: string) => {
        setTaskEdits((prev) => {
            const next = new Map(prev);
            const current = next.get(taskId) || {};
            next.set(taskId, { ...current, [field]: value });
            return next;
        });
    }, []);

    const markDeleted = useCallback((itemId: string) => {
        setDeletedIds((prev) => new Set(prev).add(itemId));
        // Also remove any pending edits for this item
        setItemEdits((prev) => {
            const next = new Map(prev);
            next.delete(itemId);
            return next;
        });
        // And remove any child drafts whose parent is this item
        setDraftItems((prev) => {
            const removeKeys = new Set<string>();
            for (const d of prev) {
                if (d.parentServerId === itemId) removeKeys.add(d.key);
            }
            if (removeKeys.size === 0) return prev;
            return prev.filter((d) => !removeKeys.has(d.key));
        });
    }, []);

    const unmarkDeleted = useCallback((itemId: string) => {
        setDeletedIds((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
        });
    }, []);

    // ── Effective value helpers (for rendering) ───────────
    const getItemField = useCallback(
        (itemId: string, field: string): string | undefined => {
            const edits = itemEdits.get(itemId);
            if (!edits) return undefined;
            return (edits as any)[field] ?? undefined;
        },
        [itemEdits],
    );

    const getTaskField = useCallback(
        (taskId: string, field: string): string | undefined => {
            const edits = taskEdits.get(taskId);
            if (!edits) return undefined;
            return (edits as any)[field] ?? undefined;
        },
        [taskEdits],
    );

    const isDeleted = useCallback(
        (itemId: string): boolean => deletedIds.has(itemId),
        [deletedIds],
    );

    // ── Save all (drafts + edits + deletes) ────────────────
    const saveAll = async () => {
        if (!hasPendingChanges) return;
        setSaving(true);

        // 1. Process task edits
        for (const [taskId, edits] of taskEdits) {
            try {
                const input: Record<string, any> = {};
                if (edits.title !== undefined) input.title = edits.title;
                if (edits.description !== undefined) input.description = edits.description;
                if (Object.keys(input).length > 0) {
                    await updateProjectTask({ variables: { id: taskId, input } });
                }
            } catch (err) { console.error('Save task edit failed:', err); }
        }

        // 2. Process item edits
        for (const [itemId, edits] of itemEdits) {
            try {
                const input: Record<string, any> = {};
                if (edits.scheduledStart !== undefined) input.scheduledStart = edits.scheduledStart || null;
                if (edits.scheduledEnd !== undefined) input.scheduledEnd = edits.scheduledEnd || null;
                if (edits.estimatedHours !== undefined) input.estimatedHours = edits.estimatedHours ? Number(edits.estimatedHours) : null;
                if (edits.parentItemId !== undefined) input.parentItemId = edits.parentItemId || null;
                if (edits.notes !== undefined) input.notes = edits.notes || null;
                if (Object.keys(input).length > 0) {
                    await updateItem({ variables: { id: itemId, input } });
                }
            } catch (err) { console.error('Save item edit failed:', err); }
        }

        // 3. Process deletions
        for (const itemId of deletedIds) {
            try {
                await removeItem({ variables: { id: itemId } });
            } catch (err) { console.error('Delete item failed:', err); }
        }

        // 4. Process new drafts (parents first)
        if (draftItems.length > 0) {
            const idMap = new Map<string, string>();
            const sorted = [...draftItems];
            sorted.sort((a, b) => {
                const da = a.parentKey || a.parentServerId ? 1 : 0;
                const db = b.parentKey || b.parentServerId ? 1 : 0;
                return da - db;
            });

            for (const draft of sorted) {
                try {
                    const taskResult = await createProjectTask({
                        variables: {
                            input: {
                                title: draft.title,
                                projectId,
                                status: 'Backlog',
                                startDate: draft.startDate || undefined,
                                endDate: draft.endDate || undefined,
                            },
                        },
                    });
                    const newTaskId = taskResult?.data?.createProjectTask?.id;
                    if (!newTaskId) continue;

                    let parentItemId: string | undefined;
                    if (draft.parentServerId) parentItemId = draft.parentServerId;
                    else if (draft.parentKey && idMap.has(draft.parentKey)) parentItemId = idMap.get(draft.parentKey);

                    const result = await addItem({
                        variables: {
                            batchId,
                            input: {
                                taskId: newTaskId,
                                parentItemId,
                                scheduledStart: draft.startDate || undefined,
                                scheduledEnd: draft.endDate || undefined,
                                estimatedHours: draft.estimatedHours ? Number(draft.estimatedHours) : undefined,
                            },
                        },
                    });
                    idMap.set(draft.key, result?.data?.addPlanBatchItem?.id);
                } catch (err) { console.error('Save draft failed:', err); }
            }
        }

        // Clear all local state
        setDraftItems([]);
        setItemEdits(new Map());
        setTaskEdits(new Map());
        setDeletedIds(new Set());
        setSaving(false);
        refetchBatch();
    };

    return {
        batchId, projectId, flat, draftItems, saving, hasPendingChanges,
        // Draft CRUD
        addDraft, updateDraft, deleteDraft, indentDraft, outdentDraft,
        // Server-item edit queue
        editItemField, editTaskField, markDeleted, unmarkDeleted,
        itemEdits, taskEdits, deletedIds,
        // Effective value getters
        getItemField, getTaskField, isDeleted,
        // Bulk save
        saveAll,
    };
}
