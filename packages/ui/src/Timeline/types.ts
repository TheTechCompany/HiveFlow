// ── Timeline — Unified types ────────────────────────────────────────
// Covers both Gantt-chart (project timeline) and lane-based schedule use cases.

/** A highlighted day on the timeline grid (public holiday, important date, etc.). */
export interface HighlightedDay {
  /** The date to highlight. Only the date portion is used (time is ignored). */
  date: Date;
  /** Optional label shown in a tooltip on hover. */
  label?: string;
  /** CSS background color for the highlight strip. Overrides the preset type color. */
  color?: string;
  /** Preset type — maps to a default color if `color` is not provided. */
  type?: 'holiday' | 'important';
}

/** A single bar on the timeline. */
export interface TimelineItem {
  /** Unique identifier. */
  id: string;

  /** Bar start date. */
  start: Date;

  /** Bar end date (exclusive). Must be > start. */
  end: Date;

  /** Display label. */
  label?: string;

  /** Background colour (CSS string). */
  color?: string;

  /** Which group / row this item belongs to. Falls back to `_rowIndex`. */
  groupId?: string;

  /** Zero-based row index when groupId is not provided. */
  _rowIndex?: number;

  /** Stacking order within a row (higher = on top). */
  zIndex?: number;

  /** Whether resize handles are shown. Default true. */
  resizable?: boolean;

  /** Whether the bar is selectable. Default true. */
  selectable?: boolean;

  /** Whether the bar is movable via drag. Default true. */
  movable?: boolean;

  /** Arbitrary payload for custom renderers. */
  data?: Record<string, unknown>;

  // ── Gantt-specific ──────────────────────────────────────────────

  /** Collapsible content rendered below the bar when expanded. */
  collapsibleContent?: React.ReactNode;

  /** Tooltip / hover info string. */
  hoverInfo?: string;

  /** Progress 0-100 (draws a fill inside the bar). */
  progress?: number;

  /** Whether the label is always visible (vs on hover). */
  showLabel?: boolean;
}

/** A dependency link between two items. */
export interface TimelineLink {
  id: string;
  /** Item id where the arrow starts. */
  source: string;
  /** Item id where the arrow ends. */
  target: string;
  /** Optional stroke colour. */
  color?: string;
}

/** A logical grouping of items (rows). */
export interface TimelineGroup {
  id: string;
  /** Header content rendered in the sidebar. */
  label?: string;
  /** Extra content rendered in the group header row. */
  headerContent?: React.ReactNode;
  /** Items belonging to this group. */
  items?: TimelineItem[];
}

/** Time granularity for the horizontal axis. */
export type TimelineStep = 'hour' | 'day' | 'week' | 'month' | 'year';

/** A label tier on the time axis (e.g. months row + days row). */
export interface HeaderTier {
  /** Moment.js unit for this tier. */
  unit: TimelineStep;
  /** Format string for the label. */
  format: string;
}

/** Selection state. */
export interface SelectionState {
  /** Selected item ids. */
  itemIds: string[];
  /** Selected link ids. */
  linkIds: string[];
}

/** Result of a bar move/resize operation. */
export interface ItemChange {
  id: string;
  start?: Date;
  end?: Date;
  groupId?: string;
}

/** Callbacks for user interactions. */
export interface TimelineCallbacks {
  /** Fired after a bar is moved or resized (final position). */
  onItemChange?: (change: ItemChange) => void;
  /** Fired during a bar move/resize (intermediate position). */
  onItemChanging?: (change: ItemChange) => void;
  /** Fired when an item or link is selected. */
  onSelect?: (selection: SelectionState) => void;
  /** Fired when a new link is created by the user. */
  onLinkCreate?: (link: Omit<TimelineLink, 'id'>) => void;
  /** Fired when the user requests item creation at a position. */
  onItemCreate?: (start: Date, end: Date, groupId?: string) => void;
  /** Fired when the visible horizon changes (scroll/zoom). */
  onHorizonChange?: (start: Date, end: Date) => void;
  /** Delete selected items (keyboard shortcut). */
  onDelete?: (itemIds: string[]) => void;
  /** Copy selected items. */
  onCopy?: (itemIds: string[]) => void;
  /** Paste items at a date. */
  onPaste?: (date: Date) => void;
  /** Navigate the visible date range. */
  onNavigate?: (direction: 'prev' | 'next' | 'today') => void;
  /** Fired when an item is double-clicked. */
  onItemDoubleClick?: (itemId: string) => void;
}

/** Render prop overrides. */
export interface TimelineRenderers {
  /** Custom bar content. */
  renderItem?: (item: TimelineItem) => React.ReactNode;
  /** Custom group header (sidebar). */
  renderGroupHeader?: (group: TimelineGroup, expanded: boolean) => React.ReactNode;
  /** Custom sidebar header row (replaces "Groups"/"Items" label). */
  renderSidebarHeader?: () => React.ReactNode;
  /** Custom time-axis cell (for dayStatus / dayInfo equivalents). */
  renderDay?: (date: Date, step: TimelineStep) => React.ReactNode;
  /** Loading placeholder. */
  renderLoading?: () => React.ReactNode;
}

/** Main component props. */
export interface TimelineProps {
  // ── Data ────────────────────────────────────────────────────────
  items: TimelineItem[];
  links?: TimelineLink[];
  groups?: TimelineGroup[];

  // ── Time axis ───────────────────────────────────────────────────
  /** Left edge of the visible window. */
  start: Date;
  /** Right edge of the visible window. */
  end: Date;
  /** Time granularity. */
  step: TimelineStep;
  /** Number of step units in the viewport (controls zoom). */
  stepCount?: number;

  // ── Appearance ──────────────────────────────────────────────────
  /** Height of a single bar in px. Default 30. */
  itemHeight?: number;
  /** Height of a group header row in px. Default 40. */
  groupHeaderHeight?: number;
  /** Height of the time-axis header in px. Default 60. */
  headerHeight?: number;
  /** Minimum bar width in px (avoids invisible bars). Default 4. */
  minBarWidth?: number;

  // ── Behaviour ───────────────────────────────────────────────────
  /** Whether bars can be resized by dragging edges. Default true. */
  resizable?: boolean;
  /** Whether bars can be moved by dragging. Default true. */
  movable?: boolean;
  /** Whether multiple items can be selected. Default true. */
  multiSelect?: boolean;
  /** Show dependency links between bars. Default true. */
  showLinks?: boolean;
  /** Whether to show the "today" marker line. Default true. */
  showToday?: boolean;
  /** Whether the timeline fills the parent container (flex: 1). Default true. */
  fitContainer?: boolean;
  /** Read-only mode — no drag, resize, or create. Default false. */
  readonly?: boolean;
  /** Override sidebar width in px. Set to 0 to hide the sidebar entirely. */
  sidebarWidth?: number;
  /** When false, sidebar rows have no internal padding/border —
   *  the renderGroupHeader callback owns all styling. Default true. */
  sidebarPadding?: boolean;
  /** When true, body uses overflow:visible so a parent can handle scrolling. */
  fullHeight?: boolean;
  /** When true, the date header sticks to the top of the scroll container. */
  stickyHeader?: boolean;

  /** Days to highlight on the grid (public holidays, important dates, etc.).
   *  Rendered as coloured vertical strips behind the grid lines and as
   *  small indicator dots in the header. */
  highlightedDays?: HighlightedDay[];

  // ── Callbacks ───────────────────────────────────────────────────
  callbacks?: TimelineCallbacks;

  // ── Renderers ───────────────────────────────────────────────────
  renderers?: TimelineRenderers;

  // ── State overrides (controlled mode) ───────────────────────────
  selectedItemIds?: string[];
  selectedLinkIds?: string[];
  loading?: boolean;
}

/** Internal geometry derived from props + container size. */
export interface TimelineGeometry {
  /** Total visible width in px. */
  viewportWidth: number;
  /** Total visible height in px. */
  viewportHeight: number;
  /** Width of the sidebar (group labels). */
  sidebarWidth: number;
  /** Width of the scrollable timeline area. */
  timelineWidth: number;
  /** Pixels per millisecond. */
  pxPerMs: number;
  /** Pixels per step unit. */
  pxPerStep: number;
  /** Step duration in ms. */
  stepDurationMs: number;
}
