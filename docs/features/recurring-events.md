# Recurring Events

Recurring events are templates that automatically generate concrete `Task` rows on a
repeating schedule.  They live inside a **RecurringSchedule** (a named container) and
are edited in the Recurring Schedules view.  The generated tasks appear in each
assignee's **Assigned Tasks** kanban board.

---

## Data model

### RecurringSchedule

A named collection that groups related recurring events.

| Field         | Type     | Notes                                      |
|---------------|----------|--------------------------------------------|
| `id`          | String   | Nano ID                                    |
| `displayId`   | String?  | Human-readable short code (unique per org)  |
| `name`        | String   | Schedule name, e.g. "Compliance checks"     |
| `description` | String?  | Free-text description                       |
| `events`      | Relation | One-to-many → `RecurringEvent`              |
| `organisation`| String   | Tenant scope                               |

### RecurringEvent

A single recurring-item template.  One event = one line in the schedule editor.

| Field             | Type     | Purpose                                                      |
|-------------------|----------|--------------------------------------------------------------|
| `id`              | String   | Nano ID                                                      |
| `scheduleId`      | String   | FK → `RecurringSchedule`                                     |
| `parentId`        | String?  | Self-relation FK for split/child events                      |
| `name`            | String   | Display name; also used as the generated task title fallback |
| `description`     | String?  | Copied to generated tasks                                    |
| `frequency`       | String   | `"daily"` / `"weekly"` / `"monthly"` / `"quarterly"` / `"yearly"` (default `"monthly"`) |
| `startDate`       | String   | **First occurrence date** — `"YYYY-MM-DD"`. The repetition starts here. Also becomes the `startDate` of each generated Task. |
| `endDate`         | String?  | **Stop date** — `"YYYY-MM-DD"`.  No more occurrences are generated on or after this date.  `null` means repeat forever.  Does NOT affect individual task duration — use `durationDays` for that. |
| `durationDays`    | Int?     | **Task duration** in days.  Each generated Task gets `endDate = startDate + durationDays`.  `null` means the task has no end date (point-in-time). |
| `assignedTo`      | String?  | **User ID** of the person assigned to each generated task. Also drives the Assigned Tasks view — only events whose `assignedTo` matches your user ID generate tasks for you. |
| `rowOrder`        | String?  | LexoRank string for ordering rows in the schedule editor     |
| `exceptionDates`  | Json?    | Array of `{ originalDate: string }` — dates to skip.  Also supports `newStartDate`/`newEndDate` for rescheduled single occurrences. |
| `taskTemplate`    | Json?    | Shape: `{ title?, description?, members?, projectId? }` — overrides for generated tasks. |
| `organisation`    | String   | Tenant scope                                                 |

Relationships:
- `schedule` — the parent `RecurringSchedule`
- `parent` / `children` — for split events (see below)
- `generatedTasks` — the concrete `Task` rows that have been materialised from this template

### Generated Task (Task with `recurringEventId`)

When a task is created from a recurring event it has:

| Field              | Value                                    |
|--------------------|------------------------------------------|
| `status`           | `"Backlog"`                              |
| `title`            | `taskTemplate.title` or `event.name`     |
| `description`      | `event.description`                      |
| `startDate`        | The occurrence date                      |
| `endDate`          | `startDate + durationDays` (or `null`)   |
| `members`          | `[event.assignedTo]`                     |
| `recurringEventId` | FK back to the template                  |
| `projectId`        | `taskTemplate.projectId` (or `null`)     |

---

## How task generation works

Generation is **lazy** — there is no background cron job.  Tasks are materialised
on-demand, triggered by three entry points:

### 1. Assigned Tasks query (`assignments` resolver)

File: `packages/app/hiveflow-backend/src/schema/assignment.ts`

```
User opens Assigned Tasks view
  → GraphQL query `assignments(horizonDays: 90)`
    → Fetch all RecurringEvent rows WHERE
        assignedTo = current user ID
        AND organisation = current org
    → For each event, call ensureGeneratedTasks(event, today, today + horizonDays)
    → Then query all Task rows (project, estimate, AND recurring) for the user
    → Return unified task list to the kanban
```

### 2. Create / Update RecurringEvent mutation

File: `packages/app/hiveflow-backend/src/schema/schedule.ts` (lines 880-886, 909-915)

When an event is created or updated and has an `assignedTo` user, tasks are
immediately seeded for the next 90 days so they appear right away.

### 3. Completion cascade (`updateTask` mutation)

File: `packages/app/hiveflow-backend/src/schema/project.ts` (lines 284-300)

When a recurring task is marked **Finished**, the system re-runs
`ensureGeneratedTasks` with a 365-day horizon.  This ensures the *next*
occurrence is always waiting in the Backlog column.

### The `ensureGeneratedTasks` function

File: `packages/app/hiveflow-backend/src/utils/recurring.ts`

```
ensureGeneratedTasks(prisma, event, horizonStart, horizonEnd)
  1. generateOccurrences(event, horizonStart, horizonEnd) → date strings
     - Advances from event.startDate by event.frequency
     - Clamps to [horizonStart, horizonEnd)
     - Stops at event.endDate if set
     - Skips exceptionDates
     - Safety cap: 500 iterations
     - Month-end clamping: Jan 31 → Feb 28 → Mar 28
  2. Query existing Tasks for this event + those dates
  3. Create missing Tasks (status: "Backlog", members: [assignedTo])
  4. Return count of newly created tasks
```

---

## Recurring schedule editor

File: `packages/app/hiveflow-frontend/src/views/recurring/single/index.tsx`

The **ScheduleSingle** view is a spreadsheet-style editor with an inline Gantt
timeline.

### Views

- **List view** (`/recurring`) — DataTable of all schedules, create/rename/delete
- **Single view** (`/recurring/:id`) — Full schedule editor with:
  - Spreadsheet rows (name, frequency, start date, end date, assigned to)
  - Tree structure (indent/outdent for parent-child relationships)
  - Inline draft row for quick creation (type name → Enter)
  - Gantt timeline showing occurrence bars
  - Drag to reschedule individual occurrences (offers "this one" or "all future")

### Split events (`splitRecurringEvent`)

When you move "this and all future occurrences", the original event's `endDate` is
capped and a **child event** is created with the new `startDate`.  Children
inherit the parent's name, frequency, and `assignedTo`.

---

## Key concepts

### `startDate` — when repetition begins (and task start)

The date the first occurrence falls on.  The repetition engine advances from this
date by `frequency` intervals.  Each generated Task copies this date as its own
`startDate`.

Example: `startDate: "2026-01-15"`, `frequency: "monthly"` →
occurrences on Jan 15, Feb 15, Mar 15, …

### `endDate` — when repetition stops

The date after which **no more occurrences are generated**.  `null` means "repeat
forever."  This controls the recurrence window only — it does NOT set the
duration of individual tasks.

Example: `startDate: "2026-01-01"`, `endDate: "2026-03-01"`, `frequency: "monthly"` →
occurrences on Jan 1, Feb 1.  March 1 is **excluded** because the cursor reaches
`endDate` and stops.

### `durationDays` — how long each generated task lasts

Optional integer.  When set, each generated Task gets `endDate = startDate +
durationDays`.  `null` means the task is point-in-time (no end date).

Example: `startDate: "2026-01-01"`, `durationDays: 3`, `frequency: "monthly"` →
each monthly task spans Jan 1–4, Feb 1–4, Mar 1–4, …

### `assignedTo` — who gets the tasks

- Stores a **user ID** (e.g. `"9fZiIZ__37_ZgtOejrfhj"`), not a display name.
- The Assigned Tasks view fetches events where `assignedTo` matches the
  authenticated user's ID.
- Each generated task gets `members: [assignedTo]`.
- If `assignedTo` is empty, no tasks are generated (skipped in both the create
  mutation and the assignments query).

### `exceptionDates` — skipping or moving occurrences

Array of `{ originalDate: string, newStartDate?: string, newEndDate?: string }`.

- If only `originalDate` is present → that date is skipped.
- If `newStartDate` is also present → the occurrence is rescheduled to a different
  date (shown as a separate bar on the Gantt chart).

### `taskTemplate` — customising generated tasks

Optional JSON object that overrides defaults for generated tasks:

```json
{
  "title": "Custom task title",
  "description": "Overrides event.description",
  "members": ["userId1", "userId2"],
  "projectId": "optional-project-id"
}
```

If not set, the task title falls back to `event.name`, description to
`event.description`, and members to `[event.assignedTo]`.

---

## Common pitfalls

| Symptom                                  | Likely cause                                    |
|------------------------------------------|-------------------------------------------------|
| Events exist but tasks don't appear      | `assignedTo` stores a name instead of a user ID |
| Recurring events aren't triggering tasks | `endDate` is set to a past date — set it to `null` for ongoing events, or a future date |
| Daily events started >500 days ago       | 500-iteration safety cap hit — no recent occurrences generated |
| Tasks generated but filtered out         | Frontend filter uses `t.schedule` but data is at `t.recurringEvent.schedule` |
| Can't drag recurring task between columns| Guard checks `!task.project && !task.estimate` but doesn't check `!task.recurringEvent` |
| Tasks have no end date                   | Set `durationDays` on the recurring event |

---

## File index

| Layer    | File                                                                  | Purpose                                      |
|----------|-----------------------------------------------------------------------|----------------------------------------------|
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 272-307)  | `RecurringSchedule` & `RecurringEvent` models|
| Backend  | `packages/app/hiveflow-backend/src/utils/recurring.ts`                | `generateOccurrences` + `ensureGeneratedTasks`|
| Backend  | `packages/app/hiveflow-backend/src/schema/assignment.ts`              | `assignments` resolver — triggers generation |
| Backend  | `packages/app/hiveflow-backend/src/schema/schedule.ts`                | CRUD mutations + seed-on-create/update        |
| Backend  | `packages/app/hiveflow-backend/src/schema/project.ts` (line 284)      | Completion cascade in `updateTask`            |
| Frontend | `packages/app/hiveflow-frontend/src/views/recurring/list/index.tsx`   | Schedule list view                            |
| Frontend | `packages/app/hiveflow-frontend/src/views/recurring/single/index.tsx` | Schedule editor (spreadsheet + Gantt)         |
| Frontend | `packages/app/hiveflow-frontend/src/hooks/use-assignments.ts`         | Assigned Tasks hook + kanban logic            |
| Frontend | `packages/app/hiveflow-frontend/src/views/assignments/index.tsx`      | Assigned Tasks kanban view                    |
| Tests    | `packages/app/hiveflow-backend/__tests__/generateOccurrences.test.ts` | 18 unit tests for date generation             |
| Tests    | `packages/app/hiveflow-frontend/src/hooks/use-assignments.test.ts`    | 20 unit tests for assignments hook            |
