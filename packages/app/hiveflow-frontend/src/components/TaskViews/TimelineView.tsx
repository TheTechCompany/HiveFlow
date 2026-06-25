import React, { useMemo, useCallback, useState } from 'react';
import { Box } from '@mui/material';
import { Timeline } from '../../components/Timeline';
import type { TimelineItem, TimelineGroup } from '../../components/Timeline';
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
}

// ── Helpers ─────────────────────────────────────────────────────────

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

function computeInitialRange(tasks: FlatTask[]) {
  if (tasks.length === 0) {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 2, 0),
    };
  }
  const times = tasks.flatMap((t) => [t.start.getTime(), t.end.getTime()]);
  const min = Math.min(...times);
  const max = Math.max(...times);
  const pad = 7 * 86400000; // 7 days
  return {
    start: new Date(min - pad),
    end: new Date(max + pad),
  };
}

// ── Component ───────────────────────────────────────────────────────

export const TimelineView: React.FC<TimelineViewProps> = ({
  columns,
  onSelectCard,
  updateTask,
  refetch,
}) => {
  const tasks = useMemo(() => flattenTasks(columns), [columns]);

  const [range, setRange] = useState(() => computeInitialRange(tasks));

  const groups: TimelineGroup[] = useMemo(() => {
    const map = new Map<string, TimelineGroup>();
    for (const t of tasks) {
      const src = t.task.project ?? t.task.estimate;
      if (src) {
        const prefix = t.task.project ? 'project' : 'estimate';
        const gid = `${prefix}:${src.id}`;
        if (!map.has(gid)) {
          map.set(gid, { id: gid, label: `${src.displayId} - ${src.name}` });
        }
      }
    }
    return [...map.values()];
  }, [tasks]);

  const timelineItems: TimelineItem[] = useMemo(
    () =>
      tasks
        .filter(
          (t) => t.end > range.start && t.start < range.end,
        )
        .map((t) => ({
          id: t.id,
          start: t.start,
          end: t.end,
          label: t.name,
          color: t.color,
          showLabel: true,
          groupId:
            t.task.project
              ? `project:${t.task.project.id}`
              : t.task.estimate
                ? `estimate:${t.task.estimate.id}`
                : undefined,
        }))
        .sort((a, b) => a.label!.localeCompare(b.label!)),
    [tasks, range],
  );

  // ── Callbacks ──────────────────────────────────────────────────

  const handleSelect = useCallback(
    (sel: { itemIds: string[]; linkIds: string[] }) => {
      if (sel.itemIds.length === 0) return;
      const flat = tasks.find((t) => t.id === sel.itemIds[0]);
      if (flat) onSelectCard?.(flat._row);
    },
    [tasks, onSelectCard],
  );

  const handleItemChange = useCallback(
    (change: { id: string; start?: Date; end?: Date }) => {
      if (!updateTask) return;
      const flat = tasks.find((t) => t.id === change.id);
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
    [tasks, updateTask, refetch],
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
        '& .color-dot': { margin: '8px' },
      }}
    >
      <Timeline
        items={timelineItems}
        groups={groups}
        start={range.start}
        end={range.end}
        step="day"
        readonly={!updateTask || timelineItems.length === 0}
        callbacks={{
          onHorizonChange: handleHorizonChange,
          onSelect: handleSelect,
          onItemChange: handleItemChange,
        }}
      />
    </Box>
  );
};

export default TimelineView;
