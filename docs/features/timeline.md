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

## User stories

### 🧑 Regular user stories

These cover the day-to-day workflows of project managers, estimators, and team leads.

**US-01 — View a project timeline**
> As a project manager, I open a project and see all its tasks laid out on a Gantt chart so I can understand the schedule at a glance.

- The timeline loads with tasks as colored bars positioned by start/end date.
- Each row in the sidebar shows the task title, start date, and end date.
- Bars that overlap in time are stacked into separate lanes so nothing is hidden.
- Dependency arrows connect tasks that block each other.
- Weekends and public holidays are shaded on the grid.

**US-02 — Create a task from the timeline**
> As a project manager, I want to add a new task directly from the timeline without switching views.

- A dedicated "new task" row is always visible at the bottom of the task list.
- I type a title into the input field and press Enter.
- The task modal opens pre-filled with my title, today's date, and "Backlog" status.
- After saving, the new task appears as a bar on the timeline immediately.
- The new task row clears and is ready for the next entry.

**US-03 — Adjust task dates by dragging**
> As a scheduler, I drag a task bar left or right to change its dates, or drag its edges to change its duration.

- I click and drag a bar horizontally — both start and end dates shift together.
- I drag the left or right edge to resize the duration.
- While dragging near the edge of the viewport, the timeline auto-scrolls.
- The update is saved automatically when I release.

**US-04 — Edit task details inline**
> As a project manager, I want to quickly fix a task title or date without opening a modal.

- In the sidebar I can edit the title, start date, or end date directly.
- Changes are saved when I blur the field (click away or press Tab).
- Pressing Enter in any field commits the change and moves focus naturally.

**US-05 — Open a task's full detail modal**
> As a team lead, I double-click a bar or select it to open the task modal with all fields: description, assignees, skills, status, subtasks.

- Clicking a bar selects it; double-clicking opens the task modal.
- The modal shows every editable field for the task.
- I can add subtasks, change status, assign members, and set required skills.

**US-06 — See task dependencies**
> As a scheduler, I want to see which tasks depend on each other so I can spot bottlenecks.

- Arrows are drawn from a task to the tasks it blocks.
- Selected arrows are highlighted and can be deleted with Backspace/Delete.
- New dependencies are created by dragging from one bar to another.

**US-07 — Switch between Gantt, Kanban, and List**
> As a project manager, I toggle between three views of the same tasks depending on what I need.

- **Gantt** — time-based bars, best for scheduling.
- **Kanban** — status columns (Backlog / In Progress / Reviewing / Finished), best for workflow.
- **List** — compact table, best for scanning or export.

**US-08 — Navigate the timeline**
> As a user, I pan left/right to see different date ranges.

- I drag on empty space to pan horizontally.
- I use the mouse wheel (or Shift+wheel) to scroll the timeline.
- The header dates update as I pan.
- A "today" marker line shows where we are.

---

### ⚡ Power-user stories

These cover high-throughput, keyboard-driven, and precision workflows.

**PW-01 — Keyboard-only task creation (no mouse, no modal)**
> As a power user, I want to create a task with just the keyboard — type a title, set dates with the keyboard, press Enter, and the task appears. No modal, no mouse.

- I focus the "new task" row at the bottom of the list.
- I type the task title and press Tab to move to the start date field.
- I type or pick a date, Tab to end date, type or pick a date.
- I press Enter — the task is created immediately (or opens the modal with all fields pre-filled).
- The row clears and focus returns to the title input, ready for the next task.
- **Now working:** Enter key anywhere on the timeline triggers `onQuickCreate` at the centre date. The new-task row also handles Enter.

**PW-02 — Batch select and act**
> As a power user, I select multiple bars and perform an action on all of them at once.

- Ctrl/Cmd+Click toggles individual bars into a multi-selection.
- Ctrl/Cmd+A selects all bars.
- With multiple selected I can: delete all (Backspace/Delete), copy (Ctrl+C).
- **Gap today:** no bulk move, no bulk status change, no paste.

**PW-03 — Inline editing at speed**
> As a power user, I edit task fields directly in the sidebar without any modal, using only the keyboard.

- I Tab between title → start date → end date in the sidebar row.
- Pressing Enter in any field saves and moves to the next row.
- Pressing Escape reverts the field.
- Changes are debounced and saved automatically on blur.
- **Gap today:** inline edits save on blur but there's no Enter-to-commit-across-rows, no Escape-to-revert.

**PW-04 — Precision date entry**
> As a scheduler, I need precise control over task dates.

- I type dates directly (YYYY-MM-DD) rather than using date pickers.
- I use relative shortcuts like "+7d", "+2w" to shift dates by a duration.
- I can set the exact time for hour-level views.
- **Gap today:** date fields are `type="date"` pickers only. Relative shortcuts and time entry are not supported.

**PW-05 — Quick dependency management**
> As a power user, I create and delete dependencies without thinking.

- I drag from the right edge of one bar to another to create a dependency.
- I click a dependency arrow and press Delete/Backspace to remove it.
- **Gap today:** drag-to-create-link works in the shared Timeline component. Link selection + delete works.

**PW-06 — Zoom and time scale**
> As a power user, I zoom in/out to see hours, days, weeks, months, or years.

- The view starts at an appropriate scale for the data (days for short projects, months for long ones).
- I can zoom with Ctrl+wheel or pinch-to-zoom.
- **Now working:** Ctrl+wheel calls `onZoom('in'|'out')`. Consumers cycle through hour→day→week→month→year.

**PW-07 — Navigate by keyboard**
> As a power user, I navigate the entire timeline without touching the mouse.

- Arrow keys move selection between bars (left/right for time, up/down for rows).
- Page Up / Page Down scrolls vertically.
- Home / End jumps to the first/last task.
- **Now working:** Arrow Up/Down moves selection through the flat bar list. Arrow Left/Right, Page Up/Down, and Home/End are still gaps.

**PW-08 — Undo**
> As a power user, I undo my last action if I make a mistake.

- Ctrl+Z undoes the last bar move, resize, delete, or inline edit.
- **Gap today:** no undo stack.

---

## Behaviour specification

This section defines exactly how each interaction MUST work. Any deviation is a bug.

### Creating a task via the new-task row

| Step | Trigger | Behaviour |
|------|---------|-----------|
| 1 | User focuses the new-task row at the bottom of the task list | Row is always present and visible, even with zero existing tasks |
| 2 | User types a title | Title appears in the input field |
| 3 | User presses Enter | Task is created (via `createTask` callback). The new-task row inputs clear and focus returns to the title field |
| 4 | User presses Enter with an empty title | Nothing happens — title is required |

### Editing inline in the sidebar

| Step | Trigger | Behaviour |
|------|---------|-----------|
| 1 | User clicks into a sidebar field (title, start, or end) | Field becomes editable |
| 2 | User types a new value | Value updates in the input |
| 3 | User presses Tab or clicks away (blur) | Change is saved via mutation |
| 4 | User presses Enter | Change is saved and focus moves to the next field or next row |
| 5 | User presses Escape | Field reverts to original value |

### Moving a bar

| Step | Trigger | Behaviour |
|------|---------|-----------|
| 1 | User mousedowns on a bar | Bar is selected |
| 2 | User drags horizontally | Bar follows the pointer. If near viewport edge, timeline auto-scrolls |
| 3 | User releases | New dates are saved via `onItemChange` callback |

### Resizing a bar

| Step | Trigger | Behaviour |
|------|---------|-----------|
| 1 | User mousedowns on the left or right edge of a bar | Resize starts |
| 2 | User drags | That edge moves; the other edge stays fixed |
| 3 | User releases | New date is saved. Bar cannot be narrower than `minBarWidth` |

### Deleting

| Step | Trigger | Behaviour |
|------|---------|-----------|
| 1 | User selects one or more bars | Bars are highlighted |
| 2 | User presses Delete or Backspace | Selected bars are deleted via `onDelete` callback |

### Selecting

| Step | Trigger | Behaviour |
|------|---------|-----------|
| 1 | User clicks a bar | Bar is selected (single selection) |
| 2 | User Ctrl/Cmd+clicks another bar | That bar is added to the selection (multi-select) |
| 3 | User Ctrl/Cmd+A | All bars are selected |
| 4 | User clicks empty space | Selection is cleared |
| 5 | User presses Escape | Selection is cleared |

### Dependency links

| Step | Trigger | Behaviour |
|------|---------|-----------|
| 1 | User drags from one bar to another | A dependency arrow is created (`onLinkCreate`) |
| 2 | User clicks an arrow | Arrow is selected |
| 3 | User presses Delete/Backspace with an arrow selected | Arrow is removed |
| 4 | User presses Escape with an arrow selected | Selection is cleared |

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
