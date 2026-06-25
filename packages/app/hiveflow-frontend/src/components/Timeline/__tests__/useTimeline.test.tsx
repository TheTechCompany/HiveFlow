// ── Timeline — useTimeline hook unit tests ──────────────────────────
//
// Uses React Testing Library v12 (no renderHook), so we use a Probe
// component pattern to capture hook return values.

import React, { useEffect, useRef } from 'react';
import { render, act } from '@testing-library/react';
import { useTimeline } from '../useTimeline';
import type { UseTimelineReturn } from '../useTimeline';
import type { TimelineProps } from '../types';

// ── Mocks ───────────────────────────────────────────────────────────

// ResizeObserver is not available in jsdom
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

// Probe component — captures hook output
function Probe({
  props,
  onResult,
}: {
  props: TimelineProps;
  onResult: (result: UseTimelineReturn) => void;
}) {
  const result = useTimeline(props);
  const ref = useRef(onResult);
  ref.current = onResult;

  useEffect(() => {
    ref.current(result);
  });

  return (
    <div ref={result.setContainerRef} style={{ width: 1200, height: 800 }}>
      <span data-testid="item-count">{result.flatItems.length}</span>
      <span data-testid="sel-count">{result.selection.itemIds.length}</span>
      {result.flatItems.map((item) => (
        <span key={item.id} data-testid={`bar-${item.id}`}>
          {item.label}
        </span>
      ))}
    </div>
  );
}

function renderHook(props: TimelineProps = defaultProps) {
  let captured!: UseTimelineReturn;
  const result = render(
    <Probe
      props={props}
      onResult={(r) => {
        captured = r;
      }}
    />,
  );
  return {
    ...result,
    /** Returns the latest captured hook result. */
    getResult: () => captured,
  };
}

// ── Tests ───────────────────────────────────────────────────────────

describe('useTimeline', () => {
  // ── Geometry ───────────────────────────────────────────────────

  it('computes geometry from container size', () => {
    const { getResult } = renderHook();
    const geo = getResult().geometry;
    expect(geo.viewportWidth).toBeGreaterThan(0);
    expect(geo.timelineWidth).toBeGreaterThan(0);
    expect(geo.pxPerMs).toBeGreaterThan(0);
    expect(geo.sidebarWidth).toBe(0); // no groups → no sidebar
  });

  // ── Items ──────────────────────────────────────────────────────

  it('exposes flat items', () => {
    const { getResult } = renderHook();
    const items = getResult().flatItems;
    expect(items.length).toBe(1);
    expect(items[0].id).toBe('item-1');
  });

  it('groups items by groupId when groups are provided', () => {
    const props: TimelineProps = {
      ...defaultProps,
      groups: [
        { id: 'g1', label: 'Group 1' },
        { id: 'g2', label: 'Group 2' },
      ],
      items: [
        makeItem({ id: 'a', groupId: 'g1' }),
        makeItem({ id: 'b', groupId: 'g2' }),
      ],
    };
    const { getResult } = renderHook(props);
    const grouped = getResult().groupedItems;
    expect(grouped.get('g1')?.length).toBe(1);
    expect(grouped.get('g2')?.length).toBe(1);
    expect(grouped.get('g1')?.[0].id).toBe('a');
  });

  // ── Selection ──────────────────────────────────────────────────

  it('selects an item on click', () => {
    const { getResult } = renderHook();
    act(() => {
      getResult().selectItem('item-1');
    });
    expect(getResult().selection.itemIds).toEqual(['item-1']);
  });

  it('deselects on second click (toggle)', () => {
    const { getResult } = renderHook();
    act(() => {
      getResult().selectItem('item-1');
    });
    act(() => {
      getResult().selectItem('item-1', true); // additive toggle
    });
    expect(getResult().selection.itemIds).toEqual([]);
  });

  it('supports multi-select with additive flag', () => {
    const props: TimelineProps = {
      ...defaultProps,
      items: [
        makeItem({ id: 'a' }),
        makeItem({ id: 'b' }),
      ],
    };
    const { getResult } = renderHook(props);
    act(() => {
      getResult().selectItem('a');
    });
    act(() => {
      getResult().selectItem('b', true); // additive
    });
    expect(getResult().selection.itemIds).toEqual(['a', 'b']);
  });

  it('replaces selection when additive is false', () => {
    const props: TimelineProps = {
      ...defaultProps,
      items: [
        makeItem({ id: 'a' }),
        makeItem({ id: 'b' }),
      ],
    };
    const { getResult } = renderHook(props);
    act(() => {
      getResult().selectItem('a');
    });
    act(() => {
      getResult().selectItem('b'); // non-additive → replaces
    });
    expect(getResult().selection.itemIds).toEqual(['b']);
  });

  it('clears selection', () => {
    const { getResult } = renderHook();
    act(() => {
      getResult().selectItem('item-1');
    });
    act(() => {
      getResult().clearSelection();
    });
    expect(getResult().selection.itemIds).toEqual([]);
  });

  it('clears link selection when selecting an item', () => {
    const { getResult } = renderHook();
    act(() => {
      getResult().selectLink('link-1');
    });
    act(() => {
      getResult().selectItem('item-1');
    });
    expect(getResult().selection.linkIds).toEqual([]);
  });

  // ── Keyboard ──────────────────────────────────────────────────

  it('clears selection on Escape', () => {
    const { getResult } = renderHook();
    act(() => {
      getResult().selectItem('item-1');
    });
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    act(() => {
      getResult().onKeyDown(event as any);
    });
    expect(getResult().selection.itemIds).toEqual([]);
  });

  it('calls onDelete on Delete key with selection', () => {
    const onDelete = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      selectedItemIds: ['item-1'],
      callbacks: { onDelete },
    };
    const { getResult } = renderHook(props);
    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    act(() => {
      getResult().onKeyDown(event as any);
    });
    expect(onDelete).toHaveBeenCalledWith(['item-1']);
  });

  it('calls onDelete on Backspace key with selection', () => {
    const onDelete = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      selectedItemIds: ['item-1'],
      callbacks: { onDelete },
    };
    const { getResult } = renderHook(props);
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    act(() => {
      getResult().onKeyDown(event as any);
    });
    expect(onDelete).toHaveBeenCalledWith(['item-1']);
  });

  it('calls onCopy on Ctrl+C', () => {
    const onCopy = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      selectedItemIds: ['item-1'],
      callbacks: { onCopy },
    };
    const { getResult } = renderHook(props);
    const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true });
    act(() => {
      getResult().onKeyDown(event as any);
    });
    expect(onCopy).toHaveBeenCalledWith(['item-1']);
  });

  it('calls onPaste on Ctrl+V', () => {
    const onPaste = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      callbacks: { onPaste },
    };
    const { getResult } = renderHook(props);
    const event = new KeyboardEvent('keydown', { key: 'v', ctrlKey: true });
    act(() => {
      getResult().onKeyDown(event as any);
    });
    expect(onPaste).toHaveBeenCalled();
  });

  it('selects all on Ctrl+A', () => {
    const props: TimelineProps = {
      ...defaultProps,
      items: [
        makeItem({ id: 'a' }),
        makeItem({ id: 'b' }),
        makeItem({ id: 'c' }),
      ],
    };
    const { getResult } = renderHook(props);
    const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
    act(() => {
      getResult().onKeyDown(event as any);
    });
    // Prevent default should be called; all items should be selected
    expect(getResult().selection.itemIds.length).toBe(3);
  });

  // ── Drag state ─────────────────────────────────────────────────

  it('starts drag in move mode', () => {
    const { getResult } = renderHook();
    act(() => {
      getResult().startDrag('item-1', 'move', 500);
    });
    expect(getResult().dragState.mode).toBe('move');
    expect(getResult().dragState.itemId).toBe('item-1');
    expect(getResult().dragState.startX).toBe(500);
  });

  it('starts drag in resize-left mode', () => {
    const { getResult } = renderHook();
    act(() => {
      getResult().startDrag('item-1', 'resize-left', 100);
    });
    expect(getResult().dragState.mode).toBe('resize-left');
  });

  it('updates drag and fires onItemChanging for move', () => {
    const onItemChanging = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      callbacks: { onItemChanging },
    };
    const { getResult } = renderHook(props);

    act(() => {
      getResult().startDrag('item-1', 'move', 500);
    });
    act(() => {
      getResult().updateDrag(600); // moved 100px right
    });

    expect(onItemChanging).toHaveBeenCalled();
    const change = onItemChanging.mock.calls[0][0];
    expect(change.id).toBe('item-1');
    expect(change.start).toBeDefined();
    expect(change.end).toBeDefined();
  });

  it('fires onItemChanging during resize-left with both start and end', () => {
    const onItemChanging = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      callbacks: { onItemChanging },
    };
    const { getResult } = renderHook(props);

    act(() => {
      getResult().startDrag('item-1', 'resize-left', 500);
    });
    act(() => {
      getResult().updateDrag(450); // dragged 50px left
    });

    expect(onItemChanging).toHaveBeenCalled();
    const change = onItemChanging.mock.calls[0][0];
    expect(change.id).toBe('item-1');
    // resize-left only provides start, not end
    expect(change.start).toBeDefined();
    expect(change.end).toBeUndefined();
  });

  it('fires onItemChanging during resize-right with end', () => {
    const onItemChanging = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      callbacks: { onItemChanging },
    };
    const { getResult } = renderHook(props);

    act(() => {
      getResult().startDrag('item-1', 'resize-right', 500);
    });
    act(() => {
      getResult().updateDrag(550); // dragged 50px right
    });

    expect(onItemChanging).toHaveBeenCalled();
    const change = onItemChanging.mock.calls[0][0];
    expect(change.id).toBe('item-1');
    expect(change.end).toBeDefined();
    expect(change.start).toBeUndefined();
  });

  it('ends drag and fires onItemChange with snapped dates', () => {
    const onItemChange = jest.fn();
    const props: TimelineProps = {
      ...defaultProps,
      callbacks: { onItemChange },
    };
    const { getResult } = renderHook(props);

    act(() => {
      getResult().startDrag('item-1', 'move', 500);
    });
    act(() => {
      getResult().updateDrag(600);
    });
    act(() => {
      getResult().endDrag();
    });

    expect(onItemChange).toHaveBeenCalled();
    const change = onItemChange.mock.calls[0][0];
    expect(change.id).toBe('item-1');
  });

  it('returns to idle after endDrag', () => {
    const { getResult } = renderHook();
    act(() => {
      getResult().startDrag('item-1', 'move', 500);
    });
    act(() => {
      getResult().endDrag();
    });
    expect(getResult().dragState.mode).toBe('idle');
  });

  // ── computeBarStyle ────────────────────────────────────────────

  it('computes absolute positioning style', () => {
    const { getResult } = renderHook();
    const style = getResult().computeBarStyle({
      ...makeItem(),
      laneIndex: 0,
    });
    expect(style.position).toBe('absolute');
    expect(style.left).toBeDefined();
    expect(style.width).toBeDefined();
    expect(style.height).toBeDefined();
  });

  it('applies selected border when item is selected', () => {
    const { getResult } = renderHook();
    act(() => {
      getResult().selectItem('item-1');
    });
    const style = getResult().computeBarStyle(makeItem());
    expect(style.border).toContain('#1a73e8');
  });

  // ── Visibility filter ──────────────────────────────────────────

  it('visibleItems filters to the current horizon', () => {
    const props: TimelineProps = {
      ...defaultProps,
      items: [
        makeItem({ id: 'visible', start: d('2025-06-10'), end: d('2025-06-15') }),
        makeItem({
          id: 'hidden',
          start: d('2024-01-01'),
          end: d('2024-01-10'),
        }),
      ],
    };
    const { getResult } = renderHook(props);
    const visible = getResult().visibleItems;
    expect(visible.map((i) => i.id)).toEqual(['visible']);
  });

  // ── Header tiers ───────────────────────────────────────────────

  it('returns correct header tiers for day step', () => {
    const { getResult } = renderHook();
    const tiers = getResult().headerTiers;
    expect(tiers.length).toBe(2);
    expect(tiers[0].unit).toBe('month');
    expect(tiers[1].unit).toBe('day');
  });

  it('returns correct header tiers for week step', () => {
    const props: TimelineProps = { ...defaultProps, step: 'week' };
    const { getResult } = renderHook(props);
    const tiers = getResult().headerTiers;
    expect(tiers.length).toBe(3);
    expect(tiers[0].unit).toBe('month');
    expect(tiers[1].unit).toBe('week');
    expect(tiers[2].unit).toBe('day');
  });
});
