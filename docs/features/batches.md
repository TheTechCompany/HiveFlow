# Plan Batches

Group tasks from a project into reviewable batches with a formal review workflow, threaded comments, and scheduling estimates.

---

## Data model

### PlanBatch

| Field         | Type       | Purpose |
|---------------|------------|---------|
| `id`          | String     | Nano ID |
| `displayId`   | String?    | Human-readable short code, unique per organisation |
| `title`       | String     | Batch title |
| `description` | String?    | Free-text description |
| `status`      | String     | Default: `"draft"` |
| `projectId`   | String     | FK → Project (cascade delete) |
| `reviewer`    | String?    | User ID of the reviewer |
| `createdBy`   | String?    | User ID who created |
| `items`       | Relation   | One-to-many → PlanBatchItem |
| `comments`    | Relation   | One-to-many → BatchComment |
| `createdAt`   | DateTime   | Auto-set |
| `updatedAt`   | DateTime   | Auto-updated |

### PlanBatchItem

Links a task to a batch with scheduling estimates. Supports hierarchical nesting.

| Field           | Type       | Purpose |
|-----------------|------------|---------|
| `id`            | String     | Nano ID |
| `batchId`       | String     | FK → PlanBatch |
| `taskId`        | String     | FK → Task |
| `parentItemId`  | String?    | Self-relation FK for nested hierarchy (up to 4 levels) |
| `scheduledStart`| DateTime?  | Estimated start date |
| `scheduledEnd`  | DateTime?  | Estimated end date |
| `estimatedHours`| Float?     | Estimated effort in hours |
| `rank`          | String?    | Ordering rank |
| `notes`         | String?    | Free-text notes |

### BatchComment

Threaded comments on a batch — supports nesting via `parentId` for reply threads.

| Field      | Type     | Purpose |
|------------|----------|---------|
| `id`       | String   | Nano ID |
| `batchId`  | String   | FK → PlanBatch |
| `message`  | String   | Comment text |
| `user`     | String   | User ID |
| `parentId` | String?  | Self-relation FK for threaded replies |
| `createdAt`| DateTime | Auto-set |

---

## Review workflow

Batches progress through a linear status pipeline:

```
draft → in_review → approved → released
```

| Status | Colour | Meaning |
|--------|--------|---------|
| `draft` | Gray | Being assembled — tasks can be added/removed |
| `in_review` | Amber | Under review by the designated reviewer |
| `approved` | Green | Review passed — ready to execute |
| `released` | Blue | Tasks have been dispatched to the team |

Status transitions are manual — the user clicks an "advance" button that calls `changeStatus` to move to the next status. New batches always start as `"draft"`.

---

## Batch detail view

The batch detail is a **split view** with two panes:

### Left pane: Task tree

A hierarchical tree of `PlanBatchItem` records, nested up to 4 levels deep via `parentItemId`. Each item shows:
- Task title
- Scheduled start/end dates
- Estimated hours
- Notes

### Right pane: Gantt chart

A scheduling Gantt where batch items can be arranged on a timeline. Items support drag-to-reschedule and duration adjustment.

### Comments

Batches support threaded comments (`BatchComment` with `parentId` for replies). Comments belong to the batch as a whole — not to individual items.

---

## GraphQL operations

### Queries

| Query | Notes |
|-------|-------|
| `planBatches(projectId)` | List batches for a project |
| `PlanBatch.items` | Nested PlanBatchItem tree |
| `PlanBatch.comments` | Threaded comments |

### Mutations

| Mutation | Notes |
|----------|-------|
| `createPlanBatch` | Requires title, projectId |
| `updatePlanBatch` | Update status, reviewer, etc. |
| `deletePlanBatch` | Hard delete with cascade |
| `addPlanBatchItem` | Link a task to a batch with scheduling info |
| `updatePlanBatchItem` | Update schedule, hours, notes, rank, parent |
| `removePlanBatchItem` | Unlink a task from the batch |
| `commentOnBatch` | Add a comment (optionally threaded via parentId) |
| `removeBatchComment` | Delete a comment |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 224–269) | PlanBatch, PlanBatchItem, BatchComment models |
| Backend  | `packages/app/hiveflow-backend/src/schema/planbatch.ts` | Batch resolvers |
| Frontend | `packages/app/hiveflow-frontend/src/views/batches/list/index.tsx` | Batch list with status badges |
| Frontend | `packages/app/hiveflow-frontend/src/views/batches/single/index.tsx` | Batch detail (split tree + Gantt) |
| Frontend | `packages/app/hiveflow-frontend/src/views/batches/single/context.tsx` | Batch context provider |
| Frontend | `packages/app/hiveflow-frontend/src/views/batches/single/panes/SplitView.tsx` | Split view layout (~45KB component) |
