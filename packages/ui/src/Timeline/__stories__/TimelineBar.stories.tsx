// ── TimelineBar stories — All bar visual & interaction states ──────
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TimelineBar } from '../TimelineBar';
import type { TimelineBarProps } from '../TimelineBar';
import { makeItem, d } from '../__stories__/mockData';

const meta: Meta<typeof TimelineBar> = {
  title: 'Timeline / TimelineBar',
  component: TimelineBar,
  tags: ['autodocs'],
  argTypes: {
    isSelected: { control: 'boolean' },
    isDragging: { control: 'boolean' },
    resizable: { control: 'boolean' },
    onMoveStart: { action: 'moveStart' },
    onResizeLeftStart: { action: 'resizeLeftStart' },
    onResizeRightStart: { action: 'resizeRightStart' },
    onClick: { action: 'click' },
    onDoubleClick: { action: 'doubleClick' },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineBar>;

// Shared base props
const baseItem = makeItem({
  id: 'bar-1',
  label: 'Design',
  start: d(2026, 6, 1),
  end: d(2026, 6, 5),
  color: '#4a90d9',
});

const baseStyle: React.CSSProperties = {
  position: 'absolute',
  left: '60px',
  top: '8px',
  width: '200px',
  height: '30px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
};

const noop = () => {};

// ── Stories ─────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default',
  args: {
    item: baseItem,
    style: { ...baseStyle, backgroundColor: '#4a90d9' },
    isSelected: false,
    resizable: true,
    isDragging: false,
    onMoveStart: noop,
    onResizeLeftStart: noop,
    onResizeRightStart: noop,
    onClick: noop,
  },
};

export const Selected: Story = {
  name: 'Selected',
  args: {
    ...Default.args,
    isSelected: true,
  },
};

export const Dragging: Story = {
  name: 'Dragging',
  args: {
    ...Default.args,
    isDragging: true,
  },
};

export const NotResizable: Story = {
  name: 'Not resizable',
  args: {
    ...Default.args,
    resizable: false,
  },
};

export const WithProgress: Story = {
  name: 'With progress (50%)',
  args: {
    ...Default.args,
    item: makeItem({
      id: 'bar-progress',
      label: 'Development',
      start: d(2026, 6, 5),
      end: d(2026, 6, 12),
      color: '#7b61ff',
      progress: 50,
    }),
    style: { ...baseStyle, backgroundColor: '#7b61ff', width: '280px' },
  },
};

export const ProgressComplete: Story = {
  name: 'Progress complete (100%)',
  args: {
    ...Default.args,
    item: makeItem({
      id: 'bar-done',
      label: 'Complete',
      start: d(2026, 6, 1),
      end: d(2026, 6, 3),
      color: '#98c379',
      progress: 100,
    }),
    style: { ...baseStyle, backgroundColor: '#98c379', width: '100px' },
  },
};

export const TinyBar: Story = {
  name: 'Tiny bar (min width)',
  args: {
    ...Default.args,
    item: makeItem({
      id: 'bar-tiny',
      label: 'T',
      start: d(2026, 6, 2),
      end: d(2026, 6, 2),
      color: '#e06c75',
    }),
    style: { ...baseStyle, backgroundColor: '#e06c75', width: '4px', minWidth: '4px' },
  },
};

export const CustomColor: Story = {
  name: 'Custom color (orange)',
  args: {
    ...Default.args,
    item: makeItem({
      id: 'bar-orange',
      label: 'Urgent',
      start: d(2026, 6, 10),
      end: d(2026, 6, 14),
      color: '#e5c07b',
    }),
    style: { ...baseStyle, backgroundColor: '#e5c07b', width: '160px' },
  },
};

export const WithTooltip: Story = {
  name: 'With hover tooltip',
  args: {
    ...Default.args,
    item: makeItem({
      id: 'bar-tip',
      label: 'Hover me',
      start: d(2026, 6, 3),
      end: d(2026, 6, 7),
      color: '#56b6c2',
      hoverInfo: 'This task is on track — 3 days remaining',
    }),
    style: { ...baseStyle, backgroundColor: '#56b6c2', width: '160px' },
  },
};

export const CustomRender: Story = {
  name: 'Custom render prop',
  args: {
    ...Default.args,
    item: makeItem({
      id: 'bar-custom',
      label: 'Custom',
      start: d(2026, 6, 5),
      end: d(2026, 6, 10),
      color: '#333',
    }),
    style: { ...baseStyle, backgroundColor: '#333', width: '200px' },
    renderItem: (item: any) =>
      React.createElement('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: 14 } }, '🔥'),
        React.createElement('strong', null, item.label),
        React.createElement('span', { style: { fontSize: 10, opacity: 0.7 } }, '(custom)'),
      ),
  },
};

export const ResizableFalseOnItem: Story = {
  name: 'Per-item resizable=false',
  args: {
    ...Default.args,
    resizable: true,
    item: makeItem({
      id: 'bar-locked',
      label: 'Locked',
      start: d(2026, 6, 8),
      end: d(2026, 6, 12),
      color: '#888',
      resizable: false,
    }),
    style: { ...baseStyle, backgroundColor: '#888', width: '160px' },
  },
};
