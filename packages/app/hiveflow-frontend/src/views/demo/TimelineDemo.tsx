// ── Timeline Demo Page ──────────────────────────────────────────────
// Visit /dashboard/flow/timeline-demo after running `yarn start`

import React, { useState, useCallback } from 'react';
import {
  Timeline,
  type TimelineItem,
  type TimelineLink,
  type TimelineGroup,
  type ItemChange,
  type SelectionState,
} from '../../components/Timeline';
import { Box, Typography, Chip, Switch, FormControlLabel } from '@mui/material';

// ── Sample data ─────────────────────────────────────────────────────

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

const COLORS = ['#4a90d9', '#e67e22', '#2ecc71', '#9b59b6', '#e74c3c', '#1abc9c'];

function makeSampleItems(baseDate: Date): TimelineItem[] {
  const d = (n: number) => { const r = new Date(baseDate); r.setDate(r.getDate() + n); return r; };
  return [
    { id: 'task-1', start: d(-3), end: d(4), label: 'Foundation pour', color: COLORS[0], groupId: 'g1', progress: 80 },
    { id: 'task-2', start: d(2), end: d(9), label: 'Steel erection', color: COLORS[1], groupId: 'g1', progress: 20 },
    { id: 'task-3', start: d(-1), end: d(6), label: 'Framing', color: COLORS[2], groupId: 'g1', progress: 45 },
    { id: 'task-4', start: d(-5), end: d(-1), label: 'Site prep', color: COLORS[3], groupId: 'g2', progress: 100 },
    { id: 'task-5', start: d(0), end: d(7), label: 'Electrical rough-in', color: COLORS[4], groupId: 'g2', progress: 10 },
    { id: 'task-6', start: d(5), end: d(12), label: 'Plumbing', color: COLORS[5], groupId: 'g2', progress: 0 },
    { id: 'task-7', start: d(8), end: d(15), label: 'Drywall', color: COLORS[0], groupId: 'g3', progress: 0 },
    { id: 'task-8', start: d(10), end: d(18), label: 'Finishes', color: COLORS[1], groupId: 'g3', progress: 0 },
  ];
}

const sampleLinks: TimelineLink[] = [
  { id: 'link-1', source: 'task-1', target: 'task-2' },
  { id: 'link-2', source: 'task-2', target: 'task-3' },
  { id: 'link-3', source: 'task-4', target: 'task-5' },
  { id: 'link-4', source: 'task-5', target: 'task-6' },
  { id: 'link-5', source: 'task-6', target: 'task-7' },
  { id: 'link-6', source: 'task-7', target: 'task-8' },
];

const sampleGroups: TimelineGroup[] = [
  { id: 'g1', label: 'Phase 1 — Structure' },
  { id: 'g2', label: 'Phase 2 — Utilities' },
  { id: 'g3', label: 'Phase 3 — Interior' },
];

// ── Component ───────────────────────────────────────────────────────

export const TimelineDemo: React.FC = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const [items, setItems] = useState<TimelineItem[]>(() => makeSampleItems(viewDate));
  const [links] = useState<TimelineLink[]>(sampleLinks);
  const [selected, setSelected] = useState<string[]>([]);
  const [lastChange, setLastChange] = useState<string | null>(null);
  const [readonly, setReadonly] = useState(false);

  const start = daysFromNow(-5);
  const end = daysFromNow(20);
  let nextId = 100;

  const handleNavigate = useCallback(
    (dir: 'prev' | 'next' | 'today') => {
      setViewDate((prev) => {
        const n = new Date(prev);
        switch (dir) {
          case 'prev': n.setDate(n.getDate() - 14); break;
          case 'next': n.setDate(n.getDate() + 14); break;
          case 'today': return new Date();
        }
        setItems(makeSampleItems(n));
        return n;
      });
    },
    [],
  );

  const handleItemChange = useCallback((change: ItemChange) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== change.id) return item;
        return { ...item, ...(change.start ? { start: change.start } : {}), ...(change.end ? { end: change.end } : {}) };
      }),
    );
    setLastChange(`${change.id} → ${change.start?.toLocaleDateString() ?? '-'} – ${change.end?.toLocaleDateString() ?? '-'}`);
  }, []);

  const handleSelect = useCallback((sel: SelectionState) => setSelected(sel.itemIds), []);

  const handleDelete = useCallback((ids: string[]) => {
    setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
    setLastChange(`Deleted ${ids.length} item(s)`);
  }, []);

  const handleCreate = useCallback((s: Date, e: Date) => {
    const id = `task-${nextId++}`;
    setItems((prev) => [...prev, { id, start: s, end: e, label: `New task ${nextId - 1}`, color: COLORS[(nextId - 1) % COLORS.length], groupId: 'g1' }]);
    setLastChange(`Created ${id}: ${s.toLocaleDateString()} – ${e.toLocaleDateString()}`);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', p: 2, gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <Typography variant="h5" fontWeight={600}>Timeline Demo</Typography>
        <FormControlLabel
          control={<Switch size="small" checked={readonly} onChange={(e) => setReadonly(e.target.checked)} />}
          label="Read-only"
        />
        {selected.length > 0 && <Chip label={`${selected.length} selected`} color="primary" size="small" onDelete={() => setSelected([])} />}
        {lastChange && <Chip label={lastChange} size="small" variant="outlined" />}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        {readonly
          ? 'View-only mode — no interactions allowed'
          : 'Drag bars to move · Drag edges to resize · Drag empty space to pan · Shift+drag to create · Click to select · Delete to remove'}
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'auto' }}>
        <Timeline
          items={items}
          links={links}
          groups={sampleGroups}
          start={daysFromNow(-5)}
          end={daysFromNow(20)}
          step="day"
          itemHeight={32}
          headerHeight={60}
          showLinks
          showToday
          fitContainer
          readonly={readonly}
          selectedItemIds={selected}
          callbacks={{
            onItemChange: handleItemChange,
            onSelect: handleSelect,
            onDelete: handleDelete,
            onItemCreate: handleCreate,
            onNavigate: handleNavigate,
          }}
          renderers={{
            renderItem: (item) => <span style={{ fontSize: 11, fontWeight: 500 }}>{item.label}</span>,
          }}
        />
      </Box>
    </Box>
  );
};

export default TimelineDemo;
