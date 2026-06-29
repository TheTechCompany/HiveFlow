// ── Timeline stories — Main component, all composite states ────────
// Covers: empty, loading, items-only, groups, readonly, links, callbacks,
// different time scales, controlled selection, custom renderers.
import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { Timeline } from '../Timeline';
import type { TimelineProps, TimelineItem, TimelineLink, TimelineGroup } from '../types';
import { demoKit, demoRange, d, makeItem, makeItems } from '../__stories__/mockData';

const meta: Meta<typeof Timeline> = {
  title: 'Timeline / Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    step: {
      control: 'select',
      options: ['hour' as const, 'day' as const, 'week' as const, 'month' as const, 'year' as const],
    },
    readonly: { control: 'boolean' },
    showLinks: { control: 'boolean' },
    showToday: { control: 'boolean' },
    resizable: { control: 'boolean' },
    movable: { control: 'boolean' },
    fitContainer: { control: 'boolean' },
    loading: { control: 'boolean' },
    itemHeight: { control: { type: 'number', min: 20, max: 60 } },
    headerHeight: { control: { type: 'number', min: 30, max: 120 } },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

// ── Wrapper: callbacks panel ───────────────────────────────────────

/** Story wrapper that logs callbacks in a panel below the timeline.
 *  Manages its own start/end so onHorizonChange actually shifts the view. */
function CallbackWrapper(props: TimelineProps) {
  const [log, setLog] = useState<string[]>([]);
  const [horizonStart, setHorizonStart] = useState(props.start);
  const [horizonEnd, setHorizonEnd] = useState(props.end);
  const add = useCallback((msg: string) => setLog((prev) => [...prev.slice(-19), msg]), []);

  const callbacks = {
    ...props.callbacks,
    onItemChange: (c: any) => { add(`onItemChange: ${c.id}`); props.callbacks?.onItemChange?.(c); },
    onItemChanging: (c: any) => { /* firehose — skip logging */ props.callbacks?.onItemChanging?.(c); },
    onSelect: (s: any) => {
      // Only log meaningful selections, not click-on-empty clears
      if (s.itemIds.length > 0 || s.linkIds.length > 0) {
        add(`onSelect: items=[${s.itemIds.join(',')}] links=[${s.linkIds.join(',')}]`);
      }
      props.callbacks?.onSelect?.(s);
    },
    onLinkCreate: (l: any) => { add(`onLinkCreate: ${l.source}→${l.target}`); props.callbacks?.onLinkCreate?.(l); },
    onItemCreate: (s: any, e: any, g: any) => { add(`onItemCreate: g=${g ?? '-'}`); props.callbacks?.onItemCreate?.(s, e, g); },
    onHorizonChange: (s: Date, e: Date) => {
      add(`onHorizonChange: ${s.toISOString().slice(0, 10)} .. ${e.toISOString().slice(0, 10)}`);
      setHorizonStart(s);
      setHorizonEnd(e);
      props.callbacks?.onHorizonChange?.(s, e);
    },
    onDelete: (ids: any) => { add(`onDelete: [${ids.join(',')}]`); props.callbacks?.onDelete?.(ids); },
    onCopy: (ids: any) => { add(`onCopy: [${ids.join(',')}]`); props.callbacks?.onCopy?.(ids); },
    onPaste: (d: any) => { add(`onPaste`); props.callbacks?.onPaste?.(d); },
    onNavigate: (dir: any) => { add(`onNavigate: ${dir}`); props.callbacks?.onNavigate?.(dir); },
    onItemDoubleClick: (id: any) => { add(`onItemDoubleClick: ${id}`); props.callbacks?.onItemDoubleClick?.(id); },
  };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, height: '100%' } },
    React.createElement('div', { style: { flex: 1, minHeight: 0 } },
      React.createElement(Timeline, { ...props, callbacks, start: horizonStart, end: horizonEnd }),
    ),
    React.createElement('div', {
      style: { maxHeight: 120, overflow: 'auto', background: '#1e1e1e', color: '#d4d4d4', borderRadius: 4, padding: '6px 10px', fontSize: 11, fontFamily: 'monospace', flexShrink: 0 },
    },
      log.length === 0
        ? React.createElement('span', { style: { color: '#888' } }, 'Callback log — interact with the timeline')
        : log.map((msg, i) =>
            React.createElement('div', { key: i, style: { padding: '1px 0', borderBottom: '1px solid #333' } }, msg),
          ),
    ),
  );
}

// ── Stories ─────────────────────────────────────────────────────────

// --- Data states ----------------------------------------------------

export const Empty: Story = {
  name: 'Empty — no items',
  args: {
    items: [],
    start: d(2026, 6, 1),
    end: d(2026, 6, 20),
    step: 'day',
  },
};

export const Loading: Story = {
  name: 'Loading state',
  args: {
    ...Empty.args,
    loading: true,
  },
};

export const LoadingCustomRenderer: Story = {
  name: 'Loading with custom renderer',
  args: {
    ...Empty.args,
    loading: true,
    renderers: {
      renderLoading: () =>
        React.createElement('div', { style: { textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: 24, marginBottom: 8 } }, '⏳'),
          React.createElement('div', null, 'Fetching schedule data...'),
        ),
    },
  },
};

// --- Basic items ----------------------------------------------------

export const SingleItem: Story = {
  name: 'Single item',
  args: {
    items: [makeItem({ id: 'only', label: 'One task', start: d(2026, 6, 3), end: d(2026, 6, 10), color: '#4a90d9', progress: 40 })],
    start: d(2026, 6, 1),
    end: d(2026, 6, 20),
    step: 'day',
  },
};

export const FewItems: Story = {
  name: 'A few items (no groups)',
  args: {
    items: makeItems(4, { color: '#4a90d9' }),
    start: d(2026, 6, 1),
    end: d(2026, 6, 20),
    step: 'day',
  },
};

export const ManyItems: Story = {
  name: 'Many items (overlapping)',
  args: {
    items: makeItems(12, { color: '#4a90d9' }),
    start: d(2026, 6, 1),
    end: d(2026, 6, 20),
    step: 'day',
  },
};

// --- Groups ---------------------------------------------------------

export const WithGroups: Story = {
  name: 'With groups',
  render: () => {
    const { items, groups, links } = demoKit();
    const { start, end } = demoRange();
    return React.createElement(CallbackWrapper, { items, groups, links, start, end, step: 'day' });
  },
};

export const GroupsNoLinks: Story = {
  name: 'Groups without links',
  args: {
    ...(() => { const k = demoKit(); return { items: k.items, groups: k.groups, start: demoRange().start, end: demoRange().end, step: 'day' as const, showLinks: false }; })(),
  },
};

// --- Time scales ----------------------------------------------------

export const WeekStep: Story = {
  name: 'Week granularity',
  args: {
    items: makeItems(4, { color: '#7b61ff' }),
    start: d(2026, 5, 1),
    end: d(2026, 8, 1),
    step: 'week',
  },
};

export const MonthStep: Story = {
  name: 'Month granularity',
  args: {
    items: makeItems(3, {
      start: d(2026, 3, 1),
      end: d(2026, 6, 1),
      color: '#e5c07b',
    }),
    start: d(2026, 1, 1),
    end: d(2026, 12, 31),
    step: 'month',
  },
};

export const YearStep: Story = {
  name: 'Year granularity',
  args: {
    items: [
      makeItem({ id: 'y1', label: 'Phase 1', start: d(2025, 6, 1), end: d(2026, 3, 1), color: '#4a90d9' }),
      makeItem({ id: 'y2', label: 'Phase 2', start: d(2026, 4, 1), end: d(2027, 1, 1), color: '#7b61ff' }),
    ],
    start: d(2025, 1, 1),
    end: d(2028, 1, 1),
    step: 'year',
  },
};

// --- Readonly / interaction modes -----------------------------------

export const Readonly: Story = {
  name: 'Read-only mode',
  render: () => {
    const { items, groups, links } = demoKit();
    const { start, end } = demoRange();
    return React.createElement(CallbackWrapper, { items, groups, links, start, end, step: 'day', readonly: true });
  },
};

export const NotResizable: Story = {
  name: 'Not resizable',
  args: {
    ...demoKit(),
    ...demoRange(),
    step: 'day' as const,
    resizable: false,
  },
};

export const NotMovable: Story = {
  name: 'Not movable',
  args: {
    ...demoKit(),
    ...demoRange(),
    step: 'day' as const,
    movable: false,
  },
};

// --- Controlled selection -------------------------------------------

export const ControlledSelection: Story = {
  name: 'Controlled selection',
  render: () => {
    const { items, groups, links } = demoKit();
    const { start, end } = demoRange();
    return React.createElement(CallbackWrapper, {
      items, groups, links, start, end, step: 'day' as const,
      selectedItemIds: ['t1', 't3'],
      selectedLinkIds: [],
    });
  },
};

// --- Custom renderers -----------------------------------------------

export const CustomBarRenderer: Story = {
  name: 'Custom bar renderer',
  render: () => {
    const { items, groups } = demoKit();
    const { start, end } = demoRange();
    return React.createElement(Timeline, {
      items, groups, start, end, step: 'day' as const,
      renderers: {
        renderItem: (item: TimelineItem) =>
          React.createElement('div', { style: { display: 'flex', gap: 4, alignItems: 'center', width: '100%' } },
            React.createElement('span', null, item.progress != null && item.progress === 100 ? '✅' : '📋'),
            React.createElement('strong', null, item.label),
            item.progress != null && item.progress < 100 &&
              React.createElement('span', { style: { fontSize: 10, opacity: 0.8 } }, `${item.progress}%`),
          ),
      },
    });
  },
};

export const CustomSidebarHeader: Story = {
  name: 'Custom sidebar header',
  args: {
    ...demoKit(),
    ...demoRange(),
    step: 'day' as const,
    renderers: {
      renderSidebarHeader: () =>
        React.createElement('div', { style: { padding: '4px 12px', fontWeight: 700, color: '#1a73e8' } }, '📁 Teams'),
    },
  },
};

// --- No sidebar (flat items) ----------------------------------------

export const NoSidebarFlat: Story = {
  name: 'Flat items (no sidebar)',
  args: {
    items: makeItems(6, { color: '#56b6c2' }),
    start: d(2026, 6, 1),
    end: d(2026, 6, 20),
    step: 'day' as const,
    sidebarWidth: 0,
  },
};

// --- Today marker ---------------------------------------------------

export const WithoutToday: Story = {
  name: 'Without today marker',
  args: {
    ...demoKit(),
    ...demoRange(),
    step: 'day' as const,
    showToday: false,
  },
};

// --- Callback logging -----------------------------------------------

export const WithCallbackLogging: Story = {
  name: 'Interactive — callback logging',
  render: () => {
    const { items, groups, links } = demoKit();
    const { start, end } = demoRange();
    return React.createElement(CallbackWrapper, { items, groups, links, start, end, step: 'day' });
  },
};

// --- Minimum viable — no features -----------------------------------

export const Minimal: Story = {
  name: 'Minimal — no interactivity',
  args: {
    items: makeItems(2, { resizable: false, movable: false, selectable: false, color: '#999' }),
    start: d(2026, 6, 1),
    end: d(2026, 6, 20),
    step: 'day' as const,
    resizable: false,
    movable: false,
    showLinks: false,
    showToday: false,
    sidebarWidth: 0,
  },
};

// --- Both-axis scroll -----------------------------------------------

export const BothAxisScroll: Story = {
  name: 'Scroll X and Y',
  render: () => {
    const colours = ['#4a90d9', '#7b61ff', '#e06c75', '#56b6c2', '#e5c07b', '#98c379', '#c678dd', '#d19a66'];
    // 12 groups, 5 items each = 60 items over 6 months — overflows both axes
    const groups: any[] = [];
    const items: any[] = [];
    for (let g = 0; g < 12; g++) {
      const gId = `g${g}`;
      groups.push({ id: gId, label: `Team ${String.fromCharCode(65 + g)}`, items: [] as any[] });
      for (let t = 0; t < 5; t++) {
        const startDay = 1 + g * 14 + t * 3;
        const item = makeItem({
          id: `xy-${g}-${t}`,
          label: `Task ${g + 1}.${t + 1} — ${['Design','Build','Test','Review','Deploy'][t]}`,
          start: d(2026, 1, startDay),
          end: d(2026, 1, startDay + 2 + (t % 3)),
          color: colours[(g + t) % colours.length],
          progress: (t * 25) as any,
          groupId: gId,
        });
        items.push(item);
        groups[g].items.push(item);
      }
    }
    return React.createElement(Timeline, {
      items,
      groups,
      start: d(2025, 11, 1),
      end: d(2026, 6, 1),
      step: 'week' as const,
      fitContainer: false,
      fullHeight: true,
      stickyHeader: true,
    });
  },
};
