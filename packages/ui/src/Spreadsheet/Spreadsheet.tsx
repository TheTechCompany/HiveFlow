// ── Spreadsheet — Responsive editable data grid ────────────────────
//
// A spreadsheet-like component built on MUI primitives.
// Designed as a drop-in replacement for the sidebar list in GanttView
// and as a standalone data grid.
//
// Features:
//  - Inline cell editing (click or Enter to edit) — editor overlays
//    the cell without changing column widths
//  - Column resizing via drag handles on header cells
//  - Keyboard navigation (arrows, Tab, Enter, Escape)
//  - Sortable columns
//  - Row selection (single + multi via ctrl/cmd) with a select stub column
//  - Sticky header that scrolls horizontally in sync with the body
//  - Responsive — horizontal scroll when columns overflow

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Checkbox } from '@mui/material';
import type { SpreadsheetProps, CellValue, SpreadsheetRow } from './types';

// ── Module-level constants ──────────────────────────────────────────

const DEFAULT_ROW_HEIGHT = 32;
const DEFAULT_HEADER_HEIGHT = 36;
const DEFAULT_COL_WIDTH = 120;
const COL_MIN_WIDTH = 60;
const COL_MAX_WIDTH = 600;
const SELECT_COL_WIDTH = 38;

const HEADER_BG = 'secondary.main';
const HEADER_COLOR = 'white';
const BORDER_COLOR = '#d0d0d0';
const ROW_BORDER_COLOR = '#e8e8e8';
const SELECTED_BG = 'rgba(25, 118, 210, 0.08)';
const HOVER_BG = 'rgba(0, 0, 0, 0.04)';

// ── Helpers ─────────────────────────────────────────────────────────

function cellToString(v: CellValue): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

// ── Sub-components ──────────────────────────────────────────────────

/** Inline text editor that overlays the cell without changing its size. */
const CellEditor: React.FC<{
  value: CellValue;
  onCommit: (next: CellValue) => void;
  onCancel: () => void;
}> = React.memo(({ value, onCommit, onCancel }) => {
  const [draft, setDraft] = useState(cellToString(value));
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.focus();
      el.select();
    }
  }, []);

  const commit = useCallback(() => {
    onCommit(draft);
  }, [draft, onCommit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        commit();
      }
    },
    [commit, onCancel],
  );

  // Plain <input> styled to match the cell — no MUI chrome that shifts layout.
  return (
    <Box
      component="input"
      ref={ref}
      type="text"
      value={draft}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setDraft((e.target as HTMLInputElement).value)
      }
      onKeyDown={handleKeyDown}
      onBlur={commit}
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        outline: '2px solid #1a73e8',
        outlineOffset: -1,
        background: '#fff',
        fontSize: '13px',
        fontFamily: 'inherit',
        px: 1,
        py: 0,
        boxSizing: 'border-box',
        zIndex: 3,
      }}
    />
  );
});

// ── Main component ──────────────────────────────────────────────────

export const Spreadsheet: React.FC<SpreadsheetProps> = ({
  columns,
  rows,
  rowHeight = DEFAULT_ROW_HEIGHT,
  headerHeight = DEFAULT_HEADER_HEIGHT,
  fitContainer = true,
  maxHeight,
  selectedRowId,
  selectedRowIds,
  activeCell: activeCellProp,
  sortKey,
  sortDirection,
  onRowClick,
  onRowDoubleClick,
  onCellChange,
  onActiveCellChange,
  onSelectionChange,
  onSort,
  onColumnResize,
  onRowKeyDown,
  showSelectColumn,
}) => {
  // ── Column width state ───────────────────────────────────────────
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const c of columns) {
      init[c.key] = c.width ?? DEFAULT_COL_WIDTH;
    }
    return init;
  });

  // Sync externally changed column widths
  useEffect(() => {
    setColWidths((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const c of columns) {
        const w = c.width ?? DEFAULT_COL_WIDTH;
        if (next[c.key] !== w) {
          next[c.key] = w;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.map((c) => c.width).join(',')]);

  // ── Selection column visibility ──────────────────────────────────
  const showSelect =
    showSelectColumn !== undefined
      ? showSelectColumn
      : !!(onSelectionChange || selectedRowIds || selectedRowId);

  const selectColW = showSelect ? SELECT_COL_WIDTH : 0;

  // ── Active cell state ────────────────────────────────────────────
  const [internalActiveCell, setInternalActiveCell] = useState<{
    rowId: string;
    columnKey: string;
  } | null>(null);

  const activeCell =
    activeCellProp !== undefined ? activeCellProp : internalActiveCell;

  const setActiveCell = useCallback(
    (cell: { rowId: string; columnKey: string } | null) => {
      if (activeCellProp === undefined) {
        setInternalActiveCell(cell);
      }
      onActiveCellChange?.(cell);
    },
    [activeCellProp, onActiveCellChange],
  );

  // ── Selection helpers ────────────────────────────────────────────
  const isSelected = useCallback(
    (rowId: string): boolean => {
      if (selectedRowIds) return selectedRowIds.includes(rowId);
      if (selectedRowId) return selectedRowId === rowId;
      return false;
    },
    [selectedRowId, selectedRowIds],
  );

  const toggleSelectRow = useCallback(
    (row: SpreadsheetRow, additive: boolean) => {
      if (!onSelectionChange) return;
      // If we only have single-select mode, treat select column click as single select
      if (selectedRowId !== undefined && selectedRowIds === undefined) {
        onSelectionChange([row.id]);
        onRowClick?.(row);
        return;
      }
      if (!selectedRowIds) return;
      let next: string[];
      if (additive) {
        next = selectedRowIds.includes(row.id)
          ? selectedRowIds.filter((id) => id !== row.id)
          : [...selectedRowIds, row.id];
      } else {
        next = [row.id];
      }
      onSelectionChange(next);
    },
    [onSelectionChange, onRowClick, selectedRowId, selectedRowIds],
  );

  const handleRowClick = useCallback(
    (row: SpreadsheetRow, event: React.MouseEvent) => {
      const additive = event.ctrlKey || event.metaKey;
      if (onSelectionChange && selectedRowIds) {
        let next: string[];
        if (additive) {
          next = selectedRowIds.includes(row.id)
            ? selectedRowIds.filter((id) => id !== row.id)
            : [...selectedRowIds, row.id];
        } else {
          next = [row.id];
        }
        onSelectionChange(next);
      }
      onRowClick?.(row);
    },
    [onRowClick, onSelectionChange, selectedRowIds],
  );

  // ── Cell commit ──────────────────────────────────────────────────
  const handleCellCommit = useCallback(
    (rowId: string, columnKey: string, value: CellValue) => {
      onCellChange?.(rowId, columnKey, value);
      setActiveCell(null);
    },
    [onCellChange, setActiveCell],
  );

  const handleCellCancel = useCallback(() => {
    setActiveCell(null);
  }, [setActiveCell]);

  // ── Keyboard navigation ──────────────────────────────────────────
  const editableCols = useMemo(
    () => columns.filter((c) => c.editable !== false),
    [columns],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const cell = activeCell;
      if (!cell) return;

      const rowIdx = rows.findIndex((r) => r.id === cell.rowId);
      const colIdx = columns.findIndex((c) => c.key === cell.columnKey);

      if (event.key === 'Escape') {
        setActiveCell(null);
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        if (rowIdx < rows.length - 1) {
          setActiveCell({
            rowId: rows[rowIdx + 1].id,
            columnKey: cell.columnKey,
          });
        }
        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        const dir = event.shiftKey ? -1 : 1;
        let nextColIdx = colIdx + dir;
        if (nextColIdx >= 0 && nextColIdx < editableCols.length) {
          setActiveCell({
            rowId: cell.rowId,
            columnKey: editableCols[nextColIdx].key,
          });
        } else if (nextColIdx >= editableCols.length && rowIdx < rows.length - 1) {
          setActiveCell({
            rowId: rows[rowIdx + 1].id,
            columnKey: editableCols[0].key,
          });
        } else if (nextColIdx < 0 && rowIdx > 0) {
          setActiveCell({
            rowId: rows[rowIdx - 1].id,
            columnKey: editableCols[editableCols.length - 1].key,
          });
        }
        return;
      }

      if (event.key === 'ArrowUp' && rowIdx > 0) {
        event.preventDefault();
        setActiveCell({
          rowId: rows[rowIdx - 1].id,
          columnKey: cell.columnKey,
        });
        return;
      }
      if (event.key === 'ArrowDown' && rowIdx < rows.length - 1) {
        event.preventDefault();
        setActiveCell({
          rowId: rows[rowIdx + 1].id,
          columnKey: cell.columnKey,
        });
        return;
      }
      if (event.key === 'ArrowLeft' && colIdx > 0) {
        event.preventDefault();
        setActiveCell({
          rowId: cell.rowId,
          columnKey: columns[colIdx - 1].key,
        });
        return;
      }
      if (event.key === 'ArrowRight' && colIdx < columns.length - 1) {
        event.preventDefault();
        setActiveCell({
          rowId: cell.rowId,
          columnKey: columns[colIdx + 1].key,
        });
        return;
      }
    },
    [activeCell, rows, columns, editableCols, setActiveCell],
  );

  // ── Sort handler ─────────────────────────────────────────────────
  const handleSortClick = useCallback(
    (columnKey: string) => {
      const newDir =
        sortKey === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort?.(columnKey, newDir);
    },
    [onSort, sortKey, sortDirection],
  );

  // ── Column resize ────────────────────────────────────────────────
  const resizeStateRef = useRef<{
    columnKey: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const handleResizeStart = useCallback(
    (columnKey: string, event: React.PointerEvent) => {
      event.preventDefault();
      const el = event.currentTarget as HTMLElement;
      try {
        el.setPointerCapture?.(event.pointerId);
      } catch {
        /* jsdom may not support pointer capture */
      }
      resizeStateRef.current = {
        columnKey,
        startX: event.clientX,
        startWidth: colWidths[columnKey] ?? DEFAULT_COL_WIDTH,
      };
    },
    [colWidths],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent | MouseEvent) => {
      const state = resizeStateRef.current;
      if (!state) return;
      const col = columns.find((c) => c.key === state.columnKey);
      const minW = col?.minWidth ?? COL_MIN_WIDTH;
      const maxW = col?.maxWidth ?? COL_MAX_WIDTH;
      const delta = (e.clientX || 0) - state.startX;
      const newWidth = Math.max(minW, Math.min(maxW, state.startWidth + delta));
      setColWidths((prev) => ({ ...prev, [state.columnKey]: newWidth }));
    };
    const onUp = (e: PointerEvent | MouseEvent) => {
      const state = resizeStateRef.current;
      if (!state) return;
      const col = columns.find((c) => c.key === state.columnKey);
      const minW = col?.minWidth ?? COL_MIN_WIDTH;
      const maxW = col?.maxWidth ?? COL_MAX_WIDTH;
      const delta = (e.clientX || 0) - state.startX;
      const newWidth = Math.max(minW, Math.min(maxW, state.startWidth + delta));
      onColumnResize?.(state.columnKey, newWidth);
      resizeStateRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture?.((e as PointerEvent).pointerId ?? 0);
      } catch {
        /* ok */
      }
    };
    document.addEventListener('pointermove', onMove as EventListener);
    document.addEventListener('pointerup', onUp as EventListener);
    // Fallback for jsdom which lacks PointerEvent
    document.addEventListener('mousemove', onMove as EventListener);
    document.addEventListener('mouseup', onUp as EventListener);
    return () => {
      document.removeEventListener('pointermove', onMove as EventListener);
      document.removeEventListener('pointerup', onUp as EventListener);
      document.removeEventListener('mousemove', onMove as EventListener);
      document.removeEventListener('mouseup', onUp as EventListener);
    };
  }, [columns, onColumnResize]);

  // ── Total content width ──────────────────────────────────────────
  const totalWidth = useMemo(
    () =>
      selectColW +
      columns.reduce((sum, c) => sum + (colWidths[c.key] ?? DEFAULT_COL_WIDTH), 0),
    [columns, colWidths, selectColW],
  );

  // ── Header scroll sync ───────────────────────────────────────────
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleBodyScroll = useCallback(() => {
    const body = bodyRef.current;
    const header = headerScrollRef.current;
    if (body && header) {
      header.scrollLeft = body.scrollLeft;
    }
  }, []);

  // ── Row keydown forwarding ───────────────────────────────────────
  const handleRowKeyDown = useCallback(
    (row: SpreadsheetRow, event: React.KeyboardEvent) => {
      onRowKeyDown?.(row, event);
    },
    [onRowKeyDown],
  );

  // ── Header cell render helper ────────────────────────────────────
  const renderHeaderCell = (col: typeof columns[number]) => {
    const w = colWidths[col.key] ?? DEFAULT_COL_WIDTH;
    const isSortable = col.sortable === true;
    const isActive = sortKey === col.key;

    return (
      <Box
        key={col.key}
        className="spreadsheet-header-cell"
        onClick={isSortable ? () => handleSortClick(col.key) : undefined}
        sx={{
          width: w,
          minWidth: w,
          maxWidth: w,
          display: 'flex',
          alignItems: 'center',
          px: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: isSortable ? 'pointer' : 'default',
          position: 'relative',
          boxSizing: 'border-box',
          flexShrink: 0,
          justifyContent:
            col.align === 'center'
              ? 'center'
              : col.align === 'right'
                ? 'flex-end'
                : 'flex-start',
          '&:hover': isSortable
            ? { bgcolor: 'rgba(255,255,255,0.1)' }
            : undefined,
        }}
      >
        {col.header ?? col.key}
        {isActive && (
          <Box component="span" sx={{ ml: 0.5, fontSize: 10 }}>
            {sortDirection === 'asc' ? '▲' : '▼'}
          </Box>
        )}
        {/* Resize handle */}
        {col.resizable !== false && (
          <Box
            className="spreadsheet-resize-handle"
            onPointerDown={(e) => handleResizeStart(col.key, e)}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 5,
              cursor: 'col-resize',
              zIndex: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              '&:active': { bgcolor: 'rgba(255,255,255,0.5)' },
            }}
          />
        )}
      </Box>
    );
  };

  // ── Render cells for a row ───────────────────────────────────────
  const renderRowCells = (row: SpreadsheetRow) =>
    columns.map((col) => {
      const value = row[col.key];
      const editing =
        activeCell?.rowId === row.id && activeCell?.columnKey === col.key;
      const w = colWidths[col.key] ?? DEFAULT_COL_WIDTH;
      const editable = col.editable !== false;

      const handleCellClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (editable) {
          setActiveCell({ rowId: row.id, columnKey: col.key });
        }
      };

      return (
        <Box
          key={col.key}
          className="spreadsheet-cell"
          data-cell-column={col.key}
          onClick={handleCellClick}
          sx={{
            width: w,
            minWidth: w,
            maxWidth: w,
            display: 'flex',
            alignItems: 'center',
            px: 1,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            borderRight: `1px solid ${ROW_BORDER_COLOR}`,
            boxSizing: 'border-box',
            flexShrink: 0,
            position: 'relative',
            justifyContent:
              col.align === 'center'
                ? 'center'
                : col.align === 'right'
                  ? 'flex-end'
                  : 'flex-start',
          }}
        >
          {/* Cell value or custom render */}
          {col.render ? (
            col.render(row, editing)
          ) : (
            <Box
              component="span"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '13px',
                color: value == null ? 'text.disabled' : 'text.primary',
              }}
            >
              {cellToString(value)}
            </Box>
          )}

          {/* Editor overlay — absolutely positioned so cell width never changes */}
          {editing && editable && !col.editRender && (
            <CellEditor
              value={value}
              onCommit={(next) => handleCellCommit(row.id, col.key, next)}
              onCancel={handleCellCancel}
            />
          )}
          {editing && editable && col.editRender && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                background: '#fff',
              }}
            >
              {col.editRender(value, row, (next) =>
                handleCellCommit(row.id, col.key, next),
              )}
            </Box>
          )}
        </Box>
      );
    });

  // ── Render ───────────────────────────────────────────────────────

  return (
    <Box
      className="spreadsheet"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      sx={{
        flex: fitContainer ? 1 : undefined,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
        outline: 'none',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '13px',
        userSelect: 'none',
        borderRadius: 1,
        border: `1px solid ${BORDER_COLOR}`,
        background: '#fff',
      }}
    >
      {/* ── Header (fixed vertically, scrolls horizontally with body) ── */}
      <Box
        ref={headerScrollRef}
        className="spreadsheet-header"
        sx={{
          display: 'flex',
          flexShrink: 0,
          height: headerHeight,
          overflow: 'hidden',
          bgcolor: HEADER_BG,
          color: HEADER_COLOR,
          fontWeight: 600,
          borderBottom: `1px solid ${BORDER_COLOR}`,
        }}
      >
        <Box sx={{ display: 'flex', minWidth: totalWidth }}>
          {/* Selection column header */}
          {showSelect && (
            <Box
              className="spreadsheet-header-select"
              sx={{
                width: SELECT_COL_WIDTH,
                minWidth: SELECT_COL_WIDTH,
                maxWidth: SELECT_COL_WIDTH,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            />
          )}
          {columns.map(renderHeaderCell)}
        </Box>
      </Box>

      {/* ── Body (scrolls both axes) ──────────────────────────────── */}
      <Box
        ref={bodyRef}
        className="spreadsheet-body"
        onScroll={handleBodyScroll}
        sx={{
          flex: 1,
          overflow: 'auto',
          minHeight: 0,
          maxHeight: maxHeight ?? undefined,
        }}
      >
        <Box className="spreadsheet-rows" sx={{ minWidth: totalWidth }}>
          {rows.map((row) => {
            const selected = isSelected(row.id);

            return (
              <Box
                key={row.id}
                className="spreadsheet-row"
                data-row-id={row.id}
                data-selected={selected ? 'true' : 'false'}
                onClick={(e) => handleRowClick(row, e)}
                onDoubleClick={() => onRowDoubleClick?.(row)}
                onKeyDown={(e) => handleRowKeyDown(row, e)}
                tabIndex={-1}
                sx={{
                  display: 'flex',
                  height: rowHeight,
                  borderBottom: `1px solid ${ROW_BORDER_COLOR}`,
                  bgcolor: selected ? SELECTED_BG : 'transparent',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: selected ? SELECTED_BG : HOVER_BG },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                {/* Selection stub */}
                {showSelect && (
                  <Box
                    className="spreadsheet-select-stub"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectRow(row, e.ctrlKey || e.metaKey);
                    }}
                    sx={{
                      width: SELECT_COL_WIDTH,
                      minWidth: SELECT_COL_WIDTH,
                      maxWidth: SELECT_COL_WIDTH,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Checkbox
                      checked={selected}
                      size="small"
                      sx={{
                        p: 0.25,
                        '& .MuiSvgIcon-root': { fontSize: 18 },
                        color: 'grey.400',
                        '&.Mui-checked': { color: 'primary.main' },
                      }}
                    />
                  </Box>
                )}

                {renderRowCells(row)}
              </Box>
            );
          })}

          {rows.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
                color: 'text.secondary',
                fontSize: 13,
              }}
            >
              No rows
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Spreadsheet;
