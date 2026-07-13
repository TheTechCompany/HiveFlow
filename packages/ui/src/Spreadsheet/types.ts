// ── Spreadsheet — Types ────────────────────────────────────────────
// A responsive, editable data-grid component designed to replace
// the sidebar list in GanttView (and stand alone).

import type { ReactNode } from 'react';

// ── Cell / Column ──────────────────────────────────────────────────

/** Value stored in a spreadsheet cell. */
export type CellValue = string | number | boolean | Date | null | undefined;

/** How a column renders and edits its cells. */
export interface SpreadsheetColumn {
  /** Unique key used to look up the value in each row object. */
  key: string;

  /** Column header label. Falls back to key. */
  header?: string;

  /** Starting width in px. Default 120. */
  width?: number;

  /** Minimum width in px (resize floor). Default 60. */
  minWidth?: number;

  /** Maximum width in px (resize ceiling). Default 600. */
  maxWidth?: number;

  /** Text alignment. Default 'left'. */
  align?: 'left' | 'center' | 'right';

  /** Whether the user can resize this column by dragging the header edge. Default true. */
  resizable?: boolean;

  /** Whether cells in this column are editable. Default true. */
  editable?: boolean;

  /** Whether the column can be sorted by clicking its header. Default false. */
  sortable?: boolean;

  /**
   * Custom cell renderer. Receives the full row and a boolean `editing`.
   * Return a ReactNode. When omitted, the raw value is rendered as text.
   */
  render?: (row: Record<string, CellValue>, editing: boolean) => ReactNode;

  /**
   * Custom editor rendered when a cell enters editing mode.
   * Receives current value, the full row, and an onChange callback.
   * When omitted, a plain <input> is used.
   */
  editRender?: (
    value: CellValue,
    row: Record<string, CellValue>,
    onChange: (next: CellValue) => void,
  ) => ReactNode;
}

// ── Row identity ───────────────────────────────────────────────────

/** Every row must have a unique string id. */
export interface SpreadsheetRow {
  id: string;
  [key: string]: CellValue;
}

// ── Props ──────────────────────────────────────────────────────────

export interface SpreadsheetProps {
  /** Column definitions. */
  columns: SpreadsheetColumn[];

  /** Row data. */
  rows: SpreadsheetRow[];

  /** Height of each row in px. Default 32. */
  rowHeight?: number;

  /** Height of the header row in px. Default 36. */
  headerHeight?: number;

  /** Whether the spreadsheet fills the parent container (flex: 1). Default true. */
  fitContainer?: boolean;

  /** Max height in px before internal scrolling kicks in. */
  maxHeight?: number;

  /** Currently selected row id (controlled). */
  selectedRowId?: string;

  /** Row ids that are currently selected (multi-select). */
  selectedRowIds?: string[];

  /** Currently active (editing) cell as `{rowId, columnKey}`. */
  activeCell?: { rowId: string; columnKey: string } | null;

  /** Sort column key. */
  sortKey?: string;

  /** Sort direction. */
  sortDirection?: 'asc' | 'desc';

  // ── Callbacks ──────────────────────────────────────────────────

  /** Fired when the user clicks a row. */
  onRowClick?: (row: SpreadsheetRow) => void;

  /** Fired when the user double-clicks a row. */
  onRowDoubleClick?: (row: SpreadsheetRow) => void;

  /** Fired when a cell value is committed (Enter, Tab, or blur). */
  onCellChange?: (rowId: string, columnKey: string, value: CellValue) => void;

  /** Fired when the active cell changes. */
  onActiveCellChange?: (cell: { rowId: string; columnKey: string } | null) => void;

  /** Fired when selection changes. */
  onSelectionChange?: (rowIds: string[]) => void;

  /** Fired when the user clicks a column header to sort. */
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;

  /** Fired when a column is resized. */
  onColumnResize?: (columnKey: string, width: number) => void;

  /** Fired when the user presses a key on a selected row. */
  onRowKeyDown?: (row: SpreadsheetRow, event: React.KeyboardEvent) => void;

  /** Show a narrow selection column on the left edge of each row. Default true
   *  when onSelectionChange or selectedRowIds is provided. */
  showSelectColumn?: boolean;
}
