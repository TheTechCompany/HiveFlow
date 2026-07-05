// ── @hive-flow/ui — Barrel export ───────────────────────────────────

// SidebarLayout
export { SidebarLayout } from './SidebarLayout';
export type { SidebarLayoutProps, SidebarMenuItem } from './SidebarLayout';

// DataTable
export { DataTable } from './DataTable';
export type { DataTableProps, DataTableColumn } from './DataTable';

// QuoteBuilder
export { QuoteBuilder } from './QuoteBuilder';
export type { QuoteBuilderProps, QuoteItem } from './QuoteBuilder';

// RichTextEditor
export { RichTextEditor, extractChecklist, extractChecklistFromHtml } from './RichTextEditor';
export type { RichTextEditorProps } from './RichTextEditor';

// TreeBranch
export { TreeBranch, TREE_INDENT_PER_DEPTH, TREE_TWISTY_WIDTH } from './TreeBranch';
export type { TreeBranchProps } from './TreeBranch';

// TreeBranch — VS Code indent-guide variant
export { TreeBranchVSCode, VSCODE_INDENT, VSCODE_TWISTY_WIDTH, DEPTH_BORDER_WIDTH } from './TreeBranch/VSCode';
export type { TreeBranchVSCodeProps } from './TreeBranch/VSCode';

// Spreadsheet
export { Spreadsheet } from './Spreadsheet';
export type {
  SpreadsheetProps,
  SpreadsheetColumn,
  SpreadsheetRow,
  CellValue,
} from './Spreadsheet';

// GanttView
export { GanttView } from './GanttView';
export type { GanttViewProps } from './GanttView';

// Timeline (re-export everything from its own barrel)
export {
  Timeline,
  TimelineBar,
  TimelineHeader,
  TimelineRow,
  TimelineGrid,
  TimelineLinks,
  useTimeline,
} from './Timeline';

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
  UseTimelineReturn,
  BarLayout,
} from './Timeline';
