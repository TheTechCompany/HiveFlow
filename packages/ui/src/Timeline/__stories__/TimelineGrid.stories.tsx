// ── TimelineGrid stories — Grid lines & today marker ───────────────
import type { Meta, StoryObj } from '@storybook/react';
import { TimelineGrid } from '../TimelineGrid';
import { makeGeometry, d } from '../__stories__/mockData';

const meta: Meta<typeof TimelineGrid> = {
  title: 'Timeline / TimelineGrid',
  component: TimelineGrid,
  tags: ['autodocs'],
  argTypes: {
    showToday: { control: 'boolean' },
    step: {
      control: 'select',
      options: ['hour' as const, 'day' as const, 'week' as const, 'month' as const, 'year' as const],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineGrid>;

const geom = makeGeometry({
  viewportWidth: 1100,
  sidebarWidth: 180,
  timelineWidth: 920,
  pxPerMs: 0.00005,
  pxPerStep: 80,
});

const weekGeom = makeGeometry({
  ...geom,
  pxPerMs: 0.000007,
  pxPerStep: 160,
});

const monthGeom = makeGeometry({
  ...geom,
  pxPerMs: 0.0000016,
  pxPerStep: 200,
});

// ── Stories ─────────────────────────────────────────────────────────

export const DayGrid: Story = {
  name: 'Day grid lines',
  args: {
    geometry: geom,
    start: d(2026, 6, 1),
    end: d(2026, 6, 15),
    step: 'day',
    totalHeight: 400,
    showToday: false,
    sidebarWidth: 180,
  },
};

export const WithTodayMarker: Story = {
  name: 'Today marker',
  args: {
    geometry: geom,
    start: d(2026, 1, 1),
    end: d(2026, 12, 31),
    step: 'day',
    totalHeight: 300,
    showToday: true,
    sidebarWidth: 180,
  },
};

export const WithoutToday: Story = {
  name: 'Without today marker',
  args: {
    ...DayGrid.args,
    showToday: false,
  },
};

export const WeekGridWithWeekends: Story = {
  name: 'Week grid with weekend shading',
  args: {
    geometry: weekGeom,
    start: d(2026, 6, 1),
    end: d(2026, 7, 15),
    step: 'week',
    totalHeight: 350,
    showToday: false,
    sidebarWidth: 180,
  },
};

export const MonthGrid: Story = {
  name: 'Month grid',
  args: {
    geometry: monthGeom,
    start: d(2026, 1, 1),
    end: d(2026, 12, 31),
    step: 'month',
    totalHeight: 300,
    showToday: false,
    sidebarWidth: 180,
  },
};

export const NoSidebar: Story = {
  name: 'No sidebar offset',
  args: {
    ...DayGrid.args,
    sidebarWidth: 0,
  },
};

export const TallGrid: Story = {
  name: 'Tall grid (many rows)',
  args: {
    ...DayGrid.args,
    totalHeight: 800,
  },
};
