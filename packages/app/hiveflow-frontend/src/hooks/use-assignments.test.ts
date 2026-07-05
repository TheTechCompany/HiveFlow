/**
 * Unit tests for the useAssignments hook — unified Task model.
 */
import React from 'react';
import { render, act } from '@testing-library/react';

const mockRefetchQueries = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockCreateTask = jest.fn();

jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client');
  return {
    ...actual,
    __esModule: true,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useApolloClient: jest.fn(),
    gql: jest.fn((strings: TemplateStringsArray) => strings.join('')),
  };
});

import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useAssignments, type UseAssignmentsReturn } from './use-assignments';

function renderUseAssignments(horizonDays = 90) {
  let captured!: UseAssignmentsReturn;
  function Probe() {
    captured = useAssignments(horizonDays);
    return null;
  }
  const utils = render(React.createElement(Probe));
  return {
    get result(): UseAssignmentsReturn {
      return captured;
    },
    rerender() {
      utils.rerender(React.createElement(Probe));
    },
  };
}

function makeTask(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Task' as const,
    id: 'task-1',
    title: 'Test Task',
    description: 'A test task description',
    startDate: '2025-01-01',
    endDate: '2025-01-10',
    status: 'Backlog',
    timelineRank: 'a0',
    columnRank: 'a0',
    members: [{ id: 'user-1', name: 'Alice' }],
    project: { id: 'proj-1', displayId: 'P-001', name: 'Alpha' },
    estimate: null,
    recurringEvent: null,
    ...overrides,
  };
}

function makeEstimateTask(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Task' as const,
    id: 'et-1',
    title: 'Estimate Task',
    description: null,
    startDate: null,
    endDate: null,
    status: 'Backlog',
    timelineRank: 'a0',
    columnRank: 'a0',
    members: [],
    project: null,
    estimate: { id: 'est-1', displayId: 'E-001', name: 'Beta' },
    recurringEvent: null,
    ...overrides,
  };
}

function makeGeneratedRecurringTask(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Task' as const,
    id: 're-1',
    title: 'Monthly Compliance Check',
    description: 'Review compliance docs',
    startDate: '2025-06-01',
    endDate: null,
    status: 'Backlog',
    timelineRank: 'a0',
    columnRank: 'a0',
    members: [{ id: 'user-1', name: 'Alice' }],
    project: { id: 'rproj-1', displayId: '', name: 'Recurring Tasks' },
    estimate: null,
    recurringEvent: {
      id: 'evt-1',
      frequency: 'monthly',
      schedule: { id: 'sched-1', name: 'Compliance Schedule' },
    },
    ...overrides,
  };
}

describe('useAssignments hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRefetchQueries.mockReset();
    mockUpdateTask.mockReset();
    mockDeleteTask.mockReset();
    mockCreateTask.mockReset();

    (useQuery as jest.Mock).mockReturnValue({
      data: { users: [], assignments: [] },
      loading: false,
      error: undefined,
    });
    (useApolloClient as jest.Mock).mockReturnValue({
      refetchQueries: mockRefetchQueries,
    });
    // Mock Apollo useMutation: returns [executor, { loading, error }]
    (useMutation as jest.Mock).mockImplementation((mutation: any) => {
      // Which mutation based on the gql tag content
      const src = typeof mutation === 'string' ? mutation : '';
      if (src.includes('updateTask')) return [mockUpdateTask, { loading: false }];
      if (src.includes('deleteTask')) return [mockDeleteTask, { loading: false }];
      if (src.includes('createTask')) return [mockCreateTask, { loading: false }];
      return [jest.fn(), { loading: false }];
    });

    mockUpdateTask.mockResolvedValue({ data: { updateTask: { id: 'x', status: 'ok' } } });
    mockDeleteTask.mockResolvedValue({ data: { deleteTask: { id: 'x' } } });
    mockCreateTask.mockResolvedValue({ data: { createTask: { id: 'new', title: 'x' } } });
  });

  // ── Data fetching states ───────────────────────────────────────

  it('returns loading=true while query is in flight', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined, loading: true, error: undefined,
    });
    const { result } = renderUseAssignments();
    expect(result.loading).toBe(true);
  });

  it('returns error when query fails', () => {
    const err = new Error('boom');
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined, loading: false, error: err,
    });
    const { result } = renderUseAssignments();
    expect(result.error).toEqual(err);
  });

  it('returns empty users and tasks when data is absent', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined, loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();
    expect(result.users).toEqual([]);
    expect(result.tasks).toEqual([]);
  });

  // ── Column building ────────────────────────────────────────────

  it('builds 5 columns from tasks grouped by status', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [
          makeTask({ id: 't1', status: 'Backlog' }),
          makeTask({ id: 't2', status: 'In Progress' }),
          makeTask({ id: 't3', status: 'Reviewing' }),
          makeTask({ id: 't4', status: 'Finished' }),
        ],
      },
      loading: false,
      error: undefined,
    });
    const { result } = renderUseAssignments();
    const cols = result.buildColumns([]);
    expect(cols).toHaveLength(5);
    expect(cols.map((c) => c.id)).toEqual([
      'Backlog', 'In Progress', 'Reviewing', 'my-reviews', 'Finished',
    ]);
  });

  it('filters columns by a project filter', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [
          makeTask({ id: 't1', project: { id: 'p1', displayId: 'P-1', name: 'One' } }),
          makeTask({ id: 't2', project: { id: 'p2', displayId: 'P-2', name: 'Two' } }),
        ],
      },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();
    const cols = result.buildColumns([
      { __typename: 'Project', id: 'p1', displayId: 'P-1', name: 'One' },
    ]);
    expect(cols[0].rows).toHaveLength(1);
    expect(cols[0].rows[0].id).toBe('t1');
  });

  it('filters columns by an estimate filter', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [
          makeEstimateTask({ id: 'e1', estimate: { id: 'est-1', displayId: 'E-1', name: 'First' } }),
          makeEstimateTask({ id: 'e2', estimate: { id: 'est-2', displayId: 'E-2', name: 'Second' } }),
        ],
      },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();
    const cols = result.buildColumns([
      { __typename: 'Estimate', id: 'est-2', displayId: 'E-2', name: 'Second' },
    ]);
    expect(cols[0].rows).toHaveLength(1);
    expect(cols[0].rows[0].id).toBe('e2');
  });

  it('deduplicates taskFilters', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [
          makeTask({ project: { id: 'p1', displayId: 'P-1', name: 'One' } }),
          makeTask({ project: { id: 'p1', displayId: 'P-1', name: 'One' } }),
          makeEstimateTask({ estimate: { id: 'e1', displayId: 'E-1', name: 'Est' } }),
        ],
      },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();
    expect(result.taskFilters).toHaveLength(2);
  });

  it('taskFilters use correct __typename from source field', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [
          makeTask({ project: { id: 'p1', displayId: 'P-1', name: 'One' } }),
          makeEstimateTask({ estimate: { id: 'e1', displayId: 'E-1', name: 'Estimate One' } }),
          makeGeneratedRecurringTask({
            project: null,
            recurringEvent: {
              id: 'evt-1',
              frequency: 'monthly',
              schedule: { id: 'sched-1', name: 'Schedule One' },
            },
          }),
        ],
      },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();
    expect(result.taskFilters).toHaveLength(3);
    const byId: Record<string, (typeof result.taskFilters)[number]> = {};
    result.taskFilters.forEach((f) => { byId[f.id] = f; });
    expect(byId['p1'].__typename).toBe('Project');
    expect(byId['e1'].__typename).toBe('Estimate');
    expect(byId['sched-1'].__typename).toBe('RecurringSchedule');
  });

  it('sorts tasks by columnRank ascending', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [
          makeTask({ id: 't1', status: 'Backlog', columnRank: 'c' }),
          makeTask({ id: 't2', status: 'Backlog', columnRank: 'a' }),
          makeTask({ id: 't3', status: 'Backlog', columnRank: 'b' }),
        ],
      },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();
    const cols = result.buildColumns([]);
    expect(cols[0].rows.map((r) => r.id)).toEqual(['t2', 't3', 't1']);
  });

  // ── Generated recurring tasks ───────────────────────────────────

  it('passes generated recurring Task through without normalization', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { users: [], assignments: [makeGeneratedRecurringTask()] },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();
    const recurring = result.tasks[0];
    expect(recurring.title).toBe('Monthly Compliance Check');
    expect(recurring.status).toBe('Backlog');
    expect(recurring.project?.name).toBe('Recurring Tasks');
    expect(recurring.recurringEvent?.frequency).toBe('monthly');
  });

  it('places generated recurring tasks in Backlog column', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [
          makeGeneratedRecurringTask({ id: 're-1', startDate: '2025-06-01' }),
          makeTask({ id: 't1', status: 'In Progress' }),
        ],
      },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();
    const cols = result.buildColumns([]);
    expect(cols[0].id).toBe('Backlog');
    expect(cols[0].rows).toHaveLength(1);
    expect(cols[0].rows[0].id).toBe('re-1');
  });

  it('sorts generated recurring tasks by startDate', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [
          makeGeneratedRecurringTask({ id: 're-1', startDate: '2025-12-01', columnRank: '2025-12-01' }),
          makeGeneratedRecurringTask({ id: 're-2', startDate: '2025-03-15', columnRank: '2025-03-15' }),
          makeGeneratedRecurringTask({ id: 're-3', startDate: '2025-08-01', columnRank: '2025-08-01' }),
        ],
      },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();
    const cols = result.buildColumns([]);
    expect(cols[0].rows.map((r) => r.id)).toEqual(['re-2', 're-3', 're-1']);
  });

  // ── Drag handler ───────────────────────────────────────────────

  it('onDrag can move a generated recurring task', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [makeGeneratedRecurringTask({ id: 're-1', status: 'Backlog' })],
      },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 're-1', type: 'LIST', reason: 'DROP', mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: { droppableId: '1', index: 0 },
      } as any);
    });

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          id: 're-1',
          input: { status: 'In Progress' },
        }),
      }),
    );
  });

  it('onDrag ignores null/undefined destination', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { users: [], assignments: [makeTask({ id: 't1', status: 'Backlog' })] },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 't1', type: 'LIST', reason: 'DROP', mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: undefined,
      } as any);
    });

    expect(mockUpdateTask).not.toHaveBeenCalled();
  });

  it('onDrag is a no-op for same-status drops', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { users: [], assignments: [makeTask({ id: 't1', status: 'Backlog' })] },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 't1', type: 'LIST', reason: 'DROP', mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: { droppableId: '0', index: 1 },
      } as any);
    });

    expect(mockUpdateTask).not.toHaveBeenCalled();
  });

  it('onDrag moves a project task to a new status', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { users: [], assignments: [makeTask({ id: 't1', status: 'Backlog' })] },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 't1', type: 'LIST', reason: 'DROP', mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: { droppableId: '1', index: 0 },
      } as any);
    });

    expect(mockUpdateTask).toHaveBeenCalled();
    expect(mockRefetchQueries).toHaveBeenCalled();
  });

  it('onDrag moves an estimate task to a new status', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { users: [], assignments: [makeEstimateTask({ id: 'e1', status: 'Backlog' })] },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 'e1', type: 'LIST', reason: 'DROP', mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: { droppableId: '1', index: 0 },
      } as any);
    });

    expect(mockUpdateTask).toHaveBeenCalled();
  });

  it('onDrag warns on invalid status index', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (useQuery as jest.Mock).mockReturnValue({
      data: { users: [], assignments: [makeTask({ id: 't1', status: 'Backlog' })] },
      loading: false, error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 't1', type: 'LIST', reason: 'DROP', mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: { droppableId: '99', index: 0 },
      } as any);
    });

    expect(mockUpdateTask).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  // ── Refetch ────────────────────────────────────────────────────

  it('refetch triggers client.refetchQueries', () => {
    const { result } = renderUseAssignments();
    result.refetch();
    expect(mockRefetchQueries).toHaveBeenCalled();
  });

  // ── Mutations ──────────────────────────────────────────────────

  it('deleteTask calls the delete mutation with correct id', async () => {
    const { result } = renderUseAssignments();
    await act(async () => { await result.deleteTask('task-1'); });
    expect(mockDeleteTask).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { id: 'task-1' } }),
    );
  });

  it('createTask calls the create mutation', async () => {
    const { result } = renderUseAssignments();
    await act(async () => {
      await result.createTask({ title: 'New Task', status: 'Backlog' });
    });
    expect(mockCreateTask).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { input: { title: 'New Task', status: 'Backlog' } } }),
    );
  });
});
