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

## Subtasks and dependencies

### Subtasks

A task can have a `parentId` referencing another task, creating a parent-child hierarchy. Subtasks are created via `createTask` with `parentId` in the input, defaulting to `status: 'Backlog'`.

### Dependencies

Dependencies are directional: `dependencyOf` = "this task blocks" (outgoing), `dependencyOn` = "this task is blocked by" (incoming).

Created via `createTaskDependency(sourceId, targetId)` — connects the source's `dependencyOf` to the target. Deleted via `deleteTaskDependency`. Dependencies are rendered as graph edges in the Timeline pane.

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
| Frontend | `packages/app/hiveflow-frontend/src/types/kanban.ts` | `KANBAN_STATUSES` constant |
