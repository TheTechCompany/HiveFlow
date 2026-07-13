// ── Spreadsheet — Storybook stories ──────────────────────────────────

import React, { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spreadsheet } from '../Spreadsheet';
import type { SpreadsheetColumn, SpreadsheetRow, CellValue } from '../types';
import { Chip } from '@mui/material';

// ── Meta ─────────────────────────────────────────────────────────────

const meta: Meta<typeof Spreadsheet> = {
  title: 'Spreadsheet',
  component: Spreadsheet,
  tags: ['autodocs'],
  argTypes: {
    rowHeight: { control: 'number' },
    headerHeight: { control: 'number' },
    maxHeight: { control: 'number' },
    fitContainer: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '400px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Spreadsheet>;

// ── Shared mock data ─────────────────────────────────────────────────

const simpleColumns: SpreadsheetColumn[] = [
  { key: 'name', header: 'Name', width: 180 },
  { key: 'status', header: 'Status', width: 120 },
  { key: 'owner', header: 'Owner', width: 140 },
  { key: 'due', header: 'Due', width: 110 },
];

const simpleRows: SpreadsheetRow[] = [
  { id: '1', name: 'Design system audit', status: 'Done', owner: 'Alice', due: '2025-07-15' },
  { id: '2', name: 'API rate limiting', status: 'In Progress', owner: 'Bob', due: '2025-07-22' },
  { id: '3', name: 'Mobile onboarding flow', status: 'Review', owner: 'Carol', due: '2025-07-18' },
  { id: '4', name: 'Database migration', status: 'Pending', owner: 'Dave', due: '2025-08-01' },
  { id: '5', name: 'Accessibility pass', status: 'In Progress', owner: 'Alice', due: '2025-07-30' },
];

const sortableColumns: SpreadsheetColumn[] = [
  { key: 'task', header: 'Task', width: 200, sortable: true },
  { key: 'priority', header: 'Priority', width: 90, sortable: true, align: 'center' },
  { key: 'assignee', header: 'Assignee', width: 130 },
  { key: 'sprint', header: 'Sprint', width: 90, sortable: true, align: 'center' },
];

const sortableRows: SpreadsheetRow[] = [
  { id: 'a', task: 'Refactor auth module', priority: 'P1', assignee: 'Eve', sprint: 'S22' },
  { id: 'b', task: 'Update dependencies', priority: 'P3', assignee: 'Frank', sprint: 'S21' },
  { id: 'c', task: 'Fix session timeout', priority: 'P1', assignee: 'Eve', sprint: 'S22' },
  { id: 'd', task: 'Write integration tests', priority: 'P2', assignee: 'Grace', sprint: 'S23' },
  { id: 'e', task: 'Design new dashboard', priority: 'P2', assignee: 'Hank', sprint: 'S23' },
  { id: 'f', task: 'Document API endpoints', priority: 'P4', assignee: 'Ivy', sprint: 'S21' },
];

const wideColumns: SpreadsheetColumn[] = Array.from({ length: 12 }, (_, i) => ({
  key: `col${i}`,
  header: `Column ${i + 1}`,
  width: 130,
  sortable: i < 3,
}));

const wideRows: SpreadsheetRow[] = Array.from({ length: 8 }, (_, r) => {
  const row: SpreadsheetRow = { id: `row-${r}` };
  for (let c = 0; c < 12; c++) {
    row[`col${c}`] = `R${r + 1}C${c + 1}`;
  }
  return row;
});

const manyRows: SpreadsheetRow[] = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i}`,
  name: `Task ${i + 1}`,
  status: ['Done', 'In Progress', 'Review', 'Pending'][i % 4],
  owner: ['Alice', 'Bob', 'Carol', 'Dave'][i % 4],
  due: `2025-${String(7 + (i % 6)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
}));

// ── Stories ──────────────────────────────────────────────────────────

/** Basic spreadsheet with four columns and five rows. */
export const Default: Story = {
  args: {
    columns: simpleColumns,
    rows: simpleRows,
  },
};

/** Empty state — column headers visible with "No rows" placeholder. */
export const Empty: Story = {
  args: {
    columns: simpleColumns,
    rows: [],
  },
};

/** 50 rows — body scrolls vertically while the header stays fixed. */
export const ManyRows: Story = {
  args: {
    columns: simpleColumns,
    rows: manyRows,
  },
};

/** Columns with sort enabled. Click a header to toggle sort direction. */
export const Sortable: Story = {
  args: {
    columns: sortableColumns,
    rows: sortableRows,
  },
  render: (args) => {
    const [sortKey, setSortKey] = useState<string | undefined>();
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const sorted = [...args.rows].sort((a, b) => {
      if (!sortKey) return 0;
      const va = String(a[sortKey] ?? '');
      const vb = String(b[sortKey] ?? '');
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    return (
      <Spreadsheet
        {...args}
        rows={sorted}
        sortKey={sortKey}
        sortDirection={sortDir}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
      />
    );
  },
};

/** 12 columns — horizontal scrollbar appears automatically. */
export const WideColumns: Story = {
  args: {
    columns: wideColumns,
    rows: wideRows,
  },
};

/** All columns non-editable — clicking a cell does nothing. */
export const ReadOnly: Story = {
  args: {
    columns: simpleColumns.map((c) => ({ ...c, editable: false })),
    rows: simpleRows,
  },
};

/** Custom cell renderers — status gets a coloured chip, due date is right-aligned. */
export const CustomRenderers: Story = {
  args: {
    columns: [
      { key: 'name', header: 'Name', width: 200 },
      {
        key: 'status',
        header: 'Status',
        width: 130,
        render: (row) => {
          const s = String(row.status ?? '');
          const color =
            s === 'Done' ? 'success' :
            s === 'In Progress' ? 'primary' :
            s === 'Review' ? 'warning' : 'default';
          return <Chip label={s} size="small" color={color as any} variant="outlined" />;
        },
      },
      { key: 'owner', header: 'Owner', width: 130 },
      { key: 'due', header: 'Due', width: 110, align: 'right' },
    ] as SpreadsheetColumn[],
    rows: simpleRows,
  },
};

/** Single editable column with cell-change tracking. */
export const Interactive: Story = {
  args: {
    columns: [
      { key: 'name', header: 'Name (editable)', width: 200 },
      { key: 'status', header: 'Status', width: 130 },
      { key: 'owner', header: 'Owner', width: 130 },
    ],
    rows: simpleRows.map((r) => ({ ...r })),
  },
  render: (args) => {
    const [rows, setRows] = useState(args.rows);
    const [log, setLog] = useState<string[]>([]);

    const handleCellChange = useCallback(
      (rowId: string, colKey: string, value: CellValue) => {
        setRows((prev) =>
          prev.map((r) => (r.id === rowId ? { ...r, [colKey]: value } : r)),
        );
        setLog((prev) => [`${rowId}.${colKey} → "${value}"`, ...prev].slice(0, 5));
      },
      [],
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <Spreadsheet {...args} rows={rows} onCellChange={handleCellChange} />
        <div
          style={{
            marginTop: 8,
            padding: '4px 8px',
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#666',
            background: '#f5f5f5',
            borderRadius: 4,
            flexShrink: 0,
          }}
        >
          {log.length === 0 ? 'Click a cell to edit, then press Enter to commit.' : log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    );
  },
};

/** Selected row with callbacks wired up. */
export const Selectable: Story = {
  args: {
    columns: simpleColumns,
    rows: simpleRows,
  },
  render: (args) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <Spreadsheet
          {...args}
          selectedRowIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowDoubleClick={(row) => alert(`Double-clicked: ${row.name}`)}
        />
        <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
          Selected: {selectedIds.length === 0 ? 'none' : selectedIds.join(', ')}
          &nbsp;| Double-click a row to alert
        </div>
      </div>
    );
  },
};

/** Narrow container — shows how the spreadsheet adapts to constrained widths. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 350, height: 400, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    columns: simpleColumns,
    rows: simpleRows,
  },
};
