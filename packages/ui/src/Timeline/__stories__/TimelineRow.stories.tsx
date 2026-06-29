// ── TimelineRow stories — Row states with items ────────────────────
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TimelineRow } from '../TimelineRow';
import type { TimelineRowProps } from '../TimelineRow';
import type { UseTimelineReturn, BarLayout } from '../useTimeline';
import type { TimelineItem, SelectionState, TimelineGeometry } from '../types';
import { makeItem, makeGeometry, d } from '../__stories__/mockData';

const meta: Meta<typeof TimelineRow> = {
  title: 'Timeline / TimelineRow',
  component: TimelineRow,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimelineRow>;

// ── Minimal mock of UseTimelineReturn ──────────────────────────────

const geom = makeGeometry();

function mockTimelineItem(item: TimelineItem, selected: boolean, laneIdx: number): TimelineItem & { laneIndex: number } {
  return { ...item, laneIndex: laneIdx };
}

function makeMockTimeline(overrides: Partial<UseTimelineReturn> = {}): UseTimelineReturn {
  const dragState = {
    mode: 'idle' as const,
    itemId: '',
    startX: 0,
    deltaX: 0,
    origStart: new Date(),
    origEnd: new Date(),
    dragStartMs: 0,
    dragPxPerMs: 0,
  };

  return {
    geometry: geom,
    groupedItems: new Map(),
    flatItems: [],
    headerTiers: [],
    selection: { itemIds: [], linkIds: [] },
    selectItem: () => {},
    selectLink: () => {},
    clearSelection: () => {},
    dragState,
    dragStateRef: { current: dragState },
    startDrag: () => {},
    updateDrag: () => {},
    endDrag: () => null,
    onKeyDown: () => {},
    visibleItems: [],
    computeBarStyle: (item: TimelineItem & { laneIndex?: number }) => {
      const startX = (item.start.getTime() - d(2026, 6, 1).getTime()) * geom.pxPerMs;
      const endX = (item.end.getTime() - d(2026, 6, 1).getTime()) * geom.pxPerMs;
      return {
        position: 'absolute',
        left: `${startX}px`,
        width: `${Math.max(4, endX - startX)}px`,
        height: '30px',
        top: `${((item as any).laneIndex ?? 0) * 34}px`,
        minWidth: '4px',
        backgroundColor: item.color ?? '#4a90d9',
        cursor: 'grab',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.1)',
        userSelect: 'none',
        boxSizing: 'border-box',
      };
    },
    barLayouts: [] as BarLayout[],
    setContainerRef: () => {},
    ...overrides,
  };
}

// ── Items ──────────────────────────────────────────────────────────

const items: (TimelineItem & { laneIndex: number })[] = [
  mockTimelineItem(makeItem({ id: 'r1', label: 'Design', start: d(2026, 6, 1), end: d(2026, 6, 5), color: '#4a90d9', progress: 100 }), false, 0),
  mockTimelineItem(makeItem({ id: 'r2', label: 'Dev', start: d(2026, 6, 8), end: d(2026, 6, 14), color: '#7b61ff', progress: 50 }), false, 0),
];

// ── Stories ─────────────────────────────────────────────────────────

export const SingleItem: Story = {
  name: 'One item',
  args: {
    groupId: 'row-1',
    items: [items[0]],
    laneCount: 1,
    itemHeight: 30,
    resizable: true,
    movable: true,
    rowHeight: 34,
    isExpanded: true,
    timeline: makeMockTimeline(),
    sidebarWidth: 0,
  },
};

export const TwoItemsSameLane: Story = {
  name: 'Two items, non-overlapping',
  args: {
    groupId: 'row-2',
    items,
    laneCount: 1,
    itemHeight: 30,
    resizable: true,
    movable: true,
    rowHeight: 34,
    isExpanded: true,
    timeline: makeMockTimeline({ selection: { itemIds: ['r1'], linkIds: [] } }),
    sidebarWidth: 0,
  },
};

export const WithSidebar: Story = {
  name: 'With group sidebar',
  args: {
    groupId: 'g-eng',
    group: { id: 'g-eng', label: 'Engineering' },
    items,
    laneCount: 1,
    itemHeight: 30,
    resizable: true,
    movable: true,
    rowHeight: 34,
    isExpanded: true,
    showSidebar: true,
    timeline: makeMockTimeline(),
    sidebarWidth: 180,
  },
};

export const EmptyPlaceholder: Story = {
  name: 'Empty placeholder row',
  args: {
    groupId: '__empty_0',
    items: [],
    laneCount: 1,
    itemHeight: 30,
    resizable: false,
    movable: false,
    rowHeight: 34,
    isExpanded: false,
    isPlaceholder: true,
    showSidebar: true,
    timeline: makeMockTimeline(),
    sidebarWidth: 180,
  },
};

export const MultiLane: Story = {
  name: 'Two overlapping items (multi-lane)',
  args: {
    groupId: 'row-multi',
    items: [
      mockTimelineItem(makeItem({ id: 'r3', label: 'Frontend', start: d(2026, 6, 1), end: d(2026, 6, 10), color: '#4a90d9' }), false, 0),
      mockTimelineItem(makeItem({ id: 'r4', label: 'Backend', start: d(2026, 6, 3), end: d(2026, 6, 8), color: '#e06c75' }), false, 1),
    ],
    laneCount: 2,
    itemHeight: 30,
    resizable: true,
    movable: true,
    rowHeight: 68,
    isExpanded: true,
    timeline: makeMockTimeline(),
    sidebarWidth: 0,
  },
};
