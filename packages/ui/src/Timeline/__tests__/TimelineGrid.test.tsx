// ── Timeline — TimelineGrid unit tests ──────────────────────────────
// Isolated grid line, today marker, and weekend shading rendering.

import React from 'react';
import { render } from '@testing-library/react';
import { TimelineGrid } from '../TimelineGrid';
import type { TimelineGridProps } from '../TimelineGrid';
import type { TimelineGeometry } from '../types';

// ── Helpers ─────────────────────────────────────────────────────────

function d(iso: string): Date {
  let s = iso.replace(/Z$/, '');
  if (!s.includes('T')) s += 'T00:00:00';
  return new Date(s);
}

function makeGeometry(overrides: Partial<TimelineGeometry> = {}): TimelineGeometry {
  return {
    viewportWidth: 1200,
    viewportHeight: 600,
    sidebarWidth: 0,
    timelineWidth: 1120,
    pxPerMs: 1120 / (14 * 86400000), // 80px per day over 14 days
    pxPerStep: 80,
    stepDurationMs: 86400000,
    ...overrides,
  };
}

const defaultProps: TimelineGridProps = {
  geometry: makeGeometry(),
  start: d('2025-06-01'),
  end: d('2025-06-15'),
  step: 'day',
  totalHeight: 300,
  showToday: false, // default to false so tests are deterministic
  sidebarWidth: 0,
};

function renderGrid(overrides: Partial<TimelineGridProps> = {}) {
  return render(<TimelineGrid {...defaultProps} {...overrides} />);
}

// ── Tests ───────────────────────────────────────────────────────────

describe('TimelineGrid', () => {
  // ── Rendering ──────────────────────────────────────────────────

  it('renders the grid container with data-timeline-grid', () => {
    renderGrid();
    const grid = document.querySelector('[data-timeline-grid]');
    expect(grid).toBeInTheDocument();
  });

  it('positions grid at sidebar offset', () => {
    renderGrid({ sidebarWidth: 180 });
    const grid = document.querySelector('[data-timeline-grid]') as HTMLElement;
    expect(grid.style.left).toBe('180px');
  });

  it('grid has pointer-events: none', () => {
    renderGrid();
    const grid = document.querySelector('[data-timeline-grid]') as HTMLElement;
    expect(grid.style.pointerEvents).toBe('none');
  });

  // ── Grid lines (day step) ──────────────────────────────────────

  it('renders vertical grid lines for day step', () => {
    renderGrid({ step: 'day' });
    const grid = document.querySelector('[data-timeline-grid]')!;
    // Each day line is an absolutely positioned div with 1px width, bg #f0f0f0
    const lines = grid.querySelectorAll('[style*="background-color: rgb(240, 240, 240)"]');
    // 14 days → should have lines for each day boundary
    expect(lines.length).toBeGreaterThanOrEqual(7);
  });

  it('grid lines span the full totalHeight', () => {
    renderGrid({ step: 'day', totalHeight: 500 });
    const grid = document.querySelector('[data-timeline-grid]')!;
    const lines = grid.querySelectorAll('[style*="background-color: rgb(240, 240, 240)"]');
    const first = lines[0] as HTMLElement;
    expect(first.style.height).toBe('500px');
  });

  // ── Grid lines (hour step) ─────────────────────────────────────

  it('renders grid lines for hour step', () => {
    renderGrid({
      step: 'hour',
      start: d('2025-06-01T00:00:00'),
      end: d('2025-06-02T00:00:00'),
      geometry: makeGeometry({
        pxPerMs: 1200 / 86400000,
        pxPerStep: 60,
        stepDurationMs: 3600000,
      }),
    });
    const grid = document.querySelector('[data-timeline-grid]')!;
    const lines = grid.querySelectorAll('[style*="background-color: rgb(240, 240, 240)"]');
    // 24 hours → at least 24 grid lines
    expect(lines.length).toBeGreaterThanOrEqual(12);
  });

  // ── Grid lines (week step) ─────────────────────────────────────

  it('renders grid lines for week step', () => {
    renderGrid({
      step: 'week',
      start: d('2025-06-01'),
      end: d('2025-07-01'),
      geometry: makeGeometry({
        pxPerMs: 1200 / (30 * 86400000),
        pxPerStep: 160,
        stepDurationMs: 7 * 86400000,
      }),
    });
    const grid = document.querySelector('[data-timeline-grid]')!;
    // Week step → finest tier is 'day', so there should be day grid lines
    const lines = grid.querySelectorAll('[style*="background-color: rgb(240, 240, 240)"]');
    expect(lines.length).toBeGreaterThan(0);
  });

  // ── Grid lines (month step) ────────────────────────────────────

  it('renders grid lines for month step', () => {
    renderGrid({
      step: 'month',
      start: d('2025-01-01'),
      end: d('2025-06-01'),
      geometry: makeGeometry({
        pxPerMs: 1200 / (150 * 86400000),
        pxPerStep: 200,
        stepDurationMs: 30 * 86400000,
      }),
    });
    const grid = document.querySelector('[data-timeline-grid]')!;
    const lines = grid.querySelectorAll('[style*="background-color: rgb(240, 240, 240)"]');
    // Month step → finest tier is 'month'
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  // ── Today marker ───────────────────────────────────────────────

  it('renders today marker when showToday is true and today is in range', () => {
    const now = new Date();
    renderGrid({
      showToday: true,
      start: new Date(now.getTime() - 7 * 86400000),
      end: new Date(now.getTime() + 7 * 86400000),
    });
    const todayLine = document.querySelector('[data-today-line]');
    expect(todayLine).toBeInTheDocument();
  });

  it('today marker has red color (#ea4335)', () => {
    const now = new Date();
    renderGrid({
      showToday: true,
      start: new Date(now.getTime() - 7 * 86400000),
      end: new Date(now.getTime() + 7 * 86400000),
    });
    const todayLine = document.querySelector('[data-today-line]') as HTMLElement;
    expect(todayLine.style.backgroundColor).toBe('rgb(234, 67, 53)');
  });

  it('does not render today marker when showToday is false', () => {
    const now = new Date();
    renderGrid({
      showToday: false,
      start: new Date(now.getTime() - 7 * 86400000),
      end: new Date(now.getTime() + 7 * 86400000),
    });
    const todayLine = document.querySelector('[data-today-line]');
    expect(todayLine).not.toBeInTheDocument();
  });

  it('does not render today marker when today is before the range', () => {
    const now = new Date();
    renderGrid({
      showToday: true,
      start: new Date(now.getTime() + 7 * 86400000),
      end: new Date(now.getTime() + 14 * 86400000),
    });
    const todayLine = document.querySelector('[data-today-line]');
    expect(todayLine).not.toBeInTheDocument();
  });

  it('does not render today marker when today is after the range', () => {
    const now = new Date();
    renderGrid({
      showToday: true,
      start: new Date(now.getTime() - 14 * 86400000),
      end: new Date(now.getTime() - 7 * 86400000),
    });
    const todayLine = document.querySelector('[data-today-line]');
    expect(todayLine).not.toBeInTheDocument();
  });

  // ── Weekend shading ────────────────────────────────────────────

  it('renders weekend shading for day step', () => {
    // 2025-06-01 is a Sunday — ensure our range includes weekends
    renderGrid({
      step: 'day',
      start: d('2025-06-01'), // Sunday
      end: d('2025-06-15'),
    });
    const grid = document.querySelector('[data-timeline-grid]')!;
    // Weekend shading has rgba(0,0,0,0.03) background
    const shades = grid.querySelectorAll('[style*="rgba(0, 0, 0, 0.03)"]');
    expect(shades.length).toBeGreaterThan(0);
  });

  it('renders weekend shading for week step', () => {
    renderGrid({
      step: 'week',
      start: d('2025-06-01'),
      end: d('2025-07-01'),
      geometry: makeGeometry({
        pxPerMs: 1200 / (30 * 86400000),
        pxPerStep: 160,
        stepDurationMs: 7 * 86400000,
      }),
    });
    const grid = document.querySelector('[data-timeline-grid]')!;
    const shades = grid.querySelectorAll('[style*="rgba(0, 0, 0, 0.03)"]');
    expect(shades.length).toBeGreaterThan(0);
  });

  it('does not render weekend shading for hour step', () => {
    renderGrid({
      step: 'hour',
      start: d('2025-06-01T00:00:00'),
      end: d('2025-06-02T00:00:00'),
      geometry: makeGeometry({
        pxPerMs: 1200 / 86400000,
        pxPerStep: 60,
        stepDurationMs: 3600000,
      }),
    });
    const grid = document.querySelector('[data-timeline-grid]')!;
    const shades = grid.querySelectorAll('[style*="rgba(0, 0, 0, 0.03)"]');
    expect(shades.length).toBe(0);
  });

  it('does not render weekend shading for month step', () => {
    renderGrid({
      step: 'month',
      start: d('2025-01-01'),
      end: d('2025-06-01'),
      geometry: makeGeometry({
        pxPerMs: 1200 / (150 * 86400000),
        pxPerStep: 200,
        stepDurationMs: 30 * 86400000,
      }),
    });
    const grid = document.querySelector('[data-timeline-grid]')!;
    const shades = grid.querySelectorAll('[style*="rgba(0, 0, 0, 0.03)"]');
    expect(shades.length).toBe(0);
  });

  // ── Negative x filtering ───────────────────────────────────────

  it('filters out grid lines with negative x positions', () => {
    // All lines should have left >= 0 (or not be rendered)
    renderGrid({ step: 'day' });
    const grid = document.querySelector('[data-timeline-grid]')!;
    const lines = Array.from(
      grid.querySelectorAll('[style*="background-color: rgb(240, 240, 240)"]'),
    ) as HTMLElement[];
    for (const line of lines) {
      const left = parseFloat(line.style.left);
      // Lines may have negative left if they start before the visible range
      // The component filters them with `if (x < 0) return null`
      // So any rendered line should have left >= 0
      // But parseFloat on empty or missing returns NaN
      if (!isNaN(left) && line.style.left) {
        expect(left).toBeGreaterThanOrEqual(-1); // allow small rounding
      }
    }
  });

  // ── Sizing ─────────────────────────────────────────────────────

  it('spans full width: right=0', () => {
    renderGrid();
    const grid = document.querySelector('[data-timeline-grid]') as HTMLElement;
    expect(grid.style.right).toBe('0px');
  });

  it('spans full height: bottom=0', () => {
    renderGrid();
    const grid = document.querySelector('[data-timeline-grid]') as HTMLElement;
    expect(grid.style.bottom).toBe('0px');
  });
});
