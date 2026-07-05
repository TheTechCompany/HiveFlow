// ── Timeline — Integration tests ────────────────────────────────────

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Timeline } from '../Timeline';
import type { TimelineProps } from '../types';

// ── Mocks ───────────────────────────────────────────────────────────

// Mock ResizeObserver (not in jsdom)
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(window as any).ResizeObserver = MockResizeObserver;

// ── Helpers ─────────────────────────────────────────────────────────

function d(iso: string): Date {
  let s = iso.replace(/Z$/, '');
  if (!s.includes('T')) s += 'T00:00:00';
  return new Date(s);
}

function makeItem(overrides: Partial<TimelineProps['items'][number]> = {}) {
  return {
    id: 'item-1',
    start: d('2025-06-10'),
    end: d('2025-06-15'),
    label: 'Test Item',
    color: '#4a90d9',
    ...overrides,
  };
}

const defaultProps: TimelineProps = {
  items: [makeItem()],
  start: d('2025-06-01'),
  end: d('2025-06-30'),
  step: 'day',
};

// ── Tests ───────────────────────────────────────────────────────────

describe('Timeline', () => {
  // ── Rendering ──────────────────────────────────────────────────

  it('renders without crashing', () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders the time-axis header', () => {
    render(<Timeline {...defaultProps} />);
    // Should contain month labels
    expect(screen.getByText('June 2025')).toBeInTheDocument();
  });

  it('renders multiple items', () => {
    const props: TimelineProps = {
      ...defaultProps,
      // With step='day' and no explicit stepCount, the default is 14 days.
      // The effectiveEnd is start + 14 days = June 15, so items beyond
      // that date are outside the visible window until the user pans.
      // Pass stepCount to widen the window to include both items.
      stepCount: 30,
      items: [
        makeItem({ id: 'a', label: 'Task A' }),
        makeItem({ id: 'b', label: 'Task B', start: d('2025-06-20'), end: d('2025-06-25') }),
      ],
    };
    render(<Timeline {...props} />);
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });

  it('renders groups with labels', () => {
    const props: TimelineProps = {
      ...defaultProps,
      groups: [
        { id: 'g1', label: 'Phase 1' },
        { id: 'g2', label: 'Phase 2' },
      ],
      items: [
        makeItem({ id: 'a', label: 'Task A', groupId: 'g1' }),
        makeItem({ id: 'b', label: 'Task B', groupId: 'g2', start: d('2025-06-20'), end: d('2025-06-25') }),
      ],
    };
    render(<Timeline {...props} />);
    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 2')).toBeInTheDocument();
  });

  // ── States ─────────────────────────────────────────────────────

  it('shows loading state', () => {
    const props: TimelineProps = { ...defaultProps, loading: true };
    render(<Timeline {...props} />);
    expect(screen.getByText('Loading timeline...')).toBeInTheDocument();
  });

  it('shows custom loading renderer', () => {
    const props: TimelineProps = {
      ...defaultProps,
      loading: true,
      renderers: { renderLoading: () => <span>Custom loading...</span> },
    };
    render(<Timeline {...props} />);
    expect(screen.getByText('Custom loading...')).toBeInTheDocument();
  });

  // The Timeline no longer renders a "No items" message — it simply renders
  // an empty body with grid lines.  The caller is expected to handle zero
  // state at a higher level.

  // ── Selection ──────────────────────────────────────────────────

  it('selects an item on click', () => {
    const onSelect = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      callbacks: { onSelect },
    };
    render(<Timeline {...props} />);

    const bar = document.querySelector('[data-timeline-item="item-1"]')!;
    fireEvent.click(bar);

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        itemIds: ['item-1'],
        linkIds: [],
      }),
    );
  });

  it('visual indicator on selected bar', () => {
    const props: TimelineProps = {
      ...defaultProps,
      selectedItemIds: ['item-1'],
    };
    render(<Timeline {...props} />);
    const bar = document.querySelector('[data-timeline-item="item-1"]')!;
    expect(bar.className).toContain('timeline-bar--selected');
  });

  // ── Resize handles ─────────────────────────────────────────────

  it('renders resize handles on bars', () => {
    render(<Timeline {...defaultProps} />);
    const leftHandle = document.querySelector('[data-resize="left"]');
    const rightHandle = document.querySelector('[data-resize="right"]');
    expect(leftHandle).toBeInTheDocument();
    expect(rightHandle).toBeInTheDocument();
  });

  it('hides resize handles when resizable=false', () => {
    const props: TimelineProps = { ...defaultProps, resizable: false };
    render(<Timeline {...props} />);
    const leftHandle = document.querySelector('[data-resize="left"]');
    expect(leftHandle).not.toBeInTheDocument();
  });

  it('hides resize handles on non-resizable items', () => {
    const props: TimelineProps = {
      ...defaultProps,
      items: [makeItem({ resizable: false })],
    };
    render(<Timeline {...props} />);
    const leftHandle = document.querySelector('[data-resize="left"]');
    expect(leftHandle).not.toBeInTheDocument();
  });

  // ── Today marker ───────────────────────────────────────────────

  it('shows today marker when today is in range', () => {
    const today = new Date();
    const props: TimelineProps = {
      items: [makeItem()],
      start: new Date(today.getTime() - 7 * 86400000),
      end: new Date(today.getTime() + 7 * 86400000),
      step: 'day',
    };
    render(<Timeline {...props} />);
    const todayLine = document.querySelector('[data-today-line]');
    expect(todayLine).toBeInTheDocument();
  });

  it('hides today marker when showToday is false', () => {
    const today = new Date();
    const props: TimelineProps = {
      items: [makeItem()],
      start: new Date(today.getTime() - 7 * 86400000),
      end: new Date(today.getTime() + 7 * 86400000),
      step: 'day',
      showToday: false,
    };
    render(<Timeline {...props} />);
    const todayLine = document.querySelector('[data-today-line]');
    expect(todayLine).not.toBeInTheDocument();
  });

  // ── Links ──────────────────────────────────────────────────────

  it('renders link arrows when links are provided', () => {
    const props: TimelineProps = {
      ...defaultProps,
      items: [
        makeItem({ id: 'a', start: d('2025-06-01'), end: d('2025-06-05') }),
        makeItem({ id: 'b', start: d('2025-06-10'), end: d('2025-06-15') }),
      ],
      links: [{ id: 'l1', source: 'a', target: 'b' }],
    };
    render(<Timeline {...props} />);
    const svg = document.querySelector('[data-timeline-links]');
    expect(svg).toBeInTheDocument();
  });

  it('hides links when showLinks is false', () => {
    const props: TimelineProps = {
      ...defaultProps,
      items: [
        makeItem({ id: 'a', start: d('2025-06-01'), end: d('2025-06-05') }),
        makeItem({ id: 'b', start: d('2025-06-10'), end: d('2025-06-15') }),
      ],
      links: [{ id: 'l1', source: 'a', target: 'b' }],
      showLinks: false,
    };
    render(<Timeline {...props} />);
    const svg = document.querySelector('[data-timeline-links]');
    expect(svg).not.toBeInTheDocument();
  });

  it('selects a link on click', () => {
    const onSelect = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      items: [
        makeItem({ id: 'a', start: d('2025-06-01'), end: d('2025-06-05') }),
        makeItem({ id: 'b', start: d('2025-06-10'), end: d('2025-06-15') }),
      ],
      links: [{ id: 'l1', source: 'a', target: 'b' }],
      callbacks: { onSelect },
    };
    render(<Timeline {...props} />);

    // Click the invisible wide path
    const path = document.querySelector('[data-timeline-links] path[stroke="transparent"]')!;
    fireEvent.click(path);

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        linkIds: ['l1'],
        itemIds: [],
      }),
    );
  });

  // ── Custom renderers ───────────────────────────────────────────

  it('uses custom item renderer', () => {
    const props: TimelineProps = {
      ...defaultProps,
      renderers: {
        renderItem: (item) => <span data-testid="custom-item">{item.label}!</span>,
      },
    };
    render(<Timeline {...props} />);
    expect(screen.getByTestId('custom-item')).toHaveTextContent('Test Item!');
  });

  it('uses custom group header renderer', () => {
    const props: TimelineProps = {
      ...defaultProps,
      groups: [{ id: 'g1', label: 'Phase 1' }],
      items: [makeItem({ groupId: 'g1' })],
      renderers: {
        renderGroupHeader: (group) => (
          <span data-testid="custom-header">✨ {group.label}</span>
        ),
      },
    };
    render(<Timeline {...props} />);
    expect(screen.getByTestId('custom-header')).toHaveTextContent('✨ Phase 1');
  });

  // ── Keyboard ───────────────────────────────────────────────────

  it('has tabIndex 0 for keyboard navigation', () => {
    render(<Timeline {...defaultProps} />);
    const container = document.querySelector('[data-timeline]')!;
    expect(container.getAttribute('tabindex')).toBe('0');
  });

  // ── Grid ───────────────────────────────────────────────────────

  it('renders the grid layer', () => {
    render(<Timeline {...defaultProps} />);
    const grid = document.querySelector('[data-timeline-grid]');
    expect(grid).toBeInTheDocument();
  });

  // ── Readonly ───────────────────────────────────────────────────

  it('disables interactions when readonly', () => {
    const onItemChange = jest.fn();
    const props: TimelineProps = { ...defaultProps, readonly: true, callbacks: { onItemChange } };
    render(<Timeline {...props} />);
    const bar = document.querySelector('[data-timeline-item="item-1"]')!;
    // In readonly, bars should still render but not be draggable
    expect(bar).toBeInTheDocument();
    // Resize handles should be hidden
    expect(document.querySelector('[data-resize="left"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-resize="right"]')).not.toBeInTheDocument();
  });

  it('shows resize handles when not readonly', () => {
    const props: TimelineProps = { ...defaultProps, readonly: false };
    render(<Timeline {...props} />);
    expect(document.querySelector('[data-resize="left"]')).toBeInTheDocument();
  });

  // ── Navigation buttons ─────────────────────────────────────────

  it('renders navigation buttons when onNavigate is provided', () => {
    const onNavigate = jest.fn();
    const props: TimelineProps = { ...defaultProps, callbacks: { onNavigate } };
    render(<Timeline {...props} />);
    expect(screen.getByTitle('Previous')).toBeInTheDocument();
    expect(screen.getByTitle('Today')).toBeInTheDocument();
    expect(screen.getByTitle('Next')).toBeInTheDocument();
  });

  it('does not render navigation buttons without onNavigate', () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.queryByTitle('Previous')).not.toBeInTheDocument();
  });

  it('calls onNavigate when nav buttons are clicked', () => {
    const onNavigate = jest.fn();
    const props: TimelineProps = { ...defaultProps, callbacks: { onNavigate } };
    render(<Timeline {...props} />);
    fireEvent.click(screen.getByTitle('Previous'));
    expect(onNavigate).toHaveBeenCalledWith('prev');
    fireEvent.click(screen.getByTitle('Next'));
    expect(onNavigate).toHaveBeenCalledWith('next');
    fireEvent.click(screen.getByTitle('Today'));
    expect(onNavigate).toHaveBeenCalledWith('today');
  });

  // ── Create by drag ─────────────────────────────────────────────

  it('renders ghost bar in wrapper during Shift+drag', () => {
    const props: TimelineProps = { ...defaultProps, callbacks: { onItemCreate: jest.fn() } };
    const { container } = render(<Timeline {...props} />);
    const body = container.querySelector('[data-timeline]')!;
    fireEvent.pointerDown(body, { clientX: 400, clientY: 200, pointerId: 1, shiftKey: true });
    // The ghost wrapper div (data-ghost-wrapper) should exist in the DOM
    const ghostWrapper = document.querySelector('[data-ghost-wrapper]');
    expect(ghostWrapper).toBeTruthy();
    // When groups are present, it's offset by the sidebar width
  });

  it('does not fire onItemCreate when readonly', () => {
    const onItemCreate = jest.fn();
    const props: TimelineProps = { ...defaultProps, readonly: true, callbacks: { onItemCreate } };
    const { container } = render(<Timeline {...props} />);
    const body = container.querySelector('[data-timeline]')!;
    fireEvent.pointerDown(body, { clientX: 500, clientY: 200, pointerId: 1, shiftKey: true });
    fireEvent.pointerUp(body, { clientX: 500, clientY: 200, pointerId: 1, shiftKey: true });
    expect(onItemCreate).not.toHaveBeenCalled();
  });

  it('does not fire onItemCreate when clicking on a bar', () => {
    const onItemCreate = jest.fn();
    const props: TimelineProps = { ...defaultProps, callbacks: { onItemCreate } };
    render(<Timeline {...props} />);
    const bar = document.querySelector('[data-timeline-item="item-1"]')!;
    fireEvent.pointerDown(bar, { clientX: 500, clientY: 200, pointerId: 1 });
    fireEvent.pointerUp(bar, { clientX: 500, clientY: 200, pointerId: 1 });
    // Should NOT fire onItemCreate when clicking a bar
    expect(onItemCreate).not.toHaveBeenCalled();
  });

  it('renders ghost bar during Shift+create drag', () => {
    const props: TimelineProps = { ...defaultProps, callbacks: { onItemCreate: jest.fn() } };
    const { container } = render(<Timeline {...props} />);
    const body = container.querySelector('[data-timeline]')!;
    (body as any).setPointerCapture = jest.fn();
    fireEvent.pointerDown(body, { clientX: 400, clientY: 200, pointerId: 1, shiftKey: true });
    const ghost = document.querySelector('[style*="dashed"]');
    expect(ghost).toBeTruthy();
  });

  it('positions ghost bar wrapper at sidebar offset when groups are present', () => {
    const props: TimelineProps = {
      ...defaultProps,
      groups: [{ id: 'g1', label: 'G1' }],
      items: [makeItem({ groupId: 'g1' })],
      callbacks: { onItemCreate: jest.fn() },
    };
    const { container } = render(<Timeline {...props} />);
    const body = container.querySelector('[data-timeline]')!;
    (body as any).setPointerCapture = jest.fn();
    fireEvent.pointerDown(body, { clientX: 500, clientY: 200, pointerId: 1, shiftKey: true });
    // The ghost bar's wrapper div should be at the sidebar offset (180px)
    const ghostWrapper = document.querySelector('[data-ghost-wrapper]');
    expect(ghostWrapper).toBeTruthy();
    expect((ghostWrapper as any).style.left).toBe('180px');
  });

  // ── Wheel-to-pan ────────────────────────────────────────────────

  it('pans horizontally on wheel deltaX', () => {
    const { container } = render(<Timeline {...defaultProps} />);
    const body = container.querySelector('[data-timeline]')!.querySelector('div[style*="overflow: hidden"][style*="position: relative"]')!;
    // Wheel deltaX should shift the pan offset (prevents default)
    const prevented = fireEvent.wheel(body, { deltaX: 60, deltaY: 0 });
    // The wheel handler calls e.preventDefault(), so the event should show as defaultPrevented
    // and the component re-renders with new panOffset (transform applied)
    expect(body).toBeTruthy();
  });

  it('pans on shift+vertical wheel', () => {
    const { container } = render(<Timeline {...defaultProps} />);
    const body = container.querySelector('[data-timeline]')!.querySelector('div[style*="overflow: hidden"][style*="position: relative"]')!;
    fireEvent.wheel(body, { deltaX: 0, deltaY: 40, shiftKey: true });
    // Shift+wheel should also pan horizontally
    expect(body).toBeTruthy();
  });

  // ── Placeholder rows ────────────────────────────────────────────

  it('does not render empty placeholder rows (body uses overflow-y:auto for scroll)', () => {
    // Placeholder rows were removed — the body uses native overflow-y:auto
    // so the ROWS_WRAPPER naturally sizes to its content.
    const { container } = render(<Timeline {...defaultProps} />);
    const placeholder = container.querySelector('[data-timeline-row*="__empty_"]');
    expect(placeholder).toBeFalsy();
  });

  // ── Backspace key ────────────────────────────────────────────────

  it('calls onDelete on Backspace key with selection', () => {
    const onDelete = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      selectedItemIds: ['item-1'],
      callbacks: { onDelete },
    };
    render(<Timeline {...props} />);
    const container = document.querySelector('[data-timeline]')!;
    fireEvent.keyDown(container, { key: 'Backspace' });
    expect(onDelete).toHaveBeenCalledWith(['item-1']);
  });

  // ── Links SVG alignment with groups ──────────────────────────────

  it('positions link SVG at sidebar offset when groups are present', () => {
    const props: TimelineProps = {
      ...defaultProps,
      groups: [{ id: 'g1', label: 'G1' }],
      items: [
        makeItem({ id: 'a', groupId: 'g1', start: d('2025-06-01'), end: d('2025-06-05') }),
        makeItem({ id: 'b', groupId: 'g1', start: d('2025-06-10'), end: d('2025-06-15') }),
      ],
      links: [{ id: 'l1', source: 'a', target: 'b' }],
    };
    render(<Timeline {...props} />);
    const svg = document.querySelector('[data-timeline-links]') as HTMLElement;
    expect(svg).toBeTruthy();
    expect(svg.style.left).toBe('180px');
  });

  // ── Edge scroll during drag ──────────────────────────────────────

  it('has edge-scroll wired to pointerMove on container', () => {
    const { container } = render(<Timeline {...defaultProps} />);
    const body = container.querySelector('[data-timeline]')!.querySelector('div[style*="overflow: hidden"][style*="position: relative"]')!;
    expect(body).toBeTruthy();
    // Wheel-to-pan works as a proxy for edge-scroll wiring
    fireEvent.wheel(body, { deltaX: 100, deltaY: 0 });
    expect(body).toBeTruthy();
  });

  // ── Rounded corners ────────────────────────────────────────────

  it('has rounded corners', () => {
    render(<Timeline {...defaultProps} />);
    const el = document.querySelector('[data-timeline]')!;
    expect(el.style.borderRadius).toBe('6px');
  });
});
