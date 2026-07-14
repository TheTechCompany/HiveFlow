import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, TextField, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Add, Delete, KeyboardTab } from '@mui/icons-material';
import { useBatchContext } from '../context';
import { usePlanBuilder, type FlatItem } from './list/usePlanBuilder';
import moment from 'moment';
import {
    GanttView,
    type TimelineItem,
    type TimelineGroup,
    type ItemChange,
    type TimelineRenderers,
    TreeBranchVSCode,
    VSCODE_INDENT,
    VSCODE_TWISTY_WIDTH,
    DEPTH_BORDER_WIDTH,
} from '@hive-flow/ui';

/* ──────────────────────────────────────────────────────────────────────
   BatchSplitView — local-first spreadsheet + Gantt.
   All edits go into local state (drafts / edit maps).  A single "Save"
   button persists everything in one batch.
   ─────────────────────────────────────────────────────────────────── */

// ── Constants ────────────────────────────────────────────────────────

const ROW_H = 34;
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

// ── Column layout constants ──────────────────────────────────────────
const COL_INDENT = VSCODE_TWISTY_WIDTH; // 16 — matches TreeBranch twisty column
const COL_START = 104;
const COL_END = 104;
const COL_HOURS = 54;
const COL_ACTIONS = 42;
const INDENT_PER_DEPTH = DEPTH_BORDER_WIDTH; // 3 — matches depth-borders band width

// ── Inline add-row inside the tree sidebar ───────────────────────────

const AddRowInput: React.FC<{
    depth: number;
    onDepthChange: (d: number) => void;
    onSubmit: (title: string, depth: number) => void;
    noBorder?: boolean;
}> = ({ depth, onDepthChange, onSubmit, noBorder }) => {
    const [value, setValue] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const depthRef = React.useRef(depth);
    depthRef.current = depth;

    return (
        <Box
            sx={{
                display: 'flex', alignItems: 'center', height: ROW_H,
                ...(!noBorder && { borderBottom: '1px solid', borderColor: 'grey.200' }),
                bgcolor: '#fafbfc',
            }}
        >
            <Box sx={{ width: COL_INDENT, flexShrink: 0, display: 'flex', alignItems: 'center', height: '100%', borderRight: '1px solid', borderColor: 'grey.200' }}>
                <Add sx={{ fontSize: 14, color: 'text.disabled', ml: 0.5 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }}>
                {depth > 0 && (<Box sx={{ width: depth * INDENT_PER_DEPTH, flexShrink: 0 }} />)}
                <TextField
                    size="small" variant="standard"
                    placeholder={depth > 0 ? 'Add subtask…' : 'Add task…'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={submitting}
                    onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                            e.preventDefault();
                            e.stopPropagation();
                            const cur = depthRef.current;
                            const next = e.shiftKey ? Math.max(0, cur - 1) : cur + 1;
                            depthRef.current = next;
                            onDepthChange(next);
                            return;
                        }
                        if (e.key === 'Enter') {
                            if (!value.trim() && depthRef.current > 0) {
                                const next = depthRef.current - 1;
                                depthRef.current = next;
                                onDepthChange(next);
                                return;
                            }
                            if (value.trim() && !submitting) {
                                setSubmitting(true);
                                setValue('');
                                Promise.resolve(onSubmit(value, depthRef.current)).finally(() => setSubmitting(false));
                            }
                        }
                    }}
                    sx={{ flex: 1, minWidth: 0, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.78rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '3px' } }}
                />
            </Box>
            <Box sx={{ width: COL_START, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }} />
            <Box sx={{ width: COL_END, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }} />
            <Box sx={{ width: COL_HOURS, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }} />
            <Box sx={{ width: COL_ACTIONS, flexShrink: 0, height: '100%' }} />
        </Box>
    );
};

// ── Component ────────────────────────────────────────────────────────

export const BatchSplitView: React.FC = () => {
    const { batchId, projectId, items, refetch } = useBatchContext();
    const pb = usePlanBuilder();

    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const now = new Date();
    const [horizonStart, setHorizonStart] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
    const [horizonEnd, setHorizonEnd] = useState(() => new Date(now.getFullYear(), now.getMonth() + 2, 1));

    const [addDepth, setAddDepth] = useState(0);
    const [viewMode, setViewMode] = useState<'split' | 'list' | 'gantt'>('split');

    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; rowId: string } | null>(null);

    const handleContextMenu = useCallback((e: React.MouseEvent, rowId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, rowId });
    }, []);

    const closeContextMenu = useCallback(() => setContextMenu(null), []);

    const flat = pb.flat;

    const contextRow: FlatItem | undefined = contextMenu
        ? flat.find((f) => f.id === contextMenu.rowId)
        : undefined;

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

    const getDisplay = useCallback(
        (row: FlatItem, field: string): string => {
            if (row.isDraft) {
                const d = row.item;
                if (field === 'title') return d.title || '';
                if (field === 'scheduledStart') return d.startDate || '';
                if (field === 'scheduledEnd') return d.endDate || '';
                if (field === 'estimatedHours') return d.estimatedHours ?? '';
                return '';
            }
            const task = row.item.task || {};
            if (field === 'title') {
                const edited = pb.getTaskField(task.id, 'title');
                return edited !== undefined ? edited : (task.title || '');
            }
            if (field === 'scheduledStart') {
                const edited = pb.getItemField(row.item.id, 'scheduledStart');
                return edited !== undefined ? edited : (row.item.scheduledStart || '');
            }
            if (field === 'scheduledEnd') {
                const edited = pb.getItemField(row.item.id, 'scheduledEnd');
                return edited !== undefined ? edited : (row.item.scheduledEnd || '');
            }
            if (field === 'estimatedHours') {
                const edited = pb.getItemField(row.item.id, 'estimatedHours');
                return edited !== undefined ? edited : (row.item.estimatedHours ?? '');
            }
            return '';
        },
        [pb],
    );

    const { timelineItems, timelineGroups } = useMemo(() => {
        const groups: TimelineGroup[] = [];
        const tItems: TimelineItem[] = [];

        for (const row of visibleRows) {
            const startStr = getDisplay(row, 'scheduledStart');
            const endStr = getDisplay(row, 'scheduledEnd');
            const start = toDate(startStr);
            const end = toDate(endStr);
            const title = getDisplay(row, 'title') || 'Untitled';

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
            timelineGroups: [...groups, { id: '__add_row__', label: '' }],
        };
    }, [visibleRows, getDisplay]);

    const hasChildren = useCallback((id: string) => flat.some((f) => f.parentId === id), [flat]);

    const toggleCollapse = useCallback((id: string) => {
        setCollapsed((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);

    const getParentInfo = useCallback(
        (parentId: string): { parentKey: string | null; parentServerId: string | null } => {
            const parent = flat.find((f) => f.id === parentId);
            if (!parent) return { parentKey: null, parentServerId: null };
            if (parent.isDraft) return { parentKey: parent.id, parentServerId: null };
            return { parentKey: null, parentServerId: parent.id };
        },
        [flat],
    );

    const addChildDraft = useCallback(
        async (parentId: string) => {
            const { parentKey, parentServerId } = getParentInfo(parentId);
            pb.addDraft('', '', '', '', parentKey, parentServerId);
        },
        [pb, getParentInfo],
    );

    const addSiblingDraft = useCallback(
        async (rowId: string) => {
            const row = flat.find((f) => f.id === rowId);
            if (!row) return;
            if (row.parentId) {
                const { parentKey, parentServerId } = getParentInfo(row.parentId);
                pb.addDraft('', '', '', '', parentKey, parentServerId);
            } else {
                pb.addDraft('', '', '', '', null, null);
            }
        },
        [flat, pb, getParentInfo],
    );

    const handleItemChange = useCallback(
        async (change: ItemChange) => {
            const row = flat.find((f) => f.id === change.id);
            if (!row) return;
            if (row.isDraft) {
                const patch: any = {};
                if (change.start) patch.startDate = moment(change.start).format('YYYY-MM-DD');
                if (change.end) patch.endDate = moment(change.end).format('YYYY-MM-DD');
                pb.updateDraft(row.id, patch);
            } else {
                if (change.start) pb.editItemField(row.item.id, 'scheduledStart', moment(change.start).format('YYYY-MM-DD'));
                if (change.end) pb.editItemField(row.item.id, 'scheduledEnd', moment(change.end).format('YYYY-MM-DD'));
            }
        },
        [flat, pb],
    );

    const handleItemCreate = useCallback(
        async (start: Date, end: Date, groupId?: string) => {
            let parentKey: string | null = null;
            let parentServerId: string | null = null;
            if (groupId) {
                // Create as sibling of the lane (same parent), not as child
                const lane = flat.find((f) => f.id === groupId);
                if (lane && lane.parentId) {
                    const info = getParentInfo(lane.parentId);
                    parentKey = info.parentKey;
                    parentServerId = info.parentServerId;
                }
            }
            pb.addDraft('New Task', moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'), '', parentKey, parentServerId);
        },
        [pb, flat, getParentInfo],
    );

    const handleDelete = useCallback(
        async (ids: string[]) => {
            for (const id of ids) {
                const row = flat.find((f) => f.id === id);
                if (!row) continue;
                if (row.isDraft) pb.deleteDraft(id);
                else pb.markDeleted(row.item.id);
            }
        },
        [flat, pb],
    );

    const handleNavigate = useCallback(
        (dir: 'prev' | 'next' | 'today') => {
            const span = horizonEnd.getTime() - horizonStart.getTime();
            if (dir === 'today') {
                setHorizonStart(new Date(now.getFullYear(), now.getMonth(), 1));
                setHorizonEnd(new Date(now.getFullYear(), now.getMonth() + 2, 0));
            } else {
                const sign = dir === 'prev' ? -1 : 1;
                const shift = span * 0.5 * sign;
                setHorizonStart((s) => new Date(s.getTime() + shift));
                setHorizonEnd((e) => new Date(e.getTime() + shift));
            }
        },
        [horizonStart, horizonEnd],
    );

    const handleHorizonChange = useCallback((s: Date, e: Date) => {
        setHorizonStart(s);
        setHorizonEnd(e);
    }, []);

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

    const { registerSave, onPendingChange } = useBatchContext();

    const handleSave = useCallback(async () => { await pb.saveAll(); }, [pb]);

    useEffect(() => { registerSave(handleSave); }, [registerSave, handleSave]);
    useEffect(() => { onPendingChange(pb.hasPendingChanges, pb.saving); }, [onPendingChange, pb.hasPendingChanges, pb.saving]);

    const handleFieldChange = useCallback(
        (row: FlatItem, field: string, value: string) => {
            if (row.isDraft) {
                const patch: any = {};
                if (field === 'title') patch.title = value;
                else if (field === 'scheduledStart') patch.startDate = value;
                else if (field === 'scheduledEnd') patch.endDate = value;
                else if (field === 'estimatedHours') patch.estimatedHours = value;
                pb.updateDraft(row.id, patch);
            } else {
                if (field === 'title') {
                    const task = row.item.task || {};
                    if (task.id) pb.editTaskField(task.id, 'title', value);
                } else {
                    pb.editItemField(row.item.id, field, value);
                }
            }
        },
        [pb],
    );

    // ── Timeline sidebar row renderer ──────────────────────────────
    const renderGroupHeader: TimelineRenderers['renderGroupHeader'] = useCallback(
        (group, _expanded) => {
            if (group.id === '__add_row__') {
                if (!projectId) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: ROW_H, px: 1, borderBottom: '1px solid', borderColor: 'grey.200', bgcolor: '#fafbfc', color: 'text.disabled', fontSize: '0.78rem' }}>
                            Loading…
                        </Box>
                    );
                }
                return (
                    <AddRowInput
                        depth={addDepth}
                        onDepthChange={setAddDepth}
                        noBorder
                        onSubmit={async (title, depth) => {
                            if (!title.trim()) return;
                            let parentKey: string | null = null;
                            let parentServerId: string | null = null;
                            if (depth > 0) {
                                const anchorId = selectedId || flat[flat.length - 1]?.id;
                                if (anchorId) {
                                    const anchorRow = flat.find((f) => f.id === anchorId);
                                    if (anchorRow) {
                                        let target = anchorRow;
                                        while (target && target.depth >= depth) {
                                            const p = flat.find((f) => f.id === target.parentId);
                                            if (!p) break;
                                            target = p;
                                        }
                                        if (target && target.depth === depth - 1) {
                                            const info = getParentInfo(target.id);
                                            parentKey = info.parentKey;
                                            parentServerId = info.parentServerId;
                                        }
                                    }
                                }
                            }
                            pb.addDraft(title.trim(), '', '', '', parentKey, parentServerId);
                        }}
                    />
                );
            }

            const row = flat.find((f) => f.id === group.id);
            if (!row) return <span>{group.id}</span>;

            const children = hasChildren(row.id);
            const isCollapsed = collapsed.has(row.id);
            const isSelected = selectedId === row.id;
            const isDeletedLocally = !row.isDraft && pb.isDeleted(row.item.id);
            const idx = visibleRows.findIndex((r) => r.id === row.id);
            const stripe = idx % 2 === 0;

            const taskTitle = getDisplay(row, 'title');
            const startVal = getDisplay(row, 'scheduledStart');
            const endVal = getDisplay(row, 'scheduledEnd');
            const hoursVal = getDisplay(row, 'estimatedHours');

            return (
                <Box
                    data-sidebar-row={row.id}
                    tabIndex={0}
                    onClick={() => setSelectedId(row.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                            if (!isSelected) return;
                            e.preventDefault();
                            if (e.shiftKey) {
                                if (row.isDraft) pb.outdentDraft(row.id, flat);
                                else if (row.depth > 0 && row.parentId) {
                                    const parent = flat.find((f) => f.id === row.parentId);
                                    const newParentId = parent?.parentId || null;
                                    pb.editItemField(row.item.id, 'parentItemId', newParentId || '');
                                }
                            } else {
                                const idx = flat.findIndex((f) => f.id === row.id);
                                let prevSibling: FlatItem | undefined;
                                for (let i = idx - 1; i >= 0; i--) {
                                    if (flat[i].depth === row.depth) { prevSibling = flat[i]; break; }
                                    if (flat[i].depth < row.depth) break;
                                }
                                if (prevSibling) {
                                    if (row.isDraft) pb.indentDraft(row.id, flat);
                                    else pb.editItemField(row.item.id, 'parentItemId', prevSibling.id);
                                }
                            }
                            return;
                        }
                        if (e.key === 'Enter') {
                            const tagName = (e.target as HTMLElement).tagName;
                            if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') return;
                            e.preventDefault();
                            addChildDraft(row.id);
                        }
                    }}
                    onContextMenu={(e) => handleContextMenu(e, row.id)}
                    sx={{
                        display: 'flex', alignItems: 'center', height: '100%', position: 'relative',
                        bgcolor: isDeletedLocally ? '#fff0f0' : isSelected ? '#e3f2fd' : stripe ? '#fafbfc' : '#ffffff',
                        cursor: 'pointer',
                        opacity: isDeletedLocally ? 0.55 : 1,
                        textDecoration: isDeletedLocally ? 'line-through' : 'none',
                        '&:hover': { bgcolor: isDeletedLocally ? '#ffe0e0' : isSelected ? '#e3f2fd' : '#f0f4f8' },
                        minWidth: 0,
                    }}
                >
                    <TreeBranchVSCode
                        variant="depth-borders"
                        depth={row.depth}
                        hasChildren={children}
                        isCollapsed={isCollapsed}
                        onToggle={() => toggleCollapse(row.id)}
                        connectors={row.connectors}
                    />

                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }}>
                        <TextField
                            key={`title-${row.id}-${taskTitle}`}
                            size="small" variant="standard"
                            defaultValue={taskTitle}
                            onBlur={(e) => { if (e.target.value !== taskTitle) handleFieldChange(row, 'title', e.target.value); }}
                            onKeyDown={(e) => {
                                if (e.key === 'Tab') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    (e.target as HTMLInputElement).blur();
                                    if (e.shiftKey) {
                                        if (row.isDraft) pb.outdentDraft(row.id, flat);
                                        else if (row.depth > 0 && row.parentId) {
                                            const parent = flat.find((f) => f.id === row.parentId);
                                            const newParentId = parent?.parentId || null;
                                            pb.editItemField(row.item.id, 'parentItemId', newParentId || '');
                                        }
                                    } else {
                                        const idx = flat.findIndex((f) => f.id === row.id);
                                        let prevSibling: FlatItem | undefined;
                                        for (let i = idx - 1; i >= 0; i--) {
                                            if (flat[i].depth === row.depth) { prevSibling = flat[i]; break; }
                                            if (flat[i].depth < row.depth) break;
                                        }
                                        if (prevSibling) {
                                            if (row.isDraft) pb.indentDraft(row.id, flat);
                                            else pb.editItemField(row.item.id, 'parentItemId', prevSibling.id);
                                        }
                                    }
                                    return;
                                }
                                if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value.trim()) {
                                        input.blur();
                                        addSiblingDraft(row.id);
                                    } else {
                                        input.blur();
                                    }
                                }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ flex: 1, minWidth: 0, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
                        />
                    </Box>

                    <TextField
                        key={`start-${row.id}-${startVal}`}
                        size="small" variant="standard" type="date"
                        defaultValue={fmtDate(startVal)}
                        onBlur={(e) => handleFieldChange(row, 'scheduledStart', e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ width: COL_START, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px', fontSize: '0.7rem' } }}
                    />

                    <TextField
                        key={`end-${row.id}-${endVal}`}
                        size="small" variant="standard" type="date"
                        defaultValue={fmtDate(endVal)}
                        onBlur={(e) => handleFieldChange(row, 'scheduledEnd', e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ width: COL_END, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px', fontSize: '0.7rem' } }}
                    />

                    <TextField
                        key={`hours-${row.id}-${hoursVal}`}
                        size="small" variant="standard" type="number"
                        defaultValue={hoursVal}
                        onBlur={(e) => handleFieldChange(row, 'estimatedHours', e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        onClick={(e) => e.stopPropagation()}
                        inputProps={{ min: 0, step: 0.5, style: { textAlign: 'center', fontSize: '0.7rem' } }}
                        sx={{ width: COL_HOURS, flexShrink: 0, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
                    />

                    <Box sx={{ width: COL_ACTIONS, flexShrink: 0, height: '100%' }} />
                </Box>
            );
        },
        [flat, collapsed, selectedId, projectId, addDepth, visibleRows, hasChildren, toggleCollapse, pb, getDisplay, getParentInfo, handleFieldChange, addChildDraft],
    );

    // ── Context menu node ──────────────────────────────────────────
    const contextMenuNode = (
        <Menu
            open={contextMenu !== null}
            onClose={closeContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
            slotProps={{ paper: { sx: { minWidth: 180 } } }}
        >
            <MenuItem dense onClick={() => { if (contextRow) addChildDraft(contextRow.id); closeContextMenu(); }}>
                <ListItemIcon><Add fontSize="small" /></ListItemIcon>
                <ListItemText>Add child</ListItemText>
                <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.7rem', ml: 1 }}>Enter</Box>
            </MenuItem>
            <MenuItem dense onClick={() => { if (contextRow) { if (contextRow.isDraft) pb.deleteDraft(contextRow.id); else pb.markDeleted(contextRow.item.id); } closeContextMenu(); }}>
                <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
                <ListItemText>Delete</ListItemText>
                <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.7rem', ml: 1 }}>Del</Box>
            </MenuItem>
            <MenuItem dense onClick={() => { if (contextRow) { if (contextRow.isDraft) { pb.indentDraft(contextRow.id, flat); } else { const idx = flat.findIndex((f) => f.id === contextRow.id); let prevSibling: FlatItem | undefined; for (let i = idx - 1; i >= 0; i--) { if (flat[i].depth === contextRow.depth) { prevSibling = flat[i]; break; } if (flat[i].depth < contextRow.depth) break; } if (prevSibling) pb.editItemField(contextRow.item.id, 'parentItemId', prevSibling.id); } } closeContextMenu(); }}>
                <ListItemIcon><KeyboardTab fontSize="small" /></ListItemIcon>
                <ListItemText>Indent</ListItemText>
                <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.7rem', ml: 1 }}>Tab</Box>
            </MenuItem>
            <MenuItem dense disabled={!contextRow || contextRow.depth === 0} onClick={() => { if (contextRow) { if (contextRow.isDraft) { pb.outdentDraft(contextRow.id, flat); } else if (contextRow.parentId) { const parent = flat.find((f) => f.id === contextRow.parentId); const newParentId = parent?.parentId || null; pb.editItemField(contextRow.item.id, 'parentItemId', newParentId || ''); } } closeContextMenu(); }}>
                <ListItemIcon><KeyboardTab sx={{ transform: 'scaleX(-1)', fontSize: 'small' }} /></ListItemIcon>
                <ListItemText>Outdent</ListItemText>
                <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.7rem', ml: 1 }}>⇧Tab</Box>
            </MenuItem>
        </Menu>
    );

    // ── Shared sidebar header renderer ──────────────────────────────
    const sidebarHeader = (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', px: '12px', borderBottom: '2px solid', borderColor: 'grey.300', bgcolor: '#f1f5f9' }}>
            <Box sx={{ width: COL_INDENT, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', borderRight: '1px solid', borderColor: 'grey.300' }}>#</Box>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', px: 0.5, borderRight: '1px solid', borderColor: 'grey.300' }}>Task</Box>
            <Box sx={{ width: COL_START, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', borderRight: '1px solid', borderColor: 'grey.300' }}>Start</Box>
            <Box sx={{ width: COL_END, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', borderRight: '1px solid', borderColor: 'grey.300' }}>End</Box>
            <Box sx={{ width: COL_HOURS, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', borderRight: '1px solid', borderColor: 'grey.300' }}>Hrs</Box>
            <Box sx={{ width: COL_ACTIONS, flexShrink: 0, height: '100%' }} />
        </Box>
    );

    // Memoized to avoid new-array-every-render causing spurious onSelect
    // re-triggers in Timeline. The hook also guards against this, but a
    // stable reference at the source is the cleaner fix.
    const selectedItemIds = useMemo(
        () => selectedId ? [selectedId] : [],
        [selectedId],
    );

    // ── Shared GanttView props (split & gantt modes) ────────────────
    const ganttViewProps = {
        items: timelineItems,
        groups: timelineGroups,
        start: horizonStart,
        end: horizonEnd,
        step: 'day' as const,
        itemHeight: 30,
        headerHeight: 48,
        showLinks: false,
        showToday: true,
        fitContainer: true,
        selectedItemIds,
        callbacks: {
            onItemChange: handleItemChange,
            onItemCreate: handleItemCreate,
            onDelete: handleDelete,
            onSelect: handleSelect,
            onNavigate: handleNavigate,
            onHorizonChange: handleHorizonChange,
        },
        renderers: {
            renderSidebarHeader: () => sidebarHeader,
            renderGroupHeader,
            renderItem: (item: TimelineItem) => (
                <span style={{ fontSize: 10, fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', paddingLeft: 4 }}>
                    {item.label}
                </span>
            ),
        },
        contextMenu: contextMenuNode,
    };

    // ── Row renderer for standalone list view ────────────────────────
    const renderListRow = (row: FlatItem, idx: number) => {
        const children = hasChildren(row.id);
        const isCollapsed = collapsed.has(row.id);
        const isSelected = selectedId === row.id;
        const isDeletedLocally = !row.isDraft && pb.isDeleted(row.item.id);
        const stripe = idx % 2 === 0;
        const taskTitle = getDisplay(row, 'title');
        const startVal = getDisplay(row, 'scheduledStart');
        const endVal = getDisplay(row, 'scheduledEnd');
        const hoursVal = getDisplay(row, 'estimatedHours');

        return (
            <Box
                key={row.id}
                data-sidebar-row={row.id}
                tabIndex={0}
                onClick={() => setSelectedId(row.id)}
                onContextMenu={(e) => handleContextMenu(e, row.id)}
                sx={{
                    display: 'flex', alignItems: 'center', height: ROW_H, px: 1.5,
                    position: 'relative',
                    bgcolor: isDeletedLocally ? '#fff0f0' : isSelected ? '#e3f2fd' : stripe ? '#fafbfc' : '#ffffff',
                    borderBottom: '1px solid', borderColor: 'grey.200',
                    cursor: 'pointer', opacity: isDeletedLocally ? 0.55 : 1,
                    textDecoration: isDeletedLocally ? 'line-through' : 'none',
                    '&:hover': { bgcolor: isDeletedLocally ? '#ffe0e0' : isSelected ? '#e3f2fd' : '#f0f4f8' },
                    minWidth: 0, flexShrink: 0,
                }}
            >
                <TreeBranchVSCode
                    variant="depth-borders"
                    depth={row.depth}
                    hasChildren={children}
                    isCollapsed={isCollapsed}
                    onToggle={() => toggleCollapse(row.id)}
                    connectors={row.connectors}
                />

                {/* Title */}
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }}>
                    <TextField
                        key={`title-${row.id}-${taskTitle}`}
                        size="small" variant="standard"
                        defaultValue={taskTitle}
                        onBlur={(e) => { if (e.target.value !== taskTitle) handleFieldChange(row, 'title', e.target.value); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ flex: 1, minWidth: 0, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
                    />
                </Box>

                <TextField
                    key={`start-${row.id}-${startVal}`}
                    size="small" variant="standard" type="date"
                    defaultValue={fmtDate(startVal)}
                    onBlur={(e) => handleFieldChange(row, 'scheduledStart', e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ width: COL_START, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px', fontSize: '0.7rem' } }}
                />

                <TextField
                    key={`end-${row.id}-${endVal}`}
                    size="small" variant="standard" type="date"
                    defaultValue={fmtDate(endVal)}
                    onBlur={(e) => handleFieldChange(row, 'scheduledEnd', e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ width: COL_END, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.200', height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px', fontSize: '0.7rem' } }}
                />

                <TextField
                    key={`hours-${row.id}-${hoursVal}`}
                    size="small" variant="standard" type="number"
                    defaultValue={hoursVal}
                    onBlur={(e) => handleFieldChange(row, 'estimatedHours', e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                    onClick={(e) => e.stopPropagation()}
                    inputProps={{ min: 0, step: 0.5, style: { textAlign: 'center', fontSize: '0.7rem' } }}
                    sx={{ width: COL_HOURS, flexShrink: 0, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
                />

                <Box sx={{ width: COL_ACTIONS, flexShrink: 0, height: '100%' }} />
            </Box>
        );
    };

    // ── Toggle toolbar ───────────────────────────────────────────────
    const toggleBar = (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.25, bgcolor: '#f5f5f5', borderBottom: '1px solid', borderColor: 'grey.300', gap: 0.5, flexShrink: 0 }}>
            <IconButton size="small" title="Split view" onClick={() => setViewMode('split')} sx={{ p: 0.5, borderRadius: 1, bgcolor: viewMode === 'split' ? 'primary.main' : 'transparent', color: viewMode === 'split' ? 'white' : 'text.secondary', '&:hover': { bgcolor: viewMode === 'split' ? 'primary.dark' : 'grey.200' } }}>
                <Box component="span" sx={{ fontSize: '1rem', lineHeight: 1 }}>⊞</Box>
            </IconButton>
            <IconButton size="small" title="List only" onClick={() => setViewMode('list')} sx={{ p: 0.5, borderRadius: 1, bgcolor: viewMode === 'list' ? 'primary.main' : 'transparent', color: viewMode === 'list' ? 'white' : 'text.secondary', '&:hover': { bgcolor: viewMode === 'list' ? 'primary.dark' : 'grey.200' } }}>
                <Box component="span" sx={{ fontSize: '1rem', lineHeight: 1 }}>≡</Box>
            </IconButton>
            <IconButton size="small" title="Gantt only" onClick={() => setViewMode('gantt')} sx={{ p: 0.5, borderRadius: 1, bgcolor: viewMode === 'gantt' ? 'primary.main' : 'transparent', color: viewMode === 'gantt' ? 'white' : 'text.secondary', '&:hover': { bgcolor: viewMode === 'gantt' ? 'primary.dark' : 'grey.200' } }}>
                <Box component="span" sx={{ fontSize: '1rem', lineHeight: 1 }}>▦</Box>
            </IconButton>
        </Box>
    );

    // ── Render ─────────────────────────────────────────────────────
    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {toggleBar}

            {viewMode === 'list' ? (
                /* ── Dedicated list view ──────────────────────────── */
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                    {/* Column header */}
                    <Box sx={{ flexShrink: 0 }}>
                        {sidebarHeader}
                    </Box>

                    {/* Scrollable rows */}
                    <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                        {visibleRows.map((row, idx) => renderListRow(row, idx))}

                        {/* Add-row at bottom */}
                        {projectId ? (
                            <Box sx={{ px: 1.5 }}>
                                <AddRowInput
                                    depth={addDepth}
                                    onDepthChange={setAddDepth}
                                    onSubmit={async (title, depth) => {
                                        if (!title.trim()) return;
                                        let parentKey: string | null = null;
                                        let parentServerId: string | null = null;
                                        if (depth > 0) {
                                            const anchorId = selectedId || flat[flat.length - 1]?.id;
                                            if (anchorId) {
                                                const anchorRow = flat.find((f) => f.id === anchorId);
                                                if (anchorRow) {
                                                    let target = anchorRow;
                                                    while (target && target.depth >= depth) {
                                                        const p = flat.find((f) => f.id === target.parentId);
                                                        if (!p) break;
                                                        target = p;
                                                    }
                                                    if (target && target.depth === depth - 1) {
                                                        const info = getParentInfo(target.id);
                                                        parentKey = info.parentKey;
                                                        parentServerId = info.parentServerId;
                                                    }
                                                }
                                            }
                                        }
                                        pb.addDraft(title.trim(), '', '', '', parentKey, parentServerId);
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', height: ROW_H, px: 1, borderBottom: '1px solid', borderColor: 'grey.200', bgcolor: '#fafbfc', color: 'text.disabled', fontSize: '0.78rem' }}>Loading…</Box>
                        )}
                    </Box>

                    {contextMenuNode}
                </Box>
            ) : (
                /* ── Split / Gantt view ──────────────────────────── */
                <GanttView
                    {...ganttViewProps}
                    sidebarWidth={viewMode === 'gantt' ? 0 : SIDEBAR_W}
                />
            )}
        </Box>
    );
};
