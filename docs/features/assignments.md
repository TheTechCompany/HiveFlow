# Assigned Tasks

A unified kanban board that combines tasks from all sources — projects, estimates, and recurring events — into a single view. Filterable by person and source, with drag-and-drop status updates and a handover workflow.

---

## How the unified kanban works

### Data sources

The `assignments` GraphQL query returns a flat list of tasks. Each task carries one of three source references:

| Source | FK field | Description |
|--------|----------|-------------|
| Project | `projectId` | Tasks created directly in a project |
| Estimate | `estimateId` | Tasks created on an estimate |
| Recurring Event | `recurringEventId` | Tasks auto-generated from a recurring schedule |

The frontend normalizes all three into a unified `KanbanTask` type that supports all optional source fields.

### Task generation for recurring events

When the `assignments` query runs, the backend calls `ensureGeneratedTasks()` for each recurring event assigned to the current user. This materializes any due tasks within the horizon window (default 90 days) before returning the results. See [Recurring Events](recurring-events.md) for details.

---

## Kanban columns

Five columns, derived from the standard kanban statuses plus a "My Reviews" view:

| Column | Status filter | Behaviour |
|--------|---------------|-----------|
| **Up Next** | `Backlog` | Default column — new tasks land here |
| **In Progress** | `In Progress` | Being worked on |
| **In Review** | `Reviewing` | Awaiting review (semi-transparent styling) |
| **My Reviews** | `Reviewing` (filtered to current user's reviews) | Same status, filtered for the reviewer |
| **Finished** | `Finished` | Starts collapsed — tasks hide after 7-day TTL |

The "My Reviews" column is a convenience view: it shows the same `Reviewing`-status tasks but filtered to only those where the current user is a reviewer.

---

## Drag-and-drop behaviour

The kanban uses `react-beautiful-dnd` for drag-and-drop between columns.

### Moving to a standard column

When a task is dragged to `Backlog`, `In Progress`, or `Finished`:
1. The `onDrag` handler calls `updateTask` with the new `status`.
2. If `above`/`below` neighbour IDs are provided, LexoRank is recomputed for the new position.

### Moving to Reviewing / My Reviews

When a task is dragged to `Reviewing` or `My Reviews`, a **handover workflow** triggers:
1. A `HandoverModal` opens, prompting the user to write a `handoverNote`.
2. On submit, the task is updated to `status: 'Reviewing'` with the handover note attached.

### Guard rules

Tasks without a source (`project`/`estimate`/`recurringEvent`) **cannot be moved** — the drag handler skips them.

---

## Filtering and grouping

### Source filters

The hook (`use-assignments.ts`) derives filter options from the union of all source types in the loaded data:
- Project name → `{ __typename: 'Project', id }`
- Estimate name → `{ __typename: 'Estimate', id }`
- Schedule name → `{ __typename: 'RecurringSchedule', id }`

These appear as autocomplete chips above the kanban.

### Grouping

When grouped by project, tasks are sorted first by project name, then by `columnRank` (LexoRank string sort) within each column.

### Person filter

Tasks can be filtered to show only those assigned to a specific person.

---

## View modes

Three view modes, switchable from the header:

| Mode | Description |
|------|-------------|
| **Horizontal Kanban** (default) | Drag-and-drop columns with `react-beautiful-dnd` |
| **Table View** | Tabular list of all tasks |
| **Timeline View** | Gantt view with inline date editing via `updateTask` |

---

## Continuous Improvement section

Below the kanban, a collapsible section shows the current user's Continuous Improvement items with status chips. See [Continuous Improvement](improvement.md).

---

## Hook: `useAssignments`

The frontend logic lives in `packages/app/hiveflow-frontend/src/hooks/use-assignments.ts`:

- **Query**: `GetAssignedTasks($horizonDays: Int)` — fetches users, assignments with nested source info, children, and parent.
- **Normalization**: Legacy `RecurringEvent` objects lacking `project`/`estimate` fields are normalized with `scheduleId`/`frequency`.
- **Column derivation**: Tasks are grouped by `status` into the 5 kanban columns.
- **Filter derivation**: Source type filters built from the union of loaded data.
- **Drag handling**: `onDrag` dispatches to `updateTask` for standard moves or triggers the handover modal for review moves.
- **Handover**: `submitHandover` updates the task to `Reviewing` with the `handoverNote`.

---

## GraphQL operations

### Queries

| Query | Notes |
|-------|-------|
| `assignments(horizonDays: Int)` | Returns union of tasks from all sources. Triggers recurring task generation. Includes nested `members`, `project`, `estimate`, `recurringEvent`. |

### Mutations (used by the kanban)

| Mutation | Notes |
|----------|-------|
| `updateTask(id, status, above, below, handoverNote)` | Status changes, reordering, handover notes |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Backend  | `packages/app/hiveflow-backend/src/schema/assignment.ts` | `assignments` resolver — triggers recurring task generation |
| Backend  | `packages/app/hiveflow-backend/src/utils/recurring.ts` | `ensureGeneratedTasks` — materializes recurring tasks |
| Frontend | `packages/app/hiveflow-frontend/src/views/assignments/index.tsx` | Main assignments view (kanban, table, timeline modes) |
| Frontend | `packages/app/hiveflow-frontend/src/hooks/use-assignments.ts` | `useAssignments` hook — data, filtering, drag logic |
| Frontend | `packages/app/hiveflow-frontend/src/types/kanban.ts` | `KanbanTask` and `KANBAN_STATUSES` types |
