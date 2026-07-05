// ── Timeline — Core hook ────────────────────────────────────────────
// Manages selection, drag state, geometry, bar layouts, and keyboard.

import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import type {
  TimelineItem,
  TimelineLink,
  TimelineGroup,
  TimelineStep,
  TimelineProps,
  TimelineGeometry,
  SelectionState,
  ItemChange,
  TimelineCallbacks,
  HeaderTier,
} from './types';
import {
  computeGeometry,
  dateToX,
  packLanes,
  filterVisibleItems,
} from './utils';
import {
  DEFAULT_ITEM_HEIGHT,
  DEFAULT_MIN_BAR_WIDTH,
  DEFAULT_SIDEBAR_WIDTH,
  HEADER_TIERS,
  STEP_DURATIONS,
} from './constants';

// ── Helpers ──────────────────────────────────────────────────────────

/** Shallow content equality for string arrays. */
function arraysEqual(a: string[] | undefined, b: string[] | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

// ── Types ───────────────────────────────────────────────────────────

type DragMode = 'idle' | 'move' | 'resize-left' | 'resize-right';

interface DragState {
  mode: DragMode;
  itemId: string;
  startX: number;
  deltaX: number;
  origStart: Date;
  origEnd: Date;
  origGroupId?: string;
  /** Timeline start timestamp when drag began (for stable positioning). */
  dragStartMs: number;
  /** pxPerMs when drag began. */
  dragPxPerMs: number;
  /** Origins of other selected items for bulk move/resize. */
  peerOrigins?: Array<{ id: string; origStart: Date; origEnd: Date }>;
}

const IDLE_DRAG: DragState = {
  mode: 'idle',
  itemId: '',
  startX: 0,
  deltaX: 0,
  origStart: new Date(),
  origEnd: new Date(),
  dragStartMs: 0,
  dragPxPerMs: 0,
};

/** Pixel-positioned layout for one bar. */
export interface BarLayout {
  itemId: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface UseTimelineReturn {
  geometry: TimelineGeometry;
  groupedItems: Map<string, (TimelineItem & { laneIndex: number })[]>;
  flatItems: TimelineItem[];
  headerTiers: HeaderTier[];

  selection: SelectionState;
  selectItem: (itemId: string, additive?: boolean) => void;
  selectLink: (linkId: string, additive?: boolean) => void;
  clearSelection: () => void;

  dragState: DragState;
  dragStateRef: React.MutableRefObject<DragState>;
  startDrag: (itemId: string, mode: DragMode, clientX: number) => void;
  updateDrag: (clientX: number, clientY?: number, groupId?: string) => void;
  endDrag: () => ItemChange | null;

  onKeyDown: (e: React.KeyboardEvent) => void;
  visibleItems: TimelineItem[];

  /** Style for a bar, including drag offset. */
  computeBarStyle: (item: TimelineItem & { laneIndex?: number }) => React.CSSProperties;

  /** Layouts for every visible bar — used by link arrows. */
  barLayouts: BarLayout[];

  /** Effective end of the visible date window, consistent with geometry. */
  effectiveEnd: Date;

  setContainerRef: (el: HTMLDivElement | null) => void;
}

// ── Module-level style constants ──────────────────────────────────

const BASE_BAR_STYLE: React.CSSProperties = {
  position: 'absolute' as const,
  borderRadius: '4px',
  userSelect: 'none' as const,
  boxSizing: 'border-box' as const,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
};

// ── Hook ────────────────────────────────────────────────────────────

export function useTimeline(props: TimelineProps): UseTimelineReturn {
  const {
    items,
    groups,
    start,
    end,
    step,
    stepCount: stepCountProp,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    minBarWidth = DEFAULT_MIN_BAR_WIDTH,
    multiSelect = true,
    callbacks,
  } = props;

  // ── Viewport size via ResizeObserver ────────────────────────────
  const [viewportWidth, setViewportWidth] = useState(800);
  const [viewportHeight, setViewportHeight] = useState(600);
  const observerRef = useRef<ResizeObserver | null>(null);

  const rafRef = useRef<number | null>(null);

  const setContainerRef = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (el) {
      observerRef.current = new ResizeObserver((entries) => {
        // Defer state updates via rAF to avoid "ResizeObserver loop"
        // errors in Chrome.  The loop is benign but clutters the console.
        if (rafRef.current !== null) return; // already queued
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            if (width > 0) setViewportWidth(width);
            if (height > 0) setViewportHeight(height);
          }
        });
      });
      observerRef.current.observe(el);
    }
  }, []);

  useEffect(() => () => {
    observerRef.current?.disconnect();
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Derived ────────────────────────────────────────────────────
  // Derive stepCount from the consumer's date range when not explicitly
  // provided — maintains backward compatibility with callers that pass
  // start/end and expect the timeline to fill that window.
  const stepCount = stepCountProp ?? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / STEP_DURATIONS[step]));
  const sidebarWidth = props.sidebarWidth ?? (groups && groups.length > 0 ? DEFAULT_SIDEBAR_WIDTH : 0);

  const geometry = useMemo(
    () => computeGeometry(viewportWidth, viewportHeight, start, end, step, sidebarWidth, stepCount),
    [viewportWidth, viewportHeight, start, end, step, sidebarWidth, stepCount],
  );

  // Effective end date derived from geometry — consistent with pxPerMs
  // and timelineWidth regardless of what the consumer passed as `end`.
  const effectiveEnd = useMemo(
    () => new Date(geometry.effectiveEndMs),
    [geometry.effectiveEndMs],
  );

  const tiers = useMemo(() => HEADER_TIERS[step], [step]);

  // ── Drag state (must be before visibleItems for the drag-aware filter) ─
  const [dragState, setDragState] = useState<DragState>(IDLE_DRAG);
  const dragStateRef = useRef<DragState>(IDLE_DRAG);

  // Filter items to the consumer's date window (start/end), not the wider
  // geometry effectiveEnd — otherwise items well outside the intended
  // horizon leak in when the viewport is wider than the date span.
  const visibleItems = useMemo(
    () => filterVisibleItems(items, start, end),
    [items, start, end],
  );

  // Always include the item being dragged, even if edge-scroll pushed
  // the date range past it — otherwise the bar vanishes mid-drag.
  const visibleWithDragged = useMemo(() => {
    if (dragState.mode === 'idle' || !dragState.itemId) return visibleItems;
    if (visibleItems.some((i) => i.id === dragState.itemId)) return visibleItems;
    const dragged = items.find((i) => i.id === dragState.itemId);
    return dragged ? [...visibleItems, dragged] : visibleItems;
  }, [visibleItems, items, dragState.mode, dragState.itemId]);

  // ── Group & pack ────────────────────────────────────────────────
  const { groupedItems, flatItems } = useMemo(() => {
    const map = new Map<string, (TimelineItem & { laneIndex: number })[]>();
    const byGroup = new Map<string, TimelineItem[]>();

    if (groups && groups.length > 0) {
      for (const item of visibleWithDragged) {
        const gid = item.groupId ?? '__ungrouped__';
        const bucket = byGroup.get(gid) ?? [];
        bucket.push(item);
        byGroup.set(gid, bucket);
      }
      for (const g of groups) {
        if (!byGroup.has(g.id)) byGroup.set(g.id, []);
      }
    } else {
      byGroup.set('__default__', [...visibleWithDragged]);
    }

    for (const [gid, groupItems] of byGroup) {
      const packed = packLanes(groupItems);
      map.set(gid, packed.items);
    }

    const flat: TimelineItem[] = [];
    for (const [, packed] of map) {
      for (const item of packed) flat.push(item);
    }

    return { groupedItems: map, flatItems: flat };
  }, [visibleWithDragged, groups]);

  // ── Bar layouts (for link arrows) ───────────────────────────────
  const laneH = itemHeight + 4;

  const barLayouts = useMemo((): BarLayout[] => {
    const layouts: BarLayout[] = [];
    const groupIds = groups?.map((g) => g.id) ?? ['__default__'];
    let groupTop = 0;

    for (const gid of groupIds) {
      const packed = groupedItems.get(gid) ?? [];
      const laneCount = packed.length > 0
        ? Math.max(...packed.map((i) => i.laneIndex)) + 1
        : 1;

      for (const item of packed) {
        const left = dateToX(item.start, start, geometry.pxPerMs);
        const right = dateToX(item.end, start, geometry.pxPerMs);
        layouts.push({
          itemId: item.id,
          left,
          top: groupTop + item.laneIndex * laneH,
          width: Math.max(minBarWidth, right - left),
          height: itemHeight,
        });
      }

      groupTop += laneCount * laneH;
    }

    return layouts;
  }, [groupedItems, groups, start, geometry.pxPerMs, itemHeight, minBarWidth, laneH]);

  // ── Selection ──────────────────────────────────────────────────
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    props.selectedItemIds ?? [],
  );
  const [selectedLinkIds, setSelectedLinkIds] = useState<string[]>(
    props.selectedLinkIds ?? [],
  );

  // Guard against redundant sync from controlled props (avoids double-render
  // when parent passes inline arrays like `selectedItemIds={[]}`).
  // Compare by content, not reference, so that new-array-same-content
  // re-renders don't trigger spurious onSelect calls.
  const prevControlledItemIdsRef = useRef<string[] | undefined>(props.selectedItemIds);
  const prevControlledLinkIdsRef = useRef<string[] | undefined>(props.selectedLinkIds);

  useEffect(() => {
    if (
      props.selectedItemIds !== undefined &&
      !arraysEqual(props.selectedItemIds, prevControlledItemIdsRef.current)
    ) {
      prevControlledItemIdsRef.current = props.selectedItemIds;
      setSelectedItemIds(props.selectedItemIds);
    }
  }, [props.selectedItemIds]);
  useEffect(() => {
    if (
      props.selectedLinkIds !== undefined &&
      !arraysEqual(props.selectedLinkIds, prevControlledLinkIdsRef.current)
    ) {
      prevControlledLinkIdsRef.current = props.selectedLinkIds;
      setSelectedLinkIds(props.selectedLinkIds);
    }
  }, [props.selectedLinkIds]);

  const selection: SelectionState = useMemo(
    () => ({ itemIds: selectedItemIds, linkIds: selectedLinkIds }),
    [selectedItemIds, selectedLinkIds],
  );

  // Ref mirror for callbacks so onSelect effect always reads latest.
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    callbacksRef.current?.onSelect?.(selection);
    // selection deps are sufficient; callbacks read via ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemIds, selectedLinkIds]);

  const selectItem = useCallback(
    (itemId: string, additive = false) => {
      setSelectedItemIds((prev) => {
        if (additive && multiSelect) {
          const idx = prev.indexOf(itemId);
          return idx >= 0 ? prev.filter((_, i) => i !== idx) : [...prev, itemId];
        }
        if (prev.length === 1 && prev[0] === itemId) return prev;
        setSelectedLinkIds([]);
        return [itemId];
      });
    },
    [multiSelect],
  );

  const selectLink = useCallback(
    (linkId: string, additive = false) => {
      setSelectedLinkIds((prev) => {
        if (additive && multiSelect) {
          const idx = prev.indexOf(linkId);
          return idx >= 0 ? prev.filter((_, i) => i !== idx) : [...prev, linkId];
        }
        setSelectedItemIds([]);
        return [linkId];
      });
    },
    [multiSelect],
  );

  const clearSelection = useCallback(() => {
    setSelectedItemIds([]);
    setSelectedLinkIds([]);
  }, []);

  // ── Drag ───────────────────────────────────────────────────────
  // Refs for values that startDrag must read live (not from stale closure).
  const startLocalRef = useRef(start);
  startLocalRef.current = start;
  const geometryLocalRef = useRef(geometry);
  geometryLocalRef.current = geometry;
  const selectedIdsLocalRef = useRef(selectedItemIds);
  selectedIdsLocalRef.current = selectedItemIds;

  const startDrag = useCallback(
    (itemId: string, mode: DragMode, clientX: number) => {
      const item = flatItems.find((i) => i.id === itemId);
      if (!item) return;

      // Capture origins of other selected items for bulk move/resize
      const selectedIds = selectedIdsLocalRef.current;
      const peerOrigins: DragState['peerOrigins'] = [];
      if (selectedIds.length > 1 && selectedIds.includes(itemId)) {
        for (const id of selectedIds) {
          if (id === itemId) continue;
          const peer = flatItems.find((i) => i.id === id);
          if (peer) {
            peerOrigins.push({
              id: peer.id,
              origStart: new Date(peer.start),
              origEnd: new Date(peer.end),
            });
          }
        }
      }

      const ds: DragState = {
        mode,
        itemId,
        startX: clientX,
        deltaX: 0,
        origStart: new Date(item.start),
        origEnd: new Date(item.end),
        origGroupId: item.groupId,
        dragStartMs: startLocalRef.current.getTime(),
        dragPxPerMs: geometryLocalRef.current.pxPerMs,
        peerOrigins: peerOrigins.length > 0 ? peerOrigins : undefined,
      };
      dragStateRef.current = ds; // synchronous — native onMove reads this before re-render
      setDragState(ds);
    },
    [flatItems],
  );

  const updateDrag = useCallback(
    (clientX: number) => {
      setDragState((prev) => {
        if (prev.mode === 'idle') return prev;
        const deltaX = clientX - prev.startX;
        // Use frozen pxPerMs so edge-scroll doesn't distort the date offset
        const pxPerMs = prev.dragPxPerMs || geometry.pxPerMs;
        const msDelta = deltaX / pxPerMs;

        const notifyPeers = (getChange: (origStart: Date, origEnd: Date) => Partial<ItemChange>) => {
          // Notify for the primary item
          const primaryChange = getChange(prev.origStart, prev.origEnd);
          if (primaryChange.start || primaryChange.end) {
            callbacksRef.current?.onItemChanging?.({ id: prev.itemId, ...primaryChange });
          }
          // Notify for peer items
          if (prev.peerOrigins) {
            for (const peer of prev.peerOrigins) {
              const peerChange = getChange(peer.origStart, peer.origEnd);
              if (peerChange.start || peerChange.end) {
                callbacksRef.current?.onItemChanging?.({ id: peer.id, ...peerChange });
              }
            }
          }
        };

        if (prev.mode === 'move') {
          notifyPeers((origStart, origEnd) => ({
            start: new Date(origStart.getTime() + msDelta),
            end: new Date(origEnd.getTime() + msDelta),
          }));
        } else if (prev.mode === 'resize-left') {
          const minWidthMs = minBarWidth / pxPerMs;
          notifyPeers((origStart, origEnd) => ({
            start: new Date(Math.min(
              origStart.getTime() + msDelta,
              origEnd.getTime() - minWidthMs,
            )),
          }));
        } else if (prev.mode === 'resize-right') {
          const minWidthMs = minBarWidth / pxPerMs;
          notifyPeers((origStart, origEnd) => ({
            end: new Date(Math.max(
              origEnd.getTime() + msDelta,
              origStart.getTime() + minWidthMs,
            )),
          }));
        }

        const next = { ...prev, deltaX };
        dragStateRef.current = next;
        return next;
      });
    },
    [geometry.pxPerMs, minBarWidth],
  );

  const endDrag = useCallback((): ItemChange | null => {
    let change: ItemChange | null = null;
    setDragState((prev) => {
      if (prev.mode === 'idle') return prev;

      const emitForPeers = (getChange: (origStart: Date, origEnd: Date) => Partial<ItemChange>) => {
        // Emit primary
        const primaryChange = getChange(prev.origStart, prev.origEnd);
        if (primaryChange.start || primaryChange.end) {
          callbacksRef.current?.onItemChange?.({ id: prev.itemId, ...primaryChange });
          if (!change) change = { id: prev.itemId, ...primaryChange };
        }
        // Emit peers
        if (prev.peerOrigins) {
          for (const peer of prev.peerOrigins) {
            const peerChange = getChange(peer.origStart, peer.origEnd);
            if (peerChange.start || peerChange.end) {
              callbacksRef.current?.onItemChange?.({ id: peer.id, ...peerChange });
            }
          }
        }
      };

      if (prev.mode === 'move') {
        const frozenStart = new Date(prev.dragStartMs);
        const frozenPxPerMs = prev.dragPxPerMs || geometry.pxPerMs;
        const visualX = (prev.origStart.getTime() - frozenStart.getTime()) * frozenPxPerMs + prev.deltaX;
        const msDelta = visualX / geometry.pxPerMs;

        emitForPeers((origStart, origEnd) => ({
          start: new Date(startLocalRef.current.getTime() + msDelta),
          end: new Date(startLocalRef.current.getTime() + msDelta + (origEnd.getTime() - origStart.getTime())),
        }));
      } else if (prev.mode === 'resize-left') {
        const pxPerMs = prev.dragPxPerMs || geometry.pxPerMs;
        const msDelta = prev.deltaX / pxPerMs;
        const minWidthMs = minBarWidth / pxPerMs;
        emitForPeers((origStart, origEnd) => ({
          start: new Date(Math.min(
            origStart.getTime() + msDelta,
            origEnd.getTime() - minWidthMs,
          )),
        }));
      } else if (prev.mode === 'resize-right') {
        const pxPerMs = prev.dragPxPerMs || geometry.pxPerMs;
        const msDelta = prev.deltaX / pxPerMs;
        const minWidthMs = minBarWidth / pxPerMs;
        emitForPeers((origStart, origEnd) => ({
          end: new Date(Math.max(
            origEnd.getTime() + msDelta,
            origStart.getTime() + minWidthMs,
          )),
        }));
      }

      dragStateRef.current = IDLE_DRAG;
      return IDLE_DRAG;
    });
    return change;
  }, [geometry.pxPerMs, minBarWidth, step]);

  // ── Keyboard ───────────────────────────────────────────────────
  // Use refs for all closure values so onKeyDown has [] deps and
  // never creates a new closure across renders.
  const selectedItemIdsRef = useRef(selectedItemIds);
  selectedItemIdsRef.current = selectedItemIds;
  const flatItemsRef = useRef(flatItems);
  flatItemsRef.current = flatItems;
  const startRef = useRef(start);
  startRef.current = start;
  const endRef = useRef(end);
  endRef.current = end;

  /** Move selection to the previous/next bar in the flat item list. */
  const moveSelection = useCallback(
    (direction: 'up' | 'down') => {
      const items = flatItemsRef.current;
      if (items.length === 0) return;
      const current = selectedItemIdsRef.current[0];
      const currentIdx = current ? items.findIndex((i) => i.id === current) : -1;
      const nextIdx =
        direction === 'down'
          ? Math.min((currentIdx >= 0 ? currentIdx : -1) + 1, items.length - 1)
          : Math.max(currentIdx >= 0 ? currentIdx - 1 : items.length - 1, 0);
      setSelectedItemIds([items[nextIdx].id]);
    },
    [],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') { clearSelection(); return; }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const ids = selectedItemIdsRef.current;
        if (ids.length) callbacksRef.current?.onDelete?.(ids);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const ids = selectedItemIdsRef.current;
        if (ids.length) { callbacksRef.current?.onCopy?.(ids); e.preventDefault(); }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        const s = startRef.current;
        const en = endRef.current;
        callbacksRef.current?.onPaste?.(new Date((s.getTime() + en.getTime()) / 2));
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        setSelectedItemIds(flatItemsRef.current.map((i) => i.id));
      }
      if (e.key === 'Enter') {
        const s = startRef.current;
        const en = endRef.current;
        callbacksRef.current?.onQuickCreate?.(new Date((s.getTime() + en.getTime()) / 2));
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveSelection('down');
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveSelection('up');
        return;
      }
    },
    [clearSelection, moveSelection],
  );

  // ── Bar style (with drag offset) ───────────────────────────────
  const computeBarStyle = useCallback(
    (item: TimelineItem & { laneIndex?: number }): React.CSSProperties => {
      const isDragging = dragState.itemId === item.id;
      // Use frozen geometry for the dragged bar so edge-scroll
      // doesn't shift its base position out from under the pointer.
      const effectiveStart = isDragging && dragState.mode === 'move'
        ? new Date(dragState.dragStartMs)
        : start;
      const effectivePxPerMs = isDragging && dragState.mode === 'move'
        ? dragState.dragPxPerMs
        : geometry.pxPerMs;

      const left = dateToX(item.start, effectiveStart, effectivePxPerMs);
      const right = dateToX(item.end, effectiveStart, effectivePxPerMs);
      const width = Math.max(minBarWidth, right - left);
      const isSelected = selectedItemIds.includes(item.id);
      let dragOffsetX = 0;
      let dragWidth = 0;
      if (isDragging && dragState.mode !== 'idle') {
        if (dragState.mode === 'move') {
          dragOffsetX = dragState.deltaX;
        } else if (dragState.mode === 'resize-left') {
          dragOffsetX = dragState.deltaX;
          dragWidth = -dragState.deltaX;
        } else if (dragState.mode === 'resize-right') {
          dragWidth = dragState.deltaX;
        }
      }

      return {
        ...BASE_BAR_STYLE,
        left: `${left}px`,
        width: `${Math.max(minBarWidth, width + dragWidth)}px`,
        height: `${itemHeight}px`,
        top: `${((item as any).laneIndex ?? 0) * laneH}px`,
        minWidth: `${minBarWidth}px`,
        backgroundColor: item.color ?? '#4a90d9',
        cursor: isDragging ? 'grabbing' : 'grab',
        border: isSelected ? '2px solid #1a73e8' : '1px solid rgba(0,0,0,0.1)',
        transform: dragOffsetX !== 0 ? `translateX(${dragOffsetX}px)` : undefined,
        zIndex: isDragging ? 100 : isSelected ? 5 : 1,
        opacity: isDragging ? 0.85 : 1,
        boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.25)' : undefined,
      };
    },
    [start, geometry.pxPerMs, itemHeight, minBarWidth, selectedItemIds, dragState, laneH],
  );

  // ── Return (memoised so sub-component React.memo actually works) ─
  return useMemo(() => ({
    geometry,
    groupedItems,
    flatItems,
    headerTiers: tiers,
    selection,
    selectItem,
    selectLink,
    clearSelection,
    dragState,
    dragStateRef,
    startDrag,
    updateDrag,
    endDrag,
    onKeyDown,
    visibleItems: visibleWithDragged,
    computeBarStyle,
    barLayouts,
    effectiveEnd,
    setContainerRef,
  }), [
    geometry,
    groupedItems,
    flatItems,
    tiers,
    selection,
    selectItem,
    selectLink,
    clearSelection,
    dragState,
    dragStateRef,
    startDrag,
    updateDrag,
    endDrag,
    onKeyDown,
    visibleWithDragged,
    computeBarStyle,
    barLayouts,
    effectiveEnd,
    setContainerRef,
  ]);
}
