/**
 * Unit tests for the Assignments view component.
 *
 * All external dependencies are mocked so tests are fast and isolated.
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// ── Mocks ───────────────────────────────────────────────────────────

jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: any) => (
    <div data-testid="dnd-context">{children}</div>
  ),
  Droppable: ({ children, droppableId }: any) =>
    children(
      {
        innerRef: jest.fn(),
        droppableProps: { 'data-rbd-droppable-id': droppableId },
        placeholder: null,
      },
      { isDraggingOver: false },
    ),
  Draggable: ({ children, draggableId }: any) =>
    children(
      {
        innerRef: jest.fn(),
        draggableProps: { 'data-rbd-draggable-id': draggableId },
        dragHandleProps: {},
      },
      { isDragging: false },
    ),
}));

jest.mock('@hexhive/ui', () => ({
  AvatarList: ({ users }: any) => (
    <span data-testid="avatar-list">{users?.length ?? 0} members</span>
  ),
}));

jest.mock('../../modals/new-task', () => ({
  TaskModal: ({ open, onClose, onDelete, onSubmit, selected }: any) =>
    open ? (
      <div data-testid="task-modal">
        <span data-testid="task-modal-title">{selected?.title}</span>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        <button data-testid="modal-delete" onClick={onDelete}>
          Delete
        </button>
        <button
          data-testid="modal-submit"
          onClick={() =>
            onSubmit({ id: selected?.id, title: 'Updated', status: 'In Progress' })
          }
        >
          Save
        </button>
      </div>
    ) : null,
}));

const mockUseAssignments = jest.fn();
jest.mock('../../hooks/use-assignments', () => ({
  useAssignments: () => mockUseAssignments(),
}));

// ── Imports under test ──────────────────────────────────────────────

import { Assignments } from '../../views/assignments';

// ── Helpers ─────────────────────────────────────────────────────────

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

function defaultHookReturn(overrides: Record<string, unknown> = {}) {
  return {
    loading: false,
    error: undefined,
    users: [{ id: 'user-1', name: 'Alice' }],
    taskFilters: [
      { __typename: 'Project', id: 'proj-1', displayId: 'P-001', name: 'Alpha' },
    ],
    buildColumns: jest.fn(() => [
      {
        id: 'Backlog',
        title: 'Backlog',
        rows: [
          { id: 'task-1', title: 'Test Task', _task: makeTask() },
        ],
      },
      { id: 'In Progress', title: 'In Progress', rows: [] },
      { id: 'Reviewing', title: 'Reviewing', rows: [] },
      { id: 'Finished', title: 'Finished', rows: [] },
    ]),
    onDrag: jest.fn(),
    updateTask: jest.fn().mockResolvedValue(undefined),
    deleteProjectTask: jest.fn().mockResolvedValue(undefined),
    deleteEstimateTask: jest.fn().mockResolvedValue(undefined),
    refetch: jest.fn(),
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────────

describe('Assignments view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── States ─────────────────────────────────────────────────────

  it('shows a loading spinner while the query is in flight', () => {
    mockUseAssignments.mockReturnValue(defaultHookReturn({ loading: true }));
    render(<Assignments />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows an error alert when the query fails', () => {
    mockUseAssignments.mockReturnValue(
      defaultHookReturn({ error: new Error('Network failure') }),
    );
    render(<Assignments />);
    expect(
      screen.getByText(/Failed to load assignments/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Network failure/)).toBeInTheDocument();
  });

  it('shows an empty state when there are no columns', () => {
    mockUseAssignments.mockReturnValue(
      defaultHookReturn({ buildColumns: jest.fn(() => []) }),
    );
    render(<Assignments />);
    expect(screen.getByText('No tasks assigned')).toBeInTheDocument();
  });

  it('does not crash when buildColumns returns empty columns (all rows filtered)', () => {
    // When all 4 columns exist but have zero rows, the board still renders
    mockUseAssignments.mockReturnValue(
      defaultHookReturn({
        buildColumns: jest.fn(() => [
          { id: 'Backlog', title: 'Backlog', rows: [] },
          { id: 'In Progress', title: 'In Progress', rows: [] },
          { id: 'Reviewing', title: 'Reviewing', rows: [] },
          { id: 'Finished', title: 'Finished', rows: [] },
        ]),
      }),
    );
    render(<Assignments />);
    // All column headers should still be visible
    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  // ── Header ─────────────────────────────────────────────────────

  it('renders the "Assigned tasks" heading', () => {
    mockUseAssignments.mockReturnValue(defaultHookReturn());
    render(<Assignments />);
    expect(screen.getByText('Assigned tasks')).toBeInTheDocument();
  });

  it('renders a filter autocomplete', () => {
    mockUseAssignments.mockReturnValue(defaultHookReturn());
    render(<Assignments />);
    expect(screen.getByLabelText('Filter')).toBeInTheDocument();
  });

  // ── Columns and cards ─────────────────────────────────────────

  it('renders four status columns', () => {
    mockUseAssignments.mockReturnValue(defaultHookReturn());
    render(<Assignments />);
    for (const status of ['Backlog', 'In Progress', 'Reviewing', 'Finished']) {
      expect(screen.getByText(status)).toBeInTheDocument();
    }
  });

  it('renders task cards with title and project info', () => {
    mockUseAssignments.mockReturnValue(defaultHookReturn());
    render(<Assignments />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('P-001 - Alpha')).toBeInTheDocument();
  });

  it('renders member avatars via AvatarList', () => {
    mockUseAssignments.mockReturnValue(defaultHookReturn());
    render(<Assignments />);
    expect(screen.getByTestId('avatar-list')).toHaveTextContent('1 members');
  });

  it('renders estimate info on estimate tasks', () => {
    const task = makeEstimateTask();
    mockUseAssignments.mockReturnValue(
      defaultHookReturn({
        taskFilters: [
          {
            __typename: 'Estimate',
            id: 'est-1',
            displayId: 'E-001',
            name: 'Beta',
          },
        ],
        buildColumns: jest.fn(() => [
          {
            id: 'Backlog',
            title: 'Backlog',
            rows: [
              { id: 'et-1', title: 'Estimate Task', _task: task },
            ],
          },
          { id: 'In Progress', title: 'In Progress', rows: [] },
          { id: 'Reviewing', title: 'Reviewing', rows: [] },
          { id: 'Finished', title: 'Finished', rows: [] },
        ]),
      }),
    );
    render(<Assignments />);
    expect(screen.getByText('E-001 - Beta')).toBeInTheDocument();
  });

  // ── Card selection / modal ────────────────────────────────────

  it('opens the task modal when a card is clicked', async () => {
    mockUseAssignments.mockReturnValue(defaultHookReturn());
    render(<Assignments />);

    await fireEvent.click(screen.getByText('Test Task'));

    expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    expect(screen.getByTestId('task-modal-title')).toHaveTextContent(
      'Test Task',
    );
  });

  it('closes the modal via the close button', async () => {
    mockUseAssignments.mockReturnValue(defaultHookReturn());
    render(<Assignments />);

    await fireEvent.click(screen.getByText('Test Task'));
    expect(screen.getByTestId('task-modal')).toBeInTheDocument();

    await fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByTestId('task-modal')).not.toBeInTheDocument();
  });

  it('calls deleteProjectTask when deleting a project task', async () => {
    const deleteProjectTask = jest.fn().mockResolvedValue(undefined);
    const refetch = jest.fn();
    mockUseAssignments.mockReturnValue(
      defaultHookReturn({ deleteProjectTask, refetch }),
    );
    render(<Assignments />);

    await fireEvent.click(screen.getByText('Test Task'));
    await fireEvent.click(screen.getByTestId('modal-delete'));

    await waitFor(() => {
      expect(deleteProjectTask).toHaveBeenCalledWith('task-1');
    });
    expect(refetch).toHaveBeenCalled();
    expect(screen.queryByTestId('task-modal')).not.toBeInTheDocument();
  });

  it('calls deleteEstimateTask when deleting an estimate task', async () => {
    const deleteEstimateTask = jest.fn().mockResolvedValue(undefined);
    const refetch = jest.fn();
    const task = makeEstimateTask();
    mockUseAssignments.mockReturnValue(
      defaultHookReturn({
        deleteEstimateTask,
        refetch,
        buildColumns: jest.fn(() => [
          {
            id: 'Backlog',
            title: 'Backlog',
            rows: [
              { id: 'et-1', title: 'Estimate Task', _task: task },
            ],
          },
          { id: 'In Progress', title: 'In Progress', rows: [] },
          { id: 'Reviewing', title: 'Reviewing', rows: [] },
          { id: 'Finished', title: 'Finished', rows: [] },
        ]),
      }),
    );
    render(<Assignments />);

    await fireEvent.click(screen.getByText('Estimate Task'));
    await fireEvent.click(screen.getByTestId('modal-delete'));

    await waitFor(() => {
      expect(deleteEstimateTask).toHaveBeenCalledWith('et-1');
    });
  });

  it('submits task edit via modal', async () => {
    const updateTask = jest.fn().mockResolvedValue(undefined);
    const refetch = jest.fn();
    mockUseAssignments.mockReturnValue(
      defaultHookReturn({ updateTask, refetch }),
    );
    render(<Assignments />);

    await fireEvent.click(screen.getByText('Test Task'));
    await fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(
        'task-1',
        { title: 'Updated', status: 'In Progress' },
        'project',
      );
    });
    expect(refetch).toHaveBeenCalled();
    expect(screen.queryByTestId('task-modal')).not.toBeInTheDocument();
  });

  // ── Filter interaction ─────────────────────────────────────────

  it('passes filter values to buildColumns', () => {
    const buildColumns = jest.fn(() => [
      { id: 'Backlog', title: 'Backlog', rows: [] },
      { id: 'In Progress', title: 'In Progress', rows: [] },
      { id: 'Reviewing', title: 'Reviewing', rows: [] },
      { id: 'Finished', title: 'Finished', rows: [] },
    ]);
    mockUseAssignments.mockReturnValue(
      defaultHookReturn({ buildColumns }),
    );
    render(<Assignments />);
    expect(buildColumns).toHaveBeenCalledWith([]);
  });
});
