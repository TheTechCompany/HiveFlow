# Timeline

> ⚠️ **Single source of truth**: `packages/ui/src/Timeline/` (`@hive-flow/ui`) is the canonical timeline component for the entire HiveFlow app. Every gantt, schedule, and timeline view MUST use this component or its `GanttView` wrapper. Do NOT create custom timeline implementations — fixes and features added here benefit all consumers automatically.

---

## Shared library (`packages/ui/src/Timeline/`)

Located at `packages/ui/src/Timeline/`, exported as `@hive-flow/ui`.

### Components

| Component | Purpose |
|-----------|---------|
| `Timeline` | Main container — header, grid, rows, links |
| `TimelineBar` | Individual bar with resize handles + progress fill |
| `TimelineGrid` | Vertical grid lines, today marker, weekend shading, highlighted days |
| `TimelineHeader` | Multi-tier date labels |
| `TimelineLink` | SVG dependency arrows between bars |
| `TimelineRow` | Group row — packs bars into lanes, renders sidebar |

### Hook

| Hook | Purpose |
|------|---------|
| `useTimeline` | Core hook — geometry, selection, drag state machine, keyboard |

### Key types

`TimelineItem`, `TimelineGroup`, `TimelineLink`, `TimelineStep`, `TimelineProps`, `TimelineCallbacks`, `TimelineRenderers`, `SelectionState`, `ItemChange`

### Features

- Time granularities: `hour`, `day`, `week`, `month`, `year`
- Groups (rows) with sidebar labels
- Bars with start/end, color, label, progress (0-100%)
- SVG dependency links between items
- Drag to move, drag to resize (left/right handles)
- Lane packing (greedy non-overlapping algorithm)
- Single & multi-select (Ctrl/Cmd+Click), Ctrl+A
- Shift+drag to create new items
- Horizon panning (drag empty space or horizontal wheel)
- Edge-scroll during drag
- Keyboard: Escape, Delete/Backspace, Ctrl+C/V, Ctrl+A
- Today marker, weekend shading, highlighted days
- Custom renderers: `renderItem`, `renderGroupHeader`, `renderSidebarHeader`, `renderDay`, `renderLoading`
- Readonly mode, loading state, sticky header

### GanttView wrapper

`packages/ui/src/GanttView/` wraps `Timeline` with an optional external sidebar column (`sidebar` prop) and context menu slot. Use this when you need a separate sidebar panel next to the timeline.

---

## Consumers

| File | Purpose | Uses |
|------|---------|------|
| `views/schedule/index.tsx` | Main schedule page (people/project allocation) | `Timeline` |
| `views/people/single/index.tsx` | Person schedule view | `Timeline` |
| `views/estimates/single/panes/timeline.tsx` | Estimate task gantt | `Timeline` |
| `views/projects/single/panes/timeline.tsx` | Project task gantt | `Timeline` |
| `views/recurring/single/index.tsx` | Recurring schedule editor | `GanttView` + `TreeBranchVSCode` |
| `components/TaskViews/TimelineView.tsx` | Kanban→timeline (assignments) | `Timeline` |

---

## Anti-patterns — DO NOT

- ❌ Create new custom timeline/schedule components outside `packages/ui/src/Timeline/`
- ❌ Import Timeline from `@hexhive/ui` (legacy external package — migrate to `@hive-flow/ui`)
- ❌ Build a timeline using raw divs and flex layout — use the shared component

## Adding features

1. Add the feature to `packages/ui/src/Timeline/`
2. Write tests in `packages/ui/src/Timeline/__tests__/`
3. All consumers get the feature for free

---

## Data model (backend)

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

## Built-in views (main timeline page)

Three pre-configured timeline views, switchable from the header:

| View | Purpose |
|------|---------|
| **Project** | Project items — shows work scheduled against projects |
| **People** | People/crew items — shows who is assigned where |
| **Estimate** | Estimate items — hatched bars for uncommitted work |

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
| UI lib   | `packages/ui/src/Timeline/` | **Canonical timeline component** |
| UI lib   | `packages/ui/src/GanttView/` | Sidebar-wrapper around Timeline |
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 158–173) | TimelineItem model |
| Backend  | `packages/app/hiveflow-backend/src/schema/schedule.ts` | TimelineItem resolvers (LexoRank CTE) |
| Frontend | `packages/app/hiveflow-frontend/src/views/timeline/Timeline.tsx` | Main Gantt component (~1048 lines) |
| Frontend | `packages/app/hiveflow-frontend/src/views/timeline/Header.tsx` | View switcher and filter controls |
