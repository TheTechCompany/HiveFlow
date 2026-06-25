import React, { useState, useMemo, useCallback } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { ChevronRight, ExpandMore, Add, Delete } from '@mui/icons-material';
import { gql, useMutation } from '@apollo/client';
import { useBatchContext } from '../context';
import { usePlanBuilder, type FlatItem } from './list/usePlanBuilder';
import moment from 'moment';
import {
    Timeline,
    type TimelineItem,
    type TimelineGroup,
    type ItemChange,
    type TimelineRenderers,
} from '../../../../components/Timeline';

/* ──────────────────────────────────────────────────────────────────────
   BatchSplitView — MS Project-style split view.
   Left:  tree list in Timeline sidebar (one group per item → 1:1 rows)
   Right: Gantt bars on day grid
   Both are inherently synced — the Timeline owns both sides.
   ─────────────────────────────────────────────────────────────────── */

// ── Constants ────────────────────────────────────────────────────────

const ROW_H = 34; // must match Timeline laneH (itemHeight 30 + gap 4)
const SIDEBAR_W = 520;

// ── Helpers ──────────────────────────────────────────────────────────

const hashColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${hash % 360}, 50%, 50%)`;
};

const fmtDate = (d: string | null | undefined): string =>
    d ? moment(d).format('YYYY-MM-DD') : '';

const toDate = (v: string | null | undefined): Date | null =>
    v ? new Date(v) : null;

// ── Inline add-row inside the tree sidebar ───────────────────────────

const AddRowInput: React.FC<{
    depth: number;
    onDepthChange: (d: number) => void;
    onSubmit: (title: string, depth: number) => void;
}> = ({ depth, onDepthChange, onSubmit }) => {
    const [value, setValue] = React.useState('');

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                height: ROW_H,
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                bgcolor: '#fafbfc',
            }}
        >
            {/* Indent spacer */}
            <Box
                sx={{
                    width: depth * 16 + 36,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    borderRight: '1px solid',
                    borderColor: 'grey.200',
                }}
            >
                <Add sx={{ fontSize: 14, color: 'text.disabled', ml: 0.5 }} />
            </Box>
            {/* Task input */}
            <TextField
                size="small"
                variant="standard"
                placeholder={depth > 0 ? 'Add subtask…' : 'Add task…'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        onDepthChange(e.shiftKey ? Math.max(0, depth - 1) : depth + 1);
                        return;
                    }
                    if (e.key === 'Enter' && value.trim()) {
                        onSubmit(value, depth);
                        setValue('');
                    }
                }}
                sx={{
                    flex: 1,
                    minWidth: 0,
                    borderRight: '1px solid',
                    borderColor: 'grey.200',
                    height: '100%',
                    '& .MuiInputBase-root': { py: 0, fontSize: '0.78rem', height: '100%' },
                    '& .MuiInputBase-input': { px: '4px', py: '3px' },
                }}
            />
            {/* Empty cells to align with date/hour columns */}
            <Box sx={{ width: 104, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }} />
            <Box sx={{ width: 104, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }} />
            <Box sx={{ width: 54, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }} />
            <Box sx={{ width: 42, flexShrink: 0, height: '100%' }} />
        </Box>
    );
};

// ── Mutations ────────────────────────────────────────────────────────

const UPDATE_DATES = gql`
    mutation UpdateBatchItemDates($id: ID!, $input: PlanBatchItemUpdateInput!) {
        updatePlanBatchItem(id: $id, input: $input) { id }
    }
`;
const ADD_ITEM = gql`
    mutation AddBatchItem($batchId: ID!, $input: PlanBatchItemInput!) {
        addPlanBatchItem(batchId: $batchId, input: $input) { id }
    }
`;
const CREATE_TASK = gql`
    mutation CreateProjectTask($input: ProjectTaskInput!) {
        createProjectTask(input: $input) { id title }
    }
`;
const REMOVE_ITEM = gql`
    mutation RemoveBatchItem($id: ID!) {
        removePlanBatchItem(id: $id) { id }
    }
`;

// ── Component ────────────────────────────────────────────────────────

export const BatchSplitView: React.FC = () => {
    const { batchId, projectId, items, refetch } = useBatchContext();
    const pb = usePlanBuilder();

    const [updateDates] = useMutation(UPDATE_DATES);
    const [addItem] = useMutation(ADD_ITEM);
    const [createTask] = useMutation(CREATE_TASK);
    const [removeItem] = useMutation(REMOVE_ITEM);

    // ── Collapse state ────────────────────────────────────────────
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // ── Date horizon ──────────────────────────────────────────────
    const now = new Date();
    const [horizonStart, setHorizonStart] = useState(
        () => new Date(now.getFullYear(), now.getMonth(), 1),
    );
    const [horizonEnd, setHorizonEnd] = useState(
        () => new Date(now.getFullYear(), now.getMonth() + 2, 0),
    );

    // ── Add-row depth (follows selection) ─────────────────────────
    const [addDepth, setAddDepth] = useState(0);

    // ── Flat list (server items + drafts) ─────────────────────────
    const flat = pb.flat;

    // ── Filter visible rows (collapse) ────────────────────────────
    const visibleRows = useMemo(() => {
        return flat.filter((row) => {
            if (!row.parentId) return true;
            let p = flat.find((f) => f.id === row.parentId);
            while (p) {
                if (collapsed.has(p.id)) return false;
                if (!p.parentId) break;
                p = flat.find((f) => f.id === p.parentId);
            }
            return true;
        });
    }, [flat, collapsed]);

    // ── Build Timeline data: one group per visible row ────────────
    const { timelineItems, timelineGroups } = useMemo(() => {
        const groups: TimelineGroup[] = [];
        const tItems: TimelineItem[] = [];

        for (const row of visibleRows) {
            const start =
                toDate(row.item.scheduledStart) ??
                toDate(row.item.task?.startDate);
            const end =
                toDate(row.item.scheduledEnd) ??
                toDate(row.item.task?.endDate);

            const title = row.item.task?.title || 'Untitled';

            groups.push({ id: row.id, label: '' });

            if (start && end) {
                tItems.push({
                    id: row.id,
                    start,
                    end: end < start ? moment(start).endOf('day').toDate() : end,
                    label: title,
                    color: hashColor(title),
                    groupId: row.id,
                    progress: 0,
                });
            }
        }

        return {
            timelineItems: tItems,
            timelineGroups: [
                { id: '__header__', label: '' },
                ...groups,
                { id: '__add_row__', label: '' },
            ],
        };
    }, [visibleRows]);

    // ── Collapse helpers ──────────────────────────────────────────
    const hasChildren = useCallback(
        (id: string) => flat.some((f) => f.parentId === id),
        [flat],
    );

    const toggleCollapse = useCallback((id: string) => {
        setCollapsed((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    // ── Callbacks ─────────────────────────────────────────────────

    const handleItemChange = useCallback(
        async (change: ItemChange) => {
            const input: Record<string, string> = {};
            if (change.start) input.scheduledStart = change.start.toISOString();
            if (change.end) input.scheduledEnd = change.end.toISOString();
            await updateDates({ variables: { id: change.id, input } });
            refetch();
        },
        [updateDates, refetch],
    );

    const handleItemCreate = useCallback(
        async (start: Date, end: Date, groupId?: string) => {
            try {
                const taskRes = await createTask({
                    variables: {
                        input: {
                            title: 'New Task',
                            projectId,
                            status: 'Backlog',
                            startDate: start.toISOString(),
                            endDate: end.toISOString(),
                        },
                    },
                });
                const taskId = taskRes?.data?.createProjectTask?.id;
                if (!taskId) return;

                await addItem({
                    variables: {
                        batchId,
                        input: {
                            taskId,
                            parentItemId: groupId || undefined,
                            scheduledStart: start.toISOString(),
                            scheduledEnd: end.toISOString(),
                        },
                    },
                });
                refetch();
            } catch (err) {
                console.error('Create from timeline failed', err);
            }
        },
        [batchId, projectId, createTask, addItem, refetch],
    );

    const handleDelete = useCallback(
        async (ids: string[]) => {
            for (const id of ids) {
                await removeItem({ variables: { id } }).catch(() => {});
            }
            refetch();
        },
        [removeItem, refetch],
    );

    const handleNavigate = useCallback(
        (dir: 'prev' | 'next' | 'today') => {
            const span = horizonEnd.getTime() - horizonStart.getTime();
            if (dir === 'today') {
                const s = new Date(now.getFullYear(), now.getMonth(), 1);
                const e = new Date(now.getFullYear(), now.getMonth() + 2, 0);
                setHorizonStart(s);
                setHorizonEnd(e);
            } else {
                const sign = dir === 'prev' ? -1 : 1;
                const shift = span * 0.5 * sign;
                setHorizonStart((s) => new Date(s.getTime() + shift));
                setHorizonEnd((e) => new Date(e.getTime() + shift));
            }
        },
        [horizonStart, horizonEnd],
    );

    const handleHorizonChange = useCallback(
        (s: Date, e: Date) => {
            setHorizonStart(s);
            setHorizonEnd(e);
        },
        [],
    );

    const handleSelect = useCallback(
        (sel: { itemIds: string[] }) => {
            const id = sel.itemIds[0] ?? null;
            setSelectedId(id);
            if (id) {
                const row = flat.find((f) => f.id === id);
                setAddDepth(row ? row.depth + 1 : 0);
            }
        },
        [flat],
    );

    // ── Timeline sidebar row renderer ──────────────────────────────
    const renderGroupHeader: TimelineRenderers['renderGroupHeader'] = useCallback(
        (group, _expanded) => {
            // Column headers row
            if (group.id === '__header__') {
                const hCell = (w: any, label: string, last?: boolean) => (
                    <Box
                        sx={{
                            ...w,
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            color: 'text.secondary',
                            px: 0.5,
                            borderRight: last ? 'none' : '1px solid',
                            borderColor: 'grey.300',
                        }}
                    >
                        {label}
                    </Box>
                );
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: ROW_H,
                            borderBottom: '2px solid',
                            borderColor: 'grey.300',
                            bgcolor: '#f1f5f9',
                        }}
                    >
                        {hCell({ width: 36, flexShrink: 0, justifyContent: 'center' }, '#')}
                        {hCell({ flex: 1, minWidth: 0 }, 'Task')}
                        {hCell({ width: 104, flexShrink: 0, justifyContent: 'center' }, 'Start')}
                        {hCell({ width: 104, flexShrink: 0, justifyContent: 'center' }, 'End')}
                        {hCell({ width: 54, flexShrink: 0, justifyContent: 'center' }, 'Hrs')}
                        {hCell({ width: 42, flexShrink: 0 }, '', true)}
                    </Box>
                );
            }

            // Special add-row at the bottom of the tree
            if (group.id === '__add_row__') {
                return (
                    <AddRowInput
                        depth={addDepth}
                        onDepthChange={setAddDepth}
                        onSubmit={async (title, depth) => {
                            if (!title.trim()) return;
                            let parentId: string | undefined;
                            if (depth > 0 && selectedId) {
                                const selRow = flat.find(
                                    (f) => f.id === selectedId,
                                );
                                if (selRow) {
                                    let target = selRow;
                                    while (
                                        target &&
                                        target.depth >= depth
                                    ) {
                                        const p = flat.find(
                                            (f) =>
                                                f.id === target.parentId,
                                        );
                                        target = p!;
                                    }
                                    if (
                                        target &&
                                        target.depth === depth - 1
                                    ) {
                                        parentId = target.id;
                                    }
                                }
                            }
                            try {
                                const taskRes = await createTask({
                                    variables: {
                                        input: {
                                            title: title.trim(),
                                            projectId,
                                            status: 'Backlog',
                                        },
                                    },
                                });
                                const taskId =
                                    taskRes?.data?.createProjectTask?.id;
                                if (taskId) {
                                    await addItem({
                                        variables: {
                                            batchId,
                                            input: {
                                                taskId,
                                                parentItemId:
                                                    parentId || undefined,
                                            },
                                        },
                                    });
                                    refetch();
                                }
                            } catch (err) {
                                console.error(
                                    'Create task failed',
                                    err,
                                );
                            }
                        }}
                    />
                );
            }

            const row = flat.find((f) => f.id === group.id);
            if (!row) return <span>{group.id}</span>;

            const children = hasChildren(row.id);
            const isCollapsed = collapsed.has(row.id);
            const isSelected = selectedId === row.id;
            const task = row.item.task || {};
            const idx = visibleRows.findIndex((r) => r.id === row.id);
            const stripe = idx % 2 === 0;

            const cellSx = {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                borderRight: '1px solid',
                borderColor: 'grey.200',
                '&:last-child': { borderRight: 'none' },
            };

            return (
                <Box
                    data-sidebar-row={row.id}
                    tabIndex={0}
                    onClick={() => setSelectedId(row.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                            e.preventDefault();
                            const idx = flat.findIndex(
                                (f) => f.id === row.id,
                            );
                            if (e.shiftKey) {
                                // Outdent: set parentItemId to grandparent
                                if (row.depth > 0 && row.parentId) {
                                    const parent = flat.find(
                                        (f) => f.id === row.parentId,
                                    );
                                    const newParentId =
                                        parent?.parentId || null;
                                    pb.saveItemField(
                                        row.item.id,
                                        'parentItemId',
                                        newParentId || '',
                                    );
                                    refetch();
                                }
                            } else {
                                // Indent: set parent to previous sibling at same depth
                                let prevSibling: FlatItem | undefined;
                                for (let i = idx - 1; i >= 0; i--) {
                                    if (flat[i].depth === row.depth) {
                                        prevSibling = flat[i];
                                        break;
                                    }
                                    if (flat[i].depth < row.depth) break;
                                }
                                if (prevSibling) {
                                    pb.saveItemField(
                                        row.item.id,
                                        'parentItemId',
                                        prevSibling.id,
                                    );
                                    refetch();
                                }
                            }
                        }
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: ROW_H,
                        bgcolor: isSelected
                            ? '#e3f2fd'
                            : stripe
                              ? '#fafbfc'
                              : '#ffffff',
                        borderBottom: '1px solid',
                        borderColor: 'grey.200',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: isSelected ? '#e3f2fd' : '#f0f4f8',
                        },
                        minWidth: 0,
                    }}
                >
                    {/* Indent + twisty */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: row.depth * 16 + 36,
                            flexShrink: 0,
                            borderRight: '1px solid',
                            borderColor: 'grey.200',
                            height: '100%',
                        }}
                    >
                        {children ? (
                            <IconButton
                                size="small"
                                sx={{ p: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCollapse(row.id);
                                }}
                            >
                                {isCollapsed ? (
                                    <ChevronRight sx={{ fontSize: 16 }} />
                                ) : (
                                    <ExpandMore sx={{ fontSize: 16 }} />
                                )}
                            </IconButton>
                        ) : (
                            <Box sx={{ width: 28 }} />
                        )}
                    </Box>

                    {/* Title */}
                    <TextField
                        size="small"
                        variant="standard"
                        defaultValue={task.title || ''}
                        onBlur={(e) => {
                            if (e.target.value !== (task.title || ''))
                                pb.saveTaskTitle(task.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            borderRight: '1px solid',
                            borderColor: 'grey.200',
                            height: '100%',
                            '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' },
                            '& .MuiInputBase-input': { px: '4px', py: '2px' },
                        }}
                    />

                    {/* Start date */}
                    <TextField
                        size="small"
                        variant="standard"
                        type="date"
                        defaultValue={fmtDate(row.item.scheduledStart)}
                        onBlur={(e) =>
                            pb.saveItemField(
                                row.item.id,
                                'scheduledStart',
                                e.target.value,
                            )
                        }
                        onClick={(e) => e.stopPropagation()}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            width: 104,
                            flexShrink: 0,
                            borderRight: '1px solid',
                            borderColor: 'grey.200',
                            height: '100%',
                            '& .MuiInputBase-root': { py: 0, height: '100%' },
                            '& .MuiInputBase-input': {
                                px: '4px',
                                py: '2px',
                                fontSize: '0.7rem',
                            },
                        }}
                    />

                    {/* End date */}
                    <TextField
                        size="small"
                        variant="standard"
                        type="date"
                        defaultValue={fmtDate(row.item.scheduledEnd)}
                        onBlur={(e) =>
                            pb.saveItemField(
                                row.item.id,
                                'scheduledEnd',
                                e.target.value,
                            )
                        }
                        onClick={(e) => e.stopPropagation()}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            width: 104,
                            flexShrink: 0,
                            borderRight: '1px solid',
                            borderColor: 'grey.200',
                            height: '100%',
                            '& .MuiInputBase-root': { py: 0, height: '100%' },
                            '& .MuiInputBase-input': {
                                px: '4px',
                                py: '2px',
                                fontSize: '0.7rem',
                            },
                        }}
                    />

                    {/* Hours */}
                    <TextField
                        size="small"
                        variant="standard"
                        type="number"
                        defaultValue={row.item.estimatedHours ?? ''}
                        onBlur={(e) =>
                            pb.saveItemField(
                                row.item.id,
                                'estimatedHours',
                                e.target.value,
                            )
                        }
                        onClick={(e) => e.stopPropagation()}
                        inputProps={{
                            min: 0,
                            step: 0.5,
                            style: { textAlign: 'center', fontSize: '0.7rem' },
                        }}
                        sx={{
                            width: 54,
                            flexShrink: 0,
                            height: '100%',
                            '& .MuiInputBase-root': { py: 0, height: '100%' },
                            '& .MuiInputBase-input': { px: '4px', py: '2px' },
                        }}
                    />

                    {/* Add child / Delete */}
                    <Box
                        sx={{
                            width: 42,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    const taskRes = await createTask({
                                        variables: {
                                            input: {
                                                title: 'New Task',
                                                projectId,
                                                status: 'Backlog',
                                            },
                                        },
                                    });
                                    const taskId =
                                        taskRes?.data?.createProjectTask?.id;
                                    if (taskId) {
                                        await addItem({
                                            variables: {
                                                batchId,
                                                input: {
                                                    taskId,
                                                    parentItemId: row.id,
                                                },
                                            },
                                        });
                                        refetch();
                                    }
                                } catch (err) {
                                    console.error('Add child failed', err);
                                }
                            }}
                            sx={{ p: 0 }}
                        >
                            <Add sx={{ fontSize: 14 }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeItem({
                                    variables: { id: row.item.id },
                                }).then(() => refetch());
                            }}
                            sx={{ p: 0 }}
                        >
                            <Delete sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Box>
                </Box>
            );
        },
        [
            flat,
            collapsed,
            selectedId,
            hasChildren,
            toggleCollapse,
            pb,
            removeItem,
            refetch,
        ],
    );

    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* ── Main split: Timeline with sidebar tree ──────────── */}
            <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
                <Timeline
                        items={timelineItems}
                        groups={timelineGroups}
                        start={horizonStart}
                        end={horizonEnd}
                        step="day"
                        itemHeight={30}
                        headerHeight={48}
                        sidebarWidth={SIDEBAR_W}
                        showLinks={false}
                        showToday
                        fitContainer
                        selectedItemIds={selectedId ? [selectedId] : []}
                        callbacks={{
                            onItemChange: handleItemChange,
                            onItemCreate: handleItemCreate,
                            onDelete: handleDelete,
                            onSelect: handleSelect,
                            onNavigate: handleNavigate,
                            onHorizonChange: handleHorizonChange,
                        }}
                        renderers={{
                            renderGroupHeader,
                            renderItem: (item) => (
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        paddingLeft: 4,
                                    }}
                                >
                                    {item.label}
                                </span>
                            ),
                        }}
                    />
            </Box>
        </Box>
    );
};
