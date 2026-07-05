// ── TaskDialog — shared types ───────────────────────────────────────

import type { ReactNode } from 'react';

/** Standard workflow statuses. */
export type TaskStatus = 'Backlog' | 'In Progress' | 'Reviewing' | 'Finished';

/** Core task data the dialog reads and writes. */
export interface TaskData {
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

export interface TaskDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called when the user wants to dismiss the dialog. */
  onClose: () => void;

  /** Task data to populate the form. Omit or pass empty object for create mode. */
  task?: TaskData;

  /** Dialog mode — defaults to 'create' when no task.id-like marker, else 'view'. */
  mode?: 'create' | 'edit' | 'view';

  /** Called when the user saves (create or update). Receives the current task state. */
  onSubmit?: (task: TaskData) => Promise<void>;
  /** Called when the user deletes the task. Only shown when `onDelete` is provided. */
  onDelete?: () => Promise<void>;

  /** Override the dialog title. Auto-generated from `mode` when omitted. */
  title?: string;

  // ── Optional slots for app-level customisation ──────────────────

  /** Extra content rendered between the title and the description. */
  renderHeaderActions?: () => ReactNode;
  /** Extra fields rendered below the date row. */
  renderExtraFields?: (editing: boolean) => ReactNode;
  /** Replace the default date inputs with a custom date picker (e.g. @mui/x-date-pickers). */
  renderDateField?: (field: DateFieldDef) => ReactNode;
}
