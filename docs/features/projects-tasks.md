# Projects & Tasks

Projects are the central organizational unit in HiveFlow. Each project contains tasks managed through a kanban board, with support for subtasks, dependencies, and file management.

---

## Data model

### Project

| Field         | Type       | Purpose |
|---------------|------------|---------|
| `id`          | String     | Nano ID |
| `displayId`   | String?    | Human-readable short code, auto-generated as `count + 1`, unique per organisation |
| `name`        | String?    | Project name |
| `description` | String?    | Free-text description |
| `colour`      | String?    | Colour for UI badges |
| `status`      | String     | Freeform status (default: `"draft"`) |
| `startDate`   | DateTime?  | Project start |
| `endDate`     | DateTime?  | Project end |
| `managers`    | String[]   | Array of user IDs |
| `archived`    | Boolean    | Soft delete flag (default: `false`) |
| `schedule`    | Relation   | One-to-many → ScheduleItem |
| `timeline`    | Relation   | One-to-many → TimelineItem |
| `tasks`       | Relation   | One-to-many → Task |
| `planBatches` | Relation   | One-to-many → PlanBatch |

### Task (unified model)

A single `Task` table serves three source types via polymorphic nullable FKs. Exactly one source FK should be non-null.

| Field              | Type       | Purpose |
|--------------------|------------|---------|
| `id`               | String     | Nano ID |
| `title`            | String     | Task title |
| `description`      | String?    | Free-text description |
| `status`           | String?    | Kanban column: `Backlog`, `In Progress`, `Reviewing`, `Finished` |
| `projectId`        | String?    | FK → Project (source type 1) |
| `estimateId`       | String?    | FK → Estimate (source type 2) |
| `recurringEventId` | String?    | FK → RecurringEvent (source type 3) |
| `startDate`        | DateTime?  | Task start date |
| `endDate`          | DateTime?  | Task end date |
| `timelineRank`     | String?    | LexoRank for timeline ordering |
| `columnRank`       | String?    | LexoRank for kanban column ordering |
| `members`          | String[]   | Assigned user IDs |
| `requiredSkills`   | Json?      | Skill requirements |
| `taskType`         | String?    | Default: `"task"` |
| `category`         | String?    | Freeform category |
| `handoverNote`     | String?    | Note written when handing over for review |
| `parentId`         | String?    | Self-relation FK for subtasks |
| `dependencyOf`     | Relation   | Tasks this task blocks (outgoing edges) |
| `dependencyOn`     | Relation   | Tasks blocking this task (incoming edges) |

---

## Project lifecycle

### Creation

`createProject` runs in a Prisma transaction:
1. If no `displayId` is provided, auto-generates it as `count + 1` (org-scoped).
2. Defaults `status` to `"draft"`.
3. Defaults `managers` to `[context.jwt.id]` (the creator).
4. Catches `P2002` unique constraint violations for duplicate displayIds.

### Deletion

Projects are **soft-deleted**: `updateProject` sets `archived: true`. Tasks on archived projects remain intact but are hidden from active views unless the `where: { archived: true }` filter is explicitly passed.

### File management

Files are stored on a separate **HiveFiles** gateway, not in the database. The backend proxies all file operations under the path `/Application Data/Flow/{displayId}/`:

| Operation | GraphQL mutation |
|-----------|-----------------|
| Create folder | `createProjectFolder(path)` |
| Upload files | `uploadProjectFiles` (multipart with `operations` + `map` JSON) |
| Move file | `moveProjectFile(source, destination)` |
| Rename file | `renameProjectFile(path, name)` |
| Delete file | `deleteProjectFile(path)` |

---

## Kanban task management

### Status columns

Tasks move through four kanban columns:

```
Backlog → In Progress → Reviewing → Finished
```

### LexoRank ordering

Both `columnRank` (vertical order within a kanban column) and `timelineRank` (order in the project timeline) use LexoRank strings for fractional-index reordering.

**When creating a task:**
1. Query the last task in the target status column (`orderBy: { columnRank: 'desc' }`).
2. Query the last task overall for timeline ordering.
3. Compute `LexoRank.parse(lastRank).between(LexoRank.max())` to get a new rank that sorts after the last item.

**When moving a task between columns (drag & drop):**
1. If `above`/`below` neighbor IDs are provided: parse their `columnRank`s and compute `aboveRank.between(belowRank)`.
2. If only `status` changes (no explicit position): place at the top of the new column.

**When reordering in the timeline:**
Same pattern — parse `above`/`below` `timelineRank`s, compute `.between()`.

### Finished task TTL

Finished tasks auto-hide from the kanban view 7 days after `lastUpdated`. This is a frontend-side filter in the `ProjectSingle` context — the tasks remain in the database.

---

## Task date semantics

A task carries two nullable date fields: `startDate` and `endDate`. The system intentionally does **not** force all tasks into a single date model — different tasks need different levels of temporal precision, and the UI should surface the right thing without making every card look like a Gantt bar.

### Three date patterns

| Pattern | `startDate` | `endDate` | Meaning | Typical use |
|---------|------------|-----------|---------|-------------|
| **Date range** | set | set | The task should be worked on between these dates | Scheduled work with a known window |
| **Deadline** | null | set | The task must be finished by this date, but can start anytime | Deliverables, submissions, reviews |
| **No dates** | null | null | The task has no time constraint — it sits in the backlog until someone picks it up | Ideas, low-priority work, "someday" items |

There is intentionally no `"deadline"` flag in the schema — the *absence* of `startDate` combined with a present `endDate` carries that meaning.

### How each pattern renders in the UI

**Card grid (assignments dashboard):**
- Date range: shows both dates with a `Flag` icon for start and `Schedule` icon for end, separated by an arrow (`→`).
- Deadline: shows only the end date with `Schedule` icon. If overdue (end date < now and task not Finished), the date turns red with a `⚠` marker.
- No dates: shows italic "No dates set" in muted text — not as a warning, just informational.

**Table view:**
- Start column: shows the formatted date or `—`.
- Due column: shows the formatted date or `—`. Overdue dates render in red with bold weight.

**Timeline (Gantt):**
- Tasks missing `startDate` or `endDate` fall back to `new Date()` / `new Date() + 1 day` so they appear as a bar on the chart. The timeline is a scheduling tool — if a task has no dates, it shows as a 1-day placeholder so the user can drag it into position.

**Task detail modal:**
- Both date pickers are independently nullable. Clear a date picker to switch from "range" to "deadline" mode. Leave both empty for undated tasks.
- In read-only mode, unset dates show `—`.

### Overdue detection

A task is considered **overdue** when `endDate` is set, `endDate < now`, and the task is **not** in `Finished` status. This is computed on the frontend in `CardGrid.buildCards()` and `TableView`. Finished tasks don't flag as overdue regardless of their dates.

---

## Subtasks and dependencies

HiveFlow has two separate relationship mechanisms between tasks, and they serve different purposes. Understanding the distinction is key to modelling work correctly.

### Subtasks (parent-child)

A task can have a `parentId` referencing another task, creating a **one-level-deep** parent-child hierarchy. Subtasks are created via `createTask` with `parentId` in the input, defaulting to `status: 'Backlog'`.

**Semantics:**
- Subtasks **decompose** a parent into smaller pieces of work.
- A parent with subtasks shows a **progress bar** in the card grid and table view, computed as `finishedSubtasks / totalSubtasks`.
- Subtask completion contributes to parent progress but does **not** block the parent's status — you can move a parent to Finished even if subtasks remain open. (This is a deliberate design choice to avoid forcing waterfall-style workflows; enforcement rules can be added later if needed.)
- Subtasks have their **own statuses**, members, dates, and dependencies — they are full tasks in their own right.

**UI behaviour:**
- A subtask shows its parent as a clickable breadcrumb in the task modal header (`Parent Title › Subtask Title`).
- The parent modal lists all subtasks with their status chips, clickable to navigate into each one.
- An inline text field at the bottom of the subtask list lets you quickly add subtasks by typing a title and pressing Enter.
- The card grid's progress bar and `✓ 2/5` counter show subtask completion at a glance without opening the modal.

**When to use subtasks vs. separate tasks:**
- Use subtasks when the work naturally breaks down into smaller units that together form a deliverable. Example: "Build website" → subtasks: "Design mockup", "Write HTML", "Deploy".
- Use separate tasks (linked by dependencies) when the work items are independently meaningful but one must precede the other.

### Dependencies (blocking relationships)

Dependencies are a **directional many-to-many** self-relation. They model blocking constraints: "Task A cannot start/finish until Task B is done."

**Data model:**
- `dependencyOf` = this task **blocks** other tasks (outgoing edges from this task's perspective).
- `dependencyOn` = this task **is blocked by** other tasks (incoming edges from this task's perspective).

For example, if "Frame walls" must finish before "Install drywall", then:
- "Frame walls".`dependencyOf` → ["Install drywall"]  *(Frame walls blocks drywall)*
- "Install drywall".`dependencyOn` → ["Frame walls"]  *(Drywall is blocked by framing)*

**Creation and deletion:**
- `createTaskDependency(sourceId, targetId)` — connects the source's `dependencyOf` to the target. The source **blocks** the target.
- `deleteTaskDependency(sourceId, targetId)` — disconnects the relation.
- In the project Timeline pane, drag from one task bar to another to create a dependency link. Select a link and press `Delete`/`Backspace` to remove it.

**How dependencies appear in the UI:**

| View | How dependencies are shown |
|------|---------------------------|
| **Timeline pane** | Directed graph edges (arrows/lines) drawn between task bars |
| **Task detail modal** | Two-column chip list: "Needs" (tasks this one depends on) and "Needed by" (tasks blocked by this one). Overdue blocking tasks render in red (`error` colour). Finished blocking tasks are hidden. |
| **Card grid / table** | Not shown at a glance — dependencies surface in the detail modal and timeline only, to keep cards scannable |

**Dependencies and status:**
- There is currently **no server-side enforcement** of dependency order — you can move a blocked task to In Progress even if its blockers are still open. This keeps the system flexible.
- The UI helps visually: the timeline shows the arrow, the modal highlights overdue blockers in red. Enforcement (e.g. preventing status changes while blocked) is a candidate for a future workflow rules layer.

### Subtasks vs. dependencies: a decision guide

| | Subtasks | Dependencies |
|---|---|---|
| Relationship | Parent owns children | Peer-to-peer blocking |
| Cardinality | One parent → many children | Many-to-many |
| Progress tracking | Automatic (subtask completion %) | Manual — no computed progress |
| Visual | Progress bar + counter on cards | Arrows on timeline, chips in modal |
| Best for | Breaking down a deliverable into steps | Sequencing independent tasks |

A task can have **both** subtasks and dependencies — they are orthogonal. For example, "Install drywall" could be a subtask of "Renovate office" and simultaneously depend on "Frame walls" being done first.

---

## UI View Guide

HiveFlow offers multiple ways to look at tasks. Each view solves a different question — the goal is that you don't need to switch views mid-workflow. Pick the view that matches what you're trying to do and stay there.

### View catalogue

| View | Where | Best for | Primary question it answers |
|------|-------|----------|---------------------------|
| **Kanban** | Project detail → Tickets tab; Assignments dashboard (horizontal) | Managing workflow, moving tasks through statuses | "What should I work on next?" |
| **Table** | Assignments dashboard → Table mode | Scanning, sorting, comparing many tasks at once | "Which tasks are overdue / unassigned / stuck?" |
| **Timeline (Gantt)** | Project detail → Timeline tab | Scheduling, spotting conflicts, adjusting dates | "When does this happen, and what blocks what?" |
| **Card Grid** | Assignments dashboard (default) | Quick overview of all your tasks across sources | "What's on my plate right now?" |

### What each view shows at a glance

**Kanban card:**
- Title, status chip, source label (project/estimate code + name)
- Subtask progress bar with `✓ done/total` counter
- Dates: simplified date range with arrow, or deadline-only with overdue flag, or "No dates set"
- Member avatars
- Description presence indicator (icon only — no text)

**Table row:**
- Source code, title (with description indicator), status chip, progress, start date, due date, member avatars
- Sortable by any column — sort by Due to find overdue items, sort by Progress to find stalled tasks
- Overdue due dates render in red with bold weight

**Timeline bar:**
- Task title on a coloured bar positioned by actual dates
- Colour derived from task title (consistent per task)
- Dependency arrows connecting related tasks
- Drag to reschedule, drag edge to change duration, drag between bars to create dependency

**Card (grid):**
- Source + status in the header row
- Title, description snippet (first 80 chars, HTML stripped)
- Date row: start → end with icons, or deadline-only, or "No dates set"
- Bottom row: progress bar + subtask counter, or description icon, plus member avatars

### Task card information hierarchy

The design follows a **progressive disclosure** pattern: the most important information is visible on the card without clicking; details that require context are one click away in the modal.

```
┌─ CARD (always visible) ─────────────────────────┐
│ Source chip              Status chip             │
│                                                  │
│ Title                                            │
│ Description snippet (if present)                 │
│                                                  │
│ Start → End  |  Deadline  |  No dates set       │
│                                                  │
│ ════ progress bar  ✓ 2/5    [avatars]           │
└──────────────────────────────────────────────────┘
         │ click
         ▼
┌─ MODAL (one click away) ────────────────────────┐
│ Parent breadcrumb (if subtask)                   │
│ Title · Members · Edit button                    │
│                                                  │
│ Description (rich text, editable)                │
│ Subtask list with status chips + inline add      │
│ Status dropdown                                  │
│ Start / End date pickers                         │
│ Dependencies: "Needs" + "Needed by" chip lists   │
│ Required skills editor                           │
└──────────────────────────────────────────────────┘
```

**Why this split:**
- Dates, subtask progress, and assignees matter for **triage** — you need them to decide what to do next.
- Dependencies, skills, and full description matter for **deep work** — you need them when you're actively working on the task.
- Putting everything on the card would make cards noisy and hard to scan. Putting too little in the modal would force constant clicking.
- The card shows **enough to decide**, the modal shows **everything to act**.

### Choosing a view and sticking with it

| If you're… | Use… | And don't switch to… |
|------------|------|---------------------|
| Doing daily standup / triage | Card Grid | — it shows every task with just the essentials |
| Moving work through stages | Kanban | Table (kanban shows flow; table flattens it) |
| Planning a project timeline | Timeline | Kanban (timeline shows temporal relationships; kanban shows status) |
| Auditing / reporting | Table | Card Grid (table is sortable and dense; grid is browsable) |

The views share the same underlying data (the unified `Task` model), so changes made in one view (status updates, date changes) are immediately reflected in all others. There's no sync delay or inconsistency worry.

---

## GraphQL operations

### Queries

| Query | Notes |
|-------|-------|
| `projects(ids, where)` | Filters: `archived`, `status`, `start`/`end` date range, `displayId` |
| `Project.tasks` | Includes `timelineRank`, `columnRank`, `members`, `requiredSkills`, `dependencyOf`, `dependencyOn`, `lastUpdated` |
| `Project.files(path)` | Proxied to HiveFiles gateway |

### Mutations

| Mutation | Notes |
|----------|-------|
| `createProject` | Auto-generates displayId, defaults status to `"draft"` |
| `updateProject` | Uses composite unique `(organisation, displayId)` |
| `deleteProject` | Sets `archived: true` (soft delete) |
| `createTask` | Computes LexoRank for both column and timeline |
| `updateTask` | Supports `above`/`below` for LexoRank reordering |
| `updateProjectTaskColumn` | Thin alias for `updateTask` with `{status, above, below}` |
| `deleteTask` | Hard delete |
| `createTaskDependency` | Connects `dependencyOf` on source → target |
| `deleteTaskDependency` | Disconnects the relation |
| `createProjectFolder` | Creates directory on HiveFiles |
| `uploadProjectFiles` | Multipart upload to HiveFiles |
| `moveProjectFile` / `renameProjectFile` / `deleteProjectFile` | File operations on HiveFiles |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 14–91) | Project and Task models |
| Backend  | `packages/app/hiveflow-backend/src/schema/project.ts` | All project/task resolvers, file proxy, LexoRank logic |
| Frontend | `packages/app/hiveflow-frontend/src/views/projects/list/index.tsx` | Project list (DataTable) |
| Frontend | `packages/app/hiveflow-frontend/src/views/projects/single/index.tsx` | Project detail with kanban/timeline/files/batches tabs |
| Frontend | `packages/app/hiveflow-frontend/src/views/projects/single/panes/kanban.tsx` | Kanban pane |
| Frontend | `packages/app/hiveflow-frontend/src/views/projects/single/panes/timeline.tsx` | Timeline pane with dependency edges |
| Frontend | `packages/app/hiveflow-frontend/src/views/projects/single/panes/files.tsx` | File explorer pane |
| Frontend | `packages/app/hiveflow-frontend/src/types/kanban.ts` | `KANBAN_STATUSES`, `KanbanTask`, `KanbanColumn`, `KanbanRow` types |
| Frontend | `packages/app/hiveflow-frontend/src/modals/new-task/index.tsx` | Task create/edit modal (title, dates, subtasks, dependencies, skills) |
| Frontend | `packages/app/hiveflow-frontend/src/components/TaskViews/CardGrid.tsx` | Card grid for assignments dashboard |
| Frontend | `packages/app/hiveflow-frontend/src/components/TaskViews/TableView.tsx` | Sortable table for assignments dashboard |
| Frontend | `packages/app/hiveflow-frontend/src/components/TaskViews/TimelineView.tsx` | Timeline (Gantt) for assignments dashboard |
| Frontend | `packages/app/hiveflow-frontend/src/components/TaskViews/HorizontalKanban.tsx` | Horizontal kanban for assignments dashboard |
| Frontend | `packages/app/hiveflow-frontend/src/hooks/use-assignments.ts` | `useAssignments` hook — data, filtering, drag logic |
| Frontend | `packages/app/hiveflow-frontend/src/views/projects/single/context.tsx` | `ProjectSingleContext` — project-scoped task mutations |
