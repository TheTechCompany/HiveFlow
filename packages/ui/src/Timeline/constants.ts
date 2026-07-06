// ── Timeline — Constants ────────────────────────────────────────────

import type { TimelineStep, HeaderTier } from './types';

/** Default item (bar) height in px. */
export const DEFAULT_ITEM_HEIGHT = 30;

/** Vertical gap between lanes in px — added to each lane's height. */
export const LANE_GAP = 8;

/** Default group header row height in px. */
export const DEFAULT_GROUP_HEADER_HEIGHT = 40;

/** Default time-axis header height in px. */
export const DEFAULT_HEADER_HEIGHT = 60;

/** Minimum bar width in px so tiny bars remain interactive. */
export const DEFAULT_MIN_BAR_WIDTH = 4;

/** Default sidebar width in px (group labels). */
export const DEFAULT_SIDEBAR_WIDTH = 180;

/** Duration of one step unit in milliseconds. */
export const STEP_DURATIONS: Record<TimelineStep, number> = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000, // approximate
  year: 365 * 24 * 60 * 60 * 1000, // approximate
};

/** Default number of step units visible when stepCount is not specified. */
export const DEFAULT_STEP_COUNTS: Record<TimelineStep, number> = {
  hour: 24,
  day: 14,
  week: 12,
  month: 12,
  year: 5,
};

/** Header tiers for each step granularity. */
export const HEADER_TIERS: Record<TimelineStep, HeaderTier[]> = {
  hour: [
    { unit: 'day', format: 'ddd D MMM' },
    { unit: 'hour', format: 'HH:mm' },
  ],
  day: [
    { unit: 'month', format: 'MMMM YYYY' },
    { unit: 'day', format: 'ddd D' },
  ],
  week: [
    { unit: 'month', format: 'MMMM YYYY' },
    { unit: 'week', format: '[W]W' },
    { unit: 'day', format: 'ddd D' },
  ],
  month: [
    { unit: 'year', format: 'YYYY' },
    { unit: 'month', format: 'MMMM' },
  ],
  year: [
    { unit: 'year', format: 'YYYY' },
    { unit: 'month', format: 'MMM' },
  ],
};

/** Resize handle width in px. */
export const RESIZE_HANDLE_WIDTH = 8;

/** Minimum viewport width before we stop rendering extras. */
export const MIN_VIEWPORT_WIDTH = 200;

/** Pixel width per step unit — the timeline content canvas is sized by stepCount × PX_PER_STEP, not the viewport. */
export const PX_PER_STEP: Record<TimelineStep, number> = {
  hour: 60,
  day: 80,
  week: 160,
  month: 200,
  year: 260,
};
