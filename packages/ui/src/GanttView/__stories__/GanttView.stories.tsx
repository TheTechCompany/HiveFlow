// ── GanttView — Storybook stories ────────────────────────────────────

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GanttView } from '../GanttView';
import type { TimelineItem, TimelineGroup } from '../../Timeline';
import { d, makeItem, makeGroup } from '../../Timeline/__stories__/mockData';
import { Spreadsheet } from '../../Spreadsheet';
import type { SpreadsheetColumn } from '../../Spreadsheet';

// ── Meta ─────────────────────────────────────────────────────────────

const meta: Meta<typeof GanttView> = {
  title: 'GanttView',
  component: GanttView,
  tags: ['autodocs'],
  argTypes: {
    sidebarWidth: { control: 'number' },
    step: {
      control: 'select',
      options: ['hour', 'day', 'week', 'month', 'year'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '500px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GanttView>;

// ── Shared mock data ─────────────────────────────────────────────────

const demoRange = {
  start: d(2025, 6, 1),
  end: d(2025, 8, 31),
};

const demoItems: TimelineItem[] = [
  makeItem({ start: d(2025, 6, 10), end: d(2025, 6, 20), label: 'Design', color: '#4caf50', groupId: 'g1', progress: 100 }),
  makeItem({ start: d(2025, 6, 15), end: d(2025, 7, 5), label: 'Development', color: '#2196f3', groupId: 'g1', progress: 60 }),
  makeItem({ start: d(2025, 7, 1), end: d(2025, 7, 20), label: 'Testing', color: '#ff9800', groupId: 'g2', progress: 20 }),
  makeItem({ start: d(2025, 7, 10), end: d(2025, 8, 5), label: 'Deployment', color: '#9c27b0', groupId: 'g2', progress: 0 }),
];

const demoGroups: TimelineGroup[] = [
  makeGroup('g1', 'Phase 1'),
  makeGroup('g2', 'Phase 2'),
];

// ── Stories ──────────────────────────────────────────────────────────

/** Default split view with sidebar at 200px. */
export const Default: Story = {
  args: {
    items: demoItems,
    groups: demoGroups,
    start: demoRange.start,
    end: demoRange.end,
    step: 'day',
    itemHeight: 30,
    headerHeight: 48,
    sidebarWidth: 200,
    showToday: true,
    fitContainer: true,
  },
};

/** Gantt-only mode — sidebarWidth=0 hides the sidebar. */
export const GanttOnly: Story = {
  args: {
    ...Default.args,
    sidebarWidth: 0,
  },
};

/** List-only mode — sidebarWidth=9999 fills the container. */
export const ListOnly: Story = {
  args: {
    ...Default.args,
    sidebarWidth: 9999,
  },
};

/** Empty state — no items. */
export const Empty: Story = {
  args: {
    items: [],
    groups: [],
    start: demoRange.start,
    end: demoRange.end,
    step: 'day',
    fitContainer: true,
  },
};

/** Loading state. */
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

/** Read-only mode (no drag or resize). */
export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readonly: true,
  },
};

/** With custom sidebar header via renderSidebarHeader. */
export const CustomSidebarHeader: Story = {
  args: {
    ...Default.args,
    renderers: {
      renderSidebarHeader: () => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 12px', fontWeight: 700, fontSize: '0.75rem', borderBottom: '2px solid #ccc', backgroundColor: '#f1f5f9' }}>
          <span style={{ flex: 1 }}>Task</span>
          <span style={{ width: 100 }}>Start</span>
          <span style={{ width: 100 }}>End</span>
        </div>
      ),
    },
  },
};

/** With a context menu rendered below the timeline. */
export const WithContextMenu: Story = {
  args: {
    ...Default.args,
    contextMenu: (
      <div style={{ padding: 8, background: '#fff', borderTop: '1px solid #ccc', fontSize: '0.75rem' }}>
        Right-click a row for actions
      </div>
    ),
  },
};

// ── Spreadsheet sidebar stories ─────────────────────────────────────

const spreadsheetColumns: SpreadsheetColumn[] = [
  { key: 'label', header: 'Task', width: 180, editable: true },
  { key: 'group', header: 'Phase', width: 100 },
  { key: 'start', header: 'Start', width: 100 },
  { key: 'end', header: 'End', width: 100 },
  { key: 'progress', header: '%', width: 50, align: 'center' },
];

function buildSpreadsheetRows(items: TimelineItem[], groups: TimelineGroup[]) {
  const groupMap = new Map(groups.map((g) => [g.id, g.label ?? g.id]));
  return items.map((i) => ({
    id: i.id,
    label: i.label ?? i.id,
    group: groupMap.get(i.groupId ?? '') ?? '—',
    start: i.start.toISOString().slice(0, 10),
    end: i.end.toISOString().slice(0, 10),
    progress: i.progress != null ? `${i.progress}%` : '',
  }));
}

const spreadsheetRows = buildSpreadsheetRows(demoItems, demoGroups);

/** Gantt with a Spreadsheet sidebar — spreadsheet replaces the default sidebar. */
export const WithSpreadsheet: Story = {
  args: {
    items: demoItems,
    groups: demoGroups,
    start: demoRange.start,
    end: demoRange.end,
    step: 'day',
    itemHeight: 30,
    headerHeight: 48,
    showToday: true,
    fitContainer: true,
    sidebarFlex: '380px',
    sidebar: (
      <Spreadsheet
        columns={spreadsheetColumns}
        rows={spreadsheetRows}
        rowHeight={30}
        headerHeight={48}
      />
    ),
  },
};

/** Gantt with Spreadsheet — showing selection wired between the two. */
export const SpreadsheetWithSelection: Story = {
  args: {
    ...WithSpreadsheet.args,
  },
  render: (args) => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    return (
      <GanttView
        {...args}
        selectedItemIds={selectedIds}
        sidebar={
          <Spreadsheet
            columns={spreadsheetColumns}
            rows={spreadsheetRows}
            rowHeight={30}
            headerHeight={48}
            selectedRowIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        }
      />
    );
  },
};
