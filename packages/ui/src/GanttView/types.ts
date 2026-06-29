// ── GanttView — Types ────────────────────────────────────────────────

import type { TimelineProps } from '../Timeline';

/** Props for the GanttView component.
 *  Extends TimelineProps — all Timeline props are passed through. */
export interface GanttViewProps extends TimelineProps {
  /** Width of the sidebar in px.
   *  Set to 0 for gantt-only, a positive value for split view,
   *  or a very large value (e.g. 9999) for list-only. */
  sidebarWidth?: number;

  /** Optional context menu node rendered by the consumer.
   *  Typically a MUI `<Menu>` with `anchorReference="anchorPosition"`. */
  contextMenu?: React.ReactNode;
}
