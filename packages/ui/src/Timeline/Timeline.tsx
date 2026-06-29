// ── Timeline — Main container ───────────────────────────────────────

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { TimelineHeader } from './TimelineHeader';
import { TimelineGrid } from './TimelineGrid';
import { TimelineRow } from './TimelineRow';
import { TimelineLinks } from './TimelineLink';
import { useTimeline } from './useTimeline';
import type { TimelineProps } from './types';
import { dateToX, xToDate } from './utils';
import {
  DEFAULT_ITEM_HEIGHT,
  DEFAULT_GROUP_HEADER_HEIGHT,
  DEFAULT_HEADER_HEIGHT,
  DEFAULT_SIDEBAR_WIDTH,
} from './constants';

export type { TimelineProps } from './types';
export type {
  TimelineItem,
  TimelineLink,
  TimelineGroup,
  TimelineStep,
  TimelineCallbacks,
  TimelineRenderers,
  SelectionState,
  ItemChange,
} from './types';

// ── Module-level style constants ──────────────────────────────────

const ROOT_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  overscrollBehavior: 'contain',
  outline: 'none',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  userSelect: 'none',
  touchAction: 'none',
  background: '#fff',
  borderRadius: 6,
};

const LOADING_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 400,
  color: '#999',
};

const HEADER_SPACER_STYLE: React.CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'stretch',
};

const BODY_STYLE: React.CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  overscrollBehavior: 'contain',
};

const SIDEBAR_LABEL_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid #d0d0d0',
  background: '#f5f5f5',
  fontWeight: 600,
  fontSize: 13,
  color: '#666',
};

const ROWS_WRAPPER_STYLE: React.CSSProperties = {
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
};


/** Throttle helper: returns true if enough ms have passed since last call. */
function useThrottle(ms: number) {
  const last = useRef(0);
  return useCallback(() => {
    const now = performance.now();
    if (now - last.current > ms) { last.current = now; return true; }
    return false;
  }, [ms]);
}

// ── Main component ──────────────────────────────────────────────────

export const Timeline: React.FC<TimelineProps> = React.memo((props) => {
  const {
    items,
    links = [],
    groups,
    start,
    end,
    step,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    groupHeaderHeight = DEFAULT_GROUP_HEADER_HEIGHT,
    headerHeight = DEFAULT_HEADER_HEIGHT,
    resizable = true,
    movable = true,
    showLinks = true,
    showToday = true,
    fitContainer = true,
    readonly = false,
    fullHeight = false,
    stickyHeader = false,
    sidebarWidth: sidebarWidthProp,
    callbacks,
    renderers,
    loading,
  } = props;

  // ── Internal date state (used when no onHorizonChange callback) ───
  // When the consumer provides onHorizonChange, the consumer owns the
  // date range. Otherwise we manage it internally for wheel/drag pan.
  const hasExternalHorizon = !!callbacks?.onHorizonChange;
  const [internalStart, setInternalStart] = useState(start);
  const [internalEnd, setInternalEnd] = useState(end);
  const activeStart = hasExternalHorizon ? start : internalStart;
  const activeEnd = hasExternalHorizon ? end : internalEnd;

  // Sync internal dates when external props change.
  const prevStartRef = useRef(start);
  const prevEndRef = useRef(end);
  if (!hasExternalHorizon && (start !== prevStartRef.current || end !== prevEndRef.current)) {
    prevStartRef.current = start;
    prevEndRef.current = end;
    // Use microtask to avoid setState-during-render warning
    Promise.resolve().then(() => {
      setInternalStart(start);
      setInternalEnd(end);
    });
  }

  // ── Shift the visible date range by a pixel delta ─────────────────
  const shiftHorizon = useCallback((deltaPx: number) => {
    const t = timelineRef.current;
    const ms = -deltaPx / t.geometry.pxPerMs;
    const newStart = new Date(activeStart.getTime() + ms);
    const newEnd = new Date(activeEnd.getTime() + ms);
    if (hasExternalHorizon) {
      callbacks!.onHorizonChange!(newStart, newEnd);
    } else {
      setInternalStart(newStart);
      setInternalEnd(newEnd);
    }
  }, [hasExternalHorizon, callbacks, activeStart, activeEnd]);

  // Build the props that useTimeline needs with the active date range.
  const activeProps = useMemo(() => ({
    ...props,
    start: activeStart,
    end: activeEnd,
  }), [props, activeStart, activeEnd]);

  const timeline = useTimeline(activeProps);

  const {
    geometry,
    groupedItems,
    barLayouts,
    selection,
    selectLink,
    onKeyDown,
    updateDrag,
    endDrag,
    setContainerRef,
  } = timeline;

  const hasGroups = !!(groups && groups.length > 0);
  const sidebarW = sidebarWidthProp ?? (hasGroups ? DEFAULT_SIDEBAR_WIDTH : 0);
  const canInteract = !readonly;
  const bodyRef = useRef<HTMLDivElement>(null);


  // ── Stable double-click callback ─────────────────────────────────
  const handleItemDoubleClick = useCallback(
    (itemId: string) => callbacks?.onItemDoubleClick?.(itemId),
    [callbacks],
  );

  // ── Row layout ───────────────────────────────────────────────────
  const rowEntries = useMemo(() => {
    if (hasGroups) {
      return groups!.map((group) => {
        const packed = groupedItems.get(group.id) ?? [];
        const laneCount = packed.length > 0
          ? Math.max(...packed.map((i) => i.laneIndex)) + 1
          : 1;
        return { groupId: group.id, group, items: packed, laneCount };
      });
    }
    const flat = groupedItems.get('__default__') ?? [];
    const laneCount = flat.length > 0
      ? Math.max(...flat.map((i) => (i as any).laneIndex ?? 0)) + 1
      : 0;
    return [{ groupId: '__default__', group: undefined, items: flat, laneCount }];
  }, [hasGroups, groups, groupedItems]);

  const laneH = itemHeight + 4;

  const totalRowsHeight = useMemo(() => {
    let h = 0;
    for (const e of rowEntries) h += Math.max(1, e.laneCount) * laneH;
    if (fullHeight) return Math.max(h, 200);
    return Math.max(h, geometry.viewportHeight - headerHeight, 200);
  }, [rowEntries, laneH, geometry.viewportHeight, headerHeight, fullHeight]);

  const actualH = rowEntries.reduce((s, e) => s + Math.max(1, e.laneCount) * laneH, 0);
  const emptyRowCount = Math.max(0, Math.ceil((totalRowsHeight - actualH) / laneH));

  // ── Drag for existing items ──────────────────────────────────────
  const dragRef = timeline.dragStateRef;

  // ── Pan / create-by-drag on empty space ──────────────────────────
  const [panDrag, setPanDrag] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    bodyLeft: number;
    bodyTop: number;
    shiftKey: boolean;
    targetGroupId: string | null;
    targetRowTop: number;
    targetRowHeight: number;
    startMs: number;
    endMs: number;
  } | null>(null);
  const panDragRef = useRef(panDrag);
  panDragRef.current = panDrag;

  // ── Consolidated ref bag for native listeners ────────────────────
  const timelineRef = useRef({
    updateDrag,
    endDrag,
    clearSelection: timeline.clearSelection,
    callbacks,
    start: activeStart,
    end: activeEnd,
    geometry,
    sidebarW,
    rowEntries,
    emptyRowCount,
    laneH,
    shiftHorizon,
  });
  timelineRef.current = {
    updateDrag,
    endDrag,
    clearSelection: timeline.clearSelection,
    callbacks,
    start: activeStart,
    end: activeEnd,
    geometry,
    sidebarW,
    rowEntries,
    emptyRowCount,
    laneH,
    shiftHorizon,
  };

  // ── Edge-scroll ──────────────────────────────────────────────────
  const edgeRafRef = useRef<number | null>(null);
  const edgeClientXRef = useRef(0);
  const edgeThrottleRef = useRef(0);

  const stopEdgeLoop = useCallback(() => {
    if (edgeRafRef.current != null) {
      cancelAnimationFrame(edgeRafRef.current);
      edgeRafRef.current = null;
    }
  }, []);

  useEffect(() => () => stopEdgeLoop(), [stopEdgeLoop]);

  const edgeTick = useCallback(() => {
    const body = bodyRef.current;
    if (!body) { stopEdgeLoop(); return; }
    const rect = body.getBoundingClientRect();
    const threshold = 60;
    const t = timelineRef.current;
    const cx = edgeClientXRef.current;
    const relX = cx - rect.left - t.sidebarW;
    const areaW = rect.width - t.sidebarW;

    if (relX >= threshold && relX <= areaW - threshold) {
      stopEdgeLoop();
      return;
    }

    const now = performance.now();
    if (now - edgeThrottleRef.current > 50) {
      edgeThrottleRef.current = now;
      const speedPx = 8;
      let ms = 0;
      if (relX < threshold) {
        const factor = 1 - relX / threshold;
        ms = -(speedPx * factor) / t.geometry.pxPerMs;
      } else {
        const factor = (relX - (areaW - threshold)) / threshold;
        ms = (speedPx * factor) / t.geometry.pxPerMs;
      }
      t.shiftHorizon(-ms * t.geometry.pxPerMs); // Convert ms to px delta
    }

    edgeRafRef.current = requestAnimationFrame(edgeTick);
  }, [stopEdgeLoop]);

  const edgeScrollEdge = useCallback((clientX: number) => {
    edgeClientXRef.current = clientX;
    const body = bodyRef.current;
    if (!body) return;
    const rect = body.getBoundingClientRect();
    const threshold = 60;
    const sw = timelineRef.current.sidebarW;
    const relX = clientX - rect.left - sw;

    if (relX < threshold || relX > rect.width - sw - threshold) {
      if (edgeRafRef.current == null) {
        edgeRafRef.current = requestAnimationFrame(edgeTick);
      }
    } else {
      stopEdgeLoop();
    }
  }, [edgeTick, stopEdgeLoop]);

  // ── Wheel — shift the date horizon ───────────────────────────────
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.deltaX !== 0 || e.shiftKey) {
        e.preventDefault();
        const delta = e.deltaX || e.deltaY;
        timelineRef.current.shiftHorizon(delta);
      }
    },
    [],
  );

  // ── Throttle for drag-to-pan date shifting ───────────────────────
  const dragThrottle = useThrottle(32);

  // ── Native pointer listeners ─────────────────────────────────────
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragRef.current.mode !== 'idle') {
        timelineRef.current.updateDrag(e.clientX, e.clientY);
        edgeScrollEdge(e.clientX);
        return;
      }
      const pd = panDragRef.current;
      if (!pd) return;
      if (pd.shiftKey) {
        edgeScrollEdge(e.clientX);
        setPanDrag((prev) => (prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null));
      } else {
        const delta = e.clientX - pd.startX;
        const t = timelineRef.current;
        const rawMs = -delta / t.geometry.pxPerMs;

        if (dragThrottle()) {
          const newStart = new Date(pd.startMs + rawMs);
          const newEnd = new Date(pd.endMs + rawMs);
          const t2 = timelineRef.current;
          if (t2.callbacks?.onHorizonChange) {
            t2.callbacks.onHorizonChange(newStart, newEnd);
          } else {
            setInternalStart(newStart);
            setInternalEnd(newEnd);
          }
        }
        setPanDrag((prev) => (prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null));
      }
    };

    const onUp = (e: PointerEvent) => {
      if (dragRef.current.mode !== 'idle') {
        timelineRef.current.endDrag();
        stopEdgeLoop();
        try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch { /* ok */ }
        return;
      }
      const pd = panDragRef.current;
      if (pd) {
        const t = timelineRef.current;
        if (pd.shiftKey && t.callbacks?.onItemCreate) {
          const body = bodyRef.current;
          if (body) {
            const bodyRect = body.getBoundingClientRect();
            const sw = t.sidebarW;
            const sx = pd.startX - bodyRect.left - sw;
            const cx = e.clientX - bodyRect.left - sw;
            const minX = Math.min(sx, cx);
            const maxX = Math.max(sx, cx);
            const minWidthPx = 4;
            const dStart = xToDate(minX, t.start, t.geometry.pxPerMs);
            const dEnd = xToDate(maxX + Math.max(0, minWidthPx - (maxX - minX)), t.start, t.geometry.pxPerMs);
            t.callbacks.onItemCreate(dStart, dEnd, pd.targetGroupId ?? undefined);
          }
        } else if (!pd.shiftKey && Math.abs(pd.currentX - pd.startX) < 3) {
          timelineRef.current.clearSelection();
        }
        stopEdgeLoop();
        try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch { /* ok */ }
      }
      setPanDrag(null);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, []); // Mount once — all state via refs

  // ── Helper: map a body-relative Y to a row entry ────────────────
  const getRowAtY = useCallback(
    (bodyY: number): { groupId: string | null; rowTop: number; rowHeight: number } | null => {
      const t = timelineRef.current;
      let top = 0;

      for (const entry of t.rowEntries) {
        const h = Math.max(1, entry.laneCount) * t.laneH;
        if (bodyY >= top && bodyY < top + h) {
          return {
            groupId: hasGroups ? entry.groupId : null,
            rowTop: top,
            rowHeight: h,
          };
        }
        top += h;
      }
      for (let i = 0; i < t.emptyRowCount; i++) {
        const h = t.laneH;
        if (bodyY >= top && bodyY < top + h) {
          return { groupId: null, rowTop: top, rowHeight: h };
        }
        top += h;
      }
      return null;
    },
    [hasGroups],
  );

  // ── Pointer down handler ────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!canInteract) return;
      const target = e.target as HTMLElement;
      if (!e.shiftKey && (target.closest('[data-timeline-item]') || target.closest('[data-timeline-links]'))) {
        return;
      }
      if (target.closest('[data-timeline-links]')) {
        return;
      }
      const body = bodyRef.current;
      if (!body) return;
      const bodyRect = body.getBoundingClientRect();
      const sw = timelineRef.current.sidebarW;
      const x = e.clientX - bodyRect.left - sw;
      if (x < 0) return;
      e.preventDefault();

      const bodyY = e.clientY - bodyRect.top;
      const rowInfo = getRowAtY(bodyY);

      try { (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); } catch { /* ok */ }
      const pd = {
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
        bodyLeft: bodyRect.left,
        bodyTop: bodyRect.top,
        shiftKey: e.shiftKey,
        targetGroupId: rowInfo?.groupId ?? null,
        targetRowTop: rowInfo?.rowTop ?? 0,
        targetRowHeight: rowInfo?.rowHeight ?? 0,
        startMs: timelineRef.current.start.getTime(),
        endMs: timelineRef.current.end.getTime(),
      };
      panDragRef.current = pd;
      setPanDrag(pd);
    },
    [canInteract, getRowAtY],
  );

  // ── Loading state ────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={LOADING_STYLE}>
        {renderers?.renderLoading?.() ?? 'Loading timeline...'}
      </div>
    );
  }

  // ── Create-drag ghost bar ────────────────────────────────────────
  const ghostBar = (() => {
    if (!panDrag || !panDrag.shiftKey) return null;
    try {
      const sw = timelineRef.current.sidebarW;
      const body = bodyRef.current;
      if (!body) return null;
      const bodyRect = body.getBoundingClientRect();
      const sx = panDrag.startX - bodyRect.left - sw;
      const cx = panDrag.currentX - bodyRect.left - sw;
      const left = Math.min(sx, cx);
      const width = Math.max(4, Math.abs(cx - sx));
      const top = panDrag.targetRowTop;
      const height = panDrag.targetRowHeight || actualH;
      return (
        <div
          style={{
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`,
            background: 'rgba(26,115,232,0.12)',
            border: '2px dashed #1a73e8',
            borderRadius: 4,
          }}
        />
      );
    } catch {
      return null;
    }
  })();

  return (
    <div
      ref={setContainerRef}
      data-timeline
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={handlePointerDown}
      style={{
        ...ROOT_STYLE,
        flex: fitContainer && !fullHeight ? 1 : undefined,
        minHeight: fitContainer && !fullHeight ? 0 : undefined,
        overflow: fullHeight ? 'visible' : ROOT_STYLE.overflow,
      }}
    >

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexShrink: 0,
        borderBottom: '1px solid #d0d0d0',
        ...(stickyHeader ? { position: 'sticky', top: 0, zIndex: 10 } : {}),
      }}>
        {sidebarW > 0 && (
          <div style={{
            width: sidebarW, minWidth: sidebarW, height: headerHeight,
            overflow: 'hidden',
          }}>
            {renderers?.renderSidebarHeader?.() ?? (
              <div style={{
                ...SIDEBAR_LABEL_STYLE,
                width: '100%', height: '100%',
              }}>
                {hasGroups ? 'Groups' : 'Items'}
              </div>
            )}
          </div>
        )}
        <div style={{ ...HEADER_SPACER_STYLE, overflow: stickyHeader ? 'visible' : HEADER_SPACER_STYLE.overflow }}>
          <div style={{ flex: 1, overflow: stickyHeader ? 'visible' : 'hidden' }}>
            <TimelineHeader geometry={geometry} start={activeStart} end={activeEnd} step={step} height={headerHeight} renderDay={renderers?.renderDay} />
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div ref={bodyRef} onWheel={handleWheel} style={{
        ...BODY_STYLE,
        flex: fullHeight ? 'none' : BODY_STYLE.flex,
        overflow: fullHeight ? 'visible' : BODY_STYLE.overflow,
      }}>
        <TimelineGrid
          geometry={geometry} start={activeStart} end={activeEnd} step={step}
          totalHeight={totalRowsHeight} showToday={showToday} sidebarWidth={sidebarW}
        />

        {showLinks && links.length > 0 && (
          <TimelineLinks
            links={links} barLayouts={barLayouts}
            areaWidth={geometry.timelineWidth} areaHeight={totalRowsHeight}
            sidebarWidth={sidebarW}
            selectedLinkIds={selection.linkIds} onSelectLink={selectLink}
          />
        )}

        {/* Ghost bar for create-drag */}
        <div data-ghost-wrapper style={{ position: 'absolute', top: 0, left: `${sidebarW}px`, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 20 }}>
          {ghostBar}
        </div>

        <div style={ROWS_WRAPPER_STYLE}>
        {rowEntries.map((entry) => (
          <TimelineRow
            key={entry.groupId}
            groupId={entry.groupId} group={entry.group}
            items={entry.items} laneCount={entry.laneCount}
            itemHeight={itemHeight}
            resizable={canInteract && resizable}
            movable={canInteract && movable}
            rowHeight={Math.max(1, entry.laneCount) * laneH}
            isExpanded={true}
            renderItem={renderers?.renderItem}
            timeline={timeline}
            sidebarWidth={sidebarW}
            renderGroupHeader={renderers?.renderGroupHeader}
            showSidebar={hasGroups}
            onDoubleClickItem={handleItemDoubleClick}
          />
        ))}
        {Array.from({ length: emptyRowCount }, (_, i) => (
          <TimelineRow
            key={`__empty_${i}`}
            groupId={`__empty_${i}`} items={[]}
            laneCount={1} itemHeight={itemHeight}
            resizable={false} movable={false}
            rowHeight={laneH} isExpanded={false}
            timeline={timeline}
            sidebarWidth={sidebarW}
            showSidebar={hasGroups}
            isPlaceholder
          />
        ))}
      </div>
      </div>
    </div>
  );
});

export default Timeline;
