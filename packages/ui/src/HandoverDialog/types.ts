// ── HandoverDialog — shared types ───────────────────────────────────

/** A task that can be included in a handover sheet. */
export interface HandoverTask {
  id: string;
  title: string;
  description?: string;
  status: HandoverTaskStatus;
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string;
}

export type HandoverTaskStatus = 'Backlog' | 'In Progress' | 'Reviewing' | 'Finished';

/** A person who can be assigned to tasks. */
export interface HandoverPerson {
  id: string;
  name: string;
}

/** A project that contains tasks. */
export interface HandoverProject {
  id: string;
  displayId: string;
  name: string;
}

/** Maps a task to its assigned people. */
export interface HandoverAssignment {
  taskId: string;
  personIds: string[];
}

export interface HandoverDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called when the user wants to dismiss the dialog. */
  onClose: () => void;

  /**
   * ID of an existing handover.  When present the dialog opens in
   * view mode (tasks collapsed).  When absent it opens in edit mode.
   */
  handoverId?: string;

  /** The date the handover is for (shown in the title). */
  date?: string;

  // ── Project ────────────────────────────────────────────────────

  /** Available projects to pick from. */
  projects: HandoverProject[];
  /** Currently selected project id. */
  selectedProjectId?: string;
  /** Called when the user picks a different project. */
  onProjectChange: (projectId: string) => void;

  // ── Date range ─────────────────────────────────────────────────

  /** Handover start date (ISO YYYY-MM-DD). */
  startDate?: string;
  /** Handover end date (ISO YYYY-MM-DD). */
  endDate?: string;
  /** Called when start date changes. */
  onStartDateChange: (iso: string) => void;
  /** Called when end date changes. */
  onEndDateChange: (iso: string) => void;

  // ── Tasks ──────────────────────────────────────────────────────

  /** All tasks available for the selected project (for the picker). */
  availableTasks: HandoverTask[];
  /** Tasks the user has selected for this handover. */
  selectedTasks: HandoverTask[];
  /** Called when the user adds or removes tasks. */
  onTasksChange: (tasks: HandoverTask[]) => void;

  // ── Managers / owners ─────────────────────────────────────────

  /** Managers or owners of this handover. */
  managers: HandoverPerson[];
  /** Called when managers change. */
  onManagersChange: (managers: HandoverPerson[]) => void;

  // ── People ─────────────────────────────────────────────────────

  /** Available people for assignment. */
  people: HandoverPerson[];

  /** Current person→task assignments. */
  assignments: HandoverAssignment[];
  /** Called when a task's assigned people change. */
  onAssignmentChange: (assignment: HandoverAssignment) => void;

  /** People on the handover not tied to a specific task. */
  extraPeople: HandoverPerson[];
  /** Called when extra people change. */
  onExtraPeopleChange: (people: HandoverPerson[]) => void;

  // ── Comment ───────────────────────────────────────────────────

  /** General comment for the handover. */
  comment: string;
  /** Called when the comment changes. */
  onCommentChange: (comment: string) => void;

  // ── Actions ────────────────────────────────────────────────────

  /** Called when the user clicks "Export PDF". */
  onExportPdf: () => void;

  /** Called when the user saves the handover. */
  onSubmit?: () => void;
}
