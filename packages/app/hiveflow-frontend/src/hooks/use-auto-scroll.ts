import { useRef, useCallback, useEffect } from 'react';
import type { DragUpdate } from 'react-beautiful-dnd';

/** Pixels from the top/bottom edge that trigger auto-scroll */
const SCROLL_THRESHOLD = 60;
/** Maximum pixels to scroll per frame */
const MAX_SCROLL_SPEED = 15;

/**
 * Manages a map of column-index → scrollable HTMLElement so that
 * during a drag, the column the pointer is currently over auto-scrolls
 * when near its top/bottom edge.
 *
 * Usage:
 *   const { registerColumn, onDragStart, onDragUpdate, onDragEnd } = useAutoScroll();
 *   // In each column:  <div ref={(el) => registerColumn(colIndex, el)} style={{overflow:'auto'}}>…</div>
 *   // On DragDropContext: <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>…</DragDropContext>
 */
export function useAutoScroll() {
  /** column-index → scrollable HTML element */
  const columnMapRef = useRef<Map<number, HTMLElement>>(new Map());
  const rafRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const stopScroll = useCallback(() => {
    isDraggingRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /** Call from each column to register its scroll container. */
  const registerColumn = useCallback(
    (index: number, el: HTMLElement | null) => {
      if (el) {
        columnMapRef.current.set(index, el);
      } else {
        columnMapRef.current.delete(index);
      }
    },
    [],
  );

  const onDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const onDragUpdate = useCallback((update: DragUpdate) => {
    if (!isDraggingRef.current) return;

    // The destination droppableId is the column index (string).
    // Use source if destination hasn't been entered yet.
    const droppableId =
      update.destination?.droppableId ?? update.source?.droppableId;
    if (droppableId == null) return;

    const colIndex = parseInt(droppableId, 10);
    const container = columnMapRef.current.get(colIndex);
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientY = update.client?.y ?? 0;

    const distFromTop = clientY - rect.top;
    const distFromBottom = rect.bottom - clientY;

    const scroll = (delta: number) => {
      if (rafRef.current !== null) return; // already scrolling
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!isDraggingRef.current) return;
        container.scrollTop += delta;

        // Keep scrolling while still in threshold
        if (isDraggingRef.current) {
          const newRect = container.getBoundingClientRect();
          const newDistFromTop = clientY - newRect.top;
          const newDistFromBottom = newRect.bottom - clientY;
          if (newDistFromTop < SCROLL_THRESHOLD && newDistFromTop > 0) {
            const speed = Math.min(
              MAX_SCROLL_SPEED,
              Math.ceil((SCROLL_THRESHOLD - newDistFromTop) / 4),
            );
            scroll(-speed);
          } else if (
            newDistFromBottom < SCROLL_THRESHOLD &&
            newDistFromBottom > 0
          ) {
            const speed = Math.min(
              MAX_SCROLL_SPEED,
              Math.ceil((SCROLL_THRESHOLD - newDistFromBottom) / 4),
            );
            scroll(speed);
          }
        }
      });
    };

    if (distFromTop < SCROLL_THRESHOLD && distFromTop > 0) {
      const speed = Math.min(
        MAX_SCROLL_SPEED,
        Math.ceil((SCROLL_THRESHOLD - distFromTop) / 4),
      );
      scroll(-speed);
    } else if (distFromBottom < SCROLL_THRESHOLD && distFromBottom > 0) {
      const speed = Math.min(
        MAX_SCROLL_SPEED,
        Math.ceil((SCROLL_THRESHOLD - distFromBottom) / 4),
      );
      scroll(speed);
    } else if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const onDragEnd = useCallback(() => {
    stopScroll();
  }, [stopScroll]);

  return {
    registerColumn,
    onDragStart,
    onDragUpdate,
    onDragEnd,
    stopScroll,
  } as const;
}
