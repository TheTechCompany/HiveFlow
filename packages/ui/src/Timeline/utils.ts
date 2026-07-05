// ── Timeline — Pure utility functions ───────────────────────────────
// No React dependencies; easily testable.

import type { TimelineItem, TimelineStep, HeaderTier, TimelineGeometry } from './types';
import { STEP_DURATIONS, PX_PER_STEP } from './constants';

// ── Date helpers ────────────────────────────────────────────────────

const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;

/** Get the start of a step unit containing `date` (native, no moment). */
export function startOf(date: Date, step: TimelineStep): Date {
  const d = new Date(date);
  switch (step) {
    case 'hour':  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
    case 'day':   return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    case 'week': { const dow = d.getDay(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow); }
    case 'month': return new Date(d.getFullYear(), d.getMonth(), 1);
    case 'year':  return new Date(d.getFullYear(), 0, 1);
    default:      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
}

/** Get the end of a step unit containing `date` (native, no moment). */
export function endOf(date: Date, step: TimelineStep): Date {
  const d = new Date(date);
  switch (step) {
    case 'hour':  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 59, 59, 999);
    case 'day':   return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    case 'week': {
      const sat = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (6 - d.getDay()));
      return new Date(sat.getFullYear(), sat.getMonth(), sat.getDate(), 23, 59, 59, 999);
    }
    case 'month': return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    case 'year':  return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
    default:      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  }
}

/** Add `count` step units to `date` (native, no moment). */
export function addStep(date: Date, step: TimelineStep, count: number): Date {
  const d = new Date(date);
  switch (step) {
    case 'hour':  return new Date(d.getTime() + count * 3_600_000);
    case 'day':   return new Date(d.getTime() + count * DAY_MS);
    case 'week':  return new Date(d.getTime() + count * WEEK_MS);
    case 'month': return new Date(d.getFullYear(), d.getMonth() + count, d.getDate());
    case 'year':  return new Date(d.getFullYear() + count, d.getMonth(), d.getDate());
    default:      return new Date(d.getTime() + count * DAY_MS);
  }
}

/** Difference in step units between two dates (end - start). */
export function diffStep(start: Date, end: Date, step: TimelineStep): number {
  const ms = end.getTime() - start.getTime();
  switch (step) {
    case 'hour':  return Math.round(ms / 3_600_000);
    case 'day':   return Math.round(ms / DAY_MS);
    case 'week':  return Math.round(ms / WEEK_MS);
    case 'month': return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    case 'year':  return end.getFullYear() - start.getFullYear();
    default:      return Math.round(ms / DAY_MS);
  }
}

/** Format a date using Intl.DateTimeFormat for the tier format patterns we use. */
export function formatDate(date: Date, format: string): string {
  const d = new Date(date);
  // Map known tier format strings to Intl.DateTimeFormat options.
  // The formats used by HEADER_TIERS in constants.ts are:
  //   'ddd D' | 'MMMM YYYY' | 'YYYY' | 'MMM' | 'HH:mm' | '[W]W'
  if (format === 'YYYY') return String(d.getFullYear());
  if (format === 'MMMM YYYY') {
    return `${d.toLocaleDateString('en', { month: 'long' })} ${d.getFullYear()}`;
  }
  if (format === 'MMMM') return d.toLocaleDateString('en', { month: 'long' });
  if (format === 'MMM') return d.toLocaleDateString('en', { month: 'short' });
  if (format === 'ddd D') {
    return `${d.toLocaleDateString('en', { weekday: 'short' })} ${d.getDate()}`;
  }
  if (format === 'HH:mm') {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  if (format === '[W]W') {
    // ISO week number
    const temp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (temp.getUTCDay() + 6) % 7;
    temp.setUTCDate(temp.getUTCDate() - dayNum + 3);
    const firstThursday = temp.getTime();
    temp.setUTCMonth(0, 1);
    if (temp.getUTCDay() !== 4) temp.setUTCMonth(0, 1 + ((4 - temp.getUTCDay()) + 7) % 7);
    const weekNum = Math.ceil((firstThursday - temp.getTime()) / (7 * 86_400_000)) + 1;
    return `W${weekNum}`;
  }
  // Fallback: return the format string literally (shouldn't happen)
  return format;
}

/** Return the duration of `count` step units in milliseconds. */
export function stepDuration(step: TimelineStep, count: number = 1): number {
  // For variable-length months we use an approximate; callers needing
  // per-month precision should use addStep / diffStep instead.
  return STEP_DURATIONS[step] * count;
}

// ── Tier iteration ──────────────────────────────────────────────────

/** Generate all time intervals for a header tier. */
export function generateTierIntervals(
  start: Date,
  end: Date,
  tier: HeaderTier,
): Array<{ start: Date; end: Date; label: string }> {
  const intervals: Array<{ start: Date; end: Date; label: string }> = [];
  let cursor = startOf(start, tier.unit);

  while (cursor < end) {
    const next = endOf(cursor, tier.unit);
    intervals.push({
      start: new Date(cursor),
      end: new Date(next),
      label: formatDate(cursor, tier.format),
    });
    cursor = addStep(cursor, tier.unit, 1);
  }

  return intervals;
}

// ── Geometry ────────────────────────────────────────────────────────

/** Compute timeline geometry from props and container size.
 *
 * pxPerMs is a step-level constant (PX_PER_STEP / step duration), NOT
 * derived from the consumer's date range.  This guarantees every step unit
 * (hour, day, week, …) gets a stable pixel width regardless of the viewport
 * or the consumer-supplied `end` date.
 *
 * effectiveEndMs is the right edge of the visible date window in epoch ms,
 * consistent with pxPerMs and timelineWidth.  Callers should use this value
 * (not the consumer-supplied `end`) for rendering headers, grids, and
 * visibility filtering. */
export function computeGeometry(
  viewportWidth: number,
  viewportHeight: number,
  start: Date,
  _end: Date,
  step: TimelineStep,
  sidebarWidth: number,
  stepCount: number,
): TimelineGeometry {
  const stepDurationMs = STEP_DURATIONS[step];
  // Fixed pixels-per-ms for this step granularity — together with
  // timelineWidth this determines how many step units are visible.
  const pxPerMs = PX_PER_STEP[step] / stepDurationMs;

  // Content canvas is sized by step count × fixed px-per-step,
  // so the timeline extends beyond the viewport and panning reveals hidden content.
  const canvasWidth = stepCount * PX_PER_STEP[step];
  const timelineWidth = Math.max(canvasWidth, viewportWidth - sidebarWidth);
  const pxPerStep = pxPerMs * stepDurationMs; // === PX_PER_STEP[step]

  // The right edge of the visible window, consistent with geometry.
  const effectiveEndMs = start.getTime() + timelineWidth / pxPerMs;

  return {
    viewportWidth,
    viewportHeight,
    sidebarWidth,
    timelineWidth,
    pxPerMs,
    pxPerStep,
    stepDurationMs,
    effectiveEndMs,
  };
}

// ── Screen ↔ date conversion ────────────────────────────────────────

/** Convert a date to an x-offset (relative to timeline area). */
export function dateToX(date: Date, start: Date, pxPerMs: number): number {
  return (date.getTime() - start.getTime()) * pxPerMs;
}

/** Convert an x-offset to a date. */
export function xToDate(x: number, start: Date, pxPerMs: number): Date {
  return new Date(start.getTime() + x / pxPerMs);
}

/** Snap a date to the nearest step boundary. */
export function snapToStep(date: Date, step: TimelineStep): Date {
  const start = startOf(date, step);
  const end = endOf(date, step);
  const diffStart = Math.abs(date.getTime() - start.getTime());
  const diffEnd = Math.abs(end.getTime() - date.getTime());
  return diffStart <= diffEnd ? start : end;
}

// ── Overlap detection ───────────────────────────────────────────────

/** Check if two items overlap in time. */
export function itemsOverlap(a: { start: Date; end: Date }, b: { start: Date; end: Date }): boolean {
  return a.start < b.end && b.start < a.end;
}

// ── Lane packing (greedy, non-overlapping per lane) ─────────────────

export interface LanesResult {
  /** Items annotated with their assigned lane index. */
  items: (TimelineItem & { laneIndex: number })[];
  /** Number of lanes needed. */
  laneCount: number;
}

/**
 * Pack items into non-overlapping lanes within a single row.
 * Uses a greedy algorithm: sort by start time, place each item in the
 * first lane that has no overlap.
 */
export function packLanes(items: TimelineItem[]): LanesResult {
  if (items.length === 0) return { items: [], laneCount: 0 };

  // Sort by start ascending, then by duration descending (longer first = better packing).
  const sorted = [...items].sort((a, b) => {
    const diff = a.start.getTime() - b.start.getTime();
    if (diff !== 0) return diff;
    return (b.end.getTime() - b.start.getTime()) - (a.end.getTime() - a.start.getTime());
  });

  const lanes: { end: Date }[] = [];
  const result: (TimelineItem & { laneIndex: number })[] = [];

  for (const item of sorted) {
    let placed = false;
    for (let i = 0; i < lanes.length; i++) {
      // Lane i is free if its last item ends before our start.
      if (lanes[i].end <= item.start) {
        lanes[i].end = item.end;
        result.push({ ...item, laneIndex: i });
        placed = true;
        break;
      }
    }
    if (!placed) {
      lanes.push({ end: item.end });
      result.push({ ...item, laneIndex: lanes.length - 1 });
    }
  }

  return { items: result, laneCount: lanes.length };
}

// ── Clamping ────────────────────────────────────────────────────────

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ── Visibility filter ───────────────────────────────────────────────

/** Return items whose time range intersects [visibleStart, visibleEnd]. */
export function filterVisibleItems(
  items: TimelineItem[],
  visibleStart: Date,
  visibleEnd: Date,
): TimelineItem[] {
  return items.filter((item) => item.end > visibleStart && item.start < visibleEnd);
}
