// ── Timeline — Utils unit tests ─────────────────────────────────────

import moment from 'moment';
import {
  startOf,
  endOf,
  addStep,
  diffStep,
  formatDate,
  stepDuration,
  generateTierIntervals,
  computeGeometry,
  dateToX,
  xToDate,
  snapToStep,
  itemsOverlap,
  packLanes,
  clamp,
  filterVisibleItems,
} from '../utils';

// ── Helpers ─────────────────────────────────────────────────────────

/** Create a Date in LOCAL time, even for date-only strings.
 *  ECMAScript treats '2025-06-09' as UTC, so we add T00:00:00. */
function d(iso: string): Date {
  let s = iso.replace(/Z$/, '');
  // If no time component, add T00:00:00 so it's parsed as local
  if (!s.includes('T')) {
    s += 'T00:00:00';
  }
  return new Date(s);
}

// ── startOf ─────────────────────────────────────────────────────────

describe('startOf', () => {
  it('rounds to start of day', () => {
    const result = startOf(d('2025-06-15T14:30:00'), 'day');
    // start of day in local time
    const expected = new Date(2025, 5, 15); // June = 5 (0-indexed)
    expect(result.getTime()).toBe(expected.getTime());
  });

  it('rounds to start of month', () => {
    const result = startOf(d('2025-06-15T14:30:00'), 'month');
    const expected = new Date(2025, 5, 1);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it('rounds to start of week', () => {
    const result = startOf(d('2025-06-15T14:30:00'), 'week');
    // moment's startOf('week') is locale-dependent (Sunday or Monday)
    // Just verify it's <= the input date and the right day
    expect(result.getTime()).toBeLessThanOrEqual(d('2025-06-15T14:30:00').getTime());
    expect(result.getDay()).toBe(
      moment.localeData().firstDayOfWeek(),
    );
  });

  it('rounds to start of hour', () => {
    const result = startOf(d('2025-06-15T14:30:00'), 'hour');
    const expected = new Date(2025, 5, 15, 14, 0, 0, 0);
    expect(result.getTime()).toBe(expected.getTime());
  });
});

// ── endOf ───────────────────────────────────────────────────────────

describe('endOf', () => {
  it('rounds to end of day', () => {
    const result = endOf(d('2025-06-15T14:30:00'), 'day');
    const expected = new Date(2025, 5, 15, 23, 59, 59, 999);
    expect(result.getTime()).toBe(expected.getTime());
  });
});

// ── addStep ─────────────────────────────────────────────────────────

describe('addStep', () => {
  it('adds days', () => {
    const result = addStep(d('2025-06-15T10:00:00'), 'day', 3);
    const expected = new Date(2025, 5, 18, 10, 0, 0, 0);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it('adds negative months', () => {
    const result = addStep(d('2025-06-15T10:00:00'), 'month', -2);
    const expected = new Date(2025, 3, 15, 10, 0, 0, 0); // April = 3
    expect(result.getTime()).toBe(expected.getTime());
  });
});

// ── diffStep ────────────────────────────────────────────────────────

describe('diffStep', () => {
  it('counts days between dates', () => {
    const diff = diffStep(d('2025-06-10'), d('2025-06-15'), 'day');
    expect(diff).toBe(5);
  });

  it('returns negative when end is before start', () => {
    const diff = diffStep(d('2025-06-15'), d('2025-06-10'), 'day');
    expect(diff).toBe(-5);
  });
});

// ── formatDate ──────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats with moment tokens', () => {
    expect(formatDate(d('2025-06-15'), 'YYYY-MM-DD')).toBe('2025-06-15');
    expect(formatDate(d('2025-06-15'), 'MMMM')).toBe('June');
  });
});

// ── stepDuration ────────────────────────────────────────────────────

describe('stepDuration', () => {
  it('returns ms for one hour', () => {
    expect(stepDuration('hour')).toBe(60 * 60 * 1000);
  });

  it('returns ms for 3 days', () => {
    expect(stepDuration('day', 3)).toBe(3 * 24 * 60 * 60 * 1000);
  });
});

// ── generateTierIntervals ───────────────────────────────────────────

describe('generateTierIntervals', () => {
  it('generates day intervals for a week', () => {
    const intervals = generateTierIntervals(
      d('2025-06-09'), // Monday
      d('2025-06-16'), // next Monday
      { unit: 'day', format: 'ddd D' },
    );
    expect(intervals.length).toBe(7);
    expect(intervals[0].label).toContain('Mon');
    expect(intervals[6].label).toContain('Sun');
  });

  it('generates month intervals for a year', () => {
    const intervals = generateTierIntervals(
      d('2025-01-01'),
      d('2025-04-01'),
      { unit: 'month', format: 'MMM' },
    );
    expect(intervals.length).toBe(3);
    expect(intervals.map((i) => i.label)).toEqual(['Jan', 'Feb', 'Mar']);
  });

  it('returns empty for zero-length range', () => {
    const intervals = generateTierIntervals(
      d('2025-06-15'),
      d('2025-06-15'),
      { unit: 'day', format: 'D' },
    );
    expect(intervals.length).toBe(0);
  });
});

// ── computeGeometry ─────────────────────────────────────────────────

describe('computeGeometry', () => {
  it('computes geometry for a 14-day viewport', () => {
    const start = d('2025-06-01');
    const end = d('2025-06-15');
    const geo = computeGeometry(1000, 600, start, end, 'day', 180, 14);

    expect(geo.viewportWidth).toBe(1000);
    expect(geo.viewportHeight).toBe(600);
    expect(geo.sidebarWidth).toBe(180);
    // Content canvas: 14 days × 80px/day = 1120px, which is > viewportWidth - sidebarWidth (820)
    expect(geo.timelineWidth).toBe(1120);
    expect(geo.pxPerMs).toBeGreaterThan(0);
    expect(geo.pxPerStep).toBeGreaterThan(0);
  });

  it('handles zero-width viewport', () => {
    const geo = computeGeometry(0, 0, d('2025-01-01'), d('2025-01-02'), 'day', 0, 14);
    // canvasWidth = 14 * 80 = 1120, viewport-sb = 0, so max = 1120
    expect(geo.timelineWidth).toBe(1120);
    expect(geo.pxPerMs).toBeGreaterThan(0);
  });

  it('uses viewport width when it is larger than canvas', () => {
    const geo = computeGeometry(2000, 600, d('2025-06-01'), d('2025-06-02'), 'day', 0, 1);
    // canvasWidth = 1 * 80 = 80, viewportWidth = 2000 → use 2000
    expect(geo.timelineWidth).toBe(2000);
  });
});

// ── dateToX / xToDate ───────────────────────────────────────────────

describe('dateToX / xToDate', () => {
  const start = d('2025-06-01');
  const end = d('2025-06-11'); // 10 days
  const pxPerMs = 800 / (10 * 86400000); // 800px for 10 days

  it('converts start date to x=0', () => {
    expect(dateToX(start, start, pxPerMs)).toBe(0);
  });

  it('round-trips a date', () => {
    const date = d('2025-06-05T12:00:00Z');
    const x = dateToX(date, start, pxPerMs);
    const back = xToDate(x, start, pxPerMs);
    expect(back.getTime()).toBeCloseTo(date.getTime(), -2); // within 100ms
  });

  it('converts end date to full width', () => {
    const x = dateToX(end, start, pxPerMs);
    expect(x).toBeCloseTo(800, 0);
  });
});

// ── snapToStep ──────────────────────────────────────────────────────

describe('snapToStep', () => {
  it('snaps to nearest day', () => {
    const date = d('2025-06-15T14:30:00');
    const snapped = snapToStep(date, 'day');
    // 14:30 is closer to end of day (23:59:59.999) than start (00:00)
    // distStart = 14.5h = 52200000ms, distEnd = 9.5h = 34200000ms → snaps to end
    const expected = new Date(2025, 5, 15, 23, 59, 59, 999);
    expect(snapped.getTime()).toBe(expected.getTime());
  });

  it('snaps to start of day for midnight', () => {
    const date = d('2025-06-15T00:00:00');
    const snapped = snapToStep(date, 'day');
    const expected = new Date(2025, 5, 15, 0, 0, 0, 0);
    expect(snapped.getTime()).toBe(expected.getTime());
  });
});

// ── itemsOverlap ────────────────────────────────────────────────────

describe('itemsOverlap', () => {
  it('detects overlapping ranges', () => {
    const a = { start: d('2025-06-10'), end: d('2025-06-15') };
    const b = { start: d('2025-06-12'), end: d('2025-06-20') };
    expect(itemsOverlap(a, b)).toBe(true);
  });

  it('returns false for non-overlapping ranges', () => {
    const a = { start: d('2025-06-10'), end: d('2025-06-12') };
    const b = { start: d('2025-06-12'), end: d('2025-06-15') };
    // End of a equals start of b → no overlap (exclusive end)
    expect(itemsOverlap(a, b)).toBe(false);
  });

  it('returns true when one contains the other', () => {
    const a = { start: d('2025-06-01'), end: d('2025-06-30') };
    const b = { start: d('2025-06-10'), end: d('2025-06-15') };
    expect(itemsOverlap(a, b)).toBe(true);
  });

  it('a range always overlaps itself', () => {
    const a = { start: d('2025-06-10'), end: d('2025-06-15') };
    expect(itemsOverlap(a, a)).toBe(true);
  });
});

// ── packLanes ───────────────────────────────────────────────────────

describe('packLanes', () => {
  function item(
    id: string,
    start: string,
    end: string,
  ): import('../types').TimelineItem {
    return { id, start: d(start), end: d(end) };
  }

  it('returns empty for no items', () => {
    const result = packLanes([]);
    expect(result.items).toEqual([]);
    expect(result.laneCount).toBe(0);
  });

  it('places non-overlapping items in the same lane', () => {
    const items = [
      item('1', '2025-06-10', '2025-06-12'),
      item('2', '2025-06-13', '2025-06-15'),
    ];
    const result = packLanes(items);
    expect(result.laneCount).toBe(1);
    expect(result.items[0].laneIndex).toBe(0);
    expect(result.items[1].laneIndex).toBe(0);
  });

  it('splits overlapping items into separate lanes', () => {
    const items = [
      item('1', '2025-06-10', '2025-06-15'),
      item('2', '2025-06-12', '2025-06-20'),
    ];
    const result = packLanes(items);
    expect(result.laneCount).toBe(2);
    // First item (earlier start) gets lane 0
    const item1 = result.items.find((i) => i.id === '1')!;
    const item2 = result.items.find((i) => i.id === '2')!;
    expect(item1.laneIndex).toBe(0);
    expect(item2.laneIndex).toBe(1);
  });

  it('packs complex overlapping sets efficiently', () => {
    // Three items: two overlap with each other, third is after both
    const items = [
      item('a', '2025-06-10', '2025-06-20'),
      item('b', '2025-06-12', '2025-06-14'),
      item('c', '2025-06-22', '2025-06-25'),
    ];
    const result = packLanes(items);
    // a and b overlap → 2 lanes; c doesn't overlap with either → fits in lane 0
    const a = result.items.find((i) => i.id === 'a')!;
    const b = result.items.find((i) => i.id === 'b')!;
    const c = result.items.find((i) => i.id === 'c')!;
    expect(a.laneIndex).toBe(0);
    expect(b.laneIndex).toBe(1);
    expect(c.laneIndex).toBe(0); // reuses lane 0 after a ends
  });

  it('preserves all items', () => {
    const items = Array.from({ length: 20 }, (_, i) =>
      item(`${i}`, `2025-06-${10 + i}`, `2025-06-${12 + i}`),
    );
    const result = packLanes(items);
    expect(result.items.length).toBe(20);
  });
});

// ── clamp ───────────────────────────────────────────────────────────

describe('clamp', () => {
  it('clamps below min', () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });

  it('clamps above max', () => {
    expect(clamp(200, 0, 100)).toBe(100);
  });

  it('returns value within range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });
});

// ── filterVisibleItems ──────────────────────────────────────────────

describe('filterVisibleItems', () => {
  const items: import('../types').TimelineItem[] = [
    { id: '1', start: d('2025-06-10'), end: d('2025-06-15') },
    { id: '2', start: d('2025-06-20'), end: d('2025-06-25') },
    { id: '3', start: d('2025-06-05'), end: d('2025-06-06') },
  ];

  it('returns items within the visible range', () => {
    const visible = filterVisibleItems(
      items,
      d('2025-06-08'),
      d('2025-06-18'),
    );
    expect(visible.map((i) => i.id)).toEqual(['1']);
  });

  it('includes items that partially overlap', () => {
    const visible = filterVisibleItems(
      items,
      d('2025-06-14'),
      d('2025-06-21'),
    );
    // Item 1 ends 6/15 (overlaps), item 2 starts 6/20 (overlaps)
    expect(visible.map((i) => i.id)).toEqual(['1', '2']);
  });

  it('returns empty when nothing is visible', () => {
    const visible = filterVisibleItems(
      items,
      d('2025-07-01'),
      d('2025-07-10'),
    );
    expect(visible.length).toBe(0);
  });
});
