import { useState, useRef, useMemo } from 'react';
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

export function flattenTree(serverItems: any[], draftItems: DraftItem[]): FlatItem[] {
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
            ...serverChildren.map((s) => ({ kind: 'server' as const, data: s })),
            ...localDrafts.map((d) => ({ kind: 'draft' as const, data: d })),
        ];

        for (let i = 0; i < all.length; i++) {
            const { kind, data } = all[i];
            const isLast = i === all.length - 1;
            const connectors = [...parentConnectors, !isLast];
            const id = kind === 'server' ? data.id : data.key;

            result.push({ id, isDraft: kind === 'draft', parentId, depth, isLast, connectors, item: data });

            const childDrafts = draftByParent.get(id) || [];
            if (kind === 'server') walk(data.children || [], data.id, depth + 1, connectors);
            if (childDrafts.length > 0) walk([], id, depth + 1, connectors);
        }
    }

    walk(serverItems, null, 0, []);
    return result;
}

// ── Hook ────────────────────────────────────────────────────────────
export function usePlanBuilder() {
    const { batchId, projectId, items, refetch: refetchBatch } = useBatchContext();

    const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
    const [saving, setSaving] = useState(false);

    const flat = useMemo(() => flattenTree(items || [], draftItems), [items, draftItems]);

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
        // Can't indent under itself, and can't indent under a descendant
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

        // Find current parent in flat list
        const parentId = item.parentServerId || item.parentKey;
        const parent = flatList.find((f) => f.id === parentId);
        if (!parent || !parent.parentId) {
            // Parent is root — outdent to root level
            setDraftItems((prev) =>
                prev.map((d) => (d.key === key ? { ...d, parentKey: null, parentServerId: null } : d)),
            );
            return;
        }

        // Set parent to grandparent
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

    // ── Save all drafts ────────────────────────────────────
    const saveDrafts = async () => {
        if (draftItems.length === 0) return;
        setSaving(true);
        const idMap = new Map<string, string>();

        // Parents first
        const sorted = [...draftItems];
        sorted.sort((a, b) => {
            const da = a.parentKey || a.parentServerId ? 1 : 0;
            const db = b.parentKey || b.parentServerId ? 1 : 0;
            return da - db;
        });

        for (const draft of sorted) {
            try {
                const taskResult = await createProjectTask({
                    variables: { input: { title: draft.title, projectId, status: 'Backlog', startDate: draft.startDate || undefined, endDate: draft.endDate || undefined } },
                });
                const newTaskId = taskResult?.data?.createProjectTask?.id;
                if (!newTaskId) continue;

                let parentItemId: string | undefined;
                if (draft.parentServerId) parentItemId = draft.parentServerId;
                else if (draft.parentKey && idMap.has(draft.parentKey)) parentItemId = idMap.get(draft.parentKey);

                const result = await addItem({
                    variables: { batchId, input: { taskId: newTaskId, parentItemId, scheduledStart: draft.startDate || undefined, scheduledEnd: draft.endDate || undefined, estimatedHours: draft.estimatedHours ? Number(draft.estimatedHours) : undefined } },
                });
                idMap.set(draft.key, result?.data?.addPlanBatchItem?.id);
            } catch (err) { console.error('Save draft failed:', err); }
        }

        setDraftItems([]);
        setSaving(false);
        refetchBatch();
    };

    // ── Server-item helpers ────────────────────────────────
    const saveTaskTitle = (taskId: string, title: string) => {
        if (!title.trim()) return;
        updateProjectTask({ variables: { id: taskId, input: { title: title.trim() } } });
    };
    const saveTaskDescription = (taskId: string, html: string) => {
        updateProjectTask({ variables: { id: taskId, input: { description: html } } });
    };
    const saveItemField = (itemId: string, field: string, value: string) => {
        updateItem({ variables: { id: itemId, input: { [field]: value || null } } });
    };
    const deleteItem = (itemId: string) => {
        removeItem({ variables: { id: itemId } });
    };

    return {
        batchId, projectId, flat, draftItems, saving,
        addDraft, updateDraft, deleteDraft, indentDraft, outdentDraft,
        saveDrafts,
        saveTaskTitle, saveTaskDescription, saveItemField, deleteItem,
    };
}
