// ── TimelineHeader stories — All time granularities ─────────────────
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TimelineHeader } from '../TimelineHeader';
import type { TimelineHeaderProps } from '../TimelineHeader';
import { makeGeometry, d } from '../__stories__/mockData';
import type { TimelineStep } from '../types';

const meta: Meta<typeof TimelineHeader> = {
  title: 'Timeline / TimelineHeader',
  component: TimelineHeader,
  tags: ['autodocs'],
  argTypes: {
    step: {
      control: 'select',
      options: ['hour' as const, 'day' as const, 'week' as const, 'month' as const, 'year' as const],
    },
    height: { control: { type: 'number', min: 30, max: 120 } },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineHeader>;

// ── Geometries per step ─────────────────────────────────────────────

const dayGeom = makeGeometry({
  viewportWidth: 1100,
  viewportHeight: 500,
  sidebarWidth: 180,
  timelineWidth: 920,
  pxPerMs: 0.00005,
  pxPerStep: 80,
  stepDurationMs: 86400000,
});

const weekGeom = makeGeometry({
  ...dayGeom,
  pxPerMs: 0.000007,
  pxPerStep: 160,
  stepDurationMs: 7 * 86400000,
});

const monthGeom = makeGeometry({
  ...dayGeom,
  pxPerMs: 0.0000016,
  pxPerStep: 200,
  stepDurationMs: 30 * 86400000,
});

const yearGeom = makeGeometry({
  ...dayGeom,
  pxPerMs: 0.00000013,
  pxPerStep: 260,
  stepDurationMs: 365 * 86400000,
});

const hourGeom = makeGeometry({
  ...dayGeom,
  pxPerMs: 0.0012,
  pxPerStep: 60,
  stepDurationMs: 3600000,
});

// ── Stories ─────────────────────────────────────────────────────────

export const DayStep: Story = {
  name: 'Day granularity',
  args: {
    geometry: dayGeom,
    start: d(2026, 6, 1),
    end: d(2026, 6, 15),
    step: 'day',
    height: 60,
  },
};

export const WeekStep: Story = {
  name: 'Week granularity',
  args: {
    geometry: weekGeom,
    start: d(2026, 6, 1),
    end: d(2026, 7, 15),
    step: 'week',
    height: 72,
  },
};

export const MonthStep: Story = {
  name: 'Month granularity',
  args: {
    geometry: monthGeom,
    start: d(2026, 1, 1),
    end: d(2026, 12, 31),
    step: 'month',
    height: 60,
  },
};

export const YearStep: Story = {
  name: 'Year granularity',
  args: {
    geometry: yearGeom,
    start: d(2024, 1, 1),
    end: d(2028, 12, 31),
    step: 'year',
    height: 60,
  },
};

export const HourStep: Story = {
  name: 'Hour granularity',
  args: {
    geometry: hourGeom,
    start: d(2026, 6, 1, 8),
    end: d(2026, 6, 2, 8),
    step: 'hour',
    height: 60,
  },
};

export const Compact: Story = {
  name: 'Compact (short height)',
  args: {
    geometry: dayGeom,
    start: d(2026, 6, 1),
    end: d(2026, 6, 15),
    step: 'day',
    height: 40,
  },
};

export const Tall: Story = {
  name: 'Tall header',
  args: {
    geometry: dayGeom,
    start: d(2026, 6, 1),
    end: d(2026, 6, 15),
    step: 'day',
    height: 100,
  },
};

export const WithCustomDayRenderer: Story = {
  name: 'Custom day renderer',
  args: {
    geometry: dayGeom,
    start: d(2026, 6, 1),
    end: d(2026, 6, 15),
    step: 'day',
    height: 60,
    renderDay: (date: Date) =>
      React.createElement('span', { style: { color: date.getDay() === 0 || date.getDay() === 6 ? '#ea4335' : '#999' } },
        date.getDay() === 0 ? '⛔' : date.getDay() === 6 ? '🎉' : ''),
  },
};
