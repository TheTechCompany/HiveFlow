// ── Timeline Interactive Test Harness ─────────────────────────────
// Renders the Timeline with debug logging for all pointer events and internal state.
// Visit: http://localhost:8503/dashboard/flow/timeline-demo
// Open browser console to see real-time pointer event traces.

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Timeline,
  type TimelineItem,
  type TimelineLink,
  type TimelineGroup,
  type ItemChange,
  type SelectionState,
} from '../../components/Timeline';
import { Box, Typography, Chip, Switch, FormControlLabel, Slider } from '@mui/material';

// ── Sample data ─────────────────────────────────────────────────────

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

const COLORS = ['#4a90d9', '#e67e22', '#2ecc71', '#9b59b6', '#e74c3c', '#1abc9c'];
const LABELS = [
  'Foundation', 'Framing', 'Electrical', 'Plumbing', 'Drywall',
  'Roofing', 'HVAC', 'Insulation', 'Flooring', 'Painting',
  'Windows', 'Siding', 'Landscaping', 'Demo', 'Inspection',
];

/** Generate a random set of items spanning a wide date range so panning
 *  reveals different items rather than dragging them all along. */
function makeRandomItems(): TimelineItem[] {
  const items: TimelineItem[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const baseMs = today.getTime();

  const groupIds = ['g1', 'g2', 'g3', 'g4', 'g5'];
  let id = 1;
  for (const gid of groupIds) {
    // 3-7 tasks per group, spread over -30 to +60 days
    const count = 3 + Math.floor(Math.random() * 5);
    for (let j = 0; j < count; j++) {
      const startOffset = -30 + Math.floor(Math.random() * 90); // days
      const duration = 2 + Math.floor(Math.random() * 15);     // days
      items.push({
        id: `task-${id++}`,
        start: new Date(baseMs + startOffset * 86400000),
        end: new Date(baseMs + (startOffset + duration) * 86400000),
        label: `${LABELS[Math.floor(Math.random() * LABELS.length)]} ${id - 1}`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        groupId: gid,
        progress: Math.floor(Math.random() * 100),
      });
    }
  }
  return items;
}

const sampleLinks: TimelineLink[] = [
  { id: 'link-1', source: 'task-1', target: 'task-2' },
  { id: 'link-2', source: 'task-2', target: 'task-3' },
];

const sampleGroups: TimelineGroup[] = [
  { id: 'g1', label: 'Phase 1 — Structure' },
  { id: 'g2', label: 'Phase 2 — Utilities' },
  { id: 'g3', label: 'Phase 3 — Interior' },
  { id: 'g4', label: 'Phase 4 — Finishes' },
  { id: 'g5', label: 'Phase 5 — Closeout' },
];

// ── Main harness ─────────────────────────────────────────────────────

export const TimelineHarness: React.FC = () => {
  const [start, setStart] = useState(() => daysFromNow(-5));
  const [end, setEnd] = useState(() => daysFromNow(20));
  const [items, setItems] = useState<TimelineItem[]>(() => makeRandomItems());
  const [groups, setGroups] = useState<TimelineGroup[]>(() => sampleGroups);
  const [links] = useState<TimelineLink[]>(sampleLinks);
  const [selected, setSelected] = useState<string[]>([]);
  const [lastChange, setLastChange] = useState<string | null>(null);
  const [readonly, setReadonly] = useState(false);
  const [showGroups, setShowGroups] = useState(true);
  const [zoomDays, setZoomDays] = useState(24); // approximate days visible
  // Higher zoomDays = zoomed OUT = narrower bars = smaller stepCount
  const stepCount = Math.max(3, Math.min(60, Math.round(350 / zoomDays)));

  // When zoom changes, expand/contract the date range around its current center
  const startRef = useRef(start);
  startRef.current = start;
  const endRef = useRef(end);
  endRef.current = end;

  useEffect(() => {
    const centerMs = (startRef.current.getTime() + endRef.current.getTime()) / 2;
    const halfMs = (zoomDays / 2) * 86400000;
    setStart(new Date(centerMs - halfMs));
    setEnd(new Date(centerMs + halfMs));
  }, [zoomDays]);

  let nextId = 200; // start higher to avoid collision with random items

  const handleHorizonChange = useCallback((s: Date, e: Date) => {
    setStart(s);
    setEnd(e);
  }, []);

  const handleNavigate = useCallback(
    (dir: 'prev' | 'next' | 'today') => {
      const stepMs = 14 * 86400000;
      if (dir === 'today') {
        setStart(daysFromNow(-5));
        setEnd(daysFromNow(20));
      } else {
        const sign = dir === 'prev' ? -1 : 1;
        setStart((prev) => new Date(prev.getTime() + sign * stepMs));
        setEnd((prev) => new Date(prev.getTime() + sign * stepMs));
      }
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
    const msg = `${change.id}: ${change.start?.toLocaleDateString() ?? '-'} – ${change.end?.toLocaleDateString() ?? '-'}`;
    setLastChange(msg);
  }, []);

  const handleItemChanging = useCallback((_change: ItemChange) => {}, []);

  const handleSelect = useCallback((sel: SelectionState) => {
    setSelected(sel.itemIds);
  }, []);

  const handleDelete = useCallback((ids: string[]) => {
    setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
    setLastChange(`Deleted ${ids.length} item(s)`);
  }, []);

  const handleCreate = useCallback((s: Date, e: Date, groupId?: string) => {
    const id = `task-${nextId++}`;
    const gid = groupId || `new-group-${nextId}`;
    setGroups((prev) => {
      if (prev.some((g) => g.id === gid)) return prev;
      return [...prev, { id: gid, label: gid }];
    });
    setItems((prev) => [...prev, { id, start: s, end: e, label: `New task ${nextId - 1}`, color: COLORS[(nextId - 1) % COLORS.length], groupId: gid }]);
    setLastChange(`Created ${id}`);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', p: 2, gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight={600}>Timeline Test Harness</Typography>
        <FormControlLabel
          control={<Switch size="small" checked={readonly} onChange={(e) => setReadonly(e.target.checked)} />}
          label="Read-only"
        />
        <FormControlLabel
          control={<Switch size="small" checked={showGroups} onChange={(e) => setShowGroups(e.target.checked)} />}
          label="Groups"
        />
        {selected.length > 0 && <Chip label={`${selected.length} selected`} color="primary" size="small" onDelete={() => setSelected([])} />}
        {lastChange && <Chip label={lastChange} size="small" variant="outlined" />}
        <Slider
          size="small"
          value={zoomDays}
          min={5}
          max={60}
          step={1}
          onChange={(_e, v) => setZoomDays(v as number)}
          sx={{ width: 120, ml: 1 }}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v}d`}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        {readonly
          ? 'View-only mode'
          : '🖱️ Drag empty space to pan · ⌨️ Shift+drag to create · Drag bars to move · Drag edges to resize · Delete/Backspace to remove'}
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden', border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Timeline
          items={items}
          links={links}
          groups={showGroups ? groups : undefined}
          start={start}
          end={end}
          step="day"
          stepCount={stepCount}
          itemHeight={32}
          headerHeight={60}
          showLinks
          showToday
          fitContainer
          readonly={readonly}
          selectedItemIds={selected}
          callbacks={{
            onItemChange: handleItemChange,
            onItemChanging: handleItemChanging,
            onSelect: handleSelect,
            onDelete: handleDelete,
            onItemCreate: handleCreate,
            onNavigate: handleNavigate,
            onHorizonChange: handleHorizonChange,
          }}
          renderers={{
            renderItem: (item) => <span style={{ fontSize: 11, fontWeight: 500 }}>{item.label}</span>,
          }}
        />
      </Box>
    </Box>
  );
};

export default TimelineHarness;
