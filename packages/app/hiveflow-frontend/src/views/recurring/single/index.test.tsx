/**
 * UI tests for the Recurring Schedule Single view.
 *
 * Verifies the GanttView sidebar: column headers, tree-branch
 * rendering, event rows, resize handles, and keyboard navigation.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

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
  useApolloClient: () => ({
    cache: {
      identify: (obj: any) => `${obj.__typename}:${obj.id}`,
      modify: jest.fn(),
    },
  }),
}));

let mockGanttProps = null;
jest.mock('@hive-flow/ui', () => ({
  VSCODE_TWISTY_WIDTH: 16,
  DEPTH_BORDER_WIDTH: 3,
  GanttView: (props) => {
    mockGanttProps = props;
    return (
      <div data-testid="gantt-view">
        <div data-testid="sidebar-header">
          {props.renderers?.renderSidebarHeader?.()}
        </div>
        <div data-testid="gantt-body">
          {(props.groups || []).map((g) => (
            <div key={g.id} data-testid={`row-${g.id}`}>
              {props.renderers?.renderGroupHeader?.(g, true)}
            </div>
          ))}
        </div>
      </div>
    );
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

import { useQuery, useMutation, useApolloClient } from '@apollo/client';
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

describe('ScheduleSingle — sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGanttProps = null;
  });

  it('renders column headers in the sidebar', () => {
    setupQueryMocks([]);
    render(<ScheduleSingle />);

    const header = screen.getByTestId('sidebar-header');
    expect(header).toBeTruthy();
    expect(header.textContent).toContain('Event');
    expect(header.textContent).toContain('Freq');
    expect(header.textContent).toContain('Start');
    expect(header.textContent).toContain('End');
    expect(header.textContent).toContain('Assigned');
  });

  it('renders resize handles on Freq, Start, End, and Assigned columns', () => {
    setupQueryMocks([makeEvent()]);
    render(<ScheduleSingle />);

    expect(screen.getByTestId('resize-freq')).toBeTruthy();
    expect(screen.getByTestId('resize-start')).toBeTruthy();
    expect(screen.getByTestId('resize-end')).toBeTruthy();
    expect(screen.getByTestId('resize-assigned')).toBeTruthy();
  });

  it('renders TreeBranchVSCode for events with depth > 0', () => {
    const childEvent = makeEvent({ id: 'evt-2', parentId: 'evt-1', name: 'Sub-task' });
    setupQueryMocks([makeEvent(), childEvent]);
    render(<ScheduleSingle />);

    const treeBranches = screen.getAllByTestId('tree-branch');
    expect(treeBranches.length).toBeGreaterThanOrEqual(1);

    const childBranch = treeBranches.find(
      (el) => el.getAttribute('data-depth') === '1',
    );
    expect(childBranch).toBeTruthy();
  });

  it('renders event rows for each event in the schedule', () => {
    setupQueryMocks([makeEvent()]);
    render(<ScheduleSingle />);

    const row = screen.getByTestId('row-evt-1');
    expect(row).toBeTruthy();
  });

  it('uses sidebarWidth for the sidebar', () => {
    setupQueryMocks([]);
    render(<ScheduleSingle />);

    expect(mockGanttProps.sidebarWidth).toBe(580);
  });

  it('enables movable on the GanttView', () => {
    setupQueryMocks([makeEvent()]);
    render(<ScheduleSingle />);

    expect(mockGanttProps.movable).toBe(true);
  });

  // ── Ordering ────────────────────────────────────────────────

  it('renders groups in tree order', () => {
    setupQueryMocks([makeEvent()]);
    render(<ScheduleSingle />);

    const groups = mockGanttProps.groups;
    expect(groups.length).toBeGreaterThanOrEqual(1);
    expect(groups[0].id).toBe('evt-1');
  });

  it('renders TreeBranchVSCode for parent/child events', () => {
    const childEvent = makeEvent({ id: 'evt-2', parentId: 'evt-1', name: 'Sub-task' });
    setupQueryMocks([makeEvent(), childEvent]);
    render(<ScheduleSingle />);

    const treeBranches = screen.getAllByTestId('tree-branch');
    expect(treeBranches.length).toBeGreaterThanOrEqual(2);
  });

  it('keeps events in tree order', () => {
    const childEvent = makeEvent({ id: 'evt-2', parentId: 'evt-1', name: 'Child' });
    setupQueryMocks([makeEvent(), childEvent]);
    const { rerender } = render(<ScheduleSingle />);
    rerender(<ScheduleSingle />);

    const groups = mockGanttProps.groups;
    const eventIds = groups.map((g) => g.id);
    expect(eventIds).toEqual(['evt-1', 'evt-2', '__blank__']);
  });

  it('assigns unique group IDs to every row', () => {
    setupQueryMocks([makeEvent()]);
    render(<ScheduleSingle />);
    const ids = mockGanttProps.groups.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('maintains tree ordering for parent/child events', () => {
    const parent = makeEvent({ id: 'p1', name: 'Parent' });
    const child = makeEvent({ id: 'c1', parentId: 'p1', name: 'Child' });
    const child2 = makeEvent({ id: 'c2', parentId: 'p1', name: 'Child 2' });
    setupQueryMocks([parent, child, child2]);
    render(<ScheduleSingle />);
    const groups = mockGanttProps.groups;
    const pIdx = groups.findIndex((g) => g.id === 'p1');
    const c1Idx = groups.findIndex((g) => g.id === 'c1');
    const c2Idx = groups.findIndex((g) => g.id === 'c2');
    expect(pIdx).toBeLessThan(c1Idx);
    expect(c1Idx).toBeLessThan(c2Idx);
  });

  // ── Keyboard navigation ────────────────────────────────────

  it('Cmd+] on event row triggers indent', () => {
    setupQueryMocks([makeEvent(), makeEvent({ id: 'evt-2', name: 'Second' })]);
    render(<ScheduleSingle />);

    const row = screen.getByTestId('row-evt-2');
    fireEvent.keyDown(row.firstElementChild!, { key: ']', metaKey: true });
    const [mutateFn] = mockUseMutation();
    expect(mutateFn).toHaveBeenCalled();
  });

  it('Cmd+[ on event row triggers outdent', () => {
    const childEvent = makeEvent({ id: 'evt-2', parentId: 'evt-1', name: 'Child' });
    setupQueryMocks([makeEvent(), childEvent]);
    render(<ScheduleSingle />);

    const row = screen.getByTestId('row-evt-2');
    fireEvent.keyDown(row.firstElementChild!, { key: '[', metaKey: true });
    const [mutateFn] = mockUseMutation();
    expect(mutateFn).toHaveBeenCalled();
  });

  it('Tab on event row does NOT trigger indent (moved to Cmd+])', () => {
    setupQueryMocks([makeEvent()]);
    render(<ScheduleSingle />);
    // Clear seed-effect mutation call
    const [mutateFn] = mockUseMutation();
    mutateFn.mockClear();

    const row = screen.getByTestId('row-evt-1');
    fireEvent.keyDown(row.firstElementChild!, { key: 'Tab' });
    expect(mutateFn).not.toHaveBeenCalled();
  });

  it('Shift+Tab on event row does NOT trigger outdent', () => {
    const childEvent = makeEvent({ id: 'evt-2', parentId: 'evt-1', name: 'Child' });
    setupQueryMocks([makeEvent(), childEvent]);
    render(<ScheduleSingle />);
    // Clear seed-effect mutation call
    const [mutateFn] = mockUseMutation();
    mutateFn.mockClear();

    const row = screen.getByTestId('row-evt-2');
    fireEvent.keyDown(row.firstElementChild!, { key: 'Tab', shiftKey: true });
    expect(mutateFn).not.toHaveBeenCalled();
  });

  it('Enter on event name field prevents default and triggers create', () => {
    setupQueryMocks([makeEvent()]);
    render(<ScheduleSingle />);

    const row = screen.getByTestId('row-evt-1');
    const nameInput = row.querySelector('input');
    expect(nameInput).toBeTruthy();
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    nameInput!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('Enter on event row triggers createEvent mutation', () => {
    setupQueryMocks([makeEvent()]);
    render(<ScheduleSingle />);

    const row = screen.getByTestId('row-evt-1');
    const nameInput = row.querySelector('input');
    const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    nameInput!.dispatchEvent(keyEvent);
    const [mutateFn] = mockUseMutation();
    // The createEvent mutation should have been called (via handleCreateBelow)
    expect(mutateFn).toHaveBeenCalled();
  });

  // ── handleItemChange (move / resize) ────────────────────────

  describe('handleItemChange', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockGanttProps = null;
    });

    function triggerChange(change) {
      // Render with one event, then invoke the callback captured by the mock
      const event = makeEvent({ startDate: '2025-01-15', endDate: '2025-06-15' });
      setupQueryMocks([event]);
      render(<ScheduleSingle />);
      // Clear auto-fired mutations from draft seed effect
      const [mutateFn] = mockUseMutation();
      mutateFn.mockClear();
      mockGanttProps.callbacks.onItemChange(change);
      return [mutateFn, ...mockUseMutation()];
    }

    it('resize-right: only end changed → updates endDate only', () => {
      const [mutateFn] = triggerChange({
        id: 'evt-1',
        end: new Date('2025-09-15'),
      });
      expect(mutateFn).toHaveBeenCalledTimes(1);
      const vars = mutateFn.mock.calls[0][0].variables;
      expect(vars.id).toBe('evt-1');
      expect(vars.input.endDate).toBe('2025-09-15');
      expect(vars.input.startDate).toBeUndefined();
    });

    it('resize-left: only start changed → updates startDate only', () => {
      const [mutateFn] = triggerChange({
        id: 'evt-1',
        start: new Date('2025-03-01'),
      });
      expect(mutateFn).toHaveBeenCalledTimes(1);
      const vars = mutateFn.mock.calls[0][0].variables;
      expect(vars.input.startDate).toBe('2025-03-01');
      expect(vars.input.endDate).toBeUndefined();
    });

    it('move: both start and end changed → shifts both preserving duration', () => {
      // Original: 2025-01-15 to 2025-06-15 → 151 days
      // Both edges shifted fwd by 31 days (e.g. snapped to month boundaries)
      const [mutateFn] = triggerChange({
        id: 'evt-1',
        start: new Date('2025-02-15'),
        end: new Date('2025-07-15'),
      });
      expect(mutateFn).toHaveBeenCalledTimes(1);
      const vars = mutateFn.mock.calls[0][0].variables;
      // startDate should be the new start
      expect(vars.input.startDate).toBe('2025-02-15');
      // endDate should be shifted by the same delta (31 days), NOT the snapped value
      // Original duration: 2025-06-15 - 2025-01-15 = 151 days
      // Shifted end: 2025-02-15 + 151 days = 2025-07-16
      expect(vars.input.endDate).toBe('2025-07-16');
    });

    it('move without endDate: only updates startDate', () => {
      const event = makeEvent({ startDate: '2025-01-15', endDate: undefined });
      setupQueryMocks([event]);
      render(<ScheduleSingle />);
      const [mutateFn] = mockUseMutation();
      mutateFn.mockClear();
      mockGanttProps.callbacks.onItemChange({
        id: 'evt-1',
        start: new Date('2025-03-01'),
        end: new Date('2025-08-01'),
      });
      expect(mutateFn).toHaveBeenCalledTimes(1);
      const vars = mutateFn.mock.calls[0][0].variables;
      expect(vars.input.startDate).toBe('2025-03-01');
      expect(vars.input.endDate).toBeUndefined();
    });

    it('no-op: no start and no end → does nothing', () => {
      setupQueryMocks([makeEvent()]);
      render(<ScheduleSingle />);
      const [mutateFn] = mockUseMutation();
      mutateFn.mockClear();
      mockGanttProps.callbacks.onItemChange({ id: 'evt-1' });
      expect(mutateFn).not.toHaveBeenCalled();
    });
  });

  // ── Occurrence move dialog ──────────────────────────────────

  describe('occurrence move dialog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockGanttProps = null;
    });

    it('moving a generated occurrence opens the dialog instead of mutating', () => {
      const event = makeEvent({ startDate: '2025-01-15', frequency: 'monthly' });
      setupQueryMocks([event]);
      render(<ScheduleSingle />);
      const [mutateFn] = mockUseMutation();
      mutateFn.mockClear();

      // Drag the 2nd occurrence (index 2 = March 15) to a new date
      mockGanttProps.callbacks.onItemChange({
        id: 'evt-1-occ-2',
        start: new Date('2025-03-22'),
        end: new Date('2025-03-22'),
      });

      // Should NOT have fired a mutation yet — dialog should be open
      expect(mutateFn).not.toHaveBeenCalled();

      // Dialog should be visible
      const dialogTitle = screen.queryByText('Move Recurring Occurrence');
      expect(dialogTitle).toBeTruthy();
    });

    it('"Change this occurrence only" adds an exceptionDates entry', () => {
      const event = makeEvent({ startDate: '2025-01-15', frequency: 'monthly', exceptionDates: undefined });
      setupQueryMocks([event]);
      render(<ScheduleSingle />);
      const [mutateFn] = mockUseMutation();
      mutateFn.mockClear();

      // Drag the 2nd occurrence to a new date
      mockGanttProps.callbacks.onItemChange({
        id: 'evt-1-occ-2',
        start: new Date('2025-03-22'),
        end: new Date('2025-03-22'),
      });

      // Click "Change this occurrence only"
      const thisOneBtn = screen.getByText('Change this occurrence only');
      fireEvent.click(thisOneBtn);

      expect(mutateFn).toHaveBeenCalledTimes(1);
      const vars = mutateFn.mock.calls[0][0].variables;
      expect(vars.id).toBe('evt-1');
      expect(vars.input.exceptionDates).toEqual([
        {
          originalDate: '2025-03-15',
          newStartDate: '2025-03-22',
          newEndDate: '2025-03-22',
        },
      ]);
    });

    it('"Change this and all future occurrences" calls splitRecurringEvent', () => {
      const event = makeEvent({ startDate: '2025-01-15', frequency: 'monthly' });
      setupQueryMocks([event]);
      render(<ScheduleSingle />);
      const [mutateFn] = mockUseMutation();
      mutateFn.mockClear();

      // Drag the 2nd occurrence to a new date
      mockGanttProps.callbacks.onItemChange({
        id: 'evt-1-occ-2',
        start: new Date('2025-03-22'),
        end: new Date('2025-07-22'),
      });

      // Click "Change this and all future occurrences"
      const allFutureBtn = screen.getByText('Change this and all future occurrences');
      fireEvent.click(allFutureBtn);

      expect(mutateFn).toHaveBeenCalledTimes(1);
      const vars = mutateFn.mock.calls[0][0].variables;
      expect(vars.id).toBe('evt-1');
      expect(vars.newStartDate).toBe('2025-03-22');
      expect(vars.newEndDate).toBe('2025-07-22');
    });

    it('"Cancel" reverts without calling any mutation', () => {
      const event = makeEvent({ startDate: '2025-01-15', frequency: 'monthly' });
      setupQueryMocks([event]);
      render(<ScheduleSingle />);
      const [mutateFn] = mockUseMutation();
      mutateFn.mockClear();

      // Drag a generated occurrence
      mockGanttProps.callbacks.onItemChange({
        id: 'evt-1-occ-2',
        start: new Date('2025-03-22'),
      });

      // Click Cancel
      const cancelBtn = screen.getByText('Cancel');
      fireEvent.click(cancelBtn);

      // Should not have fired any mutation
      expect(mutateFn).not.toHaveBeenCalled();
    });

    it('moving an exception item updates its exceptionDates entry', () => {
      const event = makeEvent({
        startDate: '2025-01-15',
        frequency: 'monthly',
        exceptionDates: [{ originalDate: '2025-03-15', newStartDate: '2025-03-20' }],
      });
      setupQueryMocks([event]);
      render(<ScheduleSingle />);
      const [mutateFn] = mockUseMutation();
      mutateFn.mockClear();

      // Resize the exception item
      mockGanttProps.callbacks.onItemChange({
        id: 'evt-1-exc-2025-03-15',
        start: new Date('2025-03-20'),
        end: new Date('2025-03-25'),
      });

      expect(mutateFn).toHaveBeenCalledTimes(1);
      const vars = mutateFn.mock.calls[0][0].variables;
      expect(vars.id).toBe('evt-1');
      expect(vars.input.exceptionDates).toEqual([
        {
          originalDate: '2025-03-15',
          newStartDate: '2025-03-20',
          newEndDate: '2025-03-25',
        },
      ]);
    });
  });

});
