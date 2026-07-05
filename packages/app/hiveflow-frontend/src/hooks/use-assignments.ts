import { useMemo, useCallback, useState } from 'react';
import { gql, useApolloClient, useQuery, useMutation } from '@apollo/client';
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
      ... on Task {
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
        estimate { id displayId name }
        recurringEvent {
          id
          frequency
          schedule { id name }
        }
        children {
          id
          title
          status
        }
        parent {
          id
          title
        }
      }
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      id
      title
    }
  }
`;

// ── Public types ────────────────────────────────────────────────────

export interface UseAssignmentsReturn {
  loading: boolean;
  error: Error | undefined;
  users: Array<{ id: string; name: string }>;
  tasks: KanbanTask[];
  taskFilters: TaskFilterOption[];
  buildColumns: (filters: TaskFilterOption[], groupBy?: 'none' | 'project') => KanbanColumn[];
  onDrag: (result: KanbanDragResult) => Promise<void>;
  updateTask: (id: string, updates: Record<string, unknown>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refetch: () => void;
  pendingHandover: KanbanTask | null;
  submitHandover: (note: string) => Promise<void>;
  cancelHandover: () => void;
  startNextTask: () => Promise<void>;
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
    if (task.recurringEvent?.schedule) {
      return f.__typename === 'RecurringSchedule' && f.id === task.recurringEvent.schedule.id;
    }
    return false;
  });
}

function deriveTaskFilters(tasks: KanbanTask[]): TaskFilterOption[] {
  const seen = new Set<string>();
  const result: TaskFilterOption[] = [];
  for (const t of tasks) {
    const src = t.project ?? t.estimate ?? t.recurringEvent?.schedule;
    if (src) {
      // Determine typename from which source field is present, not t.__typename
      let typename: string;
      if (t.project) typename = 'Project';
      else if (t.estimate) typename = 'Estimate';
      else if (t.recurringEvent?.schedule) typename = 'RecurringSchedule';
      else typename = 'Project'; // fallback

      const key = `${typename}:${src.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          __typename: typename,
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

export function useAssignments(horizonDays: number = 7): UseAssignmentsReturn {
  const client = useApolloClient();
  const { data, loading, error } = useQuery<AssignmentsQueryData>(
    GET_ASSIGNED_TASKS,
    {
      fetchPolicy: 'cache-and-network',
      variables: { horizonDays },
    },
  );

  const rawTasks: KanbanTask[] = data?.assignments ?? [];

  // Unified Task model — tasks arrive with proper title/status.
  // Fallback: if a legacy RecurringEvent sneaks through, normalize it.
  const tasks: KanbanTask[] = useMemo(
    () =>
      rawTasks.map((t: any) => {
        if (t.__typename === 'RecurringEvent' || (!t.project && !t.estimate && t.scheduleId)) {
          return {
            ...t,
            title: t.name ?? t.title,
            status: t.status || 'Backlog',
            startDate: t.start ?? t.startDate,
            endDate: t.end ?? t.endDate,
            columnRank: (t.start ?? t.startDate) ?? 'z',
          };
        }
        return t;
      }),
    [rawTasks],
  );
  const users = data?.users ?? [];

  // ── Mutations (unified) ───────────────────────────────────────

  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);
  const [createTaskMutation] = useMutation(CREATE_TASK);

  const refetch = useCallback(() => {
    client.refetchQueries({ include: ['GetAssignedTasks'] });
  }, [client]);

  const updateTask = useCallback(
    async (id: string, updates: Record<string, unknown>) => {
      await updateTaskMutation({ variables: { id, input: updates } });
    },
    [updateTaskMutation],
  );

  const deleteTaskFn = useCallback(
    async (id: string) => {
      await deleteTaskMutation({ variables: { id } });
    },
    [deleteTaskMutation],
  );

  const createTaskFn = useCallback(
    async (input: Record<string, unknown>) => {
      await createTaskMutation({ variables: { input } });
    },
    [createTaskMutation],
  );

  // ── Handover state ────────────────────────────────────────────

  const [pendingHandover, setPendingHandover] = useState<KanbanTask | null>(null);

  const cancelHandover = useCallback(() => {
    setPendingHandover(null);
  }, []);

  const startNextTask = useCallback(async () => {
    const backlogTasks = tasks
      .filter((t) => t.status === 'Backlog')
      .sort((a, b) => (a.columnRank ?? '').localeCompare(b.columnRank ?? ''));

    const next = backlogTasks[0];
    if (!next) return;
    // Tasks always have a source now (project, estimate, or recurringEvent)
    if (!next.project && !next.estimate && !next.recurringEvent) return;

    await updateTask(next.id, { status: 'In Progress' });
    refetch();
  }, [tasks, updateTask, refetch]);

  const submitHandover = useCallback(
    async (note: string) => {
      const task = pendingHandover;
      if (!task) return;
      if (!task.project && !task.estimate && !task.recurringEvent) return;

      await updateTask(task.id, { status: 'Reviewing', handoverNote: note });
      setPendingHandover(null);
      refetch();
    },
    [pendingHandover, updateTask, refetch],
  );

  // ── Derived data ───────────────────────────────────────────────

  const taskFilters = useMemo(() => deriveTaskFilters(tasks), [tasks]);

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
                const projA = a.project?.name ?? a.estimate?.name ?? a.recurringEvent?.schedule?.name ?? '';
                const projB = b.project?.name ?? b.estimate?.name ?? b.recurringEvent?.schedule?.name ?? '';
                const projCmp = projA.localeCompare(projB);
                if (projCmp !== 0) return projCmp;
                return (a.columnRank ?? '').localeCompare(b.columnRank ?? '');
              })
            : filtered.sort((a, b) =>
                (a.columnRank ?? '').localeCompare(b.columnRank ?? ''),
              );

        const rows = sorted.map((t) => {
          const src = t.project ?? t.estimate ?? t.recurringEvent?.schedule;
          const groupKey = groupBy === 'project' && src ? `${src.id}` : undefined;
          const groupLabel = groupBy === 'project' && src
            ? `${(src as any).displayId ?? ''} - ${src.name}`
            : undefined;
          return {
            id: t.id,
            title: t.title,
            _task: t,
            groupKey,
            groupLabel,
          };
        });
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
        console.warn(`[useAssignments] Invalid drop target: ${statusIndex}`);
        return;
      }

      const task = tasks.find((t) => t.id === result.draggableId);
      if (!task) return;
      if (task.status === newStatus) return;

      if (!task.project && !task.estimate && !task.recurringEvent) return;

      if (newStatus === 'Reviewing' || newStatus === 'my-reviews') {
        setPendingHandover(task);
        return;
      }

      await updateTask(task.id, { status: newStatus });
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
    deleteTask: deleteTaskFn,
    refetch,
    pendingHandover,
    submitHandover,
    cancelHandover,
    startNextTask,
    createTask: createTaskFn,
  };
}
