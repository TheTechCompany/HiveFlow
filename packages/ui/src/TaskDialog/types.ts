// ── TaskDialog — shared types ───────────────────────────────────────

import type { ReactElement, ReactNode } from 'react';

/** Standard workflow statuses. */
export type TaskStatus = 'Backlog' | 'In Progress' | 'Reviewing' | 'Finished';

/** Core task data the dialog reads and writes. */
export interface TaskData {
  id?: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string;
}

/** Named date field — passed to `renderDateField`. */
export interface DateFieldDef {
  label: string;
  /** ISO date value (YYYY-MM-DD). */
  value?: string;
  onChange: (iso: string) => void;
  editable: boolean;
}

/** A tab in the expandable sidebar. */
export interface SidebarTab {
  /** Unique key for the tab. */
  key: string;
  /** Label shown on the tab. */
  label: string;
  /** Optional icon shown next to the label. */
  icon?: ReactElement;
  /** The tab's body content. */
  content: ReactNode;
  /** Optional badge count shown next to the label. */
  badge?: number;
}

/** Event payload for `onChecklistToggle`. Mirrors RichTextEditor's signature. */
export interface ChecklistToggleEvent {
  text: string;
  checked: boolean;
  index: number;
  html: string;
}

export interface TaskDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called when the user wants to dismiss the dialog. */
  onClose: () => void;

  /** Task data to populate the form. Omit or pass empty for create mode. */
  task?: TaskData;

  /** Called when the user saves. Receives the current task state. */
  onSubmit?: (task: TaskData) => Promise<void>;
  /** Called when the user deletes the task. Delete button only shown when provided. */
  onDelete?: () => Promise<void>;

  /** Override the dialog title. Auto-generated when omitted. */
  title?: string;

  // ── Expandable sidebar ──────────────────────────────────────────

  /** When provided, an "Expand" toggle appears in the header.  Clicking
   *  it widens the dialog from `md` to `xl` and opens a right panel
   *  with the given tabs. */
  sidebar?: SidebarTab[];

  // ── Optional slots for app-level customisation ──────────────────

  /** Content rendered in the header before the title (e.g. parent breadcrumb). */
  headerPrefix?: ReactNode;
  /** Extra content rendered between the title and the description. */
  renderHeaderActions?: () => ReactNode;
  /** Extra fields rendered below the date row.  Receives the currently
   *  active field name (or `null` when no field is being edited). */
  renderExtraFields?: (activeField: string | null) => ReactNode;
  /** Subtasks panel rendered below the description. */
  renderSubtasks?: () => ReactNode;
  /** Dependencies display rendered below subtasks. */
  renderDependencies?: () => ReactNode;
  /** Replace the default date inputs with a custom date picker (e.g. @mui/x-date-pickers). */
  renderDateField?: (field: DateFieldDef) => ReactNode;
  /** Content rendered next to the status chip in the status row (e.g. creator / owner). */
  renderAfterStatus?: () => ReactNode;
  /** When true, the start/end date row is hidden. Defaults to false. */
  hideDates?: boolean;

  // ── Callbacks ───────────────────────────────────────────────────

  /** Called when a checklist item in the RichTextEditor is toggled. */
  onChecklistToggle?: (event: ChecklistToggleEvent) => void;
}
