// ── Timeline — Pure utility functions ───────────────────────────────
// No React dependencies; easily testable.

import moment from 'moment';
import type { TimelineItem, TimelineStep, HeaderTier, TimelineGeometry } from './types';
import { STEP_DURATIONS, PX_PER_STEP } from './constants';

// ── Date helpers ────────────────────────────────────────────────────

/** Get the start of a step unit containing `date`. */
export function startOf(date: Date, step: TimelineStep): Date {
  return moment(date).startOf(step as moment.unitOfTime.StartOf).toDate();
}

/** Get the end of a step unit containing `date`. */
export function endOf(date: Date, step: TimelineStep): Date {
  return moment(date).endOf(step as moment.unitOfTime.StartOf).toDate();
}

/** Add `count` step units to `date`. */
export function addStep(date: Date, step: TimelineStep, count: number): Date {
  return moment(date).add(count, step as moment.unitOfTime.DurationConstructor).toDate();
}

/** Difference in step units between two dates (end - start). */
export function diffStep(start: Date, end: Date, step: TimelineStep): number {
  return moment(end).diff(moment(start), step as moment.unitOfTime.Diff);
}

/** Format a date with a moment format string. */
export function formatDate(date: Date, format: string): string {
  return moment(date).format(format);
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
    cursor = moment(cursor).add(1, tier.unit as moment.unitOfTime.DurationConstructor).toDate();
  }

  return intervals;
}

// ── Geometry ────────────────────────────────────────────────────────

/** Compute timeline geometry from props and container size. */
export function computeGeometry(
  viewportWidth: number,
  viewportHeight: number,
  start: Date,
  end: Date,
  step: TimelineStep,
  sidebarWidth: number,
  stepCount: number,
): TimelineGeometry {
  const totalMs = moment(end).diff(moment(start), 'milliseconds');
  // Content canvas is sized by step count × fixed px-per-step,
  // so the timeline extends beyond the viewport and panning reveals hidden content.
  const canvasWidth = stepCount * PX_PER_STEP[step];
  const timelineWidth = Math.max(canvasWidth, viewportWidth - sidebarWidth);
  const pxPerMs = totalMs > 0 ? timelineWidth / totalMs : 0;
  const stepDurationMs = stepDuration(step, 1);
  const pxPerStep = pxPerMs * stepDurationMs;

  return {
    viewportWidth,
    viewportHeight,
    sidebarWidth,
    timelineWidth,
    pxPerMs,
    pxPerStep,
    stepDurationMs,
  };
}

// ── Screen ↔ date conversion ────────────────────────────────────────

/** Convert a date to an x-offset (relative to timeline area). */
export function dateToX(date: Date, start: Date, pxPerMs: number): number {
  return moment(date).diff(moment(start), 'milliseconds') * pxPerMs;
}

/** Convert an x-offset to a date. */
export function xToDate(x: number, start: Date, pxPerMs: number): Date {
  const ms = x / pxPerMs;
  return moment(start).add(ms, 'milliseconds').toDate();
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
