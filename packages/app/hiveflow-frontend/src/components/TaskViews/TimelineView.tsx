import React, { useMemo, useCallback, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { Timeline, TreeBranchVSCode, VSCODE_TWISTY_WIDTH, DEPTH_BORDER_WIDTH } from '@hive-flow/ui';
import type { TimelineItem, TimelineGroup } from '@hive-flow/ui';
import { stringToColor } from '@hexhive/utils';
import type { KanbanColumn, KanbanRow, KanbanTask } from '../../types/kanban';

// ── Types ───────────────────────────────────────────────────────────

export interface TimelineViewProps {
  columns: KanbanColumn[];
  onSelectCard?: (row: KanbanRow) => void;
  /** Update a task's scalar fields (from useAssignments) */
  updateTask?: (
    id: string,
    updates: Record<string, unknown>,
    type?: 'project' | 'estimate',
  ) => Promise<void>;
  /** Refetch after mutation */
  refetch?: () => void;
  /** Days of lookback for the initial visible window (default 90). */
  horizonDays?: number;
}

// ── Constants ────────────────────────────────────────────────────────

const SIDEBAR_W = 400;
const ROW_H = 32;
const COL_TITLE_FLEX = 1;
const COL_DATE = 110;

interface TreeRow {
  task: KanbanTask;
  depth: number;
  hasChildren: boolean;
  connectors: boolean[];
}

interface FlatTask {
  _row: KanbanRow;
  task: KanbanTask;
  id: string;
  start: Date;
  end: Date;
  name: string;
  color: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  Backlog: '#ff9800',
  'In Progress': '#4caf50',
  Reviewing: '#2196f3',
  Finished: '#9e9e9e',
};

function flattenTasks(columns: KanbanColumn[]): FlatTask[] {
  const result: FlatTask[] = [];
  for (const col of columns) {
    for (const row of col.rows) {
      const t = row._task;
      const src = t.project ?? t.estimate;
      const label = src ? `${src.displayId} - ` : '';
      result.push({
        _row: row,
        task: t,
        id: t.id,
        start: t.startDate ? new Date(t.startDate) : new Date(),
        end: t.endDate ? new Date(t.endDate) : new Date(Date.now() + 86400000),
        name: `${label}${t.title}`,
        color: STATUS_COLORS[col.id] ?? stringToColor(t.title),
        status: col.id,
      });
    }
  }
  return result;
}

function computeInitialRange(_tasks: FlatTask[], horizonDays: number = 90) {
  const now = new Date();
  // Anchor the initial view around today, respecting the chosen horizon.
  // Look back horizonDays and forward 30 days so the user sees current work first.
  return {
    start: new Date(now.getTime() - horizonDays * 86400000),
    end: new Date(now.getTime() + 30 * 86400000),
  };
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return '';
  const m = /^\d{4}-\d{2}-\d{2}/.exec(d);
  return m ? m[0] : '';
}

// ── Component ───────────────────────────────────────────────────────

export const TimelineView: React.FC<TimelineViewProps> = ({
  columns,
  onSelectCard,
  updateTask,
  refetch,
  horizonDays = 90,
}) => {
  const tasks = useMemo(() => flattenTasks(columns), [columns]);

  const [range, setRange] = useState(() => computeInitialRange(tasks, horizonDays));

  // ── Collapse state ─────────────────────────────────────────────

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ── Build tree-ordered rows ────────────────────────────────────

  const treeRows = useMemo((): TreeRow[] => {
    // Build parent → children map
    const childrenByParent = new Map<string, KanbanTask[]>();
    const topLevel: KanbanTask[] = [];
    const taskById = new Map<string, KanbanTask>();

    for (const t of tasks) {
      taskById.set(t.id, t.task);
      if (t.task.parent?.id) {
        const pid = t.task.parent.id;
        if (!childrenByParent.has(pid)) childrenByParent.set(pid, []);
        childrenByParent.get(pid)!.push(t.task);
      } else {
        topLevel.push(t.task);
      }
    }

    const rows: TreeRow[] = [];

    function walk(list: KanbanTask[], depth: number, parentConnectors: boolean[]) {
      for (let i = 0; i < list.length; i++) {
        const t = list[i];
        const kids = childrenByParent.get(t.id) ?? [];
        const isLast = i === list.length - 1;
        const connectors = [...parentConnectors, !isLast];
        rows.push({
          task: t,
          depth,
          hasChildren: kids.length > 0,
          connectors: depth === 0 ? [] : parentConnectors,
        });
        if (!collapsed.has(t.id) && kids.length > 0) {
          walk(kids, depth + 1, connectors);
        }
      }
    }
    walk(topLevel, 0, []);
    return rows;
  }, [tasks, collapsed]);

  // ── Fast lookup ────────────────────────────────────────────────

  const taskById = useMemo(() => {
    const m = new Map<string, FlatTask>();
    for (const t of tasks) m.set(t.id, t);
    return m;
  }, [tasks]);

  const rowById = useMemo(() => {
    const m = new Map<string, TreeRow>();
    for (const r of treeRows) m.set(r.task.id, r);
    return m;
  }, [treeRows]);

  // ── Groups & items ─────────────────────────────────────────────

  const groups: TimelineGroup[] = useMemo(
    () =>
      treeRows.map((row) => ({
        id: row.task.id,
        label: row.task.title ?? '',
      })),
    [treeRows],
  );

  const timelineItems: TimelineItem[] = useMemo(
    () =>
      treeRows
        .filter((row) => {
          const ft = taskById.get(row.task.id);
          return ft && ft.end > range.start && ft.start < range.end;
        })
        .map((row) => {
          const ft = taskById.get(row.task.id)!;
          return {
            id: ft.id,
            start: ft.start,
            end: ft.end,
            label: ft.name,
            color: ft.color,
            showLabel: true,
            groupId: ft.id,
          };
        }),
    [treeRows, taskById, range],
  );

  // ── Compute column widths ─────────────────────────────────────

  const maxDepth = useMemo(
    () => treeRows.reduce((max, r) => Math.max(max, r.depth), 0),
    [treeRows],
  );

  const COL_TREE = VSCODE_TWISTY_WIDTH + maxDepth * DEPTH_BORDER_WIDTH;

  const sidebarHeader = useMemo(
    () => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          px: '12px',
          borderBottom: '2px solid',
          borderColor: 'grey.300',
          bgcolor: '#f1f5f9',
          fontWeight: 700,
          fontSize: '0.7rem',
          color: 'text.secondary',
        }}
      >
        <Box
          sx={{
            width: COL_TREE,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            borderRight: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          #
        </Box>
        <Box
          sx={{
            flex: COL_TITLE_FLEX,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            px: 0.5,
            borderRight: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          Task
        </Box>
        <Box
          sx={{
            width: COL_DATE,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            borderRight: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          Start
        </Box>
        <Box
          sx={{
            width: COL_DATE,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          End
        </Box>
      </Box>
    ),
    [],
  );

  // ── Group header renderer ──────────────────────────────────────

  const renderGroupHeader = useCallback(
    (group: TimelineGroup, _expanded: boolean) => {
      const row = rowById.get(group.id);
      const ft = taskById.get(group.id);

      if (!row || !ft) {
        return (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', px: 1 }}>
            <Typography variant="caption" noWrap>
              {group.label}
            </Typography>
          </Box>
        );
      }

      const isCollapsed = collapsed.has(ft.id);
      const taskTitle = ft.task.title ?? '';

      const cellSx = {
        display: 'flex',
        alignItems: 'stretch',
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'grey.200',
        minWidth: 0,
      } as const;

      const inputSx = {
        flex: 1,
        minWidth: 0,
        height: '100%',
        '& .MuiInputBase-root': { py: 0, fontSize: '0.72rem', height: '100%' },
        '& .MuiInputBase-input': { px: '4px', py: '2px', height: '100%' },
      };

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            height: '100%',
            borderBottom: '1px solid',
            borderColor: 'grey.200',
            bgcolor: row.depth > 0 ? '#fafbfc' : '#ffffff',
            '&:hover': { bgcolor: '#f0f4f8' },
            boxSizing: 'border-box',
          }}
        >
          {/* Tree branch with twisty */}
          <Box sx={{ width: COL_TREE, flexShrink: 0, display: 'flex', height: '100%' }}>
            <TreeBranchVSCode
              variant="depth-borders"
              depth={row.depth}
              hasChildren={row.hasChildren}
              isCollapsed={isCollapsed}
              onToggle={() => toggleCollapse(ft.id)}
              connectors={row.connectors}
            />
          </Box>

          {/* Title */}
          <Box sx={{ ...cellSx, flex: COL_TITLE_FLEX, minWidth: 0 }}>
            <TextField
              size="small"
              variant="standard"
              value={taskTitle}
              InputProps={{ readOnly: true, disableUnderline: true }}
              sx={inputSx}
            />
          </Box>

          {/* Start date */}
          <Box sx={{ ...cellSx, width: COL_DATE, flexShrink: 0 }}>
            <TextField
              size="small"
              variant="standard"
              value={fmtDate(ft.task.startDate)}
              InputProps={{ readOnly: true, disableUnderline: true }}
              sx={{
                flex: 1,
                height: '100%',
                '& .MuiInputBase-root': { py: 0, height: '100%' },
                '& .MuiInputBase-input': {
                  px: '4px',
                  py: '2px',
                  fontSize: '0.7rem',
                  height: '100%',
                  textAlign: 'center',
                },
              }}
            />
          </Box>

          {/* End date */}
          <Box sx={{ ...cellSx, width: COL_DATE, flexShrink: 0, borderRight: 'none' }}>
            <TextField
              size="small"
              variant="standard"
              value={fmtDate(ft.task.endDate)}
              InputProps={{ readOnly: true, disableUnderline: true }}
              sx={{
                flex: 1,
                height: '100%',
                '& .MuiInputBase-root': { py: 0, height: '100%' },
                '& .MuiInputBase-input': {
                  px: '4px',
                  py: '2px',
                  fontSize: '0.7rem',
                  height: '100%',
                  textAlign: 'center',
                },
              }}
            />
          </Box>
        </Box>
      );
    },
    [rowById, taskById, collapsed, toggleCollapse],
  );

  // ── Callbacks ──────────────────────────────────────────────────

  const handleSelect = useCallback(
    (sel: { itemIds: string[]; linkIds: string[] }) => {
      if (sel.itemIds.length === 0) return;
      const flat = taskById.get(sel.itemIds[0]);
      if (flat) onSelectCard?.(flat._row);
    },
    [taskById, onSelectCard],
  );

  const handleItemChange = useCallback(
    (change: { id: string; start?: Date; end?: Date }) => {
      if (!updateTask) return;
      const flat = taskById.get(change.id);
      if (!flat) return;

      const taskType: 'project' | 'estimate' | undefined = flat.task.project
        ? 'project'
        : flat.task.estimate
          ? 'estimate'
          : undefined;

      const updates: Record<string, unknown> = {};
      if (change.start) updates.startDate = change.start.toISOString();
      if (change.end) updates.endDate = change.end.toISOString();
      if (Object.keys(updates).length === 0) return;

      updateTask(flat.task.id, updates, taskType).then(() => refetch?.());
    },
    [taskById, updateTask, refetch],
  );

  const handleHorizonChange = useCallback(
    (start: Date, end: Date) => setRange({ start, end }),
    [],
  );

  // ── Render ─────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
        '& .color-dot': { margin: '8px' },
      }}
    >
      <Timeline
        items={timelineItems}
        groups={groups}
        start={range.start}
        end={range.end}
        step="day"
        sidebarWidth={SIDEBAR_W}
        itemHeight={ROW_H}
        groupHeaderHeight={ROW_H}
        readonly={!updateTask || timelineItems.length === 0}
        sidebarPadding={false}
        callbacks={{
          onHorizonChange: handleHorizonChange,
          onSelect: handleSelect,
          onItemChange: handleItemChange,
        }}
        renderers={{
          renderSidebarHeader: () => sidebarHeader,
          renderGroupHeader,
        }}
      />
    </Box>
  );
};

export default TimelineView;
