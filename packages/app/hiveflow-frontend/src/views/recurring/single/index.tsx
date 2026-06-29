import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  Repeat as RepeatIcon,
  ArrowBack,
  Event,
} from '@mui/icons-material';
import { GanttView, type TimelineItem, type TimelineGroup, type TimelineStep, TreeBranchVSCode, VSCODE_TWISTY_WIDTH, DEPTH_BORDER_WIDTH } from '@hive-flow/ui';
import moment from 'moment';

// ── Types ───────────────────────────────────────────────────────

interface RecurringEvent {
  id: string;
  scheduleId: string;
  parentId?: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  assignedTo?: string;
}

interface Schedule {
  id: string;
  name: string;
  description: string;
  events: RecurringEvent[];
}

type FrequencyOption = RecurringEvent['frequency'];

const FREQUENCIES: { value: FrequencyOption; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

// ── Seed data (shared reference — in real app comes from backend) ──

const SEED_SCHEDULES: Schedule[] = [
  {
    id: 's1',
    name: 'ISO 27001 Audit',
    description: 'Annual information security management audit cycle',
    events: [
      { id: 'e1', scheduleId: 's1', name: 'Risk assessment review', description: 'Review and update risk register', frequency: 'quarterly', startDate: '2025-01-15', assignedTo: 'Security Team' },
      { id: 'e2', scheduleId: 's1', parentId: 'e1', name: 'Asset inventory update', description: 'Update hardware and software asset list', frequency: 'quarterly', startDate: '2025-01-20', assignedTo: 'IT Operations' },
      { id: 'e3', scheduleId: 's1', parentId: 'e1', name: 'Threat assessment', description: 'Re-evaluate threat landscape', frequency: 'quarterly', startDate: '2025-01-22', assignedTo: 'Security Team' },
      { id: 'e4', scheduleId: 's1', name: 'Internal audit evidence collection', description: 'Gather evidence for Annex A controls', frequency: 'yearly', startDate: '2025-03-01', assignedTo: 'Audit Committee' },
      { id: 'e4a', scheduleId: 's1', parentId: 'e4', name: 'Control testing', description: 'Test Annex A controls', frequency: 'yearly', startDate: '2025-03-15', assignedTo: 'Audit Committee' },
      { id: 'e5', scheduleId: 's1', name: 'Management review meeting', description: 'Formal ISMS management review', frequency: 'yearly', startDate: '2025-06-01', assignedTo: 'CISO' },
    ],
  },
  {
    id: 's2',
    name: 'SOC 2 Compliance',
    description: 'Annual SOC 2 Type II control monitoring',
    events: [
      { id: 'e5', scheduleId: 's2', name: 'Access control review', description: 'Review system access, remove stale accounts', frequency: 'monthly', startDate: '2025-01-05', assignedTo: 'IT Operations' },
      { id: 'e6', scheduleId: 's2', name: 'Change management audit', description: 'Audit change requests against policy', frequency: 'weekly', startDate: '2025-01-06', assignedTo: 'Engineering Lead' },
      { id: 'e7', scheduleId: 's2', name: 'Vendor security review', description: 'Review third-party vendor posture', frequency: 'quarterly', startDate: '2025-02-01', assignedTo: 'Procurement' },
      { id: 'e8', scheduleId: 's2', name: 'Backup & DR test', description: 'Test backup restoration and DR plan', frequency: 'quarterly', startDate: '2025-03-15', assignedTo: 'Platform Team' },
    ],
  },
  {
    id: 's3',
    name: 'Equipment Maintenance',
    description: 'Routine maintenance checks',
    events: [
      { id: 'e9', scheduleId: 's3', name: 'Safety inspection', description: 'Monthly safety inspection', frequency: 'monthly', startDate: '2025-01-01', assignedTo: 'Operations' },
      { id: 'e10', scheduleId: 's3', name: 'Calibration check', description: 'Verify measurement instruments', frequency: 'quarterly', startDate: '2025-02-15', assignedTo: 'Quality Assurance' },
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────

function generateOccurrences(event: RecurringEvent, windowStart: Date, windowEnd: Date): Date[] {
  const occurrences: Date[] = [];
  let cursor = moment(event.startDate);

  // Fast-forward to window
  while (cursor.isBefore(moment(windowStart))) {
    switch (event.frequency) {
      case 'daily': cursor.add(1, 'day'); break;
      case 'weekly': cursor.add(1, 'week'); break;
      case 'monthly': cursor.add(1, 'month'); break;
      case 'quarterly': cursor.add(3, 'months'); break;
      case 'yearly': cursor.add(1, 'year'); break;
    }
    if (cursor.diff(moment(event.startDate), 'years') > 50) break; // safety
  }

  while (cursor.isBefore(moment(windowEnd))) {
    occurrences.push(cursor.toDate());
    switch (event.frequency) {
      case 'daily': cursor.add(1, 'day'); break;
      case 'weekly': cursor.add(1, 'week'); break;
      case 'monthly': cursor.add(1, 'month'); break;
      case 'quarterly': cursor.add(3, 'months'); break;
      case 'yearly': cursor.add(1, 'year'); break;
    }
    if (occurrences.length > 500) break; // safety
  }

  return occurrences;
}

const EVENT_COLORS = ['#ef5350', '#ff9800', '#42a5f5', '#66bb6a', '#ab47bc', '#26c6da', '#7e57c2', '#ec407a'];

// ── Main ────────────────────────────────────────────────────────

export const ScheduleSingle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // For now use seed data; in a real app this would be fetched
  const [schedules, setSchedules] = useState<Schedule[]>(SEED_SCHEDULES);
  const schedule = schedules.find((s) => s.id === id);

  // Default horizon: current year
  const [horizon, setHorizon] = useState({
    start: moment().startOf('year').toDate(),
    end: moment().endOf('year').toDate(),
  });

  // ── Tree state ────────────────────────────────────────────
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = useCallback((eventId: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  }, []);

  const treeInfo = useMemo(() => {
    if (!schedule) return { flat: [] as (RecurringEvent & { depth: number; hasChildren: boolean; connectors: boolean[] })[], childrenOf: new Map<string, string[]>() };
    const events = schedule.events;
    const childrenOf = new Map<string, string[]>();
    for (const e of events) {
      const pid = e.parentId || '__root__';
      const list = childrenOf.get(pid) || [];
      list.push(e.id);
      childrenOf.set(pid, list);
    }

    const getDepth = (eventId: string): number => {
      let d = 0;
      let cur = events.find((e) => e.id === eventId);
      while (cur?.parentId) { d++; cur = events.find((e) => e.id === cur!.parentId); }
      return d;
    };

    // Flatten in tree order (DFS), respecting collapsed
    const flat: (RecurringEvent & { depth: number; hasChildren: boolean; connectors: boolean[] })[] = [];
    const walk = (parentId: string | undefined, depth: number, parentConnectors: boolean[]) => {
      const kids = childrenOf.get(parentId || '__root__') || [];
      for (let i = 0; i < kids.length; i++) {
        const eid = kids[i];
        const event = events.find((e) => e.id === eid);
        if (!event) continue;
        const hasKids = childrenOf.has(eid);
        const isLast = i === kids.length - 1;
        const connectors = [...parentConnectors, !isLast];
        flat.push({ ...event, depth, hasChildren: hasKids, connectors });
        if (hasKids && !collapsed.has(eid)) {
          walk(eid, depth + 1, connectors);
        }
      }
    };
    walk(undefined, 0, []);
    return { flat, childrenOf };
  }, [schedule, collapsed]);

  const indentEvent = useCallback((eventId: string) => {
    if (!schedule) return;
    const events = schedule.events;
    const idx = events.findIndex((e) => e.id === eventId);
    if (idx <= 0) return;
    // Find previous sibling at same depth
    const event = events[idx];
    const depth = treeInfo.flat.find((f) => f.id === eventId)?.depth ?? 0;
    let prevSibling: RecurringEvent | undefined;
    for (let i = idx - 1; i >= 0; i--) {
      const d = treeInfo.flat.find((f) => f.id === events[i].id)?.depth ?? 0;
      if (d === depth) { prevSibling = events[i]; break; }
      if (d < depth) break;
    }
    if (prevSibling) {
      event.parentId = prevSibling.id;
      setSchedules([...SEED_SCHEDULES]);
    }
  }, [schedule, treeInfo]);

  const outdentEvent = useCallback((eventId: string) => {
    if (!schedule) return;
    const event = schedule.events.find((e) => e.id === eventId);
    if (!event?.parentId) return;
    const parent = schedule.events.find((e) => e.id === event.parentId);
    event.parentId = parent?.parentId || undefined;
    setSchedules([...SEED_SCHEDULES]);
  }, [schedule]);

  // ── Inline drafts (spreadsheet-style creation) ─────────────
  const [drafts, setDrafts] = useState<RecurringEvent[]>(() => {
    if (!schedule) return [];
    return [{
      id: `draft-${Date.now()}`,
      scheduleId: schedule.id,
      name: '',
      description: '',
      frequency: 'monthly',
      startDate: moment().format('YYYY-MM-DD'),
      assignedTo: '',
    }];
  });

  const draftInputRef = React.useRef<HTMLInputElement>(null);

  const updateDraftField = useCallback((draftId: string, field: keyof RecurringEvent, value: string) => {
    setDrafts((prev) => prev.map((d) => (d.id === draftId ? { ...d, [field]: value } : d)));
  }, []);

  const commitDraft = useCallback((draftId: string) => {
    setDrafts((prev) => {
      const draft = prev.find((d) => d.id === draftId);
      const valid = draft && draft.name.trim() && draft.startDate;
      // Mutate seed data if valid
      if (valid) {
        const idx = SEED_SCHEDULES.findIndex((s) => s.id === draft!.scheduleId);
        if (idx !== -1) {
          SEED_SCHEDULES[idx].events.push({ ...draft!, id: `e${Date.now()}` });
        }
      }
      // Always replace with a fresh blank row (never let the draft row disappear)
      const scheduleId = draft?.scheduleId ?? schedule?.id ?? '';
      const newDraft: RecurringEvent = {
        id: `draft-${Date.now()}`,
        scheduleId,
        name: '',
        description: '',
        frequency: 'monthly',
        startDate: moment().format('YYYY-MM-DD'),
        assignedTo: '',
      };
      return prev.map((d) => (d.id === draftId ? newDraft : d));
    });
    if (drafts.find((d) => d.id === draftId)?.name.trim()) {
      setSchedules([...SEED_SCHEDULES]);
    }
    // Focus the new draft row's name input after render
    setTimeout(() => draftInputRef.current?.focus(), 0);
  }, [drafts, schedule]);

  // ── Edit modal (kept for editing existing events) ──────────
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RecurringEvent | null>(null);
  const [eventFormName, setEventFormName] = useState('');
  const [eventFormDesc, setEventFormDesc] = useState('');
  const [eventFormFrequency, setEventFormFrequency] = useState<FrequencyOption>('monthly');
  const [eventFormStartDate, setEventFormStartDate] = useState('');
  const [eventFormAssigned, setEventFormAssigned] = useState('');

  const openEditEvent = (event: RecurringEvent) => {
    setEditingEvent(event);
    setEventFormName(event.name);
    setEventFormDesc(event.description);
    setEventFormFrequency(event.frequency);
    setEventFormStartDate(event.startDate);
    setEventFormAssigned(event.assignedTo || '');
    setEventModalOpen(true);
  };

  const saveEvent = () => {
    if (editingEvent) {
      editingEvent.name = eventFormName;
      editingEvent.description = eventFormDesc;
      editingEvent.frequency = eventFormFrequency;
      editingEvent.startDate = eventFormStartDate;
      editingEvent.assignedTo = eventFormAssigned || undefined;
      setSchedules([...SEED_SCHEDULES]);
    }
    setEventModalOpen(false);
    setEditingEvent(null);
  };

  // ── Column widths for the sidebar ──────────────────────────
  const COL_TREE = VSCODE_TWISTY_WIDTH; // 16 — twisty column
  const COL_FREQ = 90;
  const COL_START = 115;
  const COL_ASSIGNED = 90;
  const SIDEBAR_W = 520; // fixed sidebar width, name column flexes to fill

  // ── Zoom & navigation ──────────────────────────────────
  const [step, setStep] = useState<TimelineStep>(() => {
    const span = moment().endOf('year').diff(moment().startOf('year'), 'days');
    if (span <= 31) return 'day';
    if (span <= 180) return 'week';
    return 'month';
  });

  const handleZoom = useCallback(
    (s: TimelineStep) => {
      setStep(s);
      // Resize horizon to a sensible window for the new granularity
      const center = new Date((horizon.start.getTime() + horizon.end.getTime()) / 2);
      switch (s) {
        case 'day':
          setHorizon({
            start: moment(center).subtract(15, 'days').toDate(),
            end: moment(center).add(15, 'days').toDate(),
          });
          break;
        case 'week':
          setHorizon({
            start: moment(center).subtract(6, 'weeks').toDate(),
            end: moment(center).add(6, 'weeks').toDate(),
          });
          break;
        case 'month':
          setHorizon({
            start: moment(center).subtract(6, 'months').toDate(),
            end: moment(center).add(6, 'months').toDate(),
          });
          break;
      }
    },
    [horizon],
  );

  const handleNavigate = useCallback(
    (dir: 'prev' | 'next' | 'today') => {
      const span = horizon.end.getTime() - horizon.start.getTime();
      if (dir === 'today') {
        const now = new Date();
        setHorizon({
          start: new Date(now.getTime() - span / 2),
          end: new Date(now.getTime() + span / 2),
        });
      } else {
        const sign = dir === 'prev' ? -1 : 1;
        const shift = span * 0.5 * sign;
        setHorizon((h) => ({ start: new Date(h.start.getTime() + shift), end: new Date(h.end.getTime() + shift) }));
      }
    },
    [horizon],
  );

  const timelineGroups = useMemo((): TimelineGroup[] => {
    if (!schedule) return [];
    return [
      ...treeInfo.flat.map((event) => ({
        id: event.id,
        label: event.name,
      })),
      ...drafts.map((d) => ({
        id: d.id,
        label: d.name || 'New event',
      })),
    ];
  }, [schedule, drafts, treeInfo]);

  const timelineItems = useMemo((): TimelineItem[] => {
    if (!schedule) return [];
    const items: TimelineItem[] = [];
    // Pre-compute color index per event: root events get their own color, children inherit parent's color
    const rootEvents = schedule.events.filter((e) => !e.parentId);
    const colorMap = new Map<string, number>();
    const resolveColorIx = (eventId: string): number => {
      if (colorMap.has(eventId)) return colorMap.get(eventId)!;
      const event = schedule.events.find((e) => e.id === eventId);
      if (!event) return 0;
      if (event.parentId) {
        const pix = resolveColorIx(event.parentId);
        colorMap.set(eventId, pix);
        return pix;
      }
      const ix = rootEvents.findIndex((e) => e.id === eventId);
      colorMap.set(eventId, ix);
      return ix;
    };
    schedule.events.forEach((event) => {
      const occurrences = generateOccurrences(event, horizon.start, horizon.end);
      const colorIx = resolveColorIx(event.id);
      occurrences.forEach((occ, oi) => {
        const end = moment(occ).add(1, 'day').toDate();
        items.push({
          id: `${event.id}-${oi}`,
          start: occ,
          end,
          groupId: event.id,
          color: EVENT_COLORS[Math.abs(colorIx) % EVENT_COLORS.length],
          selectable: false,
          movable: false,
          resizable: false,
          data: { event, occurrenceIndex: oi },
        });
      });
    });
    return items;
  }, [schedule, horizon]);

  // ── Sidebar renderers ─────────────────────────────────────
  const sidebarHeader = useMemo(() => (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', px: '12px', borderBottom: '2px solid', borderColor: 'grey.300', bgcolor: '#f1f5f9' }}>
      <Box sx={{ width: COL_TREE, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', borderRight: '1px solid', borderColor: 'grey.300' }}>#</Box>
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', px: 0.5, borderRight: '1px solid', borderColor: 'grey.300' }}>Event</Box>
      <Box sx={{ width: COL_FREQ, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', borderRight: '1px solid', borderColor: 'grey.300' }}>Frequency</Box>
      <Box sx={{ width: COL_START, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', borderRight: '1px solid', borderColor: 'grey.300' }}>Start Date</Box>
      <Box sx={{ width: COL_ASSIGNED, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', borderRight: '1px solid', borderColor: 'grey.300' }}>Assigned</Box>
    </Box>
  ), []);

  const renderGroupHeader = useCallback(
    (group: TimelineGroup, _expanded: boolean) => {
      if (!schedule) return null;

      // ── Draft row (inline spreadsheet-style creation) ──────
      const draft = drafts.find((d) => d.id === group.id);
      if (draft) {
        return (
          <Box
            sx={{
              display: 'flex', alignItems: 'center', height: '100%',
              px: 1.5, borderBottom: '1px solid', borderColor: 'grey.200',
              bgcolor: '#f0f7ff', minWidth: 0,
            }}
          >
            {/* Tree indent for draft (always depth 0) */}
            <Box sx={{ width: COL_TREE, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', borderRight: '1px solid', borderColor: 'grey.300' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#90caf9' }} />
            </Box>

            {/* Event name */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.300', height: '100%' }}>
              <TextField
                size="small" variant="standard"
                placeholder="Event name"
                value={draft.name}
                autoFocus
                inputRef={draftInputRef}
                onChange={(e) => updateDraftField(draft.id, 'name', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitDraft(draft.id);
                  if (e.key === 'Escape') setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
                }}
                onClick={(e) => e.stopPropagation()}
                sx={{ flex: 1, minWidth: 0, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
              />
            </Box>

            {/* Frequency */}
            <Box sx={{ width: COL_FREQ, flexShrink: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.300', height: '100%' }}>
              <TextField
                select size="small" variant="standard"
                value={draft.frequency}
                onChange={(e) => updateDraftField(draft.id, 'frequency', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.7rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
              >
                {FREQUENCIES.map((freq) => (
                  <MenuItem key={freq.value} value={freq.value} sx={{ fontSize: '0.75rem' }}>{freq.label}</MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Start date */}
            <Box sx={{ width: COL_START, flexShrink: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.300', height: '100%' }}>
              <TextField
                size="small" variant="standard" type="date"
                value={draft.startDate}
                onChange={(e) => updateDraftField(draft.id, 'startDate', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitDraft(draft.id); }}
                onClick={(e) => e.stopPropagation()}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px', fontSize: '0.7rem' } }}
              />
            </Box>

            {/* Assigned to */}
            <Box sx={{ width: COL_ASSIGNED, flexShrink: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.300', height: '100%' }}>
              <TextField
                size="small" variant="standard"
                placeholder="—"
                value={draft.assignedTo || ''}
                onChange={(e) => updateDraftField(draft.id, 'assignedTo', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitDraft(draft.id);
                  if (e.key === 'Escape') setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
                }}
                onClick={(e) => e.stopPropagation()}
                sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.7rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
              />
            </Box>
          </Box>
        );
      }

      // ── Existing event row ──────────────────────────────────

      const treeEvent = treeInfo.flat.find((f) => f.id === group.id);
      const event = treeEvent ? (schedule.events.find((e) => e.id === treeEvent.id)!) : null;
      if (!event || !treeEvent) return <span>{group.id}</span>;

      return (
        <Box
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              if (e.shiftKey) outdentEvent(event.id);
              else indentEvent(event.id);
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            px: 1.5,
            borderBottom: '1px solid',
            borderColor: 'grey.200',
            bgcolor: '#ffffff',
            '&:hover': { bgcolor: '#f5f5f5' },
            minWidth: 0,
            cursor: 'pointer',
          }}
        >
          <TreeBranchVSCode
            variant="depth-borders"
            depth={treeEvent.depth}
            hasChildren={treeEvent.hasChildren}
            isCollapsed={collapsed.has(event.id)}
            onToggle={() => toggleCollapse(event.id)}
            connectors={treeEvent.connectors}
          />

          {/* Event name */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }}>
            <TextField
              size="small"
              variant="standard"
              defaultValue={event.name}
              onBlur={(e) => {
                if (e.target.value !== event.name && e.target.value.trim()) {
                  // In a real app this would mutate via backend
                  event.name = e.target.value;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                  setTimeout(() => draftInputRef.current?.focus(), 0);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              sx={{ flex: 1, minWidth: 0, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
            />
          </Box>

          {/* Frequency */}
          <Box sx={{ width: COL_FREQ, flexShrink: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }}>
            <TextField
              select
              size="small"
              variant="standard"
              defaultValue={event.frequency}
              onChange={(e) => {
                event.frequency = e.target.value as FrequencyOption;
              }}
              onClick={(e) => e.stopPropagation()}
              sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.7rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
            >
              {FREQUENCIES.map((freq) => (
                <MenuItem key={freq.value} value={freq.value} sx={{ fontSize: '0.75rem' }}>
                  {freq.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Start date */}
          <Box sx={{ width: COL_START, flexShrink: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }}>
            <TextField
              size="small"
              variant="standard"
              type="date"
              defaultValue={event.startDate}
              onBlur={(e) => {
                if (e.target.value && e.target.value !== event.startDate) {
                  event.startDate = e.target.value;
                }
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              onClick={(e) => e.stopPropagation()}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px', fontSize: '0.7rem' } }}
            />
          </Box>

          {/* Assigned to */}
          <Box sx={{ width: COL_ASSIGNED, flexShrink: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }}>
            <TextField
              size="small"
              variant="standard"
              defaultValue={event.assignedTo || ''}
              placeholder="—"
              onBlur={(e) => {
                event.assignedTo = e.target.value || undefined;
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              onClick={(e) => e.stopPropagation()}
              sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.7rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
            />
          </Box>
        </Box>
      );
    },
    [schedule, drafts, updateDraftField, commitDraft, treeInfo, collapsed, toggleCollapse, indentEvent, outdentEvent],
  );

  if (!schedule) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Schedule not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* ── Breadcrumb / header ─────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={() => navigate('..')}>
            <ArrowBack fontSize="small" />
          </IconButton>
          <RepeatIcon sx={{ color: 'navigation.main' }} />
          <Typography sx={{ color: 'navigation.main' }} fontWeight="bold" variant="h6">
            {schedule.name}
          </Typography>
          <Chip
            label={`${schedule.events.length} event${schedule.events.length !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Box>
      </Box>

      {/* ── Zoom toolbar ─────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.5, bgcolor: '#f5f5f5', borderBottom: '1px solid', borderColor: 'grey.300', gap: 0.5, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mr: 1 }}>Zoom:</Typography>
        {(['day', 'week', 'month'] as const).map((s) => (
          <Button
            key={s}
            size="small"
            variant={step === s ? 'contained' : 'outlined'}
            onClick={() => handleZoom(s)}
            sx={{ textTransform: 'capitalize', fontSize: '0.7rem', py: 0.25, px: 1, minWidth: 0 }}
          >
            {s}
          </Button>
        ))}
      </Box>

      {/* ── Gantt view: sidebar rows + timeline side by side ─── */}
      <GanttView
        sidebarWidth={SIDEBAR_W}
        items={timelineItems}
        groups={timelineGroups}
        start={horizon.start}
        end={horizon.end}
        step={step}
        itemHeight={32}
        groupHeaderHeight={36}
        headerHeight={48}
        resizable={false}
        movable={false}
        showLinks={false}
        showToday
        fitContainer
        callbacks={{
          onNavigate: handleNavigate,
          onHorizonChange: (start: Date, end: Date) => {
            setHorizon({ start, end });
          },
        }}
        renderers={{
          renderSidebarHeader: () => sidebarHeader,
          renderGroupHeader,
          renderItem: (item: TimelineItem) => {
            const data: any = item.data;
            const event: RecurringEvent = data?.event;
            return (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 0.5,
                }}
              >
                <Event sx={{ fontSize: 12, color: 'white', opacity: 0.8 }} />
              </Box>
            );
          },
        }}
      />

      {/* ── Event create / edit dialog ────────────────────────── */}
      <Dialog
        open={eventModalOpen}
        onClose={() => {
          setEventModalOpen(false);
          setEditingEvent(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={eventFormName}
              onChange={(e) => setEventFormName(e.target.value)}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Description"
              value={eventFormDesc}
              onChange={(e) => setEventFormDesc(e.target.value)}
              multiline
              rows={2}
              fullWidth
              size="small"
            />
            <TextField
              select
              label="Frequency"
              value={eventFormFrequency}
              onChange={(e) => setEventFormFrequency(e.target.value as FrequencyOption)}
              size="small"
              fullWidth
            >
              {FREQUENCIES.map((freq) => (
                <MenuItem key={freq.value} value={freq.value}>
                  {freq.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start date"
              type="date"
              value={eventFormStartDate}
              onChange={(e) => setEventFormStartDate(e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="First occurrence. Future occurrences repeat from this date."
            />
            <TextField
              label="Assigned To"
              value={eventFormAssigned}
              onChange={(e) => setEventFormAssigned(e.target.value)}
              fullWidth
              size="small"
              placeholder="e.g. Security Team, CISO"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEventModalOpen(false);
              setEditingEvent(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveEvent}
            disabled={!eventFormName.trim() || !eventFormStartDate}
          >
            {editingEvent ? 'Save Changes' : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
