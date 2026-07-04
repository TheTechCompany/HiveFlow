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
  Close,
} from '@mui/icons-material';
import { GanttView, type TimelineItem, type TimelineStep, TreeBranchVSCode, VSCODE_TWISTY_WIDTH, DEPTH_BORDER_WIDTH } from '@hive-flow/ui';
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client';
import moment from 'moment';
import { LexoRank } from 'lexorank';

// ── Types ───────────────────────────────────────────────────────

interface RecurringEvent {
  id: string;
  scheduleId: string;
  parentId?: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  assignedTo?: string;
  rowOrder?: string;
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
        endDate
        assignedTo
        rowOrder
      }
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent($scheduleId: ID!, $input: RecurringEventInput!) {
    createRecurringEvent(scheduleId: $scheduleId, input: $input) {
      id
      parentId
      name
      frequency
      startDate
      endDate
      rowOrder
    }
  }
`;

const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: RecurringEventUpdateInput!) {
    updateRecurringEvent(id: $id, input: $input) {
      id
      parentId
      name
      frequency
      startDate
      endDate
      assignedTo
      rowOrder
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
  const start = moment(event.startDate);

  let i = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const freq = event.frequency;
    let cursor: moment.Moment;
    switch (freq) {
      case 'daily': cursor = start.clone().add(i, 'day'); break;
      case 'weekly': cursor = start.clone().add(i, 'week'); break;
      case 'monthly': cursor = start.clone().add(i, 'month'); break;
      case 'quarterly': cursor = start.clone().add(i * 3, 'month'); break;
      case 'yearly': cursor = start.clone().add(i, 'year'); break;
      default: cursor = start.clone().add(i, 'month'); break; // fallback to monthly
    }

    if (cursor.isSameOrAfter(moment(windowEnd))) break;
    if (i > 500) break; // safety
    if (cursor.isSameOrAfter(moment(windowStart))) {
      occurrences.push(cursor.toDate());
    }
    i++;
  }

  return occurrences;
}

const EVENT_COLORS = ['#ef5350', '#ff9800', '#42a5f5', '#66bb6a', '#ab47bc', '#26c6da', '#7e57c2', '#ec407a'];

// ── Main ────────────────────────────────────────────────────────

/**
 * ## ScheduleSingle — Recurring Schedule Editor
 *
 * Spreadsheet-style editor for recurring event schedules with an inline
 * timeline (Gantt) view.
 *
 * ### Keyboard shortcuts (when a row is focused)
 *
 * | Key            | Action                                   |
 * | -------------- | ---------------------------------------- |
 * | **Tab**        | Indent event one level deeper            |
 * | **Shift+Tab**  | Outdent event one level (repeat to root) |
 * | **Enter**      | Commit draft row / create sibling        |
 * | **Escape**     | Clear draft name field                   |
 *
 * ### Inline creation (draft rows)
 *
 * A blank "draft" row is seeded when the schedule is empty.  Fill in a
 * **name**, then press Enter to create the event.  Start date and other
 * fields are optional — dates are never auto-filled.
 */
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
  const client = useApolloClient();

  const { data: usersData } = useQuery(GET_USERS);
  const users: { id: string; name: string }[] = usersData?.users || [];

  const schedule: Schedule | undefined = data?.recurringSchedule;

  // Keep latest schedule in a ref so callbacks never see a stale version.
  const scheduleRef = React.useRef(schedule);
  scheduleRef.current = schedule;

  // ── Debounced mutation — avoid firing updateEvent on every keystroke ─
  const mutationTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const debouncedUpdate = useCallback(
    (eventId: string, input: Record<string, any>) => {
      const fieldKeys = Object.keys(input).sort().join(',');
      const timerKey = `${eventId}|${fieldKeys}`;
      const existing = mutationTimersRef.current.get(timerKey);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(() => {
        mutationTimersRef.current.delete(timerKey);
        updateEvent({ variables: { id: eventId, input } }).then(() => refetch());
      }, 300);
      mutationTimersRef.current.set(timerKey, timer);
    },
    [updateEvent, refetch],
  );

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

    // Build children lookup
    const childrenOf = new Map<string, string[]>();
    for (const e of events) {
      const pid = e.parentId || '__root__';
      const list = childrenOf.get(pid) || [];
      list.push(e.id);
      childrenOf.set(pid, list);
    }

    // Compute depth for each event (walk parent chain)
    const depthOf = new Map<string, number>();
    const computeDepth = (eventId: string): number => {
      if (depthOf.has(eventId)) return depthOf.get(eventId)!;
      const ev = events.find((x) => x.id === eventId);
      if (!ev?.parentId) { depthOf.set(eventId, 0); return 0; }
      const d = computeDepth(ev.parentId) + 1;
      depthOf.set(eventId, d);
      return d;
    };
    for (const e of events) computeDepth(e.id);

    // Build flat list sorted by lexorank
    type FlatEvent = RecurringEvent & { depth: number; hasChildren: boolean; connectors: boolean[] };
    const flat: FlatEvent[] = events.map((e) => {
      const depth = depthOf.get(e.id) ?? 0;
      const hasChildren = childrenOf.has(e.id);
      const rank = e.rowOrder ? (() => { try { return LexoRank.parse(e.rowOrder); } catch { return LexoRank.middle(); } })() : LexoRank.middle();
      return { ...e, depth, hasChildren, connectors: [], _rank: rank } as FlatEvent & { _rank: LexoRank };
    });
    flat.sort((a: any, b: any) => a._rank.compareTo(b._rank));

    // Compute connectors from flat lexorank order
    for (let i = 0; i < flat.length; i++) {
      const depth = flat[i].depth;
      const connectors: boolean[] = [];
      for (let level = 0; level < depth; level++) {
        let hasLater = false;
        for (let j = i + 1; j < flat.length; j++) {
          if (flat[j].depth <= level) break;
          if (flat[j].depth > level) { hasLater = true; break; }
        }
        connectors.push(hasLater);
      }
      (flat[i] as any).connectors = connectors;
    }
    // Strip temporary _rank
    for (const f of flat) delete (f as any)._rank;

    console.groupCollapsed('[treeInfo] flat lexorank order (%d events)', flat.length);
    for (let i = 0; i < flat.length; i++) {
      console.log('[treeInfo] %d: %s depth=%d rowOrder=%s parentId=%s connectors=%s',
        i, flat[i].name || flat[i].id, flat[i].depth, flat[i].rowOrder || '(none)',
        flat[i].parentId || '(root)', JSON.stringify(flat[i].connectors));
    }
    console.groupEnd();
    return { flat, childrenOf };
  }, [schedule, collapsed]);

  // ── Inline drafts (spreadsheet-style creation) ─────────────
  const [drafts, setDrafts] = useState<RecurringEvent[]>([]);
  const draftsRef = React.useRef(drafts);
  draftsRef.current = drafts;

  // Seed a draft row whenever schedule is loaded and no draft exists
  React.useEffect(() => {
    if (schedule && drafts.length === 0) {
      setDrafts([{
        id: `draft-${Date.now()}`,
        scheduleId: schedule.id,
        name: '',
        description: '',
        frequency: 'monthly',
        startDate: '',
        endDate: '',
        assignedTo: '',
      }]);
    }
  }, [schedule, drafts.length]);

  const draftInputRef = React.useRef<HTMLInputElement>(null);

  // ── Safe LexoRank between (fallback to genNext on collision) ─
  const safeBetween = useCallback((lower: LexoRank, upper: LexoRank): LexoRank => {
    try { return lower.between(upper); } catch { return lower.genNext(); }
  }, []);

  // ── Stable ranked rows (global lexorank sort) ─
  const rankedRows = useMemo(() => {
    const rows: { id: string; event?: RecurringEvent; draft?: RecurringEvent; rank: LexoRank }[] = [];
    // Events are already in lexorank order from treeInfo.flat
    for (const e of treeInfo.flat) {
      const rank = e.rowOrder ? LexoRank.parse(e.rowOrder) : LexoRank.middle();
      rows.push({ id: e.id, event: e, rank });
    }
    // Drafts appended at the end
    for (const draft of drafts) {
      const last = rows[rows.length - 1];
      const rank = last ? last.rank.genNext() : LexoRank.middle();
      rows.push({ id: draft.id, draft, rank });
    }
    console.groupCollapsed('[rankedRows] final order (%d rows)', rows.length);
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const label = r.event?.name || r.draft?.name || r.id;
      const kind = r.draft ? 'draft' : 'event';
      console.log('[rankedRows] %d: %s %s rank=%s parentId=%s', i, kind, label, r.rank.toString(), r.event?.parentId || r.draft && (r.draft as any).parentId || '(root)');
    }
    console.groupEnd();
    return rows;
  }, [treeInfo.flat, drafts]);

  const indentEvent = useCallback((eventId: string) => {
    const s = scheduleRef.current;
    if (!s) return;
    const info = treeInfo.flat.find((f) => f.id === eventId);
    const depth = info?.depth ?? 0;
    const selfIdx = rankedRows.findIndex((r) => r.id === eventId);
    if (selfIdx <= 0) return;
    let targetId: string | undefined;
    for (let i = selfIdx - 1; i >= 0; i--) {
      const r = rankedRows[i];
      if (!r.event) continue;
      const ri = treeInfo.flat.find((f) => f.id === r.event!.id);
      const rd = ri?.depth ?? 0;
      if (rd === depth) { targetId = r.event!.id; break; }
      if (rd < depth) break;
    }
    if (targetId) {
      updateEvent({ variables: { id: eventId, input: { parentId: targetId } } }).then(() => refetch());
    }
  }, [treeInfo, rankedRows, updateEvent, refetch]);

  const outdentEvent = useCallback((eventId: string) => {
    const s = scheduleRef.current;
    if (!s) return;
    const event = s.events.find((e) => e.id === eventId);
    if (!event?.parentId) return;
    const parent = s.events.find((e) => e.id === event.parentId);
    const newParentId = parent?.parentId ?? null;
    updateEvent({ variables: { id: eventId, input: { parentId: newParentId } } }).then(() => refetch());
  }, [updateEvent, refetch]);

  const updateDraftField = useCallback((draftId: string, field: keyof RecurringEvent, value: string) => {
    setDrafts((prev) => prev.map((d) => (d.id === draftId ? { ...d, [field]: value } : d)));
  }, []);

  // ── Draft indent / outdent ─────────────────────────────
  const indentDraft = useCallback((draftId: string) => {
    setDrafts((prev) => {
      const draft = prev.find((d) => d.id === draftId);
      if (!draft) return prev;
      const parentId = (draft as any).parentId as string | undefined;
      const currentDepth = parentId
        ? (treeInfo.flat.find((f) => f.id === parentId)?.depth ?? 0) + 1
        : 0;
      // Find the visually-previous row at the same depth
      const selfIdx = rankedRows.findIndex((r) => r.id === draftId);
      let targetId: string | undefined;
      for (let i = selfIdx - 1; i >= 0; i--) {
        const r = rankedRows[i];
        if (r.event) {
          const e = treeInfo.flat.find((f) => f.id === r.event!.id);
          if ((e?.depth ?? 0) === currentDepth) { targetId = r.event!.id; break; }
          if ((e?.depth ?? 0) < currentDepth) break;
        }
      }
      if (!targetId) return prev;
      return prev.map((d) =>
        d.id === draftId ? { ...d, parentId: targetId } as any : d
      );
    });
  }, [rankedRows, treeInfo]);

  const outdentDraft = useCallback((draftId: string) => {
    setDrafts((prev) => {
      const draft = prev.find((d) => d.id === draftId);
      if (!draft) return prev;
      const parentId = (draft as any).parentId as string | undefined;
      if (!parentId) return prev; // Already at root
      const parent = treeInfo.flat.find((f) => f.id === parentId);
      const newParentId = parent?.parentId ?? undefined;
      return prev.map((d) =>
        d.id === draftId ? { ...d, parentId: newParentId || undefined } as any : d
      );
    });
  }, [treeInfo]);

  const commitDraft = useCallback((draftId: string) => {
    const currentSchedule = scheduleRef.current;
    let draftToCommit: (RecurringEvent & { _insertAfter?: string }) | undefined;
    let rowRank: LexoRank | undefined;

    setDrafts((prev) => {
      const draft = prev.find((d) => d.id === draftId);
      draftToCommit = draft as any;
      const valid = draft && draft.name.trim();

      if (valid) {
        rowRank = rankedRows.find((r) => r.id === draftId)?.rank;

        // Fire mutation (outside setDrafts would be ideal, but we need
        // to act synchronously on the valid draft — capture values here).
        if (currentSchedule) {
          createEvent({
            variables: {
              scheduleId: currentSchedule.id,
              input: {
                name: draft!.name.trim(),
                description: draft!.description,
                frequency: draft!.frequency,
                startDate: draft!.startDate,
                endDate: draft!.endDate || undefined,
                assignedTo: draft!.assignedTo || undefined,
                parentId: draft!.parentId || undefined,
                rowOrder: rowRank ? rowRank.toString() : undefined,
              },
            },
          }).then(() => refetch());
        }

        // Remove the committed draft; the seed effect recreates a fresh one.
        return prev.filter((d) => d.id !== draftId);
      }

      // Draft is invalid (empty name) — just remove it.
      // If it was an Enter-created draft, the seed draft will still be there.
      return prev.filter((d) => d.id !== draftId);
    });
    setTimeout(() => draftInputRef.current?.focus(), 50);
  }, [drafts, rankedRows, createEvent, refetch]);
  // ↑ schedule intentionally omitted — we use scheduleRef for freshness.

  // ── Enter on event row: focus the seed draft at the bottom
  const handleEnterInRow = useCallback(() => {
    setTimeout(() => draftInputRef.current?.focus(), 0);
  }, []);

  // ── Stable ranked rows (lexorank — single source of truth) ─
  // ── Edit modal (kept for editing existing events) ──────────
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RecurringEvent | null>(null);
  const [eventFormName, setEventFormName] = useState('');
  const [eventFormDesc, setEventFormDesc] = useState('');
  const [eventFormFrequency, setEventFormFrequency] = useState<FrequencyOption>('monthly');
  const [eventFormStartDate, setEventFormStartDate] = useState('');
  const [eventFormEndDate, setEventFormEndDate] = useState('');
  const [eventFormAssigned, setEventFormAssigned] = useState('');

  const openEditEvent = (event: RecurringEvent) => {
    setEditingEvent(event);
    setEventFormName(event.name);
    setEventFormDesc(event.description);
    setEventFormFrequency(event.frequency);
    setEventFormStartDate(event.startDate);
    setEventFormEndDate(event.endDate || '');
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
            endDate: eventFormEndDate || undefined,
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

  // ── Drag-and-drop reorder ──────────────────────────────
  const dragRef = useRef<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, rowId: string) => {
    dragRef.current = rowId;
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, rowId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetId(rowId);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDropTargetId(null);
    const draggedId = dragRef.current;
    dragRef.current = null;
    if (!draggedId || draggedId === targetId) return;

    // Find the dragged row and target row in rankedRows
    const draggedIdx = rankedRows.findIndex((r) => r.id === draggedId);
    const targetIdx = rankedRows.findIndex((r) => r.id === targetId);
    if (draggedIdx < 0 || targetIdx < 0) return;

    // Compute new rank: between the items surrounding the drop position
    const rows = [...rankedRows];
    const [moved] = rows.splice(draggedIdx, 1);
    const newTargetIdx = rows.findIndex((r) => r.id === targetId);
    const prevRow = rows[newTargetIdx - 1];
    const nextRow = rows[newTargetIdx];
    let newRank: LexoRank;
    if (prevRow && nextRow) {
      newRank = safeBetween(prevRow.rank, nextRow.rank);
    } else if (prevRow) {
      newRank = prevRow.rank.genNext();
    } else if (nextRow) {
      newRank = safeBetween(LexoRank.middle(), nextRow.rank);
    } else {
      newRank = LexoRank.middle();
    }

    // Update the dragged event's rowOrder
    const event = schedule?.events.find((ev) => ev.id === draggedId);
    if (event) {
      updateEvent({
        variables: { id: draggedId, input: { rowOrder: newRank.toString() } },
      }).then(() => refetch());
    }

    // If the dragged item has children, update their rowOrder too
    if (event) {
      const childIds = treeInfo.childrenOf.get(draggedId);
      if (childIds) {
        let childRank = newRank.genNext();
        for (const cid of childIds) {
          updateEvent({
            variables: { id: cid, input: { rowOrder: childRank.toString() } },
          });
          childRank = childRank.genNext();
        }
        refetch();
      }
    }
  }, [rankedRows, schedule, treeInfo, updateEvent, refetch]);

  const timelineGroups = useMemo((): any[] => {
    return rankedRows.map((r) => ({
      id: r.id,
      label: r.event?.name || r.draft?.name || 'New event',
    }));
  }, [rankedRows]);

  const timelineItems = useMemo((): TimelineItem[] => {
    if (!schedule) return [];
    const items: TimelineItem[] = [];
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
    // Expand horizon slightly so occurrences near edges don't pop in/out
    const occWindowStart = moment(horizon.start).subtract(1, 'month').toDate();
    const occWindowEnd = moment(horizon.end).add(1, 'month').toDate();
    schedule.events.forEach((event) => {
      const startDate = new Date(event.startDate);
      const endDate = event.endDate
        ? new Date(event.endDate)
        : moment(event.startDate).add(1, 'year').toDate();
      const colorIx = resolveColorIx(event.id);
      const color = EVENT_COLORS[Math.abs(colorIx) % EVENT_COLORS.length];

      // Each occurrence spans the same duration as the template
      const templateDuration = event.endDate
        ? moment(event.endDate).diff(moment(event.startDate), 'milliseconds')
        : 86400000; // default 1 day

      const occurrences = generateOccurrences(event, occWindowStart, occWindowEnd);

      // Push occurrences first so they render behind the range bar
      occurrences.forEach((occDate, i) => {
        if (i === 0) return; // skip first — already shown as the range bar
        items.push({
          id: `${event.id}-occ-${i}`,
          start: occDate,
          end: new Date(occDate.getTime() + templateDuration),
          groupId: event.id,
          color: `${color}99`, // semi-transparent
          selectable: false,
          movable: true,
          resizable: false,
          data: { event, occurrence: true, occurrenceIndex: i },
        });
      });

      // Range bar on top so resize handles are reachable
      items.push({
        id: event.id,
        start: startDate,
        end: endDate,
        groupId: event.id,
        color,
        selectable: false,
        data: { event },
      });
    });
    return items;
  }, [schedule, horizon]);

  // ── Sidebar: column widths & resize ─────────────────────

  const maxDepth = useMemo(() => {
    let max = 0;
    for (const e of treeInfo.flat) { if (e.depth > max) max = e.depth; }
    return max;
  }, [treeInfo.flat]);
  const COL_TREE = VSCODE_TWISTY_WIDTH + maxDepth * DEPTH_BORDER_WIDTH;
  const [colTree, setColTree] = useState(COL_TREE);
  useEffect(() => {
    setColTree((prev) => Math.max(prev, COL_TREE));
  }, [COL_TREE]);
  const [colFreq, setColFreq] = useState(80);
  const [colStart, setColStart] = useState(100);
  const [colEnd, setColEnd] = useState(95);
  const [colAssigned, setColAssigned] = useState(130);

  const resizeRef = useRef<{ left: string; right: string; leftW: number; rightW: number; startX: number } | null>(null);
  const setCol = useCallback((col: string, w: number) => {
    switch (col) {
      case 'tree': setColTree(w); break;
      case 'freq': setColFreq(w); break;
      case 'start': setColStart(w); break;
      case 'end': setColEnd(w); break;
      case 'assigned': setColAssigned(w); break;
    }
  }, []);
  const onResizeMove = useCallback((e: MouseEvent) => {
    const rs = resizeRef.current;
    if (!rs) return;
    const delta = e.clientX - rs.startX;
    if (rs.right) {
      // Two-column trade: left grows by delta, right shrinks by same amount
      const newLeft = Math.max(40, rs.leftW + delta);
      const actualDelta = newLeft - rs.leftW;
      const newRight = Math.max(40, rs.rightW - actualDelta);
      setCol(rs.left, newLeft);
      setCol(rs.right, newRight);
    } else {
      // Last column: just change width (1fr name column absorbs)
      setCol(rs.left, Math.max(40, rs.leftW + delta));
    }
  }, [setCol]);
  const onResizeEnd = useCallback(() => {
    resizeRef.current = null;
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
  }, [onResizeMove]);
  const onResizeStart = useCallback((left: string, leftW: number, right: string, rightW: number) => (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    resizeRef.current = { left, right, leftW, rightW, startX: e.clientX };
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeEnd);
  }, [onResizeMove, onResizeEnd]);
  useEffect(() => () => {
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
  }, [onResizeMove, onResizeEnd]);

  // ── Sidebar ↔ timeline ratio ───────────────────────────
  const [sidebarWidth, setSidebarWidth] = useState(580);
  const sidebarResizeRef = useRef<{ startX: number; startW: number } | null>(null);
  const onSidebarResizeMove = useCallback((e: MouseEvent) => {
    if (!sidebarResizeRef.current) return;
    const delta = e.clientX - sidebarResizeRef.current.startX;
    setSidebarWidth(Math.max(200, Math.min(1200, sidebarResizeRef.current.startW + delta)));
  }, []);
  const onSidebarResizeEnd = useCallback(() => {
    sidebarResizeRef.current = null;
    document.removeEventListener('mousemove', onSidebarResizeMove);
    document.removeEventListener('mouseup', onSidebarResizeEnd);
  }, [onSidebarResizeMove]);
  const onSidebarResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    sidebarResizeRef.current = { startX: e.clientX, startW: sidebarWidth };
    document.addEventListener('mousemove', onSidebarResizeMove);
    document.addEventListener('mouseup', onSidebarResizeEnd);
  }, [sidebarWidth, onSidebarResizeMove, onSidebarResizeEnd]);
  useEffect(() => () => {
    document.removeEventListener('mousemove', onSidebarResizeMove);
    document.removeEventListener('mouseup', onSidebarResizeEnd);
  }, [onSidebarResizeMove, onSidebarResizeEnd]);

  // ── Row deletion ─────────────────────────────────────
  const handleDeleteRow = useCallback((eventId: string) => {
    deleteEvent({ variables: { id: eventId } }).then(() => refetch());
  }, [deleteEvent, refetch]);

  const removeDraft = useCallback((draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
  }, []);

  const handleDelete = useCallback((itemIds: string[]) => {
    for (const id of itemIds) {
      // Item ids are `${eventId}-occ-${i}`; extract the real event id
      const eventId = id.replace(/-occ-\d+$/, '');
      const event = schedule?.events.find((e) => e.id === eventId);
      if (event) {
        deleteEvent({ variables: { id: eventId } }).then(() => refetch());
      }
    }
  }, [schedule, deleteEvent, refetch]);

  // ── Shared grid column template ─────────────────────────
  const gridColumns = useMemo(
    () => `${colTree}px 1fr ${colFreq}px ${colStart}px ${colEnd}px ${colAssigned}px`,
    [colTree, colFreq, colStart, colEnd, colAssigned],
  );

  const resizeHandleSx = {
    position: 'absolute', right: -3, top: 0, bottom: 0, width: 6,
    cursor: 'col-resize', zIndex: 1,
    '&:hover': { bgcolor: 'primary.light', opacity: 0.4 },
    '&:active': { bgcolor: 'primary.main', opacity: 0.6 },
  } as const;

  const hdrCell = {
    display: 'flex', alignItems: 'center', height: '100%',
    fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary',
    borderRight: '1px solid', borderColor: 'grey.300',
    overflow: 'hidden', minWidth: 0, boxSizing: 'border-box',
  } as const;

  const sidebarHeader = useMemo(() => (
    <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: gridColumns, alignItems: 'center', height: '100%', px: '12px', borderBottom: '3px solid', borderBottomColor: 'grey.400', bgcolor: '#f1f5f9', boxSizing: 'border-box', flex: 1, minWidth: 0 }}>
        <Box sx={{ ...hdrCell, justifyContent: 'center', borderRight: 'none', position: 'relative' }}>#<Box data-testid="resize-tree" onMouseDown={onResizeStart('tree', colTree, '', 0)} sx={resizeHandleSx} /></Box>
        <Box sx={{ ...hdrCell, px: 0.5 }}>Event</Box>
        <Box sx={{ ...hdrCell, justifyContent: 'center', position: 'relative' }}>Freq<Box data-testid="resize-freq" onMouseDown={onResizeStart('freq', colFreq, 'start', colStart)} sx={resizeHandleSx} /></Box>
        <Box sx={{ ...hdrCell, justifyContent: 'center', position: 'relative' }}>Start<Box data-testid="resize-start" onMouseDown={onResizeStart('start', colStart, 'end', colEnd)} sx={resizeHandleSx} /></Box>
        <Box sx={{ ...hdrCell, justifyContent: 'center', position: 'relative' }}>End<Box data-testid="resize-end" onMouseDown={onResizeStart('end', colEnd, 'assigned', colAssigned)} sx={resizeHandleSx} /></Box>
        <Box sx={{ ...hdrCell, justifyContent: 'center', position: 'relative', borderRight: 'none' }}>Assigned<Box data-testid="resize-assigned" onMouseDown={onResizeStart('assigned', colAssigned, '', 0)} sx={resizeHandleSx} /></Box>
      </Box>
      {/* Sidebar ↔ timeline resize handle */}
      <Box
        data-testid="resize-sidebar"
        onMouseDown={onSidebarResizeStart}
        sx={{
          width: 6, flexShrink: 0, cursor: 'col-resize', zIndex: 1,
          bgcolor: 'transparent',
          '&:hover': { bgcolor: 'primary.light', opacity: 0.4 },
          '&:active': { bgcolor: 'primary.main', opacity: 0.6 },
        }}
      />
    </Box>
  ), [gridColumns, onResizeStart, colTree, colFreq, colStart, colEnd, colAssigned, onSidebarResizeStart]);

  const renderGroupHeader = useCallback(
    (group: any, _expanded: boolean) => {
      const row = rankedRows.find((r) => r.id === group.id);
      if (!row) return <Box sx={{ height: '100%' }}>{group.id}</Box>;

      const draft = row.draft;
      const isDraft = !!draft;
      const treeEvent = !isDraft && row.event ? treeInfo.flat.find((f) => f.id === row.event!.id) : null;
      const event = !isDraft && treeEvent ? (schedule!.events.find((e) => e.id === treeEvent.id)!) : null;

      const cellSx = {
        display: 'flex', alignItems: 'stretch', height: '100%',
        borderRight: '1px solid', borderColor: 'grey.200', minWidth: 0,
      } as const;

      const inputSx = {
        flex: 1, minWidth: 0, height: '100%',
        '& .MuiInputBase-root': { py: 0, fontSize: '0.7rem', height: '100%' },
        '& .MuiInputBase-input': { px: '8px', py: '2px', height: '100%' },
      };

      // ── Draft row ─────────────────────────────────────
      if (isDraft && draft) {
        const parentDepth = draft.parentId
          ? (treeInfo.flat.find((f) => f.id === draft.parentId)?.depth ?? 0)
          : -1;
        const draftDepth = draft.parentId ? parentDepth + 1 : 0;
        const freqLabel = FREQUENCIES.find((f) => f.value === draft.frequency)?.label ?? '';
        const endDate = draft.startDate ? (() => {
          const s = moment(draft.startDate);
          switch (draft.frequency) {
            case 'daily': return s.clone().add(1, 'day').format('YYYY-MM-DD');
            case 'weekly': return s.clone().add(1, 'week').format('YYYY-MM-DD');
            case 'monthly': return s.clone().add(1, 'month').format('YYYY-MM-DD');
            case 'quarterly': return s.clone().add(3, 'months').format('YYYY-MM-DD');
            case 'yearly': return s.clone().add(1, 'year').format('YYYY-MM-DD');
            default: return '';
          }
        })() : '';
        return (
          <Box tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Tab') { e.preventDefault(); if (e.shiftKey) outdentDraft(draft.id); else indentDraft(draft.id); }
            }}
            sx={{ display: 'grid', gridTemplateColumns: gridColumns, alignItems: 'center', height: '100%', borderBottom: '1px solid', borderColor: 'grey.200', bgcolor: '#f0f7ff', boxSizing: 'border-box' }}>
            <Box sx={{ display: 'flex', height: '100%' }}>
              <TreeBranchVSCode
                variant="depth-borders"
                depth={draftDepth}
                hasChildren={false}
                isCollapsed={false}
                onToggle={() => {}}
                connectors={(() => {
                  if (draftDepth <= 0) return [];
                  // Copy parent connectors from tree, then append whether
                  // this draft is NOT the last sibling at its depth under
                  // the same parent.  Check rankedRows: if any later row
                  // is an event at the same depth or another draft with the
                  // same parentId, this connector is true (line continues).
                  const parentConns = treeInfo.flat.find((f) => f.id === draft.parentId)?.connectors ?? [];
                  const selfIdx = rankedRows.findIndex((r) => r.id === draft.id);
                  const hasLaterSibling = selfIdx >= 0 && rankedRows.slice(selfIdx + 1).some((r) => {
                    if (r.event) {
                      const e = treeInfo.flat.find((f) => f.id === r.event!.id);
                      return (e?.depth ?? -1) === draftDepth;
                    }
                    if (r.draft) {
                      return (r.draft as any).parentId === draft.parentId;
                    }
                    return false;
                  });
                  return [...parentConns, hasLaterSibling];
                })()}
              />
            </Box>
            <Box sx={cellSx}>
              <TextField size="small" variant="standard" placeholder="Event name" value={draft.name} autoFocus
                inputRef={draftInputRef}
                onChange={(e) => updateDraftField(draft.id, 'name', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitDraft(draft.id); if (e.key === 'Escape') updateDraftField(draft.id, 'name', ''); }}
                sx={{ flex: 1, minWidth: 0, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px' } }}
              />
            </Box>
            <Box sx={cellSx}>
              <TextField select size="small" variant="standard" value={draft.frequency}
                onChange={(e) => updateDraftField(draft.id, 'frequency', e.target.value)}
                sx={{ flex: 1, ...inputSx }}>
                {FREQUENCIES.map((f) => <MenuItem key={f.value} value={f.value} sx={{ fontSize: '0.75rem' }}>{f.label}</MenuItem>)}
              </TextField>
            </Box>
            <Box sx={cellSx}>
              <TextField size="small" variant="standard" type="date" value={draft.startDate}
                onChange={(e) => updateDraftField(draft.id, 'startDate', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitDraft(draft.id); }}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px', fontSize: '0.7rem', height: '100%' } }}
              />
            </Box>
            <Box sx={cellSx}>
              <TextField size="small" variant="standard" type="date" value={draft.endDate || ''}
                onChange={(e) => updateDraftField(draft.id, 'endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px', fontSize: '0.7rem', height: '100%' } }}
              />
            </Box>
            <Box sx={{ ...cellSx, borderRight: 'none' }}>
              <Autocomplete freeSolo options={users.map((u) => u.name)} value={draft.assignedTo || ''}
                onChange={(_, val) => updateDraftField(draft.id, 'assignedTo', val || '')}
                onInputChange={(_, val) => updateDraftField(draft.id, 'assignedTo', val)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitDraft(draft.id); if (e.key === 'Escape') updateDraftField(draft.id, 'assignedTo', ''); }}
                renderInput={(params) => <TextField {...params} variant="standard" placeholder="—"
                  sx={{ '& .MuiInputBase-root': { py: 0, fontSize: '0.7rem', height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px', height: '100%' } }} />}
                sx={{ flex: 1, height: '100%', '& .MuiFormControl-root': { height: '100%' }, '& .MuiInputBase-root': { height: '100%' }, '& .MuiAutocomplete-inputRoot': { height: '100%', py: 0, minHeight: 0, alignItems: 'center' } }}
              />
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeDraft(draft.id); }}
                sx={{ p: 0.25, ml: 0.25, '&:hover': { color: 'error.main' } }}>
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          </Box>
        );
      }

      // ── Event row ─────────────────────────────────────
      if (!event || !treeEvent) return <Box sx={{ height: '100%' }}>{group.id}</Box>;
      const endDate = (() => {
        const s = moment(event.startDate);
        switch (event.frequency) {
          case 'daily': return s.clone().add(1, 'day').format('YYYY-MM-DD');
          case 'weekly': return s.clone().add(1, 'week').format('YYYY-MM-DD');
          case 'monthly': return s.clone().add(1, 'month').format('YYYY-MM-DD');
          case 'quarterly': return s.clone().add(3, 'months').format('YYYY-MM-DD');
          case 'yearly': return s.clone().add(1, 'year').format('YYYY-MM-DD');
          default: return '';
        }
      })();

      return (
        <Box tabIndex={0}
          draggable
          onDragStart={(e) => handleDragStart(e, event.id)}
          onDragOver={(e) => handleDragOver(e, event.id)}
          onDrop={(e) => handleDrop(e, event.id)}
          onDragLeave={() => setDropTargetId(null)}
          onKeyDown={(e) => {
            if (e.key === 'Tab') { e.preventDefault(); if (e.shiftKey) outdentEvent(event.id); else indentEvent(event.id); }
          }}
          sx={{ display: 'grid', gridTemplateColumns: gridColumns, alignItems: 'center', height: '100%', borderBottom: '1px solid', borderColor: 'grey.200', bgcolor: '#ffffff', '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer', boxSizing: 'border-box', ...(dropTargetId === event.id ? { borderTop: '3px solid', borderTopColor: 'primary.main' } : {}) }}>
          <Box sx={{ display: 'flex', height: '100%' }}>
            <TreeBranchVSCode variant="depth-borders" depth={treeEvent.depth} hasChildren={treeEvent.hasChildren} isCollapsed={collapsed.has(event.id)} onToggle={() => toggleCollapse(event.id)} connectors={treeEvent.connectors} />
          </Box>
          <Box sx={cellSx}>
            <TextField key={`name-${event.id}-${event.name}`} size="small" variant="standard" defaultValue={event.name}
              onBlur={(e) => { if (e.target.value !== event.name && e.target.value.trim()) updateEvent({ variables: { id: event.id, input: { name: e.target.value } } }).then(() => refetch()); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); handleEnterInRow(); } }}
              sx={{ flex: 1, minWidth: 0, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px' } }}
            />
          </Box>
          <Box sx={cellSx}>
            <TextField select size="small" variant="standard" key={`freq-${event.id}-${event.frequency}`} defaultValue={event.frequency}
              onChange={(e) => debouncedUpdate(event.id, { frequency: e.target.value })}
              sx={{ flex: 1, ...inputSx }}>
              {FREQUENCIES.map((f) => <MenuItem key={f.value} value={f.value} sx={{ fontSize: '0.75rem' }}>{f.label}</MenuItem>)}
            </TextField>
          </Box>
          <Box sx={cellSx}>
            <TextField key={`start-${event.id}-${event.startDate}`} size="small" variant="standard" type="date" defaultValue={event.startDate}
              onChange={(e) => { if (e.target.value && e.target.value !== event.startDate) debouncedUpdate(event.id, { startDate: e.target.value }); }}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px', fontSize: '0.7rem', height: '100%' } }}
            />
          </Box>
          <Box sx={cellSx}>
            <TextField key={`end-${event.id}-${event.endDate || ''}`} size="small" variant="standard" type="date" defaultValue={event.endDate || ''}
              onChange={(e) => { debouncedUpdate(event.id, { endDate: e.target.value || ('' as any) }); }}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px', fontSize: '0.7rem', height: '100%' } }}
            />
          </Box>
          <Box sx={{ ...cellSx, borderRight: 'none' }}>
            <Autocomplete freeSolo options={users.map((u) => u.name)} defaultValue={event.assignedTo || ''}
              onInputChange={(_, val) => debouncedUpdate(event.id, { assignedTo: val || ('' as any) })}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              renderInput={(params) => <TextField {...params} variant="standard" placeholder="—"
                sx={{ '& .MuiInputBase-root': { py: 0, fontSize: '0.7rem', height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px', height: '100%' } }} />}
              sx={{ flex: 1, height: '100%', '& .MuiFormControl-root': { height: '100%' }, '& .MuiInputBase-root': { height: '100%' }, '& .MuiAutocomplete-inputRoot': { height: '100%', py: 0, minHeight: 0, alignItems: 'center' } }}
            />
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteRow(event.id); }}
              sx={{ p: 0.25, ml: 0.25, '&:hover': { color: 'error.main' } }}>
              <Close sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
      );
    },
    [treeInfo, rankedRows, collapsed, toggleCollapse, indentEvent, outdentEvent, indentDraft, outdentDraft, users, debouncedUpdate, updateDraftField, commitDraft, handleEnterInRow, handleDeleteRow, removeDraft, handleDragStart, handleDragOver, handleDrop, dropTargetId, draftInputRef, colTree, colFreq, colStart, colEnd, colAssigned, gridColumns, schedule],
  );

  const handleItemCreate = useCallback((start: Date, end: Date, groupId?: string) => {
    if (!groupId) return;
    const startStr = moment(start).format('YYYY-MM-DD');
    const endStr = moment(end).format('YYYY-MM-DD');

    // Use refs so we always see the latest drafts / schedule.
    const draft = draftsRef.current.find((d) => d.id === groupId);
    if (draft) {
      updateDraftField(groupId, 'startDate', startStr);
      updateDraftField(groupId, 'endDate', endStr);
      return;
    }

    const event = scheduleRef.current?.events.find((e) => e.id === groupId);
    if (event) {
      updateEvent({
        variables: { id: groupId, input: { startDate: startStr, endDate: endStr } },
      }).then(() => refetch());
    }
  }, [updateDraftField, updateEvent, refetch]);

  const handleItemChange = useCallback((change: { id: string; start?: Date; end?: Date; groupId?: string }) => {
    console.log('[handleItemChange] raw change', {
      id: change.id,
      start: change.start ? moment(change.start).format('YYYY-MM-DD') : undefined,
      startISO: change.start?.toISOString(),
      end: change.end ? moment(change.end).format('YYYY-MM-DD') : undefined,
      endISO: change.end?.toISOString(),
      startRaw: change.start,
      endRaw: change.end,
    });
    const eventId = change.id.replace(/-occ-\d+$/, '');
    const event = scheduleRef.current?.events.find((e) => e.id === eventId);
    if (!event) return;
    if (!change.start && !change.end) return;

    const input: Record<string, any> = {};
    const bothEdges = change.start && change.end;

    if (bothEdges) {
      // Move: shift startDate, preserve duration by shifting endDate
      input.startDate = moment(change.start).format('YYYY-MM-DD');
      if (event.endDate) {
        const shiftMs = moment(change.start).valueOf() - moment(event.startDate).valueOf();
        input.endDate = moment(moment(event.endDate).valueOf() + shiftMs).format('YYYY-MM-DD');
      }
    } else {
      // Resize: only one edge changed — set it directly
      if (change.start) input.startDate = moment(change.start).format('YYYY-MM-DD');
      if (change.end) input.endDate = moment(change.end).format('YYYY-MM-DD');
    }

    // Optimistic cache update: show the new position immediately
    client.cache.modify({
      id: client.cache.identify({ __typename: 'RecurringEvent', id: eventId }),
      fields: {
        startDate: (existing) => input.startDate ?? existing,
        endDate: (existing) => input.endDate !== undefined ? input.endDate : existing,
      },
    });

    updateEvent({ variables: { id: eventId, input } })
      .then(() => refetch())
      .catch((err) => console.error('[handleItemChange] mutation failed', err));
  }, [updateEvent, refetch, client]);

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
        sidebarWidth={sidebarWidth}
        items={timelineItems}
        groups={timelineGroups}
        start={horizon.start}
        end={horizon.end}
        step={step}
        itemHeight={32}
        groupHeaderHeight={32}
        headerHeight={48}
        resizable
        movable
        showLinks={false}
        showToday
        fitContainer
        callbacks={{
          onNavigate: handleNavigate,
          onItemCreate: handleItemCreate,
          onItemChange: handleItemChange,
          onDelete: handleDelete,
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
              label="End date"
              type="date"
              value={eventFormEndDate}
              onChange={(e) => setEventFormEndDate(e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="Optional. The date this recurring event ends."
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
