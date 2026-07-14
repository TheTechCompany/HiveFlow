// ── Spreadsheet — Tests ──────────────────────────────────────────────

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Spreadsheet } from '../Spreadsheet';
import type { SpreadsheetColumn, SpreadsheetRow, CellValue } from '../types';

// ── Polyfills for jsdom ──────────────────────────────────────────────

// jsdom doesn't implement PointerEvent — React's onPointerDown etc. need it.
// We extend MouseEvent so React's `instanceof PointerEvent` check passes.
class JsdomPointerEvent extends MouseEvent {
  pointerId: number;
  pointerType: string;
  isPrimary: boolean;

  constructor(type: string, params: any = {}) {
    super(type, params);
    this.pointerId = params.pointerId ?? 0;
    this.pointerType = params.pointerType ?? 'mouse';
    this.isPrimary = params.isPrimary ?? true;
    if (params.clientX != null) {
      try { (this as any).clientX = params.clientX; } catch { /* readonly */ }
    }
  }
}

if (typeof PointerEvent === 'undefined') {
  (global as any).PointerEvent = JsdomPointerEvent;
}

// jsdom doesn't implement setPointerCapture / releasePointerCapture
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = function () {};
}
if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = function () {};
}

// ── Helpers ──────────────────────────────────────────────────────────

function makeCol(overrides: Partial<SpreadsheetColumn> = {}): SpreadsheetColumn {
  return { key: 'name', header: 'Name', width: 150, ...overrides };
}

function makeRow(id: string, overrides: Record<string, CellValue> = {}): SpreadsheetRow {
  return { id, name: `Item ${id}`, status: 'Active', owner: 'Alice', ...overrides };
}

const defaultCols: SpreadsheetColumn[] = [
  makeCol({ key: 'name', header: 'Name', width: 150 }),
  makeCol({ key: 'status', header: 'Status', width: 100 }),
  makeCol({ key: 'owner', header: 'Owner', width: 120 }),
];

const defaultRows: SpreadsheetRow[] = [
  makeRow('1', { name: 'Alpha', status: 'Done' }),
  makeRow('2', { name: 'Beta', status: 'Pending' }),
  makeRow('3', { name: 'Gamma', status: 'Active' }),
];

function renderSpreadsheet(props: Partial<Parameters<typeof Spreadsheet>[0]> = {}) {
  return render(
    <div style={{ width: 600, height: 300, display: 'flex' }}>
      <Spreadsheet
        columns={defaultCols}
        rows={defaultRows}
        {...props}
      />
    </div>,
  );
}

// ── Rendering ────────────────────────────────────────────────────────

describe('Spreadsheet rendering', () => {
  it('renders column headers', () => {
    renderSpreadsheet();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
  });

  it('renders row data', () => {
    renderSpreadsheet();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders "No rows" when rows is empty', () => {
    renderSpreadsheet({ rows: [] });
    expect(screen.getByText('No rows')).toBeInTheDocument();
  });

  it('still renders headers when rows is empty', () => {
    renderSpreadsheet({ rows: [] });
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('applies rowHeight to rows', () => {
    renderSpreadsheet({ rowHeight: 48 });
    const row = document.querySelector('.spreadsheet-row');
    expect(row).toHaveStyle('height: 48px');
  });

  it('applies headerHeight', () => {
    renderSpreadsheet({ headerHeight: 50 });
    const header = document.querySelector('.spreadsheet-header');
    expect(header).toHaveStyle('height: 50px');
  });

  it('applies maxHeight constraint', () => {
    renderSpreadsheet({ maxHeight: 200 });
    const body = document.querySelector('.spreadsheet-body');
    expect(body).toHaveStyle('max-height: 200px');
  });
});

// ── Row selection ────────────────────────────────────────────────────

describe('Row selection', () => {
  it('calls onRowClick when a row is clicked', () => {
    const onClick = jest.fn();
    renderSpreadsheet({ onRowClick: onClick });
    fireEvent.click(screen.getByText('Alpha').closest('.spreadsheet-row')!);
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', name: 'Alpha' }),
    );
  });

  it('calls onRowDoubleClick on double-click', () => {
    const onDbl = jest.fn();
    renderSpreadsheet({ onRowDoubleClick: onDbl });
    const row = screen.getByText('Alpha').closest('.spreadsheet-row')!;
    fireEvent.doubleClick(row);
    expect(onDbl).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
    );
  });

  it('marks a row as selected via data-selected attribute', () => {
    renderSpreadsheet({ selectedRowIds: ['2'] });
    const row = document.querySelector('[data-row-id="2"]');
    expect(row).toHaveAttribute('data-selected', 'true');
  });

  it('calls onSelectionChange with additive selection on ctrl+click', () => {
    const onChange = jest.fn();
    renderSpreadsheet({
      selectedRowIds: ['1'],
      onSelectionChange: onChange,
    });
    const row = document.querySelector('[data-row-id="2"]')!;
    fireEvent.click(row, { ctrlKey: true });
    expect(onChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('calls onSelectionChange with single selection on plain click', () => {
    const onChange = jest.fn();
    renderSpreadsheet({
      selectedRowIds: ['1', '2'],
      onSelectionChange: onChange,
    });
    const row = document.querySelector('[data-row-id="3"]')!;
    fireEvent.click(row);
    expect(onChange).toHaveBeenCalledWith(['3']);
  });

  it('deselects a row on ctrl+click when already selected', () => {
    const onChange = jest.fn();
    renderSpreadsheet({
      selectedRowIds: ['1', '2'],
      onSelectionChange: onChange,
    });
    const row = document.querySelector('[data-row-id="1"]')!;
    fireEvent.click(row, { ctrlKey: true });
    expect(onChange).toHaveBeenCalledWith(['2']);
  });
});

// ── Select stub column ───────────────────────────────────────────────

describe('Select stub column', () => {
  it('shows select column by default when onSelectionChange is provided', () => {
    const onChange = jest.fn();
    const { container } = renderSpreadsheet({ onSelectionChange: onChange });
    expect(container.querySelector('.spreadsheet-select-stub')).toBeInTheDocument();
    expect(container.querySelector('.spreadsheet-header-select')).toBeInTheDocument();
  });

  it('hides select column when showSelectColumn=false', () => {
    const onChange = jest.fn();
    const { container } = renderSpreadsheet({
      onSelectionChange: onChange,
      showSelectColumn: false,
    });
    expect(container.querySelector('.spreadsheet-select-stub')).not.toBeInTheDocument();
  });

  it('shows select column when showSelectColumn=true even without selection handler', () => {
    const { container } = renderSpreadsheet({ showSelectColumn: true });
    expect(container.querySelector('.spreadsheet-select-stub')).toBeInTheDocument();
  });

  it('clicking select stub toggles row selection', () => {
    const onChange = jest.fn();
    renderSpreadsheet({
      selectedRowIds: [],
      onSelectionChange: onChange,
    });
    const stub = document.querySelector('[data-row-id="1"] .spreadsheet-select-stub')!;
    fireEvent.click(stub);
    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  it('clicking select stub with ctrl adds to selection', () => {
    const onChange = jest.fn();
    renderSpreadsheet({
      selectedRowIds: ['1'],
      onSelectionChange: onChange,
    });
    const stub = document.querySelector('[data-row-id="2"] .spreadsheet-select-stub')!;
    fireEvent.click(stub, { ctrlKey: true });
    expect(onChange).toHaveBeenCalledWith(['1', '2']);
  });
});

// ── Cell editing ─────────────────────────────────────────────────────

describe('Cell editing', () => {
  it('enters edit mode when an editable cell is clicked', () => {
    const { container } = renderSpreadsheet();
    const cell = document.querySelector('[data-row-id="1"] [data-cell-column="name"]')!;
    fireEvent.click(cell);
    // Editor <input> should appear
    expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
  });

  it('does not enter edit mode for non-editable columns', () => {
    const cols: SpreadsheetColumn[] = [
      makeCol({ key: 'name', header: 'Name', editable: false }),
      makeCol({ key: 'status', header: 'Status' }),
    ];
    renderSpreadsheet({ columns: cols });
    const cell = document.querySelector('[data-row-id="1"] [data-cell-column="name"]')!;
    fireEvent.click(cell);
    expect(document.querySelector('input[type="text"]')).not.toBeInTheDocument();
  });

  it('commits cell value on Enter', () => {
    const onChange = jest.fn();
    renderSpreadsheet({ onCellChange: onChange });
    const cell = document.querySelector('[data-row-id="1"] [data-cell-column="name"]')!;
    fireEvent.click(cell);
    const input = document.querySelector('input[type="text"]')!;
    fireEvent.change(input, { target: { value: 'Renamed' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('1', 'name', 'Renamed');
  });

  it('commits cell value on Tab', () => {
    const onChange = jest.fn();
    renderSpreadsheet({ onCellChange: onChange });
    const cell = document.querySelector('[data-row-id="1"] [data-cell-column="name"]')!;
    fireEvent.click(cell);
    const input = document.querySelector('input[type="text"]')!;
    fireEvent.change(input, { target: { value: 'Tabbed' } });
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(onChange).toHaveBeenCalledWith('1', 'name', 'Tabbed');
  });

  it('cancels editing on Escape', () => {
    renderSpreadsheet();
    const cell = document.querySelector('[data-row-id="1"] [data-cell-column="name"]')!;
    fireEvent.click(cell);
    const input = document.querySelector('input[type="text"]')!;
    fireEvent.change(input, { target: { value: 'ShouldNotSave' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    // Editor should be gone, original value still displayed
    expect(document.querySelector('input[type="text"]')).not.toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('commits on blur', () => {
    const onChange = jest.fn();
    renderSpreadsheet({ onCellChange: onChange });
    const cell = document.querySelector('[data-row-id="1"] [data-cell-column="name"]')!;
    fireEvent.click(cell);
    const input = document.querySelector('input[type="text"]')!;
    fireEvent.change(input, { target: { value: 'BlurSave' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith('1', 'name', 'BlurSave');
  });

  it('calls onActiveCellChange when entering edit mode', () => {
    const onActive = jest.fn();
    renderSpreadsheet({ onActiveCellChange: onActive });
    const cell = document.querySelector('[data-row-id="1"] [data-cell-column="name"]')!;
    fireEvent.click(cell);
    expect(onActive).toHaveBeenCalledWith({ rowId: '1', columnKey: 'name' });
  });

  it('supports controlled activeCell prop', () => {
    const { container } = render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={defaultCols}
          rows={defaultRows}
          activeCell={{ rowId: '2', columnKey: 'status' }}
        />
      </div>,
    );
    // Row 2, status column should have an editor
    const cell = document.querySelector('[data-row-id="2"] [data-cell-column="status"]')!;
    expect(cell.querySelector('input[type="text"]')).toBeInTheDocument();
  });
});

// ── Keyboard navigation ──────────────────────────────────────────────

describe('Keyboard navigation', () => {
  it('ArrowDown moves to next row', () => {
    const onActive = jest.fn();
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={defaultCols}
          rows={defaultRows}
          activeCell={{ rowId: '1', columnKey: 'name' }}
          onActiveCellChange={onActive}
        />
      </div>,
    );
    const root = document.querySelector('.spreadsheet')!;
    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(onActive).toHaveBeenCalledWith({ rowId: '2', columnKey: 'name' });
  });

  it('ArrowUp moves to previous row', () => {
    const onActive = jest.fn();
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={defaultCols}
          rows={defaultRows}
          activeCell={{ rowId: '2', columnKey: 'name' }}
          onActiveCellChange={onActive}
        />
      </div>,
    );
    const root = document.querySelector('.spreadsheet')!;
    fireEvent.keyDown(root, { key: 'ArrowUp' });
    expect(onActive).toHaveBeenCalledWith({ rowId: '1', columnKey: 'name' });
  });

  it('ArrowRight moves to next column', () => {
    const onActive = jest.fn();
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={defaultCols}
          rows={defaultRows}
          activeCell={{ rowId: '1', columnKey: 'name' }}
          onActiveCellChange={onActive}
        />
      </div>,
    );
    const root = document.querySelector('.spreadsheet')!;
    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(onActive).toHaveBeenCalledWith({ rowId: '1', columnKey: 'status' });
  });

  it('ArrowLeft moves to previous column', () => {
    const onActive = jest.fn();
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={defaultCols}
          rows={defaultRows}
          activeCell={{ rowId: '1', columnKey: 'status' }}
          onActiveCellChange={onActive}
        />
      </div>,
    );
    const root = document.querySelector('.spreadsheet')!;
    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(onActive).toHaveBeenCalledWith({ rowId: '1', columnKey: 'name' });
  });

  it('does not navigate past first row with ArrowUp', () => {
    const onActive = jest.fn();
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={defaultCols}
          rows={defaultRows}
          activeCell={{ rowId: '1', columnKey: 'name' }}
          onActiveCellChange={onActive}
        />
      </div>,
    );
    const root = document.querySelector('.spreadsheet')!;
    fireEvent.keyDown(root, { key: 'ArrowUp' });
    expect(onActive).not.toHaveBeenCalled();
  });

  it('does not navigate past last row with ArrowDown', () => {
    const onActive = jest.fn();
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={defaultCols}
          rows={defaultRows}
          activeCell={{ rowId: '3', columnKey: 'name' }}
          onActiveCellChange={onActive}
        />
      </div>,
    );
    const root = document.querySelector('.spreadsheet')!;
    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(onActive).not.toHaveBeenCalled();
  });

  it('Escape clears the active cell', () => {
    const onActive = jest.fn();
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={defaultCols}
          rows={defaultRows}
          activeCell={{ rowId: '1', columnKey: 'name' }}
          onActiveCellChange={onActive}
        />
      </div>,
    );
    const root = document.querySelector('.spreadsheet')!;
    fireEvent.keyDown(root, { key: 'Escape' });
    expect(onActive).toHaveBeenCalledWith(null);
  });

  it('Enter moves active cell to next row', () => {
    const onActive = jest.fn();
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={defaultCols}
          rows={defaultRows}
          activeCell={{ rowId: '1', columnKey: 'name' }}
          onActiveCellChange={onActive}
        />
      </div>,
    );
    const root = document.querySelector('.spreadsheet')!;
    fireEvent.keyDown(root, { key: 'Enter' });
    expect(onActive).toHaveBeenCalledWith({ rowId: '2', columnKey: 'name' });
  });

  it('Tab moves to next editable column (skipping non-editable)', () => {
    const cols: SpreadsheetColumn[] = [
      makeCol({ key: 'a', header: 'A', editable: true }),
      makeCol({ key: 'b', header: 'B', editable: false }),
      makeCol({ key: 'c', header: 'C', editable: true }),
    ];
    const onActive = jest.fn();
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={cols}
          rows={defaultRows}
          activeCell={{ rowId: '1', columnKey: 'a' }}
          onActiveCellChange={onActive}
        />
      </div>,
    );
    const root = document.querySelector('.spreadsheet')!;
    fireEvent.keyDown(root, { key: 'Tab' });
    expect(onActive).toHaveBeenCalledWith({ rowId: '1', columnKey: 'c' });
  });
});

// ── Sorting ──────────────────────────────────────────────────────────

describe('Sorting', () => {
  it('calls onSort when a sortable column header is clicked', () => {
    const onSort = jest.fn();
    const cols: SpreadsheetColumn[] = [
      makeCol({ key: 'name', header: 'Name', sortable: true }),
    ];
    renderSpreadsheet({ columns: cols, onSort });
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('toggles sort direction when same column clicked again', () => {
    const onSort = jest.fn();
    const cols: SpreadsheetColumn[] = [
      makeCol({ key: 'name', header: 'Name', sortable: true }),
    ];
    renderSpreadsheet({ columns: cols, onSort, sortKey: 'name', sortDirection: 'asc' });
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('does not call onSort for non-sortable columns', () => {
    const onSort = jest.fn();
    renderSpreadsheet({ onSort });
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).not.toHaveBeenCalled();
  });

  it('shows sort direction indicator on active sort column', () => {
    const cols: SpreadsheetColumn[] = [
      makeCol({ key: 'name', header: 'Name', sortable: true }),
    ];
    const { container } = render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={cols}
          rows={defaultRows}
          sortKey="name"
          sortDirection="desc"
        />
      </div>,
    );
    expect(container.textContent).toContain('▼');
  });
});

// ── Column resize ────────────────────────────────────────────────────

describe('Column resize', () => {
  it('renders resize handles on header cells', () => {
    const { container } = renderSpreadsheet();
    expect(container.querySelector('.spreadsheet-resize-handle')).toBeInTheDocument();
  });

  it('does not render resize handle when column is not resizable', () => {
    const cols: SpreadsheetColumn[] = [
      makeCol({ key: 'name', header: 'Name', resizable: false }),
    ];
    const { container } = renderSpreadsheet({ columns: cols });
    expect(container.querySelector('.spreadsheet-resize-handle')).not.toBeInTheDocument();
  });

  it('calls onColumnResize when a column is resized via drag', () => {
    const onResize = jest.fn();
    const { container } = renderSpreadsheet({ onColumnResize: onResize });
    const handle = container.querySelector('.spreadsheet-resize-handle')!;

    // With PointerEvent polyfilled, fireEvent.pointerDown triggers React's onPointerDown
    fireEvent.pointerDown(handle, { clientX: 200, pointerId: 1 });
    // The resize effect listens for mousemove as a fallback
    fireEvent.mouseMove(document, { clientX: 230 });
    fireEvent.mouseUp(document, { clientX: 230 });

    // Name column started at 150, moved 30px right → 180
    expect(onResize).toHaveBeenCalledWith('name', 180);
  });

  it('respects minWidth during resize', () => {
    const cols: SpreadsheetColumn[] = [
      makeCol({ key: 'name', header: 'Name', width: 150, minWidth: 100 }),
    ];
    const onResize = jest.fn();
    const { container } = renderSpreadsheet({ columns: cols, onColumnResize: onResize });
    const handle = container.querySelector('.spreadsheet-resize-handle')!;

    fireEvent.pointerDown(handle, { clientX: 200, pointerId: 1 });
    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(document, { clientX: 50 });

    // Should floor at minWidth 100
    expect(onResize).toHaveBeenCalledWith('name', 100);
  });

  it('respects maxWidth during resize', () => {
    const cols: SpreadsheetColumn[] = [
      makeCol({ key: 'name', header: 'Name', width: 150, maxWidth: 200 }),
    ];
    const onResize = jest.fn();
    const { container } = renderSpreadsheet({ columns: cols, onColumnResize: onResize });
    const handle = container.querySelector('.spreadsheet-resize-handle')!;

    fireEvent.pointerDown(handle, { clientX: 200, pointerId: 1 });
    fireEvent.mouseMove(document, { clientX: 700 });
    fireEvent.mouseUp(document, { clientX: 700 });

    // Should ceil at maxWidth 200
    expect(onResize).toHaveBeenCalledWith('name', 200);
  });
});

// ── Custom renderers ─────────────────────────────────────────────────

describe('Custom renderers', () => {
  it('uses custom cell renderer', () => {
    const cols: SpreadsheetColumn[] = [
      makeCol({
        key: 'name',
        header: 'Name',
        render: (row) => <strong data-testid="custom-cell">{String(row.name)}</strong>,
      }),
    ];
    renderSpreadsheet({ columns: cols });
    expect(screen.getAllByTestId('custom-cell')).toHaveLength(3);
  });

  it('uses custom edit renderer', () => {
    const cols: SpreadsheetColumn[] = [
      makeCol({
        key: 'name',
        header: 'Name',
        editRender: (_value, _row, onChange) => (
          <textarea
            data-testid="custom-editor"
            onChange={(e) => onChange(e.target.value)}
          />
        ),
      }),
    ];
    const { container } = renderSpreadsheet({ columns: cols });
    const cell = document.querySelector('[data-row-id="1"] [data-cell-column="name"]')!;
    fireEvent.click(cell);
    expect(container.querySelector('[data-testid="custom-editor"]')).toBeInTheDocument();
  });
});

// ── Callbacks ────────────────────────────────────────────────────────

describe('Callbacks', () => {
  it('calls onRowKeyDown when a key is pressed on a row', () => {
    const onKeyDown = jest.fn();
    renderSpreadsheet({ onRowKeyDown: onKeyDown });
    const row = document.querySelector('[data-row-id="2"]')!;
    fireEvent.keyDown(row, { key: 'Delete' });
    expect(onKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({ id: '2' }),
      expect.objectContaining({ key: 'Delete' }),
    );
  });

  it('supports single selectedRowId mode', () => {
    renderSpreadsheet({ selectedRowId: '3' });
    const row = document.querySelector('[data-row-id="3"]');
    expect(row).toHaveAttribute('data-selected', 'true');
  });

  it('auto-shows select column when selectedRowId is provided', () => {
    const { container } = renderSpreadsheet({ selectedRowId: '1' });
    expect(container.querySelector('.spreadsheet-select-stub')).toBeInTheDocument();
  });
});

// ── Edge cases ───────────────────────────────────────────────────────

describe('Edge cases', () => {
  it('renders null/undefined cell values as empty string', () => {
    const rows: SpreadsheetRow[] = [
      { id: '1', name: null, status: undefined } as any,
    ];
    renderSpreadsheet({ rows });
    // Should not crash — just renders empty cells
    expect(document.querySelector('[data-row-id="1"]')).toBeInTheDocument();
  });

  it('handles rows with extra keys not in columns gracefully', () => {
    const rows: SpreadsheetRow[] = [
      { id: 'x', name: 'X', status: 'Y', owner: 'Z', extraField: 'ignored' },
    ];
    renderSpreadsheet({ rows });
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('works with no optional props at all', () => {
    render(
      <div style={{ width: 600, height: 300, display: 'flex' }}>
        <Spreadsheet
          columns={[{ key: 'col', header: 'Col' }]}
          rows={[{ id: '1', col: 'val' }]}
        />
      </div>,
    );
    expect(screen.getByText('val')).toBeInTheDocument();
  });
});
