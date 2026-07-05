# Timeline

Gantt-style project timeline with dependency links, drag-to-reschedule, capacity alerts, and multiple built-in views.

---

## Data model

### TimelineItem

| Field        | Type       | Purpose |
|--------------|------------|---------|
| `id`         | String     | Nano ID |
| `rank`       | String?    | LexoRank for ordering |
| `startDate`  | DateTime   | Bar start |
| `endDate`    | DateTime   | Bar end |
| `timeline`   | String     | Which timeline view this belongs to |
| `projectId`  | String?    | FK → Project (nullable — item can belong to estimate instead) |
| `estimateId` | String?    | FK → Estimate |
| `data`       | Json?      | Arbitrary payload (hours breakdown, people, locations) |
| `notes`      | String?    | Free-text notes |
| `requires`   | Relation   | Items this item blocks (outgoing dependencies) |
| `blocks`     | Relation   | Items blocking this item (incoming dependencies) |

Dependencies are a **many-to-many self-relation** via the `blocksTimeline` relation name.

---

## How the Timeline view works

The frontend Timeline (`packages/app/hiveflow-frontend/src/views/timeline/Timeline.tsx`) wraps `@hexhive/ui`'s Timeline component configured as a Gantt chart.

### Built-in views

Three pre-configured timeline views, switchable from the header:

| View | Purpose |
|------|---------|
| **Project** | Project items — shows work scheduled against projects |
| **People** | People/crew items — shows who is assigned where |
| **Estimate** | Estimate items — hatched bars for uncommitted work |

### Data flow

1. Two GraphQL queries run:
   - `TimelineData` — fetches `timelineItems` filtered by the active view and date horizon.
   - `ProjectInfo` — fetches all projects and estimates for the "add item" autocomplete.
2. Items are mapped to Gantt bar format via `mapItems()`:
   - `name`, `start`, `end`, `rank`
   - `color`: CSS linear gradients built from hour-type breakdown (Welder, TA, Fabricator, Skilled Labourer, Civil Subcontractor).
   - Estimate bars use a **hatched pattern** to visually distinguish them from committed project bars.
   - `hoverInfo`: Detailed breakdown by item/location with colour-coded dots.

### Dependency links

Dependencies are rendered as **lines** between timeline bars:
- **Data**: Derived from the `blocks` field — `{ id, source: blockingItem.id, target: blockedItem.id }`.
- **Creation**: Drag from one bar to another — calls `createTimelineItemDependency` mutation.
- **Deletion**: Select a link and press `Delete`/`Backspace` — calls `deleteTimelineItemDependency`.
- **Selection**: Clicking a dependency line selects it for deletion (vs clicking a bar which selects the item).

### Drag interactions

- **Move**: Drag a bar horizontally to change its `startDate`/`endDate` → calls `updateTask`.
- **Resize**: Drag the bar edge to change duration → same `updateTask` mutation.
- **Reorder**: Drag items within the list → uses `@dnd-kit/sortable`'s `arrayMove` with LexoRank re-computation.

### Capacity alerts

The timeline computes a **capacity alarm** by comparing two metrics:
- **Demand** (`job_power`): Total hours from all timeline items on a given day.
- **Supply** (`week_power`): Available hours from people (crew capacity).

Days where demand exceeds supply are coloured **red**. This gives a visual early warning of over-allocation.

---

## Ordering (LexoRank)

When creating a `TimelineItem`, the backend uses a raw SQL CTE with `LEAD`/`LAG` window functions to find the rank neighbors, then computes `LexoRank.between(prevRank, nextRank)` for the new item. The same pattern is used for `updateTimelineItemOrder` when items are dragged to new positions.

---

## GraphQL operations

### Queries

| Query | Notes |
|-------|-------|
| `timelineItems(timeline, startDate, endDate)` | Items filtered by view and date horizon |

### Mutations

| Mutation | Notes |
|----------|-------|
| `createTimelineItem` | Computes LexoRank with CTE + `between()` |
| `updateTimelineItem` | Update dates, notes, data |
| `updateTimelineItemOrder` | Reorder via LexoRank |
| `deleteTimelineItem` | Hard delete |
| `createTimelineItemDependency` | Create blocks/requires link |
| `deleteTimelineItemDependency` | Remove dependency link |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 158–173) | TimelineItem model |
| Backend  | `packages/app/hiveflow-backend/src/schema/schedule.ts` | TimelineItem resolvers (LexoRank CTE) |
| Frontend | `packages/app/hiveflow-frontend/src/views/timeline/Timeline.tsx` | Main Gantt component (~1048 lines) |
| Frontend | `packages/app/hiveflow-frontend/src/views/timeline/Header.tsx` | View switcher and filter controls |
