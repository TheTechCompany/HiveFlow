# Schedule & Calendar

The Schedule view provides calendar-based scheduling with drag-and-drop assignment of people and equipment to projects.

---

## Data model

### ScheduleItem

The primary scheduling unit — links a project to people and equipment on a specific date.

| Field        | Type       | Purpose |
|--------------|------------|---------|
| `id`         | String     | Nano ID |
| `date`       | DateTime   | The scheduled date |
| `projectId`  | String     | FK → Project |
| `people`     | String[]   | Array of user IDs assigned |
| `equipment`  | Relation   | Many-to-many → Equipment |
| `notes`      | String[]   | Array of note strings |
| `owner`      | String?    | Creator user ID |
| `permissions`| Relation   | One-to-many → ScheduleItemPermission |

### CalendarItem

A generic calendar entry for the timeline view — more flexible than ScheduleItem.

| Field        | Type       | Purpose |
|--------------|------------|---------|
| `id`         | String     | Nano ID |
| `start`      | DateTime   | Start time |
| `end`        | DateTime   | End time |
| `data`       | Json?      | Arbitrary payload (people, tasks, comments) |
| `groupBy`    | Json?      | Grouping key (project ID/name for row grouping) |
| `comments`   | Relation   | Threaded comments |
| `permissions`| Relation   | Access control entries |

### ScheduleItemPermission

| Field            | Type   | Purpose |
|------------------|--------|---------|
| `id`             | String | Nano ID |
| `owner`          | String | User ID granted access |
| `scheduleItemId` | String | FK → ScheduleItem |
| Unique constraint: `(owner, scheduleItemId)` |

### TimelineItem

Gantt bar with optional dependency links. See [Timeline](timeline.md).

---

## How the Schedule view works

The frontend Schedule view (`packages/app/hiveflow-frontend/src/views/schedule/index.tsx`) renders a **Timeline-based Gantt chart** with two layers:

1. **Draft layer** (zIndex: 0) — Background bars derived from project/estimate task date ranges. These are non-selectable, non-movable previews of where work is scheduled.

2. **Calendar layer** (zIndex: 1) — Actual `CalendarItem` records. Selectable, movable, resizable. People and equipment are stored inside the `data` JSON field.

### Row structure

- **Project rows**: Each project appears as a row with its tasks' date ranges merged into background bars.
- **People rows**: Each user appears as a row; leave records are merged into contiguous red blocks via a sweep-line algorithm.

### Creating/editing schedule entries

Clicking a timeline slot opens the `SchedulingModal`, which submits a `CalendarItemInput`:

```graphql
input CalendarItemInput {
  start: DateTime!
  end: DateTime!
  data: JSON        # { people, comments, tasks }
  groupBy: JSON     # { id, displayId, name } of the project
}
```

### People & Equipment assignment

When a `ScheduleItem` is created or edited, the modal uses `TransferList` components:

- **People tab** — Two-panel transfer list: available users ↔ selected users, keyed by user ID.
- **Equipment tab** — Same transfer list pattern for equipment items.

Assignment is via GraphQL mutations:
- `createScheduleItem` — Connects project via `connect: {id}`, sets people as `set: [ID array]`, connects equipment via `connect: [{id}]`.
- `updateScheduleItem` — Same connect/set pattern for updates.
- `cloneScheduleItem` — Reads the source item, creates duplicates for each target date, copying people/equipment/notes.

### Permission model

Schedule items have a `canEdit` field computed server-side: the authenticated user is in the combined list of `managers` + `owner`. Users can `joinScheduleItem` (upserts a permission record) or `leaveScheduleItem` (deletes it).

---

## GraphQL operations

### Queries

| Query | Filters |
|-------|---------|
| `calendarItems` | `ids`, `start_LTE`, `end_GTE` — date range filtering |
| `scheduleItems` | `id`, `date_GTE`, `date_LTE`, `project` (by displayId) |
| `timelineItems` | `id`, `timeline`, date range |

### Mutations

| Mutation | Notes |
|----------|-------|
| `createCalendarItem` | Sets `organisation` and `createdBy` from JWT |
| `updateCalendarItem` | Standard update |
| `deleteCalendarItem` | Hard delete |
| `createScheduleItem` | Requires `date`, `project`, `people`, `equipment`, `notes` |
| `updateScheduleItem` | Partial update |
| `cloneScheduleItem` | Copies to multiple target dates |
| `joinScheduleItem` | Adds current user to permissions |
| `leaveScheduleItem` | Removes current user from permissions |
| `deleteScheduleItem` | Hard delete |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Backend  | `packages/app/hiveflow-backend/src/schema/schedule.ts` | All schedule/calendar/timeline resolvers |
| Frontend | `packages/app/hiveflow-frontend/src/views/schedule/index.tsx` | Main Schedule Gantt view |
| Frontend | `packages/app/hiveflow-frontend/src/views/schedule/modal/index.tsx` | SchedulingModal for creating/editing calendar entries |
| Frontend | `packages/app/hiveflow-frontend/src/views/schedule/modals/schedule/index.tsx` | ScheduleItem modal with people/equipment tabs |
| Frontend | `packages/app/hiveflow-frontend/src/views/schedule/modals/schedule/people-tab.tsx` | People TransferList |
| Frontend | `packages/app/hiveflow-frontend/src/views/schedule/modals/schedule/equipment-tab.tsx` | Equipment TransferList |
