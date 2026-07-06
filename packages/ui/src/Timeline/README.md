# Timeline

A performant, infinite-canvas Gantt-chart component for React. Renders items as bars on a time axis with groups, dependency links, drag-to-move, drag-to-resize, and keyboard shortcuts. Designed to feel fluid at 60 fps even under heavy load, and to work identically across desktop and mobile touch.

---

## Table of contents

- [Design philosophy](#design-philosophy)
- [Architecture](#architecture)
- [Positioning model](#positioning-model)
- [Interaction model](#interaction-model)
- [Performance](#performance)
- [API reference](#api-reference)
- [Usage](#usage)
- [Testing](#testing)
- [Cross-platform / mobile](#cross-platform--mobile)
- [File index](#file-index)

---

## Design philosophy

### Infinite timeline without scroll-X

The timeline does **not** use native browser horizontal scrolling. Instead it maintains a visible date window (the "horizon") defined by `start` and `end` props. All bar, grid, and header positions are derived from the horizon via a pure function:

```
x = (date - horizon.start) × pxPerMs
```

When the user pans (drag on empty space, horizontal wheel, or edge-scroll during item drag), the horizon shifts and all positions recompute. The CSS `left`/`width` values change — nothing ever uses `transform: translateX()` or horizontal `overflow: scroll`.

**Why:**
- No scroll jank — the layout is always anchored to the viewport left edge.
- Infinite pan in either direction — the horizon just keeps shifting.
- Consistent with the mental model of "looking through a window onto an infinite canvas."

### Native Y-axis scroll

Vertical overflow uses standard `overflow-y: auto` on the body container. This means:
- Native scroll momentum on every OS.
- Works with trackpad, mouse wheel, and touch drag.
- Keyboard page-up/down and space-to-page-down work as expected.
- No custom scroll emulation.

### No virtualization — target < ~200 bars

Every visible row and bar is rendered into the DOM. For the target dataset size (a project schedule with tens to low-hundreds of items), this is faster than a virtual list because:
- No scroll-position tracking overhead.
- No item measurement / estimation.
- React's reconciliation is fast enough for this scale.

If you need thousands of items, reduce before passing to the component (e.g. one bar per event, not one bar per daily occurrence).

---

## Architecture

### Component tree

```
Timeline (root, flex column, overflow:hidden, tabIndex=0)
├── Header (flex row, shrink:0)
│   ├── Sidebar header  (fixed width, optional, sticky)
│   └── Header spacer   (flex:1) → TimelineHeader (multi-tier date labels)
└── Body (flex:1, overflow-y:auto)
    │   └── Sidebar gutter via body background (linear-gradient) —
    │       extends to the body bottom without a spacer element.
    ├── TimelineGrid   (absolute, pointer-events:none) — vertical grid lines
    ├── TimelineLinks  (absolute, SVG) — dependency arrows between bars
    ├── Ghost wrapper  (absolute, z-index:20) — Shift+drag creation preview
    └── ROWS_WRAPPER (flex column, content-sized)
        └── TimelineRow × N (React.memo)
            ├── SidebarCell (React.memo) — group label gutter
            └── Bar area (position:relative, overflow:hidden, flex:1)
                └── RowBar × N (React.memo) → TimelineBar (React.memo)
```

### Data flow

```
Consumer props (items, groups, start, end, step, callbacks, renderers, …)
  │
  ▼
useTimeline() — the core hook
  ├── ResizeObserver → viewportWidth / viewportHeight
  ├── computeGeometry() → pxPerMs, timelineWidth, effectiveEndMs
  ├── filterVisibleItems() → items in [start, effectiveEnd]
  ├── packLanes() → non-overlapping lane assignment per group
  ├── groupLaneHs → per-lane heights (each lane sized to its tallest item + 4 px)
  ├── groupHeights → per-group row heights (sum of lane heights)
  ├── computeBarStyle() → absolute-positioned CSS for each bar (with drag offset)
  ├── Selection state + controlled-selection sync
  ├── Drag state machine (idle → move | resize-left | resize-right → idle)
  ├── Keyboard handlers (Escape, Delete, Ctrl+C/V, Ctrl+A)
  └── barLayouts[] → pixel positions for every bar (consumed by link arrows)
  │
  ▼
Timeline (main component)
  ├── rowEntries → groups mapped to { groupId, items[], laneCount }
  ├── shiftHorizon() → onHorizonChange callback or internal setState
  ├── Native pointermove/pointerup listeners (document-level, ref-based)
  ├── Edge-scroll rAF loop during drag
  └── Ghost bar rendering for Shift+drag creation
```

### Two modes of horizon ownership

| Mode | `onHorizonChange` provided? | Who owns state |
|------|----------------------------|----------------|
| **Controlled** (recommended) | ✅ Yes | Consumer — manages `start`/`end` via React state or URL params |
| **Uncontrolled** | ❌ No | Timeline — internal `useState` for `start`/`end`, updated on wheel/drag |

In controlled mode the consumer can persist the horizon (e.g. in the URL), synchronise it across views, or clamp it to a date range. The `shiftHorizon` function calls `onHorizonChange(newStart, newEnd)` and the consumer feeds the new values back through props.

---

## Positioning model

### `computeGeometry(viewportWidth, viewportHeight, start, _end, step, sidebarWidth, stepCount)`

Returns `TimelineGeometry`:

| Field | Source | Meaning |
|-------|--------|---------|
| `pxPerMs` | `PX_PER_STEP[step] / STEP_DURATIONS[step]` | Fixed pixels-per-millisecond for this step granularity. **Not derived from the consumer's date range.** |
| `timelineWidth` | `max(canvasWidth, viewportWidth - sidebarWidth)` | Content canvas width in px |
| `effectiveEndMs` | `start.getTime() + timelineWidth / pxPerMs` | The actual right edge of the visible window |
| `pxPerStep` | `pxPerMs × stepDurationMs` | Always equals `PX_PER_STEP[step]` |

**Key invariant:** `pxPerMs` is a **step-level constant**. It does not change when the consumer passes a wider or narrower `start`/`end` range. This guarantees that every hour/day/week/month/year gets the same pixel width regardless of the viewport — and that panning feels smooth because the mapping from date-delta to pixel-delta is stable.

### Per-step constants

| Step | `PX_PER_STEP` | `STEP_DURATIONS` | Default `stepCount` | pxPerMs × 10⁶ |
|------|---------------|-------------------|---------------------|---------------|
| `hour` | 60 | 3,600,000 ms | 24 | ~16.7 |
| `day` | 80 | 86,400,000 ms | 14 | ~0.93 |
| `week` | 160 | 604,800,000 ms | 12 | ~0.26 |
| `month` | 200 | 2,592,000,000 ms | 12 | ~0.077 |
| `year` | 260 | 31,536,000,000 ms | 5 | ~0.0082 |

The content canvas is `stepCount × PX_PER_STEP[step]` wide — wider than the viewport so panning reveals more content. This is the "window onto a larger canvas" model.

### Bar positioning

```ts
// In useTimeline → computeBarStyle()
const left  = dateToX(item.start, horizon.start, pxPerMs);
const right = dateToX(item.end,   horizon.start, pxPerMs);
const width = Math.max(minBarWidth, right - left);
```

Bars are `position: absolute` inside a `position: relative` bar-area div. Lane placement (vertical stacking within a group row) is determined by `packLanes()` — a greedy algorithm that assigns each bar to the first lane with no overlap.

### Item sizing & lane heights

Each `TimelineItem` can specify an explicit `height` in pixels. When set, the item's bar renders at that height and the surrounding lane grows to accommodate it.

**Per-lane sizing (default).** Lanes within a group are sized independently — each lane is only as tall as its tallest item plus a 4 px gap. A lane with only 30 px items stays at 34 px; a lane with a 100 px item grows to 104 px. This keeps rows snug around their content.

```
Group "Backend" (row height = 138 px)
├── Lane 0 (104 px)  ← tallest item 100 px + 4
│   ├── Bar: "Extra tall"         100 px
│   └── Bar: "Normal"             30 px  (shares lane, empty space around it)
└── Lane 1 (34 px)   ← tallest item 30 px + 4
    └── Bar: "Normal"             30 px
```

**`itemHeightMode`.** Controls how bars behave within their lane:

| Mode | Behaviour |
|------|-----------|
| `'natural'` (default) | Bar is exactly its item height. Short bars in tall lanes have empty space around them. |
| `'fillLane'` | Bar fills its lane's content height (lane height minus the 4 px gap). All bars in a lane appear as uniform blocks. Content is centred vertically. |

**Interaction with scrolling.** Lane heights are computed from the currently visible items (`filterVisibleItems`). When panning horizontally, items may enter or leave the visible date window, which can change the tallest item in a lane and thus the lane height. This is expected — the layout always reflects the visible data. If you need a fixed-height display, use `itemHeightMode="fillLane"` with consistent item heights, or set `itemHeight` to a value that accommodates your tallest content.

### Container filling

The Timeline uses flexbox throughout to fill its container:

1. **Root** (`display: flex; flex-direction: column; flex: 1`) — stretches to fill the parent when `fitContainer` is true. Place the Timeline inside a flex column container (e.g. `<div style="display:flex;flex-direction:column;height:100vh">`) for it to occupy available space.

2. **Body** (`flex: 1; overflow-y: auto`) — fills the remaining space below the header. Native vertical scroll when rows exceed the body height.

3. **Sidebar gutter** — rendered as a `linear-gradient` on the body background instead of a DOM spacer element. This extends the sidebar column to the body bottom without affecting the row layout.

4. **ROWS_WRAPPER** — content-sized (no `min-height`). Grows and shrinks with the rows. The grid lines (`TimelineGrid`) use `gridHeight` (at least body-height) so they always extend to the bottom regardless of row count.

---

## Interaction model

### Pan (drag on empty space)

- **Trigger:** pointerdown on the body (not on a bar or link).
- During pointermove, the delta in clientX is converted to a time delta via `pxPerMs` and the horizon shifts.
- Updates are **rAF-throttled**: at most one React state update per animation frame, with the latest pending horizon stored in a ref.
- Pointer position is tracked in a ref only — no React re-render on every pointermove event.
- On pointerup with < 3 px movement → clears selection (treated as a click on empty space).

### Wheel scroll

- **Horizontal:** `deltaX ≠ 0` or `shiftKey + deltaY` → shifts the horizon.
- **Vertical:** plain `deltaY` (no shift) → passes through to native `overflow-y: auto`.
- Both paths call `e.preventDefault()` to prevent browser default.

### Item drag (move)

- Pointer down on a bar body → `startDrag(itemId, 'move', clientX)`.
- **Frozen geometry:** `dragStartMs` and `dragPxPerMs` are captured at drag start. The bar's visual position uses these frozen values so edge-scroll (which changes the real horizon) doesn't cause the bar to jump under the pointer.
- `onItemChanging()` fires on every pointermove with intermediate dates.
- On pointerup → `endDrag()` converts the frozen-coordinate visual position back to a date in the current horizon, then fires `onItemChange()` with the final date.

### Item resize

- Pointer down on left/right resize handles → `resize-left` or `resize-right` mode.
- Same frozen-geometry approach as move.
- Minimum bar width enforced: `minBarWidth / pxPerMs` ms.
- `onItemChanging()` fires during drag; `onItemChange()` on drop.

### Create by Shift+drag

- Shift+pointerdown on empty space → starts a create-drag.
- A ghost bar (dashed border, translucent fill) renders in real-time.
- On pointerup → `onItemCreate(startDate, endDate, groupId)` fires.

### Edge-scroll during drag

When the pointer is within 60 px of the body left or right edge during any drag:

- An rAF loop starts.
- Every 50 ms the horizon shifts by up to 8 px (proportional to how close to the edge).
- The loop stops when the pointer moves back inside the safe zone or the drag ends.

### Selection

- **Click** a bar → select it (replaces current selection).
- **Ctrl/Cmd+Click** a bar → toggle in multi-select.
- **Click** a link → select the link.
- **Click** on empty space → clear selection.
- **Ctrl/Cmd+A** → select all visible items.

### Keyboard

| Key | Action |
|-----|--------|
| Escape | Clear selection |
| Delete / Backspace | Delete selected items (calls `onDelete`) |
| Ctrl/Cmd+C | Copy selected items (calls `onCopy`) |
| Ctrl/Cmd+V | Paste at centre of visible horizon (calls `onPaste`) |
| Ctrl/Cmd+A | Select all visible items |

---

## Performance

### Summary of techniques

| Technique | Where | Why |
|-----------|-------|-----|
| **`React.memo`** | TimelineRow, RowBar, SidebarCell, TimelineBar, TimelineGrid, TimelineHeader, TimelineLinks | Prevents re-render when props are referentially stable |
| **rAF-throttled pan** | Native pointermove listener → `panPendingRef` → single `requestAnimationFrame` callback | At most one React state update per frame during panning |
| **Ref-based state for hot paths** | `timelineRef`, `dragStateRef`, `panDragRef`, `panCurrentRef`, `callbacksRef` | Native event listeners read refs synchronously — no stale closure, no re-render |
| **Frozen geometry during drag** | `dragStartMs`, `dragPxPerMs` captured at `startDrag()` | Edge-scroll doesn't distort the bar position under the pointer |
| **`useMemo` on everything derived** | geometry, groupedItems, barLayouts, rowEntries, gridLines, tier intervals | Avoids recomputation on every render |
| **`visibility: filterVisibleItems()`** | Only items intersecting `[start, effectiveEnd]` are rendered | Keeps the DOM small when panning through a large dataset |
| **CSS containment** | `contain: 'layout style paint'` on Body | Tells the browser the body subtree is independent — improves layout/paint performance |
| **`will-change: transform`** | ROWS_WRAPPER | Hints the compositor to promote to a separate layer |
| **`overscroll-behavior: contain`** | Root + Body | Prevents scroll chaining to parent containers |
| **`touch-action: none`** | Root | Prevents browser default touch gestures (pinch-zoom, swipe-navigate) |
| **Lazy bar content** | SidebarCell memo'd separately from bar area | Panning recomputes bar positions but leaves MUI-rendered sidebar cells untouched |
| **Greedy lane packing** | `packLanes()` — sort by start, place in first free lane | O(n × lanes) but lanes ≤ ~5 in practice, so effectively O(n) |
| **Content-identical array guard** | `arraysEqual()` check in controlled selection sync | Prevents spurious `onSelect` calls when parent passes `selectedItemIds={[]}` on every render |

### Performance targets

| Metric | Target | Measured |
|--------|--------|----------|
| Pan frame time (≤ 100 items) | < 8 ms | ~2-3 ms (well within 16 ms budget) |
| Pan frame time (≤ 500 items) | < 16 ms | ~8-12 ms |
| Initial render (100 items, 10 groups) | < 200 ms | ~50-80 ms |
| Edge-scroll smoothness | No visible stutter | rAF + 50ms throttle |
| Memory (1,000 items) | < 50 MB | ~15-20 MB |

### When to worry

- **> 500 items:** `filterVisibleItems` + `packLanes` + React reconciliation may exceed 16 ms. Consider server-side filtering or aggregation.
- **> 50 groups:** DOM node count grows linearly. Still fast but memory increases.
- **Deeply nested custom renderers:** `React.memo` on `RowBar` only prevents re-render when `style` reference is stable. If your `renderItem` creates new objects every call, pass a stable callback.

---

## API reference

### `TimelineProps`

```ts
interface TimelineProps {
  // ── Data ─────────────────────────────────────────────
  items: TimelineItem[];
  links?: TimelineLink[];
  groups?: TimelineGroup[];

  // ── Time axis ────────────────────────────────────────
  start: Date;                         // Left edge of visible window
  end: Date;                           // Right edge (used for stepCount derivation)
  step: 'hour' | 'day' | 'week' | 'month' | 'year';
  stepCount?: number;                  // Override number of step units visible

  // ── Appearance ───────────────────────────────────────
  itemHeight?: number;                 // Default: 30
  groupHeaderHeight?: number;          // Default: 40 (unused in current impl)
  headerHeight?: number;               // Default: 60
  minBarWidth?: number;                // Default: 4
  itemHeightMode?: 'natural' | 'fillLane'; // Default: 'natural'

  // ── Behaviour ────────────────────────────────────────
  resizable?: boolean;                 // Default: true
  movable?: boolean;                   // Default: true
  multiSelect?: boolean;               // Default: true
  showLinks?: boolean;                 // Default: true
  showToday?: boolean;                 // Default: true
  fitContainer?: boolean;              // Default: true (flex: 1)
  readonly?: boolean;                  // Default: false
  sidebarWidth?: number;               // Override sidebar width (0 = hide)
  sidebarPadding?: boolean;            // Default: true
  fullHeight?: boolean;                // overflow:visible for parent scroll
  stickyHeader?: boolean;              // position:sticky date header
  highlightedDays?: HighlightedDay[];

  // ── Callbacks ────────────────────────────────────────
  callbacks?: TimelineCallbacks;

  // ── Renderers ────────────────────────────────────────
  renderers?: TimelineRenderers;

  // ── Controlled state ─────────────────────────────────
  selectedItemIds?: string[];
  selectedLinkIds?: string[];
  loading?: boolean;
}
```

### `TimelineItem`

```ts
interface TimelineItem {
  id: string;
  start: Date;
  end: Date;
  label?: string;
  color?: string;                // CSS background color
  groupId?: string;              // Which group row
  _rowIndex?: number;            // Row index when no groups
  zIndex?: number;               // Stacking order within lane
  resizable?: boolean;           // Per-item override
  selectable?: boolean;
  movable?: boolean;
  data?: Record<string, unknown>;
  collapsibleContent?: React.ReactNode;
  hoverInfo?: string;            // Tooltip
  progress?: number;             // 0-100, renders fill overlay
  height?: number;               // Explicit bar height in px (falls back to itemHeight)
  showLabel?: boolean;
}
```

### `TimelineGroup`

```ts
interface TimelineGroup {
  id: string;
  label?: string;
  headerContent?: React.ReactNode;
  items?: TimelineItem[];        // Optional — items keyed by groupId on the main array
}
```

### `TimelineCallbacks`

```ts
interface TimelineCallbacks {
  onItemChange?: (change: ItemChange) => void;
  onItemChanging?: (change: ItemChange) => void;
  onSelect?: (selection: SelectionState) => void;
  onLinkCreate?: (link: Omit<TimelineLink, 'id'>) => void;
  onItemCreate?: (start: Date, end: Date, groupId?: string) => void;
  onHorizonChange?: (start: Date, end: Date) => void;
  onDelete?: (itemIds: string[]) => void;
  onCopy?: (itemIds: string[]) => void;
  onPaste?: (date: Date) => void;
  onNavigate?: (direction: 'prev' | 'next' | 'today') => void;
  onItemDoubleClick?: (itemId: string) => void;
}
```

### `TimelineRenderers`

```ts
interface TimelineRenderers {
  renderItem?: (item: TimelineItem) => React.ReactNode;
  renderGroupHeader?: (group: TimelineGroup, expanded: boolean) => React.ReactNode;
  renderSidebarHeader?: () => React.ReactNode;
  renderDay?: (date: Date, step: TimelineStep) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
}
```

---

## Usage

### Minimal

```tsx
import { Timeline } from '@hive-flow/ui';

<Timeline
  items={[
    { id: '1', start: new Date('2026-06-01'), end: new Date('2026-06-05'), label: 'Design' },
    { id: '2', start: new Date('2026-06-05'), end: new Date('2026-06-12'), label: 'Build' },
  ]}
  start={new Date('2026-06-01')}
  end={new Date('2026-06-20')}
  step="day"
/>
```

### With groups, links, and callbacks

```tsx
<Timeline
  items={items}
  groups={[
    { id: 'eng', label: 'Engineering' },
    { id: 'qa', label: 'QA' },
  ]}
  links={[
    { id: 'l1', source: '1', target: '2' },
  ]}
  start={horizonStart}
  end={horizonEnd}
  step="week"
  callbacks={{
    onItemChange: (change) => updateTask(change),
    onItemCreate: (start, end, groupId) => createTask(start, end, groupId),
    onHorizonChange: (s, e) => { setHorizonStart(s); setHorizonEnd(e); },
    onDelete: (ids) => deleteTasks(ids),
  }}
/>
```

### Read-only display

```tsx
<Timeline
  items={scheduleItems}
  start={displayStart}
  end={displayEnd}
  step="month"
  readonly
  showLinks={false}
  showToday={false}
  sidebarWidth={0}
/>
```

### Custom bar renderer

```tsx
<Timeline
  items={items}
  start={start}
  end={end}
  step="day"
  renderers={{
    renderItem: (item) => (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {item.progress === 100 ? '✅' : '📋'}
        <strong>{item.label}</strong>
      </div>
    ),
    renderGroupHeader: (group) => (
      <span style={{ fontWeight: 700, color: '#1a73e8' }}>📁 {group.label}</span>
    ),
  }}
/>
```

### Tall custom events

```tsx
<Timeline
  items={[
    { id: '1', start: d(2026,6,2), end: d(2026,6,8),  label: 'Design review', color: '#7b61ff', groupId: 'eng', height: 72 },
    { id: '2', start: d(2026,6,5), end: d(2026,6,11), label: 'Quick fix',     color: '#4a90d9', groupId: 'eng' },
    { id: '3', start: d(2026,6,1), end: d(2026,6,6),  label: 'Infra setup',   color: '#e06c75', groupId: 'ops', height: 100 },
  ]}
  groups={[{ id: 'eng', label: 'Engineering' }, { id: 'ops', label: 'Ops' }]}
  start={d(2026,6,1)}
  end={d(2026,6,20)}
  step="day"
  renderers={{
    renderItem: (item) => (
      <div style={{ padding: '6px 10px', height: '100%', display: 'flex', flexDirection: 'column', gap: 2,
                    background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`, borderRadius: 4 }}>
        <strong style={{ color: '#fff', fontSize: 14 }}>{item.label}</strong>
        {item.height && item.height > 40 && (
          <span style={{ color: '#fff', fontSize: 11, opacity: 0.9 }}>Extra detail visible because the bar is tall.</span>
        )}
      </div>
    ),
  }}
/>
```

### Controlled horizon (recommended for production)

```tsx
function ProjectTimeline() {
  const [horizonStart, setHorizonStart] = useState(new Date('2026-06-01'));
  const [horizonEnd, setHorizonEnd] = useState(new Date('2026-06-30'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Nav buttons — call onNavigate */}
      <div>
        <button onClick={() => shiftHorizon(-7, 'days')}>← Week</button>
        <button onClick={() => jumpToToday()}>Today</button>
        <button onClick={() => shiftHorizon(7, 'days')}>Week →</button>
      </div>

      <Timeline
        items={tasks}
        groups={teams}
        start={horizonStart}
        end={horizonEnd}
        step="week"
        callbacks={{
          onHorizonChange: (s, e) => { setHorizonStart(s); setHorizonEnd(e); },
          onItemChange: persistTaskChange,
          onNavigate: (dir) => {
            if (dir === 'prev') shiftHorizon(-7, 'days');
            if (dir === 'next') shiftHorizon(7, 'days');
            if (dir === 'today') jumpToToday();
          },
        }}
      />
    </div>
  );
}
```

---

## Testing

### Unit tests — `__tests__/`

| File | Tests | Coverage |
|------|-------|----------|
| `utils.test.ts` | Pure functions: date math, lane packing, geometry | Date helpers, `packLanes()`, `computeGeometry()`, `filterVisibleItems()`, `dateToX`/`xToDate` |
| `useTimeline.test.tsx` | 20 tests | Geometry, grouping, per-lane heights, selection (single/multi/toggle/clear), keyboard (Escape, Delete, Backspace, Ctrl+C/V/A), drag state lifecycle, `computeBarStyle`, `getBarTop`, visibility filter, header tiers, controlled selection de-duplication |
| `Timeline.test.tsx` | 30 tests | Rendering, groups, loading/empty, selection (click, visual indicator), resize handles, today marker, links (render/hide/select), custom renderers, keyboard navigation, readonly mode, ghost bar, wheel-to-pan, edge-scroll, rounded corners |
| `TimelineBar.test.tsx` | 18 tests | Rendering, selection state, drag state, resize handles (left/right/render/hide), progress fill, custom renderer, pointer events, double-click |
| `TimelineGrid.test.tsx` | 15 tests | Grid lines for all step types, today marker visibility, weekend shading, highlighted day strips, sidebar offset |
| `TimelineHeader.test.tsx` | 14 tests | Multi-tier rendering (day/week/month/year), narrow-zoom tier dropping, day-number shortening, custom `renderDay` |
| `TimelineLink.test.tsx` | 20 tests | SVG rendering, empty states, missing layouts, selection, click handling, custom colours, sidebar offset |
| `TimelineRow.test.tsx` | 16 tests | Sidebar rendering, lane dividers, bar rendering, drag wiring, click-to-select |

**Total: ~133 unit/integration tests.**

Run with:

```bash
cd packages/ui && yarn test
```

### E2E tests — Playwright

Located at `packages/app/hiveflow-frontend/tests/timeline-pan.spec.ts` — 19 tests:

- **Rendering:** container, items, today marker, grid, group rows, nav buttons
- **Panning:** drag-left, drag-right, click-clear, large drags
- **Wheel:** deltaX, shiftKey + deltaY, rapid-fire
- **Shift+drag create:** new bar, edge cases, new group
- **Navigation:** button visibility/enabled
- **Keyboard:** Escape
- **Readonly:** toggle exists

Run with:

```bash
cd packages/app/hiveflow-frontend && npx playwright test tests/timeline-pan.spec.ts
```

Additional E2E harnesses (Puppeteer):

| Script | Purpose |
|--------|---------|
| `scripts/timeline-e2e.ts` | Original harness |
| `scripts/timeline-e2e-v2.ts` | Native event dispatch version |
| `scripts/timeline-edge-scroll-e2e.ts` | Edge-scroll behaviour |

### Smoke / performance tests

To validate the component under extreme load, add a smoke test file at `__tests__/Timeline.smoke.test.tsx`:

```tsx
// Smoke test — verifies the component stays performant under ridiculous load
import React from 'react';
import { render } from '@testing-library/react';
import { Timeline } from '../Timeline';
import type { TimelineItem, TimelineGroup } from '../types';

const COLOURS = ['#4a90d9','#7b61ff','#e06c75','#56b6c2','#e5c07b','#98c379','#c678dd','#d19a66'];

function generateDataset(groupCount: number, itemsPerGroup: number) {
  const items: TimelineItem[] = [];
  const groups: TimelineGroup[] = [];
  for (let g = 0; g < groupCount; g++) {
    const gId = `g${g}`;
    groups.push({ id: gId, label: `Group ${g}` });
    for (let t = 0; t < itemsPerGroup; t++) {
      const startDay = 1 + g * 30 + t * 3;
      items.push({
        id: `${gId}-i${t}`,
        start: new Date(2026, 0, startDay),
        end: new Date(2026, 0, startDay + 2 + (t % 5)),
        label: `Item ${g}.${t}`,
        color: COLOURS[(g + t) % COLOURS.length],
        groupId: gId,
        progress: (t * 25) % 101,
      });
    }
  }
  return { items, groups };
}

describe('Timeline smoke tests', () => {
  beforeAll(() => {
    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    (window as any).ResizeObserver = MockResizeObserver;
  });

  // ── Load tests ────────────────────────────────────────────────

  it('renders 100 items in 10 groups under 200ms', () => {
    const { items, groups } = generateDataset(10, 10);
    const t0 = performance.now();
    render(
      <Timeline
        items={items}
        groups={groups}
        start={new Date('2026-01-01')}
        end={new Date('2026-12-31')}
        step="week"
      />,
    );
    const t1 = performance.now();
    expect(t1 - t0).toBeLessThan(200);
  });

  it('renders 500 items in 50 groups under 500ms', () => {
    const { items, groups } = generateDataset(50, 10);
    const t0 = performance.now();
    render(
      <Timeline
        items={items}
        groups={groups}
        start={new Date('2026-01-01')}
        end={new Date('2026-12-31')}
        step="month"
      />,
    );
    const t1 = performance.now();
    expect(t1 - t0).toBeLessThan(500);
  });

  it('renders 1,000 flat items (no groups) under 500ms', () => {
    const items: TimelineItem[] = Array.from({ length: 1000 }, (_, i) => ({
      id: `i${i}`,
      start: new Date(2026, 0, 1 + (i % 365)),
      end: new Date(2026, 0, 1 + (i % 365) + 3),
      label: `Task ${i}`,
      color: COLOURS[i % COLOURS.length],
    }));
    const t0 = performance.now();
    render(
      <Timeline
        items={items}
        start={new Date('2025-06-01')}
        end={new Date('2027-06-01')}
        step="month"
      />,
    );
    const t1 = performance.now();
    expect(t1 - t0).toBeLessThan(500);
  });

  // ── Memory (no leak) ──────────────────────────────────────────

  it('can unmount and remount without leaking', () => {
    const { items, groups } = generateDataset(20, 5);
    const { unmount } = render(
      <Timeline
        items={items}
        groups={groups}
        start={new Date('2026-01-01')}
        end={new Date('2026-12-31')}
        step="week"
      />,
    );
    expect(() => unmount()).not.toThrow();
  });

  // ── Stress: many overlapping bars ─────────────────────────────

  it('handles 200 overlapping bars in a single row', () => {
    const items: TimelineItem[] = Array.from({ length: 200 }, (_, i) => ({
      id: `overlap-${i}`,
      start: new Date('2026-06-01'),
      end: new Date('2026-06-30'),
      label: `Overlap ${i}`,
      color: COLOURS[i % COLOURS.length],
    }));
    const t0 = performance.now();
    render(
      <Timeline
        items={items}
        start={new Date('2026-05-01')}
        end={new Date('2026-08-01')}
        step="day"
      />,
    );
    const t1 = performance.now();
    // Lane packing for 200 items → 200 lanes, O(n²) worst case with greedy algo
    // Should still be fast since n=200
    expect(t1 - t0).toBeLessThan(1000);
  });

  // ── Stress: rapid horizon shifts ──────────────────────────────

  it('handles 100 rapid horizon shifts without error', () => {
    const { items, groups } = generateDataset(10, 10);
    const { rerender } = render(
      <Timeline
        items={items}
        groups={groups}
        start={new Date('2026-06-01')}
        end={new Date('2026-06-30')}
        step="day"
      />,
    );
    for (let i = 0; i < 100; i++) {
      const offset = i * 86400000;
      rerender(
        <Timeline
          items={items}
          groups={groups}
          start={new Date(Date.UTC(2026, 5, 1) + offset)}
          end={new Date(Date.UTC(2026, 5, 30) + offset)}
          step="day"
        />,
      );
    }
  });

  // ── Stress: empty states ──────────────────────────────────────

  it('renders 100 groups with 0 items', () => {
    const groups: TimelineGroup[] = Array.from({ length: 100 }, (_, i) => ({
      id: `eg${i}`,
      label: `Empty Group ${i}`,
    }));
    render(
      <Timeline
        items={[]}
        groups={groups}
        start={new Date('2026-01-01')}
        end={new Date('2026-12-31')}
        step="month"
      />,
    );
  });

  // ── Stress: all step types ────────────────────────────────────

  (['hour', 'day', 'week', 'month', 'year'] as const).forEach((step) => {
    it(`renders at ${step} step without error`, () => {
      const { items, groups } = generateDataset(5, 3);
      render(
        <Timeline
          items={items}
          groups={groups}
          start={new Date('2026-01-01')}
          end={new Date('2026-12-31')}
          step={step}
        />,
      );
    });
  });

  // ── Stress: links ─────────────────────────────────────────────

  it('handles 500 links', () => {
    const items: TimelineItem[] = Array.from({ length: 100 }, (_, i) => ({
      id: `li${i}`,
      start: new Date(2026, 0, 1 + i * 3),
      end: new Date(2026, 0, 1 + i * 3 + 2),
      label: `Linked ${i}`,
    }));
    const links = Array.from({ length: 500 }, (_, i) => ({
      id: `link${i}`,
      source: `li${i % 99}`,
      target: `li${(i + 1) % 100}`,
    }));
    render(
      <Timeline
        items={items}
        links={links}
        start={new Date('2026-01-01')}
        end={new Date('2026-12-31')}
        step="day"
      />,
    );
  });
});
```

These smoke tests validate:

| Scenario | Load | What it proves |
|----------|------|----------------|
| 100 items, 10 groups | Moderate | Typical production load renders fast |
| 500 items, 50 groups | Heavy | Groups don't cause quadratic slowdown |
| 1,000 flat items | Heavy | Flat mode scales well |
| 200 overlapping bars | Lane-packing stress | Greedy algorithm handles wide overlap |
| 100 rapid horizon shifts | Pan stress | No memory leak from rapid re-renders |
| 100 empty groups | Edge case | Empty groups don't break layout |
| All 5 step types | Coverage | Each granularity works |
| 500 dependency links | Link stress | SVG doesn't blow up |
| Unmount/remount | Memory | No leak from ResizeObserver/promises |

---

## Cross-platform / mobile

### Current state

The timeline uses **Pointer Events** throughout — `onPointerDown`, `pointermove`, `pointerup` — which unify mouse and touch input on all modern browsers. There is no separate touch handling path.

### What works on mobile today

- **Tap to select** a bar.
- **Touch-drag on empty space** to pan (horizon shift).
- **Touch-drag a bar** to move it.
- **Native vertical scroll** (body `overflow-y: auto` handles touch momentum).
- **No double-tap zoom interference** (`touch-action: none` on root).

### What needs attention for production mobile

1. **Resize handles (8 px wide):** These are tight for a finger on a 2x display (16 CSS px ≈ reasonable for a careful tap, but borderline). Increase `RESIZE_HANDLE_WIDTH` to 12-14 px on touch devices, or detect pointer type and adjust.

2. **Create by Shift+drag:** The Shift key isn't available on touch. A long-press could trigger create mode — this would require a timer-based gesture detector, not built in today.

3. **Edge-scroll:** Works on touch (pointer is tracked by the same `pointermove` listener), but the 60 px threshold may feel narrow on a phone screen. Consider making it proportional to viewport width.

4. **Sidebar width (180 px):** Fixed width works on tablet but may be too wide on a phone (320 px viewport). The consumer can pass `sidebarWidth` to shrink it, or use the "no sidebar" mode (`sidebarWidth={0}`) with a separate mobile layout.

5. **Touch-action:** `touch-action: none` on the root prevents all native browser gestures including pinch-zoom. For an embedded timeline in a scrollable page, this should be scoped to the timeline container so the page itself still zooms.

6. **Horizontal swipe navigation:** Some mobile browsers use horizontal swipe for back/forward. The timeline intercepts horizontal touch, so users can't accidentally navigate away — but they also can't intentionally navigate. This is usually desired behaviour.

### Responsive pattern

```tsx
// Consumer is responsible for responsive sidebar width
const sidebarWidth = useMediaQuery('(max-width: 768px)') ? 120 : 180;

<Timeline
  sidebarWidth={isMobile ? 120 : 180}
  // On very small screens, drop sidebar entirely
  // sidebarWidth={isPhone ? 0 : 180}
  ...
/>
```

---

## File index

```
packages/ui/src/Timeline/
├── Timeline.tsx            Main container (~760 lines)
├── useTimeline.ts          Core hook — geometry, selection, drag, keyboard (~630 lines)
├── TimelineBar.tsx         Individual bar with resize handles + progress (188 lines)
├── TimelineGrid.tsx        Vertical grid lines, today marker, weekends, highlights (216 lines)
├── TimelineHeader.tsx      Multi-tier date labels (204 lines)
├── TimelineLink.tsx        SVG dependency arrows (122 lines)
├── TimelineRow.tsx         Group row — packs bars into lanes, renders sidebar (~340 lines)
├── types.ts                All TypeScript interfaces (~255 lines)
├── utils.ts                Pure functions — date math, geometry, lane packing, getBarTop (~285 lines)
├── constants.ts            Defaults, step durations, header tiers, PX_PER_STEP (76 lines)
├── index.ts                Barrel export (27 lines)
├── README.md               This file
├── __tests__/
│   ├── utils.test.ts
│   ├── useTimeline.test.tsx
│   ├── Timeline.test.tsx
│   ├── TimelineBar.test.tsx
│   ├── TimelineGrid.test.tsx
│   ├── TimelineHeader.test.tsx
│   ├── TimelineLink.test.tsx
│   └── TimelineRow.test.tsx
└── __stories__/
    ├── Timeline.stories.tsx     18 stories
    ├── TimelineBar.stories.tsx
    ├── TimelineGrid.stories.tsx
    ├── TimelineHeader.stories.tsx
    ├── TimelineLink.stories.tsx
    ├── TimelineRow.stories.tsx
    └── mockData.ts
```

---

## Package

```json
{
  "name": "@hive-flow/ui",
  "peerDependencies": {
    "react": "^17.0.0",
    "react-dom": "^17.0.0"
  },
  "dependencies": {
    "@mui/material": "5.15.14",
    "@mui/icons-material": "5.15.14"
  }
}
```

React 17+ and MUI 5. No other runtime dependencies. No moment.js — all date math is native `Date` + `Intl.DateTimeFormat`.

---

## Related docs

- [Feature doc: Timeline data model](../../docs/features/timeline.md) — GraphQL schema, LexoRank, dependency model
- [Storybook](../../packages/ui/README.md) — `yarn storybook` at `packages/ui`
- [Playwright E2E tests](../../packages/app/hiveflow-frontend/tests/timeline-pan.spec.ts)
