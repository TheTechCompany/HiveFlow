import { flattenTree, nextKey, DraftItem, FlatItem } from './usePlanBuilder';

// ── Helpers ────────────────────────────────────────────────────────

/** Create a minimal server item for testing */
function serverItem(id: string, overrides: any = {}) {
    return {
        id,
        parentItemId: overrides.parentItemId ?? null,
        scheduledStart: overrides.scheduledStart ?? null,
        scheduledEnd: overrides.scheduledEnd ?? null,
        estimatedHours: overrides.estimatedHours ?? null,
        task: overrides.task ?? { id: `task-${id}`, title: 'Task ' + id },
        children: overrides.children ?? [],
    };
}

/** Simulate the Enter-key logic from SplitView's onKeyDown */
function handleEnter(
    row: FlatItem,
    flat: FlatItem[],
    drafts: DraftItem[],
    setDrafts: (fn: (prev: DraftItem[]) => DraftItem[]) => void,
    addChild: (parentId: string) => void,
): 'outdent' | 'add-child' | 'skipped' {
    // Guard: skip if target is INPUT/TEXTAREA/SELECT — not relevant for row-focused Enter
    const title = getRowTitle(row);
    if (!title && row.depth > 0) {
        if (row.isDraft) {
            outdentDraft(row.id, flat, drafts, setDrafts);
            return 'outdent';
        }
        // Server-item outdent — not tested here
    } else {
        addChild(row.id);
        return 'add-child';
    }
    return 'skipped';
}

function getRowTitle(row: FlatItem): string {
    if (row.isDraft) return (row.item as DraftItem).title?.trim() || '';
    return row.item.task?.title?.trim() || '';
}

function outdentDraft(
    key: string,
    flatList: FlatItem[],
    draftItems: DraftItem[],
    setDraftItems: (fn: (prev: DraftItem[]) => DraftItem[]) => void,
) {
    const item = draftItems.find((d) => d.key === key);
    if (!item || (!item.parentKey && !item.parentServerId)) return;

    const parentId = item.parentServerId || item.parentKey;
    const parent = flatList.find((f) => f.id === parentId);
    if (!parent || !parent.parentId) {
        // Parent is root → outdent to root level
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
}

// ── Mock addChild ──────────────────────────────────────────────────
function makeAddChild(drafts: DraftItem[], setDrafts: (fn: (prev: DraftItem[]) => DraftItem[]) => void) {
    return (parentId: string) => {
        const parent = drafts.find((d) => d.key === parentId);
        const newDraft: DraftItem = {
            key: nextKey(),
            parentKey: parent ? parentId : null,
            parentServerId: parent ? null : parentId,
            title: '',
            startDate: '',
            endDate: '',
            estimatedHours: '',
        };
        setDrafts((prev) => [...prev, newDraft]);
    };
}

// ═══════════════════════════════════════════════════════════════════
// Tests
// ═══════════════════════════════════════════════════════════════════

describe('flattenTree', () => {
    it('flattens server items with no children', () => {
        const items = [serverItem('a'), serverItem('b')];
        const result = flattenTree(items, []);
        expect(result).toHaveLength(2);
        expect(result[0].depth).toBe(0);
        expect(result[0].isDraft).toBe(false);
        expect(result[0].connectors).toEqual([true]);  // not last → continuation line
        expect(result[1].connectors).toEqual([false]); // last → no continuation
    });

    it('interleaves drafts under server parents', () => {
        const items = [serverItem('a')];
        const drafts: DraftItem[] = [
            { key: 'd1', parentKey: null, parentServerId: 'a', title: 'Child', startDate: '', endDate: '', estimatedHours: '' },
        ];
        const result = flattenTree(items, drafts);
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('a');
        expect(result[0].depth).toBe(0);
        expect(result[1].id).toBe('d1');
        expect(result[1].depth).toBe(1);
        expect(result[1].isDraft).toBe(true);
        expect(result[1].parentId).toBe('a');
    });

    it('handles nested drafts', () => {
        const items = [serverItem('a')];
        const drafts: DraftItem[] = [
            { key: 'd1', parentKey: null, parentServerId: 'a', title: 'Child', startDate: '', endDate: '', estimatedHours: '' },
            { key: 'd2', parentKey: 'd1', parentServerId: null, title: 'Grandchild', startDate: '', endDate: '', estimatedHours: '' },
        ];
        const result = flattenTree(items, drafts);
        expect(result).toHaveLength(3);
        expect(result[1].id).toBe('d1');
        expect(result[1].depth).toBe(1);
        expect(result[2].id).toBe('d2');
        expect(result[2].depth).toBe(2);
        expect(result[2].parentId).toBe('d1');
    });

    it('filters out deleted server items', () => {
        const items = [serverItem('a'), serverItem('b')];
        const deleted = new Set(['a']);
        const result = flattenTree(items, [], deleted);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('b');
    });
});

describe('Enter-key outdent logic', () => {
    it('outdents empty draft on Enter when indented', () => {
        const drafts: DraftItem[] = [
            { key: 'd1', parentKey: null, parentServerId: 'server-a', title: 'Sub', startDate: '', endDate: '', estimatedHours: '' },
        ];
        const setDrafts = jest.fn((fn: any) => {
            const next = fn(drafts);
            drafts.length = 0;
            drafts.push(...next);
        });

        const addChild = makeAddChild(drafts, setDrafts);
        const flat = flattenTree([serverItem('server-a')], drafts);
        const row = flat.find((f) => f.id === 'd1')!;

        expect(row.depth).toBe(1);
        expect(row.isDraft).toBe(true);
        expect(getRowTitle(row)).toBe('Sub'); // "Sub" is not empty!

        // Clear title first
        drafts[0] = { ...drafts[0], title: '' };
        const flat2 = flattenTree([serverItem('server-a')], drafts);
        const row2 = flat2.find((f) => f.id === 'd1')!;

        expect(getRowTitle(row2)).toBe('');

        const result = handleEnter(row2, flat2, drafts, setDrafts as any, addChild);
        expect(result).toBe('outdent');
        expect(drafts[0].parentKey).toBeNull();
        expect(drafts[0].parentServerId).toBeNull();
    });

    it('adds child on Enter when draft has non-empty title', () => {
        const drafts: DraftItem[] = [
            { key: 'd1', parentKey: null, parentServerId: 'server-a', title: 'Real Task', startDate: '', endDate: '', estimatedHours: '' },
        ];
        const setDrafts = jest.fn((fn: any) => {
            const next = fn(drafts);
            drafts.length = 0;
            drafts.push(...next);
        });
        const addChild = makeAddChild(drafts, setDrafts);
        const flat = flattenTree([serverItem('server-a')], drafts);
        const row = flat.find((f) => f.id === 'd1')!;

        const result = handleEnter(row, flat, drafts, setDrafts as any, addChild);
        expect(result).toBe('add-child');
        // A new draft child should have been added
        expect(drafts).toHaveLength(2);
        expect(drafts[1].parentKey).toBe('d1');
        expect(drafts[1].title).toBe('');
    });

    it('does NOT outdent root-level empty draft (depth 0)', () => {
        const drafts: DraftItem[] = [
            { key: 'd1', parentKey: null, parentServerId: null, title: '', startDate: '', endDate: '', estimatedHours: '' },
        ];
        const setDrafts = jest.fn((fn: any) => {
            const next = fn(drafts);
            drafts.length = 0;
            drafts.push(...next);
        });
        const addChild = makeAddChild(drafts, setDrafts);
        const flat = flattenTree([], drafts);
        const row = flat.find((f) => f.id === 'd1')!;

        expect(row.depth).toBe(0);

        const result = handleEnter(row, flat, drafts, setDrafts as any, addChild);
        expect(result).toBe('add-child'); // root item — add child, don't outdent
    });

    it('outdents nested draft to grandparent level', () => {
        const drafts: DraftItem[] = [
            { key: 'd1', parentKey: null, parentServerId: 'server-a', title: 'Level 1', startDate: '', endDate: '', estimatedHours: '' },
            { key: 'd2', parentKey: 'd1', parentServerId: null, title: '', startDate: '', endDate: '', estimatedHours: '' },
        ];
        const setDrafts = jest.fn((fn: any) => {
            const next = fn(drafts);
            drafts.length = 0;
            drafts.push(...next);
        });
        const addChild = makeAddChild(drafts, setDrafts);
        const flat = flattenTree([serverItem('server-a')], drafts);
        const row = flat.find((f) => f.id === 'd2')!;

        expect(row.depth).toBe(2);
        expect(getRowTitle(row)).toBe('');

        const result = handleEnter(row, flat, drafts, setDrafts as any, addChild);
        expect(result).toBe('outdent');
        // d2 should now be at same level as d1 (parent = server-a)
        expect(drafts[1].parentKey).toBeNull();
        expect(drafts[1].parentServerId).toBe('server-a');
    });
});
