import React, { useContext, useMemo, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  Subject,
  TableChart,
} from '@mui/icons-material';
import {
  GanttView,
  TreeBranchVSCode,
  VSCODE_TWISTY_WIDTH,
  DEPTH_BORDER_WIDTH,
} from '@hive-flow/ui';
import { Timeline as TimelineIcon, List } from '../../../../assets';
import type {
  TimelineItem,
  TimelineLink,
  TimelineGroup,
  TimelineStep,
  HighlightedDay,
} from '@hive-flow/ui';
import { AvatarList } from '@hexhive/ui';
import { stringToColor } from '@hexhive/utils';
import { gql, useMutation as useApolloMutation, useQuery } from '@apollo/client';
import { UPDATE_ESTIMATE_TASK } from '@hive-flow/api';
import moment from 'moment';
import { KanbanBoard } from '../../../../components/KanbanBoard';
import { TableView } from '../../../../components/TaskViews';
import { KANBAN_STATUSES } from '../../../../types/kanban';
import type { KanbanColumn, KanbanRow } from '../../../../types/kanban';
import type { DropResult } from 'react-beautiful-dnd';
import { EstimateSingleContext } from '../context';

// ── Types ───────────────────────────────────────────────────────────

type ViewMode = 'gantt' | 'kanban' | 'list';

const VIEW_OPTIONS: Array<{
  value: ViewMode;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: 'gantt', label: 'Gantt', icon: <TimelineIcon width={20} /> },
  { value: 'kanban', label: 'Kanban', icon: <TableChart fontSize="small" /> },
  { value: 'list', label: 'List', icon: <List width={20} /> },
];

// ── Constants ────────────────────────────────────────────────────────

const SIDEBAR_W = 440;
const ROW_H = 32;
const COL_TITLE_FLEX = 1;
const COL_DATE = 120;

// ── Helpers ─────────────────────────────────────────────────────────

function computeInitialRange(tasks: any[]) {
  if (!tasks || tasks.length === 0) {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 2, 0),
    };
  }
  const times = tasks.flatMap((t) => {
    const s = t.startDate ? new Date(t.startDate).getTime() : null;
    const e = t.endDate ? new Date(t.endDate).getTime() : null;
    const vals = [s, e].filter((v): v is number => v != null && !isNaN(v));
    return vals;
  });
  if (times.length === 0) {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 2, 0),
    };
  }
  const min = Math.min(...times);
  const max = Math.max(...times);
  const pad = 7 * 86400000;
  return { start: new Date(min - pad), end: new Date(max + pad) };
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return '';
  const m = /^\d{4}-\d{2}-\d{2}/.exec(d);
  return m ? m[0] : '';
}

interface GanttRow {
  task: any;
  depth: number;
  hasChildren: boolean;
  connectors: boolean[];
}

// ── Component ───────────────────────────────────────────────────────

export const TicketsPane: React.FC = () => {
  const {
    estimateId,
    tasks = [],
    finishTtl,
    updateTaskStatus,
    createTask,
    updateTask,
    createDependency,
    deleteDependency,
    refetch,
  } = useContext(EstimateSingleContext);

  const [viewMode, setViewMode] = useState<ViewMode>('gantt');
  const [range, setRange] = useState(() => computeInitialRange(tasks));
  const [ganttStep, setGanttStep] = useState<TimelineStep>('day');

  // ── New task row state ───────────────────────────────────────
  const NEW_TASK_ID = '__new_task__';
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStart, setNewTaskStart] = useState('');
  const [newTaskEnd, setNewTaskEnd] = useState('');

  const handleCreateNewTask = useCallback(() => {
    const title = newTaskTitle.trim();
    if (!title) return;
    createTask?.({
      status: 'Backlog',
      title,
      start: newTaskStart ? new Date(newTaskStart) : new Date(),
      end: newTaskEnd ? new Date(newTaskEnd) : new Date(),
    });
    setNewTaskTitle('');
    setNewTaskStart('');
    setNewTaskEnd('');
  }, [newTaskTitle, newTaskStart, newTaskEnd, createTask]);

  // ── Enter-to-commit in sidebar: save field, then focus next ───
  const focusNextSidebarField = useCallback((current: HTMLInputElement) => {
    // Blur triggers onBlur save
    current.blur();
    // Find all sidebar inputs and focus the next one
    const allInputs = Array.from(
      document.querySelectorAll<HTMLInputElement>('[data-sidebar-input]'),
    );
    const idx = allInputs.indexOf(current);
    if (idx >= 0 && idx < allInputs.length - 1) {
      const next = allInputs[idx + 1];
      setTimeout(() => { next.focus(); next.select(); }, 0);
    }
  }, []);

  const [updateTaskDirect] = useApolloMutation(UPDATE_ESTIMATE_TASK);

  // ── Public holidays ──────────────────────────────────────────

  const holidayYear = useMemo(() => moment(range.start).year(), [range.start]);

  const { data: holidaysData } = useQuery(gql`
    query PublicHolidays($year: Int!) {
      publicHolidays(year: $year) {
        date
        name
      }
    }
  `, {
    variables: { year: holidayYear },
    skip: !range.start,
  });

  const highlightedDays = useMemo((): HighlightedDay[] => {
    if (!holidaysData?.publicHolidays) return [];
    return holidaysData.publicHolidays.map((h: { date: string; name: string }) => ({
      date: new Date(h.date),
      label: h.name,
      type: 'holiday' as const,
    }));
  }, [holidaysData]);

  // ── Derived kanban columns (shared by kanban + list views) ────

  const columns: KanbanColumn[] = useMemo(
    () =>
      KANBAN_STATUSES.map((status) => {
        const rows: KanbanRow[] = (tasks ?? [])
          .filter((t) => t.status === status)
          .sort((a, b) =>
            (a.columnRank ?? '').localeCompare(b.columnRank ?? ''),
          )
          .map((t) => ({
            id: t.id,
            title: t.title ?? t.name,
            _task: t,
            lastUpdated: t.lastUpdated ? new Date(t.lastUpdated) : undefined,
          }));
        return {
          id: status,
          title: status,
          rows,
          ttl: status === 'Finished' ? finishTtl : undefined,
        };
      }),
    [tasks, finishTtl],
  );

  // ── Gantt: collapse state ────────────────────────────────────

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // ── Gantt: tree-ordered groups, items & links ──────────────────

  const { ganttGroups, timelineItems, timelineLinks, ganttRows } = useMemo(() => {
    const allActive = (tasks ?? []).filter((t) => t.status !== 'Finished');

    // Build parent → children map
    const childrenByParent = new Map<string, any[]>();
    const topLevel: any[] = [];
    for (const t of allActive) {
      if (t.parent) {
        const pid = t.parent.id;
        if (!childrenByParent.has(pid)) childrenByParent.set(pid, []);
        childrenByParent.get(pid)!.push(t);
      } else {
        topLevel.push(t);
      }
    }

    // Tree-ordered flat list with connector computation
    const rows: GanttRow[] = [];

    function walk(list: any[], depth: number, parentConnectors: boolean[]) {
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

    // Groups & items
    const groups: TimelineGroup[] = [];
    const items: TimelineItem[] = [];

    for (const row of rows) {
      const t = row.task;
      groups.push({
        id: t.id,
        label: t.title ?? t.name ?? 'Untitled',
      });

      const s = t.startDate ? new Date(t.startDate) : null;
      const e = t.endDate ? new Date(t.endDate) : null;
      if (s && e && e > range.start && s < range.end) {
        items.push({
          id: t.id,
          start: s,
          end: e,
          label: t.title ?? t.name,
          color: stringToColor(t.title ?? t.name ?? ''),
          showLabel: true,
          groupId: t.id,
        });
      }
    }

    const links: TimelineLink[] = (tasks ?? [])
      .filter((a) => a.status !== 'Finished')
      .flatMap((task) =>
        (task.dependencyOf ?? []).map((dep: any) => ({
          id: `${task.id}-${dep.id}`,
          source: task.id,
          target: dep.id,
        })),
      );

    // Alwys add a few placeholder rows so shift+drag create has visible space
    // Always include one "new task" input row at the bottom
    const NEW_TASK_ID = '__new_task__';
    groups.push({
      id: NEW_TASK_ID,
      label: '',
    });

    return {
      ganttGroups: groups,
      timelineItems: items,
      timelineLinks: links,
      ganttRows: rows,
    };
  }, [tasks, range, collapsed]);

  // Build a map for quick row lookup by id
  const rowById = useMemo(() => {
    const m = new Map<string, GanttRow>();
    for (const r of ganttRows) m.set(r.task.id, r);
    return m;
  }, [ganttRows]);

  // ── Inline field update helper ─────────────────────────────────

  const updateTaskField = useCallback(
    (taskId: string, field: string, value: any) => {
      updateTaskDirect({
        variables: {
          id: taskId,
          input: { [field]: value, estimateId },
        },
      });
    },
    [updateTaskDirect, estimateId],
  );

  // ── Sidebar column header ──────────────────────────────────────

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
            width: VSCODE_TWISTY_WIDTH,
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
            borderRight: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          End
        </Box>
        <Box sx={{ width: 32, flexShrink: 0, height: '100%' }} />
      </Box>
    ),
    [],
  );

  // ── Group header renderer (editable sidebar rows) ──────────────

  const renderGroupHeader = useCallback(
    (group: TimelineGroup, _expanded: boolean) => {
      // ── New task input row ──────────────────────────────────
      if (group.id === NEW_TASK_ID) {
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
              bgcolor: '#fafbfc',
              boxSizing: 'border-box',
            }}
          >
            <Box sx={{ width: VSCODE_TWISTY_WIDTH, flexShrink: 0, display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>+</Typography>
            </Box>
            <Box sx={cellSx}>
              <TextField
                size="small"
                variant="standard"
                placeholder="New task (Enter to create)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (newTaskTitle.trim()) {
                      handleCreateNewTask();
                    } else {
                      focusNextSidebarField(e.target as HTMLInputElement);
                    }
                  }
                }}
                InputProps={{ disableUnderline: false }}
                inputProps={{ 'data-sidebar-input': '' } as any}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ ...cellSx, width: COL_DATE, flexShrink: 0 }}>
              <TextField
                size="small"
                variant="standard"
                type="date"
                value={newTaskStart}
                onChange={(e) => setNewTaskStart(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') focusNextSidebarField(e.target as HTMLInputElement);
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 'data-sidebar-input': '' } as any}
                sx={{
                  flex: 1,
                  height: '100%',
                  '& .MuiInputBase-root': { py: 0, height: '100%' },
                  '& .MuiInputBase-input': {
                    px: '4px',
                    py: '2px',
                    fontSize: '0.7rem',
                    height: '100%',
                  },
                }}
              />
            </Box>
            <Box sx={{ ...cellSx, width: COL_DATE, flexShrink: 0, borderRight: 'none' }}>
              <TextField
                size="small"
                variant="standard"
                type="date"
                value={newTaskEnd}
                onChange={(e) => setNewTaskEnd(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') focusNextSidebarField(e.target as HTMLInputElement);
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 'data-sidebar-input': '' } as any}
                sx={{
                  flex: 1,
                  height: '100%',
                  '& .MuiInputBase-root': { py: 0, height: '100%' },
                  '& .MuiInputBase-input': {
                    px: '4px',
                    py: '2px',
                    fontSize: '0.7rem',
                    height: '100%',
                  },
                }}
              />
            </Box>
            <Box sx={{ width: 32, flexShrink: 0, height: '100%' }} />
          </Box>
        );
      }

      const row = rowById.get(group.id);
      if (!row) return <Box sx={{ height: '100%' }}>{group.label}</Box>;

      const t = row.task;
      const isCollapsed = collapsed.has(t.id);
      const taskTitle = t.title ?? t.name ?? '';

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
          <Box sx={{ display: 'flex', height: '100%' }}>
            <TreeBranchVSCode
              variant="depth-borders"
              depth={row.depth}
              hasChildren={row.hasChildren}
              isCollapsed={isCollapsed}
              onToggle={() => toggleCollapse(t.id)}
              connectors={row.connectors}
            />
          </Box>

          {/* Title */}
          <Box sx={cellSx}>
            <TextField
              key={`title-${t.id}-${taskTitle}`}
              size="small"
              variant="standard"
              defaultValue={taskTitle}
              onBlur={(e) => {
                if (e.target.value !== taskTitle && e.target.value.trim()) {
                  updateTaskField(t.id, 'title', e.target.value.trim());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') focusNextSidebarField(e.target as HTMLInputElement);
              }}
              inputProps={{ 'data-sidebar-input': '' } as any}
              sx={inputSx}
            />
          </Box>

          {/* Start date */}
          <Box sx={{ ...cellSx, width: COL_DATE, flexShrink: 0 }}>
            <TextField
              key={`start-${t.id}-${t.startDate ?? ''}`}
              size="small"
              variant="standard"
              type="date"
              defaultValue={fmtDate(t.startDate)}
              onBlur={(e) => {
                if (e.target.value && e.target.value !== fmtDate(t.startDate)) {
                  updateTaskField(t.id, 'startDate', e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') focusNextSidebarField(e.target as HTMLInputElement);
              }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ 'data-sidebar-input': '' } as any}
              sx={{
                flex: 1,
                height: '100%',
                '& .MuiInputBase-root': { py: 0, height: '100%' },
                '& .MuiInputBase-input': {
                  px: '4px',
                  py: '2px',
                  fontSize: '0.7rem',
                  height: '100%',
                },
              }}
            />
          </Box>

          {/* End date */}
          <Box sx={{ ...cellSx, width: COL_DATE, flexShrink: 0, borderRight: 'none' }}>
            <TextField
              key={`end-${t.id}-${t.endDate ?? ''}`}
              size="small"
              variant="standard"
              type="date"
              defaultValue={fmtDate(t.endDate)}
              onBlur={(e) => {
                if (e.target.value && e.target.value !== fmtDate(t.endDate)) {
                  updateTaskField(t.id, 'endDate', e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') focusNextSidebarField(e.target as HTMLInputElement);
              }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ 'data-sidebar-input': '' } as any}
              sx={{
                flex: 1,
                height: '100%',
                '& .MuiInputBase-root': { py: 0, height: '100%' },
                '& .MuiInputBase-input': {
                  px: '4px',
                  py: '2px',
                  fontSize: '0.7rem',
                  height: '100%',
                },
              }}
            />
          </Box>
        </Box>
      );
    },
    [rowById, collapsed, toggleCollapse, updateTaskField],
  );

  // ── Kanban handlers ────────────────────────────────────────────

  const handleKanbanDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const newStatus =
        KANBAN_STATUSES[parseInt(result.destination.droppableId, 10)];
      if (!newStatus || newStatus === result.source?.droppableId) return;
      updateTaskStatus?.(
        result.draggableId,
        result.destination.index,
        newStatus,
      );
    },
    [updateTaskStatus],
  );

  const handleSelectCard = useCallback(
    (row: KanbanRow) => {
      const card = row._task;
      updateTask?.({
        ...card,
        start: card.startDate ? new Date(card.startDate) : undefined,
        end: card.endDate ? new Date(card.endDate) : undefined,
      });
    },
    [updateTask],
  );

  const handleCreateCard = useCallback(
    (columnId: string) => {
      createTask?.({
        status: columnId,
        start: new Date(),
        end: new Date(),
      });
    },
    [createTask],
  );

  // ── Gantt handlers ─────────────────────────────────────────────

  const handleGanttItemChange = useCallback(
    (change: { id: string; start?: Date; end?: Date }) => {
      updateTaskDirect({
        variables: {
          id: change.id,
          input: {
            startDate: change.start,
            endDate: change.end,
            estimateId,
          },
        },
      }).then(() => refetch?.());
    },
    [updateTaskDirect, estimateId, refetch],
  );

  const handleGanttSelect = useCallback(
    (sel: { itemIds: string[]; linkIds: string[] }) => {
      if (sel.linkIds.length > 0) return;
      if (sel.itemIds.length === 0) return;
      const task = tasks.find((t: any) => t.id === sel.itemIds[0]);
      if (task) {
        updateTask?.({
          ...task,
          start: task.startDate ? new Date(task.startDate) : undefined,
          end: task.endDate ? new Date(task.endDate) : undefined,
        });
      }
    },
    [tasks, updateTask],
  );

  const handleGanttItemCreate = useCallback(
    (start: Date, end: Date, groupId?: string) => {
      // New-task row or empty space → create new task via modal
      if (!groupId || groupId === NEW_TASK_ID) {
        createTask?.({ status: 'Backlog', start, end });
        return;
      }
      // Shift+drag in an existing task lane → set dates on that task
      updateTaskDirect({
        variables: {
          id: groupId,
          input: { startDate: start, endDate: end, estimateId },
        },
      }).then(() => refetch?.());
    },
    [createTask, updateTaskDirect, estimateId, refetch],
  );

  const handleGanttLinkCreate = useCallback(
    (link: { source: string; target: string }) => {
      createDependency?.(link.source, link.target);
    },
    [createDependency],
  );

  const handleGanttHorizonChange = useCallback(
    (start: Date, end: Date) => setRange({ start, end }),
    [],
  );

  const ZOOM_STEPS: TimelineStep[] = ['hour', 'day', 'week', 'month', 'year'];

  const handleGanttZoom = useCallback(
    (direction: 'in' | 'out') => {
      setGanttStep((prev) => {
        const idx = ZOOM_STEPS.indexOf(prev);
        if (direction === 'in') return ZOOM_STEPS[Math.max(0, idx - 1)];
        return ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, idx + 1)];
      });
    },
    [],
  );

  const handleGanttQuickCreate = useCallback(
    (date: Date) => {
      createTask?.({ status: 'Backlog', start: date, end: date });
    },
    [createTask],
  );

  // ── Shared card renderer (kanban) ──────────────────────────────

  const renderKanbanCard = useCallback(
    (row: KanbanRow) => (
      <Paper
        sx={{
          bgcolor: 'background.paper',
          minHeight: '24px',
          flexDirection: 'column',
          display: 'flex',
          padding: '6px',
          boxShadow: 1,
        }}
      >
        <Typography variant="body2">{row.title}</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: '4px',
          }}
        >
          <Box>
            {(() => {
              const subtasks = row._task.children;
              if (subtasks && subtasks.length > 0) {
                const done = subtasks.filter((s: any) => s.status === 'Finished').length;
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <Subject sx={{ fontSize: 13 }} />
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                      {done}/{subtasks.length}
                    </Typography>
                  </Box>
                );
              }
              if ((row._task.description?.length ?? 0) > 0) {
                return <Subject fontSize="small" />;
              }
              return null;
            })()}
          </Box>
          <AvatarList size={20} users={row._task.members ?? []} />
        </Box>
      </Paper>
    ),
    [],
  );

  // ── Render ─────────────────────────────────────────────────────

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* View toggle bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1,
          py: 0.5,
          bgcolor: 'secondary.main',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          size="small"
          onChange={(_ev, val) => val && setViewMode(val)}
          sx={{
            '& .MuiToggleButton-root': {
              color: 'text.secondary',
              borderColor: 'rgba(255,255,255,0.12)',
              textTransform: 'none',
              px: 1.25,
              py: 0.25,
              fontSize: '0.7rem',
              '&.Mui-selected': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.12)',
              },
            },
          }}
        >
          {VIEW_OPTIONS.map((opt) => (
            <Tooltip key={opt.value} title={opt.label}>
              <ToggleButton value={opt.value}>
                {opt.icon}
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* View content */}
      {viewMode === 'gantt' ? (
        <Box sx={{ flex: 1, display: 'flex', '& .color-dot': { margin: '8px' } }}>
          <GanttView
            items={timelineItems}
            groups={ganttGroups}
            links={timelineLinks}
            start={range.start}
            end={range.end}
            step={ganttStep}
            sidebarWidth={SIDEBAR_W}
            itemHeight={ROW_H}
            groupHeaderHeight={ROW_H}
            headerHeight={48}
            showLinks
            showToday
            fitContainer
            highlightedDays={highlightedDays}
            callbacks={{
              onItemChange: handleGanttItemChange,
              onSelect: handleGanttSelect,
              onItemDoubleClick: (itemId: string) => {
                const task = tasks.find((t: any) => t.id === itemId);
                if (task) {
                  updateTask?.({
                    ...task,
                    start: task.startDate ? new Date(task.startDate) : undefined,
                    end: task.endDate ? new Date(task.endDate) : undefined,
                  });
                }
              },
              onItemCreate: handleGanttItemCreate,
              onLinkCreate: handleGanttLinkCreate,
              onHorizonChange: handleGanttHorizonChange,
              onZoom: handleGanttZoom,
              onQuickCreate: handleGanttQuickCreate,
            }}
            renderers={{
              renderSidebarHeader: () => sidebarHeader,
              renderGroupHeader,
            }}
          />
        </Box>
      ) : viewMode === 'kanban' ? (
        <Box sx={{ flex: 1, display: 'flex' }}>
          <KanbanBoard
            columns={columns}
            onDragEnd={handleKanbanDragEnd}
            onSelectCard={handleSelectCard}
            onCreateCard={handleCreateCard}
            renderCard={renderKanbanCard}
          />
        </Box>
      ) : viewMode === 'list' ? (
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <TableView
            columns={columns}
            onSelectCard={handleSelectCard}
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default TicketsPane;
