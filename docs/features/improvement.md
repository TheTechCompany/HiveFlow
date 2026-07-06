# Continuous Improvement

Tracking system for continuous improvement items through a 5-stage lifecycle, displayed in a kanban view.

---

## Data model

### ContinuousImprovement

| Field             | Type      | Purpose |
|-------------------|-----------|---------|
| `id`              | String    | Nano ID |
| `displayId`       | String?   | Auto-generated as `CI-XXXX` (4-digit number), unique per organisation |
| `title`           | String    | CI item title |
| `description`     | String?   | Free-text description |
| `category`        | String?   | Category (e.g. Safety, Quality, Efficiency, Cost, Environment, Morale, Other) |
| `source`          | String?   | Origin (e.g. Audit, Incident, Suggestion, Inspection, Review, Feedback) |
| `status`          | String    | Default: `"identified"` |
| `priority`        | String?   | Priority level (Low, Medium, High, Critical) |
| `impact`          | String?   | Expected impact description |
| `rootCause`       | String?   | Root cause analysis |
| `actionTaken`     | String?   | What action was implemented |
| `outcomeMeasured` | String?   | Measured outcome after implementation |
| `createdBy`       | String?   | User ID who created |
| `assignedTo`      | String?   | User ID responsible |
| `createdAt`       | DateTime  | Auto-set |
| `updatedAt`       | DateTime  | Auto-updated |
| `completedAt`     | DateTime? | When the CI was closed |

---

## CI workflow

### Status flow

CI items move through five stages:

```
identified → in_progress → implemented → verified → closed
```

| Status | Meaning |
|--------|---------|
| `identified` | New improvement idea logged — needs triage |
| `in_progress` | Being actively worked on |
| `implemented` | Change has been made |
| `verified` | Outcome has been measured and validated |
| `closed` | Complete — no further action |

Status transitions are **manual** — the user edits the CI and changes the `status` field. There is no automated state machine. The `completedAt` timestamp can be set or cleared independently of status.

### Display IDs

On creation, displayId is auto-generated in the format **`CI-XXXX`** (e.g. `CI-0042`). The number is derived from the count of existing CIs in the organisation.

### Rich metadata

CIs support rich categorization:

- **Category** (7 options): Safety, Quality, Efficiency, Cost, Environment, Morale, Other
- **Source** (6 options): Audit, Incident, Suggestion, Inspection, Review, Feedback
- **Priority** (4 levels): Low, Medium, High, Critical

### Lifecycle fields

Different fields become relevant at different stages:
- **Create**: title, description, category, source, priority, assignedTo, impact
- **In progress**: add rootCause
- **Implemented**: add actionTaken
- **Verified**: add outcomeMeasured

The frontend form adapts — `actionTaken` and `outcomeMeasured` are hidden during creation and only appear when editing an existing CI.

---

## Kanban view

The CI kanban is shown as a collapsible section at the bottom of the **Assigned Tasks** view. Each CI appears as a card with:
- Display ID (`CI-XXXX`)
- Title
- Status chip (colour-coded by status)
- Assigned person
- Priority badge

Clicking a card opens the CI detail/update modal.

---

## GraphQL operations

### Queries

| Query | Notes |
|-------|-------|
| `continuousImprovements` | List all CIs for the organisation |

### Mutations

| Mutation | Notes |
|----------|-------|
| `createContinuousImprovement` | Auto-generates `CI-XXXX` displayId |
| `updateContinuousImprovement` | Update any field — manual status transitions |
| `deleteContinuousImprovement` | Hard delete |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 372–392) | ContinuousImprovement model |
| Backend  | `packages/app/hiveflow-backend/src/schema/improvement.ts` | CI resolvers |
| Frontend | `packages/app/hiveflow-frontend/src/views/management/` | Management views (CI kanban + reports) |
| Frontend | `packages/app/hiveflow-frontend/src/views/assignments/index.tsx` | CI section in assignments view |
