/**
 * Unit tests for the useAssignments hook.
 *
 * All external dependencies (Apollo, gqty) are mocked.
 * Uses a small test component to exercise the hook since
 * @testing-library/react v12 does not include renderHook.
 */

import React from 'react';
import { render, act } from '@testing-library/react';

// ── Mock state (set per test) ────────────────────────────────────────

const mockRefetchQueries = jest.fn();
const mockCreateProjectTask = jest.fn();
const mockUpdateProjectTask = jest.fn();
const mockUpdateEstimateTask = jest.fn();
const mockDeleteProjectTask = jest.fn();
const mockDeleteEstimateTask = jest.fn();

// ── Module mocks ────────────────────────────────────────────────────

jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client');
  return {
    ...actual,
    __esModule: true,
    useQuery: jest.fn(),
    useApolloClient: jest.fn(),
    gql: jest.fn((strings: TemplateStringsArray) => strings.join('')),
  };
});

// useMutation(fn) — fn is called once with the mutation object to build a
// selection. It returns an executor: (args) => Promise<selection>
jest.mock('@hive-flow/api', () => ({
  __esModule: true,
  useMutation: jest.fn(),
}));

// ── Imports ─────────────────────────────────────────────────────────

import { useQuery, useApolloClient } from '@apollo/client';
import { useMutation } from '@hive-flow/api';
import { useAssignments, type UseAssignmentsReturn } from './use-assignments';

// ── Helpers ─────────────────────────────────────────────────────────

function renderUseAssignments() {
  let captured!: UseAssignmentsReturn;
  function Probe() {
    captured = useAssignments();
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
    __typename: 'ProjectTask' as const,
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
    ...overrides,
  };
}

function makeEstimateTask(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'EstimateTask' as const,
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
    ...overrides,
  };
}

// ── gqty useMutation simulation ─────────────────────────────────────
//
// gqty's useMutation(fn):
//   1. Calls fn(mutation) to build a selection object
//   2. Returns an executor: (args) => mutation.updateTask(args)
//      which resolves with the selection shape applied to the result.
//
// Our mock: fn sees our jest.fn() mocks, returns { item: ... }.
// The executor is a jest.fn() that calls e.g. mockUpdateProjectTask(args)
// and resolves with the selection.

// useMutation(fn):
//   gqty pattern: useMutation((mutation, args) => mutation.someField(args))
//   The executor is called as executor({ args: { id, ... } })
//   gqty unwraps and passes the inner object to fn as the second argument.
function mockGqtyUseMutation(fn: any): [jest.Mock] {
  const mutations = {
    createProjectTask: mockCreateProjectTask,
    updateProjectTask: mockUpdateProjectTask,
    updateEstimateTask: mockUpdateEstimateTask,
    deleteProjectTask: mockDeleteProjectTask,
    deleteEstimateTask: mockDeleteEstimateTask,
  };
  const executor = jest.fn(async (callArgs: any = {}) => {
    // gqty unwraps the `args` envelope: executor({ args: {...} })
    // passes the inner {...} to the selection callback.
    const unwrapped = callArgs?.args ?? callArgs;
    fn(mutations, unwrapped);
    return { item: {} };
  });
  return [executor];
}

// ── Tests ───────────────────────────────────────────────────────────

describe('useAssignments hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRefetchQueries.mockReset();
    mockCreateProjectTask.mockReset();
    mockUpdateProjectTask.mockReset();
    mockUpdateEstimateTask.mockReset();
    mockDeleteProjectTask.mockReset();
    mockDeleteEstimateTask.mockReset();

    // Default Apollo mock
    (useQuery as jest.Mock).mockReturnValue({
      data: { users: [], assignments: [] },
      loading: false,
      error: undefined,
    });
    (useApolloClient as jest.Mock).mockReturnValue({
      refetchQueries: mockRefetchQueries,
    });
    (useMutation as jest.Mock).mockImplementation(mockGqtyUseMutation);
  });

  // ── Data fetching states ───────────────────────────────────────

  it('returns loading=true while query is in flight', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    });
    const { result } = renderUseAssignments();
    expect(result.loading).toBe(true);
  });

  it('returns error when query fails', () => {
    const err = new Error('boom');
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error: err,
    });
    const { result } = renderUseAssignments();
    expect(result.error).toEqual(err);
  });

  it('returns empty users and tasks when data is absent', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    });
    const { result } = renderUseAssignments();
    expect(result.users).toEqual([]);
    expect(result.tasks).toEqual([]);
  });

  // ── Column building ────────────────────────────────────────────

  it('builds 4 columns from tasks grouped by status', () => {
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
    expect(cols).toHaveLength(4);
    expect(cols.map((c) => c.id)).toEqual([
      'Backlog',
      'In Progress',
      'Reviewing',
      'Finished',
    ]);
    expect(cols[0].rows).toHaveLength(1);
    expect(cols[3].rows).toHaveLength(1);
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
      loading: false,
      error: undefined,
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
      loading: false,
      error: undefined,
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
      loading: false,
      error: undefined,
    });
    const { result } = renderUseAssignments();
    expect(result.taskFilters).toHaveLength(2);
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
      loading: false,
      error: undefined,
    });
    const { result } = renderUseAssignments();
    const cols = result.buildColumns([]);
    expect(cols[0].rows.map((r) => r.id)).toEqual(['t2', 't3', 't1']);
  });

  // ── Drag handler ───────────────────────────────────────────────

  it('onDrag ignores null/undefined destination', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [makeTask({ id: 't1', status: 'Backlog' })],
      },
      loading: false,
      error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 't1',
        type: 'LIST',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: undefined,
      } as any);
    });

    expect(mockUpdateProjectTask).not.toHaveBeenCalled();
  });

  it('onDrag is a no-op for same-status drops', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [makeTask({ id: 't1', status: 'Backlog' })],
      },
      loading: false,
      error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 't1',
        type: 'LIST',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: { droppableId: '0', index: 1 },
      } as any);
    });

    expect(mockUpdateProjectTask).not.toHaveBeenCalled();
  });

  it('onDrag moves a project task to a new status', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [makeTask({ id: 't1', status: 'Backlog' })],
      },
      loading: false,
      error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 't1',
        type: 'LIST',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: { droppableId: '1', index: 0 },
      } as any);
    });

    // The hook calls updateTask → updateProjectTask executor
    // The executor calls mockUpdateProjectTask with { id, input }
    expect(mockUpdateProjectTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 't1',
        input: { status: 'In Progress' },
      }),
    );
    expect(mockRefetchQueries).toHaveBeenCalled();
  });

  it('onDrag moves an estimate task to a new status', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [makeEstimateTask({ id: 'e1', status: 'Backlog' })],
      },
      loading: false,
      error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 'e1',
        type: 'LIST',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: { droppableId: '2', index: 0 },
      } as any);
    });

    expect(mockUpdateEstimateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'e1',
        input: { status: 'Reviewing' },
      }),
    );
    expect(mockRefetchQueries).toHaveBeenCalled();
  });

  it('onDrag warns on invalid status index', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        users: [],
        assignments: [makeTask({ id: 't1', status: 'Backlog' })],
      },
      loading: false,
      error: undefined,
    });
    const { result } = renderUseAssignments();

    await act(async () => {
      await result.onDrag({
        draggableId: 't1',
        type: 'LIST',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: '0', index: 0 },
        destination: { droppableId: '99', index: 0 },
      } as any);
    });

    expect(mockUpdateProjectTask).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  // ── Refetch ────────────────────────────────────────────────────

  it('refetch triggers client.refetchQueries', () => {
    const { result } = renderUseAssignments();
    result.refetch();
    expect(mockRefetchQueries).toHaveBeenCalledWith(
      expect.objectContaining({ include: ['GetAssignedTasks'] }),
    );
  });

  // ── Mutations ──────────────────────────────────────────────────

  it('deleteProjectTask calls the delete mutation with the correct id', async () => {
    const { result } = renderUseAssignments();
    await act(async () => {
      await result.deleteProjectTask('task-1');
    });
    expect(mockDeleteProjectTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'task-1' }),
    );
  });

  it('deleteEstimateTask calls the delete mutation with the correct id', async () => {
    const { result } = renderUseAssignments();
    await act(async () => {
      await result.deleteEstimateTask('et-1');
    });
    expect(mockDeleteEstimateTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'et-1' }),
    );
  });

  it('createTask calls the createProjectTask mutation', async () => {
    const { result } = renderUseAssignments();
    await act(async () => {
      await result.createTask({ title: 'New Task', status: 'Backlog' });
    });
    expect(mockCreateProjectTask).toHaveBeenCalledWith(
      expect.objectContaining({ input: { title: 'New Task', status: 'Backlog' } }),
    );
  });
});
