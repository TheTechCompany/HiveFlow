import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
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
import { GanttView, Spreadsheet, type TimelineItem, type TimelineGroup, type TimelineStep, TreeBranchVSCode, type SpreadsheetColumn, type SpreadsheetRow } from '@hive-flow/ui';
import { gql, useQuery, useMutation } from '@apollo/client';
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

// ── GraphQL ────────────────────────────────────────────────────

const GET_SCHEDULE = gql`
  query GetSchedule($id: ID!) {
    recurringSchedule(id: $id) {
      id
      name
      description
      events {
        id
        scheduleId
        parentId
        name
        description
        frequency
        startDate
        assignedTo
      }
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent($scheduleId: ID!, $input: RecurringEventInput!) {
    createRecurringEvent(scheduleId: $scheduleId, input: $input) {
      id
      name
      frequency
      startDate
    }
  }
`;

const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: RecurringEventUpdateInput!) {
    updateRecurringEvent(id: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteRecurringEvent(id: $id) {
      id
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users(active: true) {
      id
      name
    }
  }
`;

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

  const { data, loading, error, refetch } = useQuery(GET_SCHEDULE, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  const [createEvent] = useMutation(CREATE_EVENT, { refetchQueries: ['GetSchedule'] });
  const [updateEvent] = useMutation(UPDATE_EVENT);
  const [deleteEvent] = useMutation(DELETE_EVENT);

  const { data: usersData } = useQuery(GET_USERS);
  const users: { id: string; name: string }[] = usersData?.users || [];

  const schedule: Schedule | undefined = data?.recurringSchedule;

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
    const event = events[idx];
    const depth = treeInfo.flat.find((f) => f.id === eventId)?.depth ?? 0;
    let prevSibling: RecurringEvent | undefined;
    for (let i = idx - 1; i >= 0; i--) {
      const d = treeInfo.flat.find((f) => f.id === events[i].id)?.depth ?? 0;
      if (d === depth) { prevSibling = events[i]; break; }
      if (d < depth) break;
    }
    if (prevSibling) {
      updateEvent({ variables: { id: eventId, input: { parentId: prevSibling.id } } }).then(() => refetch());
    }
  }, [schedule, treeInfo, updateEvent, refetch]);

  const outdentEvent = useCallback((eventId: string) => {
    if (!schedule) return;
    const event = schedule.events.find((e) => e.id === eventId);
    if (!event?.parentId) return;
    const parent = schedule.events.find((e) => e.id === event.parentId);
    const grandParentId = parent?.parentId || undefined;
    updateEvent({ variables: { id: eventId, input: { parentId: grandParentId as any } } }).then(() => refetch());
  }, [schedule, updateEvent, refetch]);

  // ── Inline drafts (spreadsheet-style creation) ─────────────
  const [drafts, setDrafts] = useState<RecurringEvent[]>([]);

  // Seed a draft row whenever schedule is loaded and no draft exists
  React.useEffect(() => {
    if (schedule && drafts.length === 0) {
      setDrafts([{
        id: `draft-${Date.now()}`,
        scheduleId: schedule.id,
        name: '',
        description: '',
        frequency: 'monthly',
        startDate: moment().format('YYYY-MM-DD'),
        assignedTo: '',
      }]);
    }
  }, [schedule, drafts.length]);

  const draftInputRef = React.useRef<HTMLInputElement>(null);

  const updateDraftField = useCallback((draftId: string, field: keyof RecurringEvent, value: string) => {
    setDrafts((prev) => prev.map((d) => (d.id === draftId ? { ...d, [field]: value } : d)));
  }, []);

  const commitDraft = useCallback((draftId: string) => {
    setDrafts((prev) => {
      const draft = prev.find((d) => d.id === draftId);
      const valid = draft && draft.name.trim() && draft.startDate;
      if (valid && schedule) {
        createEvent({
          variables: {
            scheduleId: schedule.id,
            input: {
              name: draft!.name.trim(),
              description: draft!.description,
              frequency: draft!.frequency,
              startDate: draft!.startDate,
              assignedTo: draft!.assignedTo || undefined,
            },
          },
        }).then(() => refetch());
      }
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
    setTimeout(() => draftInputRef.current?.focus(), 0);
  }, [drafts, schedule, createEvent, refetch]);

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

  const saveEvent = async () => {
    if (editingEvent) {
      await updateEvent({
        variables: {
          id: editingEvent.id,
          input: {
            name: eventFormName,
            description: eventFormDesc,
            frequency: eventFormFrequency,
            startDate: eventFormStartDate,
            assignedTo: eventFormAssigned || undefined,
          },
        },
      });
      refetch();
    }
    setEventModalOpen(false);
    setEditingEvent(null);
  };

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

  // ── Spreadsheet sidebar ───────────────────────────────────

  const spreadsheetColumns = useMemo((): SpreadsheetColumn[] => [
    {
      key: 'name',
      header: 'Event',
      width: 200,
      editable: false,
      render: (row) => {
        const depth = (row._depth as number) ?? 0;
        const hasChildren = !!(row._hasChildren);
        const isCollapsed = !!(row._isCollapsed);
        const connectors = (row._connectors as unknown as boolean[]) ?? [];
        const isDraft = !!(row._isDraft);
        const rowId = String(row.id);

        if (isDraft) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%', height: '100%' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#90caf9', flexShrink: 0 }} />
              <TextField
                size="small" variant="standard"
                placeholder="Event name"
                value={(row.name as string) ?? ''}
                autoFocus
                inputRef={draftInputRef}
                onChange={(e) => updateDraftField(rowId, 'name', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitDraft(rowId);
                  if (e.key === 'Escape') updateDraftField(rowId, 'name', '');
                }}
                sx={{ flex: 1, minWidth: 0, '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
              />
            </Box>
          );
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', minWidth: 0 }}>
            <TreeBranchVSCode
              variant="depth-borders"
              depth={depth}
              hasChildren={hasChildren}
              isCollapsed={isCollapsed}
              onToggle={() => toggleCollapse(rowId)}
              connectors={connectors}
            />
            <TextField
              size="small" variant="standard"
              defaultValue={(row.name as string) ?? ''}
              onBlur={(e) => {
                if (e.target.value !== (row.name as string) && e.target.value.trim()) {
                  updateEvent({ variables: { id: rowId, input: { name: e.target.value } } }).then(() => refetch());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                  setTimeout(() => draftInputRef.current?.focus(), 0);
                }
              }}
              sx={{ flex: 1, minWidth: 0, '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' }, '& .MuiInputBase-input': { px: '4px', py: '2px' } }}
            />
          </Box>
        );
      },
    },
    {
      key: 'frequency',
      header: 'Frequency',
      width: 90,
      editable: false,
      render: (row) => {
        const rowId = String(row.id);
        const isDraft = !!(row._isDraft);
        const value = String(row.frequency ?? 'monthly');

        if (isDraft) {
          return (
            <TextField
              select size="small" variant="standard"
              value={value}
              onChange={(e) => updateDraftField(rowId, 'frequency', e.target.value)}
              sx={{ width: '100%', height: '100%', '& .MuiInputBase-root': { height: '100%', py: 0, fontSize: '0.7rem' }, '& .MuiInputBase-input': { height: '100%', px: '4px', py: '2px' } }}
            >
              {FREQUENCIES.map((freq) => (
                <MenuItem key={freq.value} value={freq.value} sx={{ fontSize: '0.75rem' }}>{freq.label}</MenuItem>
              ))}
            </TextField>
          );
        }

        return (
          <TextField
            select size="small" variant="standard"
            defaultValue={value}
            onChange={(e) => {
              updateEvent({ variables: { id: rowId, input: { frequency: e.target.value } } }).then(() => refetch());
            }}
            sx={{ width: '100%', height: '100%', '& .MuiInputBase-root': { height: '100%', py: 0, fontSize: '0.7rem' }, '& .MuiInputBase-input': { height: '100%', px: '4px', py: '2px' } }}
          >
            {FREQUENCIES.map((freq) => (
              <MenuItem key={freq.value} value={freq.value} sx={{ fontSize: '0.75rem' }}>{freq.label}</MenuItem>
            ))}
          </TextField>
        );
      },
    },
    {
      key: 'startDate',
      header: 'Start Date',
      width: 115,
      editable: false,
      render: (row) => {
        const rowId = String(row.id);
        const isDraft = !!(row._isDraft);
        const value = String(row.startDate ?? '');

        if (isDraft) {
          return (
            <TextField
              size="small" variant="standard" type="date"
              value={value}
              onChange={(e) => updateDraftField(rowId, 'startDate', e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitDraft(rowId); }}
              InputLabelProps={{ shrink: true }}
              sx={{ width: '100%', height: '100%', '& .MuiInputBase-root': { height: '100%', py: 0 }, '& .MuiInputBase-input': { height: '100%', px: '4px', py: '2px', fontSize: '0.7rem' } }}
            />
          );
        }

        return (
          <TextField
            size="small" variant="standard" type="date"
            defaultValue={value}
            onBlur={(e) => {
              if (e.target.value && e.target.value !== value) {
                updateEvent({ variables: { id: rowId, input: { startDate: e.target.value } } }).then(() => refetch());
              }
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
            InputLabelProps={{ shrink: true }}
            sx={{ width: '100%', height: '100%', '& .MuiInputBase-root': { height: '100%', py: 0 }, '& .MuiInputBase-input': { height: '100%', px: '4px', py: '2px', fontSize: '0.7rem' } }}
          />
        );
      },
    },
    {
      key: 'assignedTo',
      header: 'Assigned',
      width: 140,
      editable: false,
      render: (row) => {
        const rowId = String(row.id);
        const isDraft = !!(row._isDraft);
        const value = String(row.assignedTo || '');

        if (isDraft) {
          return (
            <Autocomplete
              freeSolo size="small"
              options={users.map((u) => u.name)}
              value={value || undefined}
              onChange={(_, val) => updateDraftField(rowId, 'assignedTo', val || '')}
              onInputChange={(_, val) => updateDraftField(rowId, 'assignedTo', val)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitDraft(rowId);
                if (e.key === 'Escape') updateDraftField(rowId, 'assignedTo', '');
              }}
              renderInput={(params) => (
                <TextField {...params} variant="standard" placeholder="—"
                  sx={{ '& .MuiInputBase-root': { height: '100%', py: 0, fontSize: '0.7rem' }, '& .MuiInputBase-input': { height: '100%', px: '4px', py: '2px' } }}
                />
              )}
              sx={{ width: '100%', height: '100%', '& .MuiAutocomplete-inputRoot': { height: '100%', py: 0 } }}
            />
          );
        }

        return (
          <Autocomplete
            freeSolo size="small"
            options={users.map((u) => u.name)}
            defaultValue={value || undefined}
            onInputChange={(_, val) => {
              updateEvent({ variables: { id: rowId, input: { assignedTo: val || ('' as any) } } }).then(() => refetch());
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" placeholder="—"
                sx={{ '& .MuiInputBase-root': { height: '100%', py: 0, fontSize: '0.7rem' }, '& .MuiInputBase-input': { height: '100%', px: '4px', py: '2px' } }}
              />
            )}
            sx={{ width: '100%', height: '100%', '& .MuiAutocomplete-inputRoot': { height: '100%', py: 0 } }}
          />
        );
      },
    },
  ], [users, collapsed, toggleCollapse, updateDraftField, commitDraft, draftInputRef, updateEvent, refetch]);

  const spreadsheetRows = useMemo((): SpreadsheetRow[] => {
    const rows: SpreadsheetRow[] = [];

    // Draft rows first
    for (const draft of drafts) {
      rows.push({
        id: draft.id,
        name: draft.name,
        frequency: draft.frequency,
        startDate: draft.startDate,
        assignedTo: draft.assignedTo || '',
        _depth: 0,
        _hasChildren: false,
        _isCollapsed: false,
        _connectors: [] as any,
        _isDraft: true,
      });
    }

    // Event rows in tree order
    for (const event of treeInfo.flat) {
      rows.push({
        id: event.id,
        name: event.name,
        frequency: event.frequency,
        startDate: event.startDate,
        assignedTo: event.assignedTo || '',
        _depth: event.depth,
        _hasChildren: event.hasChildren,
        _isCollapsed: collapsed.has(event.id),
        _connectors: event.connectors as any,
        _isDraft: false,
      });
    }

    return rows;
  }, [drafts, treeInfo.flat, collapsed]);

  const handleRowKeyDown = useCallback((row: SpreadsheetRow, event: React.KeyboardEvent) => {
    if (event.key === 'Tab' && !row._isDraft) {
      event.preventDefault();
      if (event.shiftKey) outdentEvent(row.id);
      else indentEvent(row.id);
    }
  }, [outdentEvent, indentEvent]);

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">Failed to load schedule: {error.message}</Typography>
      </Box>
    );
  }

  if (!schedule) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Schedule not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* ── Header bar ──────────────────────────────────────── */}
      <Paper
        sx={{
          display: 'flex',
          bgcolor: 'secondary.main',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1 }}>
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
      </Paper>

      {/* ── Content ─────────────────────────────────────────── */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '4px', overflow: 'hidden' }}>
        {/* ── Zoom toolbar ──────────────────────────────────── */}
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

        {/* ── Gantt view: sidebar rows + timeline side by side */}
        <GanttView
        sidebarFlex="580px"
        sidebar={(
          <Spreadsheet
            columns={spreadsheetColumns}
            rows={spreadsheetRows}
            rowHeight={32}
            headerHeight={48}
            fitContainer
            onRowKeyDown={handleRowKeyDown}
          />
        )}
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
      </Paper>

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
