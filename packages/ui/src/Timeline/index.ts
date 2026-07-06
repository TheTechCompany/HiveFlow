// ── Timeline — Barrel export ────────────────────────────────────────
//
// ⚠️  CANONICAL TIMELINE — SINGLE SOURCE OF TRUTH
//
// This is the ONE timeline implementation for the entire HiveFlow app.
// All gantt / schedule / timeline views MUST use this component or its
// GanttView wrapper.  Do NOT create custom timeline implementations —
// any fix or feature added here benefits every consumer automatically.
//
// Consumers (keep this list current):
//   - views/schedule/index.tsx          — Main schedule page
//   - views/people/single/index.tsx     — Person schedule (people view)
//   - views/estimates/single/panes/timeline.tsx — Estimate task gantt
//   - views/projects/single/panes/timeline.tsx  — Project task gantt
//   - views/recurring/single/index.tsx  — Recurring schedule editor
//   - components/TaskViews/TimelineView.tsx — Kanban→timeline (assignments)

export { Timeline } from './Timeline';
export { TimelineBar } from './TimelineBar';
export { TimelineHeader } from './TimelineHeader';
export { TimelineRow } from './TimelineRow';
export { TimelineGrid } from './TimelineGrid';
export { TimelineLinks } from './TimelineLink';
export { useTimeline } from './useTimeline';
export { getBarTop } from './utils';

export type {
  TimelineProps,
  TimelineItem,
  TimelineLink,
  TimelineGroup,
  TimelineStep,
  TimelineCallbacks,
  TimelineRenderers,
  SelectionState,
  ItemChange,
  TimelineGeometry,
  HeaderTier,
  HighlightedDay,
} from './types';

export type { UseTimelineReturn, BarLayout } from './useTimeline';
