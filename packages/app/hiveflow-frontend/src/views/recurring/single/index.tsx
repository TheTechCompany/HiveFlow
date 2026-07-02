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
import { gql, useQuery, useMutation } from '@apollo/client';
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
  const eventEnd = event.endDate ? moment(event.endDate) : null;

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
    if (eventEnd && cursor.isAfter(eventEnd)) break;
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

  // Keep latest schedule in a ref so callbacks never see a stale version.
  const scheduleRef = React.useRef(schedule);
  scheduleRef.current = schedule;

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
    // Use treeInfo.flat (visual DFS order) instead of schedule.events (server order)
    // so we find the correct visually-previous sibling.
    const flat = treeInfo.flat;
    const selfIdx = flat.findIndex((f) => f.id === eventId);
    if (selfIdx <= 0) return;
    const depth = flat[selfIdx].depth;
    let prevSibling: RecurringEvent | undefined;
    for (let i = selfIdx - 1; i >= 0; i--) {
      if (flat[i].depth === depth) { prevSibling = flat[i]; break; }
      if (flat[i].depth < depth) break;
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
    // Use null (not undefined) so Apollo sends parentId: null to clear it.
    const grandParentId = parent?.parentId ?? null;
    updateEvent({ variables: { id: eventId, input: { parentId: grandParentId as any } } }).then(() => refetch());
  }, [schedule, updateEvent, refetch]);

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
        startDate: moment().format('YYYY-MM-DD'),
        endDate: '',
        assignedTo: '',
      }]);
    }
  }, [drafts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const draftInputRef = React.useRef<HTMLInputElement>(null);

  // ── Safe LexoRank between (fallback to genNext on collision) ─
  const safeBetween = useCallback((lower: LexoRank, upper: LexoRank): LexoRank => {
    try { return lower.between(upper); } catch { return lower.genNext(); }
  }, []);

  // ── Stable ranked rows (lexorank — single source of truth) ─
  const rankedRows = useMemo(() => {
    const rows: { id: string; event?: RecurringEvent; draft?: RecurringEvent; rank: LexoRank }[] = [];
    let lastRank = LexoRank.middle();

    // Events: use persisted rowOrder if available, else compute sequentially
    for (const e of treeInfo.flat) {
      const rank = e.rowOrder ? LexoRank.parse(e.rowOrder) : lastRank;
      rows.push({ id: e.id, event: e, rank });
      lastRank = rank.genNext();
    }

    // Insert drafts at their _insertAfter positions
    // Track the last inserted rank per position so multiple drafts
    // at the same spot get unique, ordered ranks
    const afterRanks = new Map<number, LexoRank>();
    for (const draft of drafts) {
      const afterId = (draft as any)._insertAfter as string | undefined;
      if (afterId) {
        const afterIdx = rows.findIndex((r) => r.id === afterId);
        if (afterIdx >= 0) {
          const lower = afterRanks.get(afterIdx) ?? rows[afterIdx].rank;
          const nextRow = rows[afterIdx + 1];
          const insertRank = nextRow ? safeBetween(lower, nextRow.rank) : lower.genNext();
          rows.push({ id: draft.id, draft, rank: insertRank });
          afterRanks.set(afterIdx, insertRank);
        } else {
          const last = rows[rows.length - 1];
          rows.push({ id: draft.id, draft, rank: last ? last.rank.genNext() : LexoRank.middle() });
        }
      } else {
        const last = rows[rows.length - 1];
        rows.push({ id: draft.id, draft, rank: last ? last.rank.genNext() : LexoRank.middle() });
      }
    }

    rows.sort((a, b) => a.rank.compareTo(b.rank));
    return rows;
  }, [treeInfo.flat, drafts]);

  const updateDraftField = useCallback((draftId: string, field: keyof RecurringEvent, value: string) => {
    setDrafts((prev) => prev.map((d) => (d.id === draftId ? { ...d, [field]: value } : d)));
  }, []);

  const commitDraft = useCallback((draftId: string) => {
    const currentSchedule = scheduleRef.current;
    let draftToCommit: (RecurringEvent & { _insertAfter?: string }) | undefined;
    let rowRank: LexoRank | undefined;

    setDrafts((prev) => {
      const draft = prev.find((d) => d.id === draftId);
      draftToCommit = draft as any;
      const valid = draft && draft.name.trim() && draft.startDate;

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
                rowOrder: rowRank ? rowRank.toString() : undefined,
              },
            },
          }).then(() => refetch());
        }

        // For Enter-created drafts, replace with a new blank one at the
        // same position so the user can keep adding siblings.
        const insertAfter = (draft as any)?._insertAfter as string | undefined;
        if (insertAfter) {
          const replacement: any = {
            id: `draft-${Date.now()}`,
            scheduleId: draft!.scheduleId,
            parentId: draft!.parentId,
            name: '',
            description: '',
            frequency: 'monthly',
            startDate: moment().format('YYYY-MM-DD'),
            endDate: '',
            assignedTo: '',
            _insertAfter: insertAfter,
          };
          return prev.map((d) => (d.id === draftId ? replacement : d));
        }
        // Seed draft (no _insertAfter): remove it; the seed effect recreates.
        return prev.filter((d) => d.id !== draftId);
      }

      // Draft is invalid (empty name or date) — just remove it.
      // If it was an Enter-created draft, the seed draft will still be there.
      return prev.filter((d) => d.id !== draftId);
    });
    setTimeout(() => draftInputRef.current?.focus(), 50);
  }, [drafts, rankedRows, createEvent, refetch]);
  // ↑ schedule intentionally omitted — we use scheduleRef for freshness.

  // ── Enter in filled row → new sibling row ───────────────
  const handleEnterInRow = useCallback((afterEventId: string, parentId?: string) => {
    setDrafts((prev) => {
      const scheduleId = scheduleRef.current?.id ?? '';
      const newDraft: RecurringEvent & { _insertAfter?: string } = {
        id: `draft-${Date.now()}`,
        scheduleId,
        parentId: parentId || undefined,
        name: '',
        description: '',
        frequency: 'monthly',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: '',
        assignedTo: '',
        _insertAfter: afterEventId,
      };
      return [...prev, newDraft as RecurringEvent];
    });
    setTimeout(() => draftInputRef.current?.focus(), 0);
  }, []); // scheduleRef is stable across renders

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

  const timelineItems = ((): TimelineItem[] => {
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
      if (occurrences.length === 0) return;
      const colorIx = resolveColorIx(event.id);
      const color = EVENT_COLORS[Math.abs(colorIx) % EVENT_COLORS.length];

      // Create a visual marker for each occurrence — these are derived,
      // not primary objects. All share the event's groupId so they appear
      // in the same row as the definition.
      for (let i = 0; i < occurrences.length; i++) {
        const occDate = occurrences[i];
        // Each marker spans 3 days so it's clearly visible at any zoom level,
        // while still leaving gaps between occurrences so the repetition is obvious.
        const markerEnd = moment(occDate).add(3, 'days').toDate();

        items.push({
          id: `${event.id}-occ-${i}`,
          start: occDate,
          end: markerEnd,
          groupId: event.id,
          color,
          selectable: false,
          resizable: false,
          data: { event, occurrenceIndex: i },
        });
      }
    });
    return items;
  })();

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
          <Box sx={{ display: 'grid', gridTemplateColumns: gridColumns, alignItems: 'center', height: '100%', borderBottom: '1px solid', borderColor: 'grey.200', bgcolor: '#f0f7ff', boxSizing: 'border-box' }}>
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
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#90caf9', flexShrink: 0, mt: '11px' }} />
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
              onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); handleEnterInRow(event.id, event.parentId); } }}
              sx={{ flex: 1, minWidth: 0, height: '100%', '& .MuiInputBase-root': { py: 0, fontSize: '0.75rem', height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px' } }}
            />
          </Box>
          <Box sx={cellSx}>
            <TextField select size="small" variant="standard" key={`freq-${event.id}-${event.frequency}`} defaultValue={event.frequency}
              onChange={(e) => updateEvent({ variables: { id: event.id, input: { frequency: e.target.value } } }).then(() => refetch())}
              sx={{ flex: 1, ...inputSx }}>
              {FREQUENCIES.map((f) => <MenuItem key={f.value} value={f.value} sx={{ fontSize: '0.75rem' }}>{f.label}</MenuItem>)}
            </TextField>
          </Box>
          <Box sx={cellSx}>
            <TextField key={`start-${event.id}-${event.startDate}`} size="small" variant="standard" type="date" defaultValue={event.startDate}
              onChange={(e) => { if (e.target.value && e.target.value !== event.startDate) updateEvent({ variables: { id: event.id, input: { startDate: e.target.value } } }).then(() => refetch()); }}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px', fontSize: '0.7rem', height: '100%' } }}
            />
          </Box>
          <Box sx={cellSx}>
            <TextField key={`end-${event.id}-${event.endDate || ''}`} size="small" variant="standard" type="date" defaultValue={event.endDate || ''}
              onChange={(e) => { updateEvent({ variables: { id: event.id, input: { endDate: e.target.value || ('' as any) } } }).then(() => refetch()); }}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1, height: '100%', '& .MuiInputBase-root': { py: 0, height: '100%' }, '& .MuiInputBase-input': { px: '8px', py: '2px', fontSize: '0.7rem', height: '100%' } }}
            />
          </Box>
          <Box sx={{ ...cellSx, borderRight: 'none' }}>
            <Autocomplete freeSolo options={users.map((u) => u.name)} defaultValue={event.assignedTo || ''}
              onInputChange={(_, val) => updateEvent({ variables: { id: event.id, input: { assignedTo: val || ('' as any) } } }).then(() => refetch())}
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
    [treeInfo, rankedRows, collapsed, toggleCollapse, indentEvent, outdentEvent, users, updateEvent, refetch, updateDraftField, commitDraft, handleEnterInRow, handleDeleteRow, removeDraft, handleDragStart, handleDragOver, handleDrop, dropTargetId, draftInputRef, colTree, colFreq, colStart, colEnd, colAssigned, gridColumns, schedule],
  );

  const handleItemCreate = useCallback((start: Date, _end: Date, groupId?: string) => {
    if (!groupId) return;
    const startStr = moment(start).format('YYYY-MM-DD');

    // Use refs so we always see the latest drafts / schedule.
    const draft = draftsRef.current.find((d) => d.id === groupId);
    if (draft) {
      updateDraftField(groupId, 'startDate', startStr);
      return;
    }

    const event = scheduleRef.current?.events.find((e) => e.id === groupId);
    if (event) {
      updateEvent({
        variables: { id: groupId, input: { startDate: startStr } },
      }).then(() => refetch());
    }
  }, [updateDraftField, updateEvent, refetch]);

  const handleItemChange = useCallback((change: { id: string; start?: Date; end?: Date; groupId?: string }) => {
    if (!change.start) return;
    // Item ids are `${eventId}-occ-${i}`; extract the real event id
    const eventId = change.id.replace(/-occ-\d+$/, '');
    const startStr = moment(change.start).format('YYYY-MM-DD');
    const event = scheduleRef.current?.events.find((e) => e.id === eventId);
    if (event) {
      updateEvent({ variables: { id: eventId, input: { startDate: startStr } } }).then(() => refetch());
    }
  }, [updateEvent, refetch]);

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
        resizable={false}
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
