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
  overscrollBehavior: 'none',
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
};

const NAV_CONTAINER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '0 8px',
  borderRight: '1px solid #d0d0d0',
  background: '#f5f5f5',
  flexShrink: 0,
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

// ── Nav button component ────────────────────────────────────────────

const NavButton: React.FC<{ label: string; title: string; onClick: () => void }> = React.memo(
  function NavButton({ label, title, onClick }) {
    const [hover, setHover] = useState(false);
    return (
      <button
        title={title}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #d0d0d0', borderRadius: 6,
          background: hover ? '#e8e8e8' : '#fff', cursor: 'pointer',
          fontSize: 18, color: '#333', padding: 0, lineHeight: 1,
          transition: 'background 0.15s',
        }}
      >
        {label}
      </button>
    );
  },
);

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
    sidebarWidth: sidebarWidthProp,
    callbacks,
    renderers,
    loading,
  } = props;

  const timeline = useTimeline(props);

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

  // ── Stable nav callbacks (no inline arrows each render) ─────────
  const navPrev = useCallback(() => callbacks?.onNavigate?.('prev'), [callbacks]);
  const navToday = useCallback(() => callbacks?.onNavigate?.('today'), [callbacks]);
  const navNext = useCallback(() => callbacks?.onNavigate?.('next'), [callbacks]);

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
    return Math.max(h, geometry.viewportHeight - headerHeight, 200);
  }, [rowEntries, laneH, geometry.viewportHeight, headerHeight]);

  const actualH = rowEntries.reduce((s, e) => s + Math.max(1, e.laneCount) * laneH, 0);
  const emptyRowCount = Math.max(0, Math.ceil((totalRowsHeight - actualH) / laneH));

  // ── Drag for existing items ─────────────────────────────────────
  const dragRef = timeline.dragStateRef;

  // ── Pan / create-by-drag on empty space ──────────────────────────
  const [panDrag, setPanDrag] = useState<{
    startX: number;
    startY: number;
    startPanOffset: number;
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

  // ── Smooth pan offset (CSS translateX for header + body content) ──
  const [panOffset, setPanOffset] = useState(0);
  const panOffsetRef = useRef(panOffset);
  panOffsetRef.current = panOffset;

  // ── Consolidated ref bag for native listeners (replaces ~10 mirror pairs) ─
  const timelineRef = useRef({
    updateDrag,
    endDrag,
    clearSelection: timeline.clearSelection,
    callbacks,
    start,
    end,
    geometry,
    sidebarW,
    rowEntries,
    emptyRowCount,
    laneH,
  });
  timelineRef.current = {
    updateDrag,
    endDrag,
    clearSelection: timeline.clearSelection,
    callbacks,
    start,
    end,
    geometry,
    sidebarW,
    rowEntries,
    emptyRowCount,
    laneH,
  };

  // ── Edge-scroll ─────────────────────────────────────────────────
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
    if (t.callbacks?.onHorizonChange && now - edgeThrottleRef.current > 50) {
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
      t.callbacks.onHorizonChange(
        new Date(t.start.getTime() + ms),
        new Date(t.end.getTime() + ms),
      );
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

  // ── Wheel-to-pan ─────────────────────────────────────────────────
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const body = bodyRef.current;
      if (!body) return;
      if (e.deltaX !== 0 || e.shiftKey) {
        e.preventDefault();
        const delta = e.deltaX || e.deltaY;
        const t = timelineRef.current;

        if (t.callbacks?.onHorizonChange) {
          const ms = -delta / t.geometry.pxPerMs;
          t.callbacks.onHorizonChange(
            new Date(t.start.getTime() + ms),
            new Date(t.end.getTime() + ms),
          );
        } else {
          const visibleW = t.geometry.viewportWidth - t.sidebarW;
          const overflow = t.geometry.timelineWidth - visibleW;
          const minPan = overflow > 0 ? -overflow : -200;
          setPanOffset((prev) => Math.max(minPan, Math.min(0, prev - delta)));
        }
      }
    },
    [],
  );

  // ── Ref for the last horizon change timestamp ──────────────────
  const lastHorizonChangeRef = useRef(0);

  // ── Native pointer listeners (reliable cross-browser, single-instance) ──
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

        if (t.callbacks?.onHorizonChange) {
          const now = performance.now();
          if (now - lastHorizonChangeRef.current > 32) {
            lastHorizonChangeRef.current = now;
            const newStart = new Date(pd.startMs + rawMs);
            const newEnd = new Date(pd.endMs + rawMs);
            t.callbacks.onHorizonChange(newStart, newEnd);
          }
          setPanDrag((prev) => (prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null));
        } else {
          const visibleW = t.geometry.viewportWidth - t.sidebarW;
          const maxPan = 0;
          const overflow = t.geometry.timelineWidth - visibleW;
          const minPan = overflow > 0 ? -overflow : -200;
          const raw = pd.startPanOffset + delta;
          const clamped = Math.max(minPan, Math.min(maxPan, raw));
          setPanOffset(clamped);

          if (t.callbacks?.onNavigate && raw < minPan && delta < 0) {
            t.callbacks.onNavigate('prev');
            setPanOffset(0);
            setPanDrag((prev) => (prev ? { ...prev, currentX: e.clientX, startX: e.clientX, startPanOffset: 0, currentY: e.clientY } : null));
            return;
          }
          if (t.callbacks?.onNavigate && raw > maxPan && delta > 0) {
            t.callbacks.onNavigate('next');
            setPanOffset(0);
            setPanDrag((prev) => (prev ? { ...prev, currentX: e.clientX, startX: e.clientX, startPanOffset: 0, currentY: e.clientY } : null));
            return;
          }
          setPanDrag((prev) => (prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null));
        }
      }
    };

    const onUp = (e: PointerEvent) => {
      if (dragRef.current.mode !== 'idle') {
        timelineRef.current.endDrag();
        stopEdgeLoop();
        setPanOffset(0);
        try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch { /* ok */ }
        return;
      }
      const pd = panDragRef.current;
      if (pd) {
        const t = timelineRef.current;
        const po = panOffsetRef.current;
        if (pd.shiftKey && t.callbacks?.onItemCreate) {
          const sx = pd.startX - pd.bodyLeft - po - t.sidebarW;
          const cx = e.clientX - pd.bodyLeft - po - t.sidebarW;
          const minX = Math.min(sx, cx);
          const maxX = Math.max(sx, cx);
          const minWidthPx = 4;
          const dStart = xToDate(minX, t.start, t.geometry.pxPerMs);
          const dEnd = xToDate(maxX + Math.max(0, minWidthPx - (maxX - minX)), t.start, t.geometry.pxPerMs);
          t.callbacks.onItemCreate(dStart, dEnd, pd.targetGroupId ?? undefined);
        } else if (!pd.shiftKey && Math.abs(pd.currentX - pd.startX) < 3) {
          timelineRef.current.clearSelection();
        }
        stopEdgeLoop();
        setPanOffset(0);
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
  }, []); // Mount once — all state via timelineRef

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

  // ── Pointer down handler (move/up handled by native document listeners only) ─
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!canInteract) return;
      const target = e.target as HTMLElement;
      if (target.closest('[data-timeline-item]') || target.closest('[data-timeline-links]')) {
        return;
      }
      const body = bodyRef.current;
      if (!body) return;
      const bodyRect = body.getBoundingClientRect();
      const currentPan = panOffsetRef.current;
      const sw = timelineRef.current.sidebarW;
      const x = e.clientX - bodyRect.left - currentPan - sw;
      if (x < 0) return;
      e.preventDefault();

      const bodyY = e.clientY - bodyRect.top;
      const rowInfo = getRowAtY(bodyY);

      try { (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); } catch { /* ok */ }
      const pd = {
        startX: e.clientX,
        startY: e.clientY,
        startPanOffset: currentPan,
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

  // ── States ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={LOADING_STYLE}>
        {renderers?.renderLoading?.() ?? 'Loading timeline...'}
      </div>
    );
  }

  // ── Create-drag ghost bar ───────────────────────────────────────
  const ghostBar = (() => {
    if (!panDrag || !panDrag.shiftKey) return null;
    try {
      const sw = timelineRef.current.sidebarW;
      const sx = panDrag.startX - panDrag.bodyLeft - panOffset - sw;
      const cx = panDrag.currentX - panDrag.bodyLeft - panOffset - sw;
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

  // ── Shared pan transform (memoised) ───────────────────────────
  const panTransform = useMemo<React.CSSProperties>(() => ({
    transform: `translateX(${panOffset}px)`,
    willChange: panDrag ? 'transform' : undefined,
  }), [panOffset, panDrag]);

  return (
    <div
      ref={setContainerRef}
      data-timeline
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={handlePointerDown}
      style={{
        ...ROOT_STYLE,
        flex: fitContainer ? 1 : undefined,
        minHeight: fitContainer ? 0 : undefined,
      }}
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexShrink: 0, borderBottom: '1px solid #d0d0d0' }}>
        {sidebarW > 0 && (
          <div style={{
            ...SIDEBAR_LABEL_STYLE,
            width: sidebarW, minWidth: sidebarW, height: headerHeight,
          }}>
            {hasGroups ? 'Groups' : 'Items'}
          </div>
        )}
        <div style={HEADER_SPACER_STYLE}>
          {callbacks?.onNavigate && (
            <div style={NAV_CONTAINER_STYLE}>
              <NavButton label="←" title="Previous" onClick={navPrev} />
              <NavButton label="●" title="Today" onClick={navToday} />
              <NavButton label="→" title="Next" onClick={navNext} />
            </div>
          )}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={panTransform}>
              <TimelineHeader geometry={geometry} start={start} end={end} step={step} height={headerHeight} renderDay={renderers?.renderDay} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div ref={bodyRef} onWheel={handleWheel} style={BODY_STYLE}>
        <div style={panTransform}>
          <TimelineGrid
            geometry={geometry} start={start} end={end} step={step}
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

          {/* Ghost bar for create-drag — offset by sidebar width so it aligns with grid / bars */}
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
    </div>
  );
});

export default Timeline;
