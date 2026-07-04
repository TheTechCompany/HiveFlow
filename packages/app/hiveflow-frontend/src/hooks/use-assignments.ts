import { useMemo, useCallback, useState } from 'react';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import { useMutation } from '@hive-flow/api';
import type {
  KanbanTask,
  KanbanColumn,
  KanbanDragResult,
  TaskFilterOption,
  AssignmentsQueryData,
} from '../types/kanban';

// ── GraphQL ─────────────────────────────────────────────────────────

const GET_ASSIGNED_TASKS = gql`
  query GetAssignedTasks($horizonDays: Int) {
    users(active: true) {
      id
      name
    }
    assignments(horizonDays: $horizonDays) {
      ... on EstimateTask {
        id
        title
        description
        startDate
        endDate
        status
        timelineRank
        columnRank
        handoverNote
        members { id name }
        estimate { displayId id name }
      }
      ... on ProjectTask {
        id
        title
        description
        startDate
        endDate
        status
        timelineRank
        columnRank
        handoverNote
        members { id name }
        project { id displayId name }
        recurringEvent {
          id
          frequency
          schedule { id name }
        }
      }
      ... on RecurringEvent {
        id
        name
        description
        frequency
        start: startDate
        end: endDate
        assignedTo
        exceptionDates
        schedule { id name }
      }
    }
  }
`;

// ── Public types ────────────────────────────────────────────────────

export interface UseAssignmentsReturn {
  loading: boolean;
  error: Error | undefined;
  users: Array<{ id: string; name: string }>;
  tasks: KanbanTask[];
  /** Unique project/estimate filter options derived from tasks */
  taskFilters: TaskFilterOption[];
  /** Build kanban columns from tasks, applying optional filters */
  buildColumns: (filters: TaskFilterOption[], groupBy?: 'none' | 'project') => KanbanColumn[];
  /** Drag-end handler (validates, mutates, refetches) */
  onDrag: (result: KanbanDragResult) => Promise<void>;
  /** Update a task's scalar fields */
  updateTask: (
    id: string,
    updates: Record<string, unknown>,
    type?: 'project' | 'estimate',
  ) => Promise<void>;
  /** Delete a project-task by id */
  deleteProjectTask: (id: string) => Promise<void>;
  /** Delete an estimate-task by id */
  deleteEstimateTask: (id: string) => Promise<void>;
  /** Refetch the assignments query */
  refetch: () => void;
  /** Task awaiting handover note (when dropped into Reviewing) */
  pendingHandover: KanbanTask | null;
  /** Submit the handover note and finalize the status change */
  submitHandover: (note: string) => Promise<void>;
  /** Cancel the handover — reverts the task to its previous status */
  cancelHandover: () => void;
  /** Move the top backlog task into In Progress */
  startNextTask: () => Promise<void>;
  /** Create a new task (defaults to project task) */
  createTask: (input: Record<string, unknown>) => Promise<void>;
}

// ── Helpers ─────────────────────────────────────────────────────────

function taskMatchesFilter(
  task: KanbanTask,
  filters: TaskFilterOption[],
): boolean {
  if (!filters || filters.length === 0) return true;
  return filters.some((f) => {
    if (task.project) {
      return f.__typename === 'Project' && f.id === task.project.id;
    }
    if (task.estimate) {
      return f.__typename === 'Estimate' && f.id === task.estimate.id;
    }
    if (task.schedule) {
      return f.__typename === 'RecurringSchedule' && f.id === task.schedule.id;
    }
    return false;
  });
}

function deriveTaskFilters(tasks: KanbanTask[]): TaskFilterOption[] {
  const seen = new Set<string>();
  const result: TaskFilterOption[] = [];
  for (const t of tasks) {
    const src = t.project ?? t.estimate ?? t.schedule;
    if (src) {
      const key = `${t.__typename}:${src.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          __typename: t.__typename ?? 'Project',
          id: src.id,
          displayId: (src as any).displayId ?? '',
          name: src.name,
        });
      }
    }
  }
  return result;
}

// ── Hook ────────────────────────────────────────────────────────────

export function useAssignments(horizonDays: number = 90): UseAssignmentsReturn {
  const client = useApolloClient();
  const { data, loading, error } = useQuery<AssignmentsQueryData>(
    GET_ASSIGNED_TASKS,
    {
      fetchPolicy: 'cache-and-network',
      variables: { horizonDays },
    },
  );

  const rawTasks: KanbanTask[] = data?.assignments ?? [];

  // Generated recurring tasks arrive as ProjectTask rows when the server
  // has been restarted with the new code.  Until then, raw RecurringEvent
  // templates may still come through — normalize them as a fallback.
  const tasks: KanbanTask[] = useMemo(
    () =>
      rawTasks.map((t) => {
        if (t.__typename === 'RecurringEvent' || (!t.project && !t.estimate && t.scheduleId)) {
          const rec = t as any;
          return {
            ...t,
            title: rec.name ?? t.title,
            status: t.status || 'Backlog',
            startDate: rec.start ?? t.startDate,
            endDate: rec.end ?? t.endDate,
            columnRank: (rec.start ?? t.startDate) ?? 'z',
          };
        }
        return t;
      }),
    [rawTasks],
  );
  const users = data?.users ?? [];

  // ── Mutations ──────────────────────────────────────────────────

  const [createProjectTask] = useMutation((mutation, args: any) => {
    const item = mutation.createProjectTask({
      input: { ...args?.input },
    });
    return { item: { ...item } };
  });

  const [updateProjectTask] = useMutation((mutation, args: any) => {
    const item = mutation.updateProjectTask({
      id: args?.id,
      input: { ...args?.input },
    });
    return { item: { ...item } };
  });

  const [updateEstimateTask] = useMutation((mutation, args: any) => {
    const item = mutation.updateEstimateTask({
      id: args?.id,
      input: { ...args?.input },
    });
    return { item: { ...item } };
  });

  const [delProjectTask] = useMutation((mutation, args: any) => {
    const item = mutation.deleteProjectTask({ id: args?.id });
    return { item: { ...item } };
  });

  const [delEstimateTask] = useMutation((mutation, args: any) => {
    const item = mutation.deleteEstimateTask({ id: args?.id });
    return { item: { ...item } };
  });

  const refetch = useCallback(() => {
    client.refetchQueries({ include: ['GetAssignedTasks'] });
  }, [client]);

  const updateTask = useCallback(
    async (
      id: string,
      updates: Record<string, unknown>,
      type?: 'project' | 'estimate',
    ) => {
      if (type === 'project') {
        await updateProjectTask({ args: { id, input: updates } });
      } else if (type === 'estimate') {
        await updateEstimateTask({ args: { id, input: updates } });
      }
    },
    [updateProjectTask, updateEstimateTask],
  );

  const createTask = useCallback(
    async (input: Record<string, unknown>) => {
      await createProjectTask({ args: { input } });
    },
    [createProjectTask],
  );

  // ── Handover state (In Progress → Reviewing) ───────────────────

  const [pendingHandover, setPendingHandover] = useState<KanbanTask | null>(null);

  const cancelHandover = useCallback(() => {
    setPendingHandover(null);
  }, []);

  const startNextTask = useCallback(async () => {
    // Find the top backlog task (first by columnRank)
    const backlogTasks = tasks
      .filter((t) => t.status === 'Backlog')
      .sort((a, b) =>
        (a.columnRank ?? '').localeCompare(b.columnRank ?? ''),
      );

    const next = backlogTasks[0];
    if (!next) return;

    const taskType: 'project' | 'estimate' | undefined = next.project
      ? 'project'
      : next.estimate
        ? 'estimate'
        : undefined;
    if (!taskType) return;

    await updateTask(next.id, { status: 'In Progress' }, taskType);
    refetch();
  }, [tasks, updateTask, refetch]);

  const submitHandover = useCallback(
    async (note: string) => {
      const task = pendingHandover;
      if (!task) return;

      const taskType: 'project' | 'estimate' | undefined = task.project
        ? 'project'
        : task.estimate
          ? 'estimate'
          : undefined;
      if (!taskType) return;

      await updateTask(
        task.id,
        { status: 'Reviewing', handoverNote: note },
        taskType,
      );
      setPendingHandover(null);
      refetch();
    },
    [pendingHandover, updateTask, refetch],
  );

  const deleteProjectTask = useCallback(
    async (id: string) => {
      await delProjectTask({ args: { id } });
    },
    [delProjectTask],
  );

  const deleteEstimateTask = useCallback(
    async (id: string) => {
      await delEstimateTask({ args: { id } });
    },
    [delEstimateTask],
  );

  // ── Derived data ───────────────────────────────────────────────

  const taskFilters = useMemo(() => deriveTaskFilters(tasks), [tasks]);

  /** Column order + visual variants for the stacked assignments view. */
  const COLUMN_DEFS: Array<{
    status: string;
    title: string;
    variant?: 'default' | 'subtle' | 'collapsed';
  }> = [
    { status: 'Backlog', title: 'Up Next' },
    { status: 'In Progress', title: 'In Progress' },
    { status: 'Reviewing', title: 'In Review', variant: 'subtle' },
    { status: 'my-reviews', title: 'My Reviews' },
    { status: 'Finished', title: 'Finished', variant: 'collapsed' },
  ];

  const buildColumns = useCallback(
    (filters: TaskFilterOption[], groupBy: 'none' | 'project' = 'none'): KanbanColumn[] =>
      COLUMN_DEFS.map(({ status, title, variant }) => {
        const filtered = tasks.filter(
          (t) => (status === 'my-reviews' ? t.status === 'Reviewing' : t.status === status) && taskMatchesFilter(t, filters),
        );

        const sorted =
          groupBy === 'project'
            ? filtered.sort((a, b) => {
                const projA = a.project?.name ?? a.estimate?.name ?? '';
                const projB = b.project?.name ?? b.estimate?.name ?? '';
                const projCmp = projA.localeCompare(projB);
                if (projCmp !== 0) return projCmp;
                return (a.columnRank ?? '').localeCompare(b.columnRank ?? '');
              })
            : filtered.sort((a, b) =>
                (a.columnRank ?? '').localeCompare(b.columnRank ?? ''),
              );

        const rows = sorted.map((t) => ({
          id: t.id,
          title: t.title,
          _task: t,
        }));
        return { id: status, title, rows, variant };
      }),
    [tasks],
  );

  // ── Drag handler ───────────────────────────────────────────────

  const onDrag = useCallback(
    async (result: KanbanDragResult) => {
      if (!result.destination) return;

      const statusIndex = parseInt(result.destination.droppableId, 10);
      const newStatus = COLUMN_DEFS[statusIndex]?.status;

      if (!newStatus) {
        console.warn(
          `[useAssignments] Invalid drop target: ${statusIndex}`,
        );
        return;
      }

      const task = tasks.find((t) => t.id === result.draggableId);
      if (!task) return;
      if (task.status === newStatus) return; // no-op

      const taskType: 'project' | 'estimate' | undefined = task.project
        ? 'project'
        : task.estimate
          ? 'estimate'
          : undefined;

      if (!taskType) return;

      // Intercept drops into Reviewing (including via My Reviews column) — show handover modal
      if (newStatus === 'Reviewing' || newStatus === 'my-reviews') {
        setPendingHandover(task);
        return;
      }

      await updateTask(task.id, { status: newStatus }, taskType);
      refetch();
    },
    [tasks, updateTask, refetch],
  );

  return {
    loading,
    error,
    users,
    tasks,
    taskFilters,
    buildColumns,
    onDrag,
    updateTask,
    deleteProjectTask,
    deleteEstimateTask,
    refetch,
    pendingHandover,
    submitHandover,
    cancelHandover,
    startNextTask,
    createTask,
  };
}
