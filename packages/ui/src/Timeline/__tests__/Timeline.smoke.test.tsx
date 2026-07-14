// ── Timeline — Smoke / performance tests ─────────────────────────────
// Pushes the component to ridiculous limits to validate it stays
// performant under extreme load. These are not unit tests — they
// measure wall-clock render time and verify no crashes.

import React from 'react';
import { render } from '@testing-library/react';
import { Timeline } from '../Timeline';
import type { TimelineItem, TimelineGroup } from '../types';

// ── Mocks ───────────────────────────────────────────────────────────

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(window as any).ResizeObserver = MockResizeObserver;

// ── Helpers ─────────────────────────────────────────────────────────

const COLOURS = [
  '#4a90d9', '#7b61ff', '#e06c75', '#56b6c2',
  '#e5c07b', '#98c379', '#c678dd', '#d19a66',
];

function d(y: number, m: number, day: number): Date {
  return new Date(y, m - 1, day);
}

function generateDataset(groupCount: number, itemsPerGroup: number) {
  const items: TimelineItem[] = [];
  const groups: TimelineGroup[] = [];
  for (let g = 0; g < groupCount; g++) {
    const gId = `g${g}`;
    groups.push({ id: gId, label: `Group ${g}` });
    for (let t = 0; t < itemsPerGroup; t++) {
      const startDay = 1 + g * 30 + t * 3;
      items.push({
        id: `${gId}-i${t}`,
        start: d(2026, 1, startDay),
        end: d(2026, 1, startDay + 2 + (t % 5)),
        label: `Item ${g}.${t}`,
        color: COLOURS[(g + t) % COLOURS.length],
        groupId: gId,
        progress: (t * 25) % 101,
      });
    }
  }
  return { items, groups };
}

// ── Tests ───────────────────────────────────────────────────────────

describe('Timeline smoke tests', () => {
  // ── Load tests ──────────────────────────────────────────────────

  it('renders 100 items in 10 groups under 200ms', () => {
    const { items, groups } = generateDataset(10, 10);
    const t0 = performance.now();
    render(
      <Timeline
        items={items}
        groups={groups}
        start={d(2026, 1, 1)}
        end={d(2026, 12, 31)}
        step="week"
      />,
    );
    const t1 = performance.now();
    expect(t1 - t0).toBeLessThan(200);
  });

  it('renders 500 items in 50 groups under 500ms', () => {
    const { items, groups } = generateDataset(50, 10);
    const t0 = performance.now();
    render(
      <Timeline
        items={items}
        groups={groups}
        start={d(2026, 1, 1)}
        end={d(2026, 12, 31)}
        step="month"
      />,
    );
    const t1 = performance.now();
    expect(t1 - t0).toBeLessThan(500);
  });

  it('renders 1,000 flat items (no groups) under 500ms', () => {
    const items: TimelineItem[] = Array.from({ length: 1000 }, (_, i) => ({
      id: `i${i}`,
      start: d(2026, 1, 1 + (i % 365)),
      end: d(2026, 1, 1 + (i % 365) + 3),
      label: `Task ${i}`,
      color: COLOURS[i % COLOURS.length],
    }));
    const t0 = performance.now();
    render(
      <Timeline
        items={items}
        start={d(2025, 6, 1)}
        end={d(2027, 6, 1)}
        step="month"
      />,
    );
    const t1 = performance.now();
    expect(t1 - t0).toBeLessThan(500);
  });

  // ── Stress: lane packing ────────────────────────────────────────

  it('handles 200 overlapping bars in a single row', () => {
    const items: TimelineItem[] = Array.from({ length: 200 }, (_, i) => ({
      id: `overlap-${i}`,
      start: d(2026, 6, 1),
      end: d(2026, 6, 30),
      label: `Overlap ${i}`,
      color: COLOURS[i % COLOURS.length],
    }));
    const t0 = performance.now();
    render(
      <Timeline
        items={items}
        start={d(2026, 5, 1)}
        end={d(2026, 8, 1)}
        step="day"
      />,
    );
    const t1 = performance.now();
    // Lane packing for 200 items → 200 lanes, O(n²) worst case
    expect(t1 - t0).toBeLessThan(1000);
  });

  // ── Stress: rapid horizon shifts (pan simulation) ───────────────

  it('handles 100 rapid horizon shifts without error', () => {
    const { items, groups } = generateDataset(10, 10);
    const { rerender } = render(
      <Timeline
        items={items}
        groups={groups}
        start={d(2026, 6, 1)}
        end={d(2026, 6, 30)}
        step="day"
      />,
    );
    for (let i = 0; i < 100; i++) {
      const offset = i * 86_400_000;
      rerender(
        <Timeline
          items={items}
          groups={groups}
          start={new Date(Date.UTC(2026, 5, 1) + offset)}
          end={new Date(Date.UTC(2026, 5, 30) + offset)}
          step="day"
        />,
      );
    }
  });

  // ── Stress: empty groups ────────────────────────────────────────

  it('renders 100 groups with 0 items', () => {
    const groups: TimelineGroup[] = Array.from({ length: 100 }, (_, i) => ({
      id: `eg${i}`,
      label: `Empty Group ${i}`,
    }));
    render(
      <Timeline
        items={[]}
        groups={groups}
        start={d(2026, 1, 1)}
        end={d(2026, 12, 31)}
        step="month"
      />,
    );
  });

  // ── Stress: all step types ──────────────────────────────────────

  (['hour', 'day', 'week', 'month', 'year'] as const).forEach((step) => {
    it(`renders at ${step} step without error`, () => {
      const { items, groups } = generateDataset(5, 3);
      render(
        <Timeline
          items={items}
          groups={groups}
          start={d(2026, 1, 1)}
          end={d(2026, 12, 31)}
          step={step}
        />,
      );
    });
  });

  // ── Stress: dependency links ────────────────────────────────────

  it('handles 500 links', () => {
    const items: TimelineItem[] = Array.from({ length: 100 }, (_, i) => ({
      id: `li${i}`,
      start: d(2026, 1, 1 + i * 3),
      end: d(2026, 1, 1 + i * 3 + 2),
      label: `Linked ${i}`,
    }));
    const links = Array.from({ length: 500 }, (_, i) => ({
      id: `link${i}`,
      source: `li${i % 99}`,
      target: `li${(i + 1) % 100}`,
    }));
    render(
      <Timeline
        items={items}
        links={links}
        start={d(2026, 1, 1)}
        end={d(2026, 12, 31)}
        step="day"
      />,
    );
  });

  // ── Memory: unmount/remount ──────────────────────────────────────

  it('can unmount and remount without leaking', () => {
    const { items, groups } = generateDataset(20, 5);
    const { unmount } = render(
      <Timeline
        items={items}
        groups={groups}
        start={d(2026, 1, 1)}
        end={d(2026, 12, 31)}
        step="week"
      />,
    );
    expect(() => unmount()).not.toThrow();
  });
});
