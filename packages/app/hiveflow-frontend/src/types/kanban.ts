import type { DropResult } from 'react-beautiful-dnd';

/** The four kanban status columns */
export const KANBAN_STATUSES = ['Backlog', 'In Progress', 'Reviewing', 'Finished'] as const;
export type KanbanStatus = typeof KANBAN_STATUSES[number];

/** A card on the kanban board — common fields from all task types */
export interface KanbanTask {
  __typename?: 'ProjectTask' | 'EstimateTask' | 'RecurringEvent';
  id: string;
  title: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  timelineRank?: string | null;
  columnRank?: string | null;
  handoverNote?: string | null;
  members?: Array<{ id: string; name: string }> | null;
  project?: { id: string; displayId: string; name: string } | null;
  estimate?: { id: string; displayId: string; name: string } | null;
  /** Set when a task was generated from a RecurringEvent */
  recurringEvent?: {
    id: string;
    frequency?: string | null;
    schedule?: { id: string; name: string } | null;
  } | null;
  /** RecurringEvent-specific fields (legacy, for raw templates without horizon) */
  scheduleId?: string | null;
  frequency?: string | null;
  assignedTo?: string | { id: string; name: string } | null;
  exceptionDates?: unknown | null;
  schedule?: { id: string; name: string } | null;
}

/** Row shape the KanbanBoard expects per card */
export interface KanbanRow {
  id: string;
  title: string;
  /** Original task payload carried through for renderCard / onSelectCard */
  _task: KanbanTask;
  /** Timestamp of the last status change — used for TTL filtering */
  lastUpdated?: Date;
}

/** Column appearance variant for stacked layouts */
export type KanbanColumnVariant = 'default' | 'subtle' | 'collapsed';

/** Column shape the KanbanBoard expects */
export interface KanbanColumn {
  id: string;
  title: string;
  rows: KanbanRow[];
  /** Auto-hide rows whose lastUpdated is older than this (ms). Undefined = never hide. */
  ttl?: number;
  /** Visual variant — 'subtle' renders opaque, 'collapsed' starts closed. */
  variant?: KanbanColumnVariant;
}

/** Result of the GetAssignedTasks query */
export interface AssignmentsQueryData {
  users?: Array<{ id: string; name: string }> | null;
  assignments?: KanbanTask[] | null;
}

/** Filter option for project/estimate autocomplete */
export interface TaskFilterOption {
  __typename: string;
  id: string;
  displayId: string;
  name: string;
}

/** Drag payload passed to onDragEnd */
export type KanbanDragResult = DropResult;
