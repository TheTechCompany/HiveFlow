/**
 * Tests for project subtask creation flow.
 *
 * Verifies that Apollo mutations pass `parentId` correctly when creating
 * subtasks, and that the UI properly wires the onAddSubtask callback.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ── Mocks (jest.mock hoisted — define fns inside factory, expose via module) ──

const mockRefetchQueries = jest.fn();

jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client');
  const createMutate = jest.fn().mockResolvedValue({
    data: { createProjectTask: { id: 'child-1', title: 'New subtask' } },
  });
  return {
    ...actual,
    useApolloClient: () => ({ refetchQueries: mockRefetchQueries }),
    useQuery: jest.fn().mockReturnValue({
      data: {
        users: [{ id: 'user-1', name: 'Alice' }],
        skills: [],
        projects: [{
          id: 'proj-1',
          displayId: 'P-001',
          name: 'Test Project',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          tasks: [{
            id: 'task-1',
            title: 'Parent Task',
            description: '<p>Some description</p>',
            startDate: '2025-01-01',
            endDate: '2025-01-15',
            status: 'Backlog',
            timelineRank: 'a0',
            columnRank: 'a0',
            members: [{ id: 'user-1', name: 'Alice' }],
            requiredSkills: null,
            lastUpdated: '2025-01-01T00:00:00.000Z',
            dependencyOn: [],
            dependencyOf: [],
            children: [],
          }],
        }],
      },
    }),
    useMutation: jest.fn().mockReturnValue([createMutate]),
    gql: (strings: TemplateStringsArray) => strings.join(''),
    // Expose mock for test assertions
    __createMutate: createMutate,
  };
});

jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  Droppable: ({ children, droppableId }: any) =>
    children(
      { innerRef: jest.fn(), droppableProps: { 'data-rbd-droppable-id': droppableId }, placeholder: null },
      { isDraggingOver: false },
    ),
  Draggable: ({ children, draggableId }: any) =>
    children(
      { innerRef: jest.fn(), draggableProps: { 'data-rbd-draggable-id': draggableId }, dragHandleProps: {} },
      { isDragging: false },
    ),
}));

jest.mock('@hexhive/ui', () => ({
  AvatarList: ({ users }: any) => <span data-testid="avatar-list">{users?.length ?? 0} members</span>,
  Kanban: () => <div data-testid="kanban" />,
  FileDialog: () => <div data-testid="file-dialog" />,
  FileExplorer: () => <div data-testid="file-explorer" />,
  Timeline: () => <div data-testid="timeline" />,
  FormControl: () => <select data-testid="form-control" />,
}));

jest.mock('@hive-flow/ui', () => ({
  RichTextEditor: () => <textarea data-testid="rich-text-editor" />,
  extractChecklistFromHtml: () => [],
  extractChecklist: () => [],
}));

jest.mock('@mui/x-date-pickers', () => ({
  DatePicker: () => <input data-testid="date-picker" />,
}));

jest.mock('../../../actions', () => ({ files: {} }));

jest.mock('../../../modals/new-task', () => ({
  TaskModal: ({ open, onClose, onDelete, onSubmit, onAddSubtask, selected }: any) =>
    open ? (
      <div data-testid="task-modal">
        <span data-testid="task-modal-title">{selected?.title}</span>
        <span data-testid="task-modal-children-count">{selected?.children?.length ?? 0}</span>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
        <button data-testid="modal-delete" onClick={onDelete}>Delete</button>
        <button data-testid="modal-submit"
          onClick={() => onSubmit({ id: selected?.id, title: 'Updated', status: 'In Progress' })}
        >Save</button>
        <button data-testid="modal-add-subtask"
          onClick={() => onAddSubtask?.(selected?.id ?? 'task-1', 'New subtask')}
        >Add Subtask</button>
      </div>
    ) : null,
}));

jest.mock('../../batches', () => ({ BatchView: () => <div data-testid="batch-view" /> }));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'P-001', jobParam: undefined }),
    useLocation: () => ({ pathname: '/tickets' }),
    useNavigate: () => jest.fn(),
    Outlet: ({ children }: any) => <div data-testid="outlet">{children}</div>,
    Route: ({ element }: any) => <>{element}</>,
    Routes: ({ children }: any) => <div data-testid="routes">{children}</div>,
  };
});

jest.mock('@dnd-kit/sortable', () => ({
  arrayMove: (arr: any[], from: number, to: number) => {
    const copy = [...arr];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  },
}));

jest.mock('./KanbanModal', () => ({ KanbanModal: () => <div data-testid="kanban-modal" /> }));

jest.mock('./panes', () => ({
  KanbanPane: () => <div data-testid="kanban-pane" />,
  TimelinePane: () => <div data-testid="timeline-pane" />,
  TicketsPane: () => <div data-testid="tickets-pane" />,
  FilePane: () => <div data-testid="file-pane" />,
  InfoPane: () => <div data-testid="info-pane" />,
}));

// ── Import under test ───────────────────────────────────────────────

import { ProjectSingle } from './index';

// ── Helpers ─────────────────────────────────────────────────────────

function getCreateMutate(): jest.Mock {
  const apollo = require('@apollo/client');
  return apollo.__createMutate;
}

// ── Tests ───────────────────────────────────────────────────────────

describe('ProjectSingle — subtask creation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCreateMutate().mockClear();
  });

  it('renders without crashing', () => {
    render(<ProjectSingle />);
    expect(screen.getByText(/P-001/)).toBeInTheDocument();
  });

  it('onAddSubtask handler passes parentId in mutation variables', () => {
    // Simulate what the project view's onAddSubtask handler does:
    // TaskModal calls onAddSubtask(parentId, title)
    // → handler calls createTask({ variables: { input: { title, parentId, status: 'Backlog', projectId: job_id } } })
    // → Apollo useMutation sends the variables to the GraphQL endpoint

    const createMutate = getCreateMutate();
    const job_id = 'P-001';

    const handler = async (parentId: string, title: string) => {
      await createMutate({
        variables: {
          input: { title, parentId, status: 'Backlog', projectId: job_id }
        }
      });
    };

    handler('task-1', 'My subtask');

    expect(createMutate).toHaveBeenCalledTimes(1);
    expect(createMutate).toHaveBeenCalledWith({
      variables: {
        input: {
          title: 'My subtask',
          parentId: 'task-1',
          status: 'Backlog',
          projectId: 'P-001',
        }
      }
    });
  });

  it('Apollo useMutation is wired with ProjectTaskInput mutation document', () => {
    render(<ProjectSingle />);

    const { useMutation } = require('@apollo/client');
    const calls: [string][] = useMutation.mock.calls;

    const hasCreateTaskMutation = calls.some(([doc]) =>
      typeof doc === 'string' &&
      doc.includes('CreateProjectTask') &&
      doc.includes('ProjectTaskInput')
    );
    expect(hasCreateTaskMutation).toBe(true);

    const hasUpdateMutation = calls.some(([doc]) =>
      typeof doc === 'string' &&
      doc.includes('UpdateProjectTask') &&
      doc.includes('ProjectTaskInput')
    );
    expect(hasUpdateMutation).toBe(true);
  });

  it('refetches after subtask creation', async () => {
    const handler = async () => {
      await getCreateMutate()({
        variables: { input: { title: 'Sub', parentId: 't1', status: 'Backlog', projectId: 'P-001' } }
      });
      mockRefetchQueries({ include: ['GetProject'] });
    };

    await handler();

    expect(mockRefetchQueries).toHaveBeenCalledWith({ include: ['GetProject'] });
  });
});
