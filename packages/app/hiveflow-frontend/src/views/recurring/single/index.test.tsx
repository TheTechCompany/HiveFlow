/**
 * UI tests for the Recurring Schedule Single view.
 *
 * Verifies the Spreadsheet-based sidebar: column headers, tree-branch
 * rendering, draft rows, and GanttView sidebar wiring.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// ── Mocks ───────────────────────────────────────────────────────────

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'sched-1' }),
  useNavigate: () => mockNavigate,
}));

jest.mock('@apollo/client', () => ({
  gql: (strings) => strings.join(''),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Capture the rendered props for inspection
// Note: jest.mock factories are hoisted; JSX in the factory is fine
// because Babel transforms it to React.createElement before hoisting.
let mockGanttProps = null;
let mockSheetProps = null;
jest.mock('@hive-flow/ui', () => ({
  GanttView: (props) => {
    mockGanttProps = props;
    if (props.sidebar && props.sidebar.props) {
      mockSheetProps = props.sidebar.props;
    }
    return (
      <div data-testid="gantt-view">
        {props.sidebar && (
          <div data-testid="sidebar">
            {(mockSheetProps?.columns || []).map((col) => (
              <div key={col.key} data-testid={`col-header-${col.key}`}>
                {col.header || col.key}
              </div>
            ))}
            {(mockSheetProps?.rows || []).map((row) => (
              <div key={row.id} data-testid={`row-${row.id}`}>
                {(mockSheetProps?.columns || []).map((col) => {
                  if (col.render) {
                    return (
                      <span key={col.key} data-testid={`cell-${row.id}-${col.key}`}>
                        {col.render(row, false)}
                      </span>
                    );
                  }
                  return (
                    <span key={col.key} data-testid={`cell-${row.id}-${col.key}`}>
                      {String(row[col.key] ?? '')}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        <div data-testid="gantt-body">
          {(props.groups || []).map((g) => (
            <div key={g.id} data-testid={`gantt-row-${g.id}`}>
              {g.label}
            </div>
          ))}
        </div>
      </div>
    );
  },
  Spreadsheet: (props) => {
    mockSheetProps = props;
    return null;
  },
  TreeBranchVSCode: (props) => (
    <span
      data-testid="tree-branch"
      data-depth={props.depth}
      data-has-children={String(props.hasChildren)}
      data-collapsed={String(props.isCollapsed)}
    />
  ),
}));

import { useQuery, useMutation } from '@apollo/client';
import { ScheduleSingle } from './index';

// ── Helpers ─────────────────────────────────────────────────────────

const mockUseQuery = useQuery;
const mockUseMutation = useMutation;

function makeEvent(overrides = {}) {
  return {
    __typename: 'RecurringEvent',
    id: 'evt-1',
    scheduleId: 'sched-1',
    parentId: null,
    name: 'Monthly Review',
    description: '',
    frequency: 'monthly',
    startDate: '2025-01-15',
    assignedTo: '',
    ...overrides,
  };
}

function setupQueryMocks(events = []) {
  mockUseQuery.mockImplementation(function (query: any) {
    const q = typeof query === 'string' ? query : '';
    if (q.includes('recurringSchedule')) {
      return {
        data: {
          recurringSchedule: {
            __typename: 'RecurringSchedule',
            id: 'sched-1',
            name: 'Test Schedule',
            description: '',
            events,
          },
        },
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      };
    }
    return {
      data: {
        users: [
          { __typename: 'User', id: 'u1', name: 'Alice' },
          { __typename: 'User', id: 'u2', name: 'Bob' },
        ],
      },
      loading: false,
      error: undefined,
    };
  });
  mockUseMutation.mockReturnValue([jest.fn().mockResolvedValue({})]);
}

// ── Tests ───────────────────────────────────────────────────────────

describe('ScheduleSingle — Spreadsheet sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGanttProps = null;
    mockSheetProps = null;
  });

  // ── 1. GanttView receives a Spreadsheet sidebar ────────────────

  it('passes a Spreadsheet as the sidebar prop to GanttView', () => {
    setupQueryMocks([]);
    render(<ScheduleSingle />);

    expect(mockGanttProps).toBeTruthy();
    expect(mockGanttProps.sidebar).toBeTruthy();
    expect(mockSheetProps).toBeTruthy();
  });

  // ── 2. Spreadsheet columns match expected headers ──────────────

  it('renders Event, Frequency, Start Date, and Assigned column headers', () => {
    setupQueryMocks([]);
    render(<ScheduleSingle />);

    expect(mockSheetProps.columns).toBeTruthy();
    const headers = mockSheetProps.columns.map((c) => c.header || c.key);
    expect(headers).toContain('Event');
    expect(headers).toContain('Frequency');
    expect(headers).toContain('Start Date');
    expect(headers).toContain('Assigned');
  });

  // ── 3. Tree branches render for events with depth ─────────────

  it('renders TreeBranchVSCode for events with depth > 0', () => {
    const childEvent = makeEvent({
      id: 'evt-2',
      parentId: 'evt-1',
      name: 'Sub-task',
    });
    setupQueryMocks([makeEvent(), childEvent]);
    render(<ScheduleSingle />);

    const treeBranches = screen.getAllByTestId('tree-branch');
    expect(treeBranches.length).toBeGreaterThanOrEqual(1);

    const childBranch = treeBranches.find(
      (el) => el.getAttribute('data-depth') === '1',
    );
    expect(childBranch).toBeTruthy();
  });

  // ── 4. Draft row is included in spreadsheet rows ──────────────

  it('includes a draft row in the spreadsheet', () => {
    setupQueryMocks([]);
    render(<ScheduleSingle />);

    const draftRow = screen.getByTestId(/^row-draft-/);
    expect(draftRow).toBeTruthy();
    const draftRowData = mockSheetProps.rows.find((r) => r._isDraft);
    expect(draftRowData).toBeTruthy();
  });

  // ── 5. Spreadsheet rows match timeline groups ─────────────────

  it('creates spreadsheet rows for each timeline group', () => {
    setupQueryMocks([makeEvent()]);
    render(<ScheduleSingle />);

    const rows = mockSheetProps.rows;
    const groups = mockGanttProps.groups;
    for (const group of groups) {
      const matchingRow = rows.find((r) => r.id === group.id);
      expect(matchingRow).toBeTruthy();
    }
  });

  // ── 6. GanttView uses sidebarFlex instead of sidebarWidth ─────

  it('uses sidebarFlex (not sidebarWidth) for the sidebar column', () => {
    setupQueryMocks([]);
    render(<ScheduleSingle />);

    expect(mockGanttProps.sidebarFlex).toBe('580px');
    expect(mockGanttProps.sidebarWidth).toBeUndefined();
  });
});
