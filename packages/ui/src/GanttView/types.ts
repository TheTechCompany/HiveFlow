// ── GanttView — Types ────────────────────────────────────────────────

import type { TimelineProps } from '../Timeline';

/** Props for the GanttView component.
 *  Extends TimelineProps — all Timeline props are passed through. */
export interface GanttViewProps extends TimelineProps {
  /** Width of the sidebar in px.
   *  Set to 0 for gantt-only, a positive value for split view,
   *  or a very large value (e.g. 9999) for list-only.
   *
   *  Ignored when `sidebar` is provided — the sidebar node controls
   *  its own width via the flex column. */
  sidebarWidth?: number;

  /** Optional sidebar node rendered to the left of the timeline.
   *  When provided, the Timeline is rendered with sidebarWidth=0
   *  and this node fills the left column.
   *
   *  Use this to embed a Spreadsheet, DataTable, or any custom
   *  list component alongside the gantt bars. */
  sidebar?: React.ReactNode;

  /** Flex-basis width for the sidebar column when `sidebar` is used.
   *  Default '320px'. Can be a px value, percentage, or flex value. */
  sidebarFlex?: string;

  /** Optional context menu node rendered by the consumer.
   *  Typically a MUI `<Menu>` with `anchorReference="anchorPosition"`. */
  contextMenu?: React.ReactNode;
}
