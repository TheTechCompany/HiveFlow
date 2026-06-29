// ── Timeline — Bar item ─────────────────────────────────────────────
// A single bar rendered on the timeline grid. Supports resize handles.

import React, { useCallback, useMemo, useRef } from 'react';
import type { TimelineItem } from './types';
import { RESIZE_HANDLE_WIDTH } from './constants';

export interface TimelineBarProps {
  item: TimelineItem & { laneIndex?: number };
  style: React.CSSProperties;
  isSelected: boolean;
  resizable: boolean;
  /** Whether a drag operation is currently active on this bar. */
  isDragging: boolean;
  /** Render prop for custom bar content. */
  renderItem?: (item: TimelineItem) => React.ReactNode;
  /** Pointer down on the bar body → initiates move. */
  onMoveStart: (e: React.PointerEvent) => void;
  /** Pointer down on left handle → initiates resize-left. */
  onResizeLeftStart: (e: React.PointerEvent) => void;
  /** Pointer down on right handle → initiates resize-right. */
  onResizeRightStart: (e: React.PointerEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

// ── Module-level style constants ──────────────────────────────────

const RESIZE_HANDLE_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  height: '100%',
  width: `${RESIZE_HANDLE_WIDTH}px`,
  cursor: 'col-resize',
  zIndex: 2,
};

const BAR_CONTENT_STYLE: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  padding: '0 8px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: '12px',
  fontWeight: 500,
  color: '#fff',
  zIndex: 1,
  position: 'relative',
  minWidth: 0,
  pointerEvents: 'none',
};

const PROGRESS_FILL_STYLE: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  backgroundColor: 'rgba(255,255,255,0.25)',
  pointerEvents: 'none',
  zIndex: 0,
};

const ELLIPSIS_SPAN_STYLE: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

// ── Component ───────────────────────────────────────────────────────

export const TimelineBar: React.FC<TimelineBarProps> = React.memo(function TimelineBar({
  item,
  style,
  isSelected,
  resizable,
  isDragging,
  renderItem,
  onMoveStart,
  onResizeLeftStart,
  onResizeRightStart,
  onClick,
  onDoubleClick,
}) {
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only capture on primary button
      if (e.button !== 0) return;
      // Shift+click → let event bubble so Timeline can start a create-drag
      if (e.shiftKey) return;
      e.stopPropagation();
      onMoveStart(e);
    },
    [onMoveStart],
  );

  const handleResizeLeft = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onResizeLeftStart(e);
    },
    [onResizeLeftStart],
  );

  const handleResizeRight = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onResizeRightStart(e);
    },
    [onResizeRightStart],
  );

  // Memoise the overlay style so TimelineBar's own memo isn't defeated
  // by a new style merge object on every parent render.
  const overlayStyle = useMemo(() => ({
    ...style,
    opacity: isDragging ? 0.6 : 1,
    transition: isDragging ? 'none' : 'opacity 0.15s ease',
  }), [style, isDragging]);

  return (
    <div
      data-timeline-item={item.id}
      className={`timeline-bar ${isSelected ? 'timeline-bar--selected' : ''} ${isDragging ? 'timeline-bar--dragging' : ''}`}
      style={overlayStyle}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={item.hoverInfo}
    >
      {/* Left resize handle */}
      {resizable && item.resizable !== false && (
        <div
          data-resize="left"
          onPointerDown={handleResizeLeft}
          style={RESIZE_HANDLE_STYLE}
        />
      )}

      {/* Bar content */}
      <div style={BAR_CONTENT_STYLE}>
        {renderItem ? renderItem(item) : (
          <span style={ELLIPSIS_SPAN_STYLE}>
            {item.label ?? item.id}
          </span>
        )}
      </div>

      {/* Progress fill */}
      {item.progress != null && item.progress > 0 && (
        <div
          style={{
            ...PROGRESS_FILL_STYLE,
            width: `${Math.min(100, item.progress)}%`,
          }}
        />
      )}

      {/* Right resize handle */}
      {resizable && item.resizable !== false && (
        <div
          data-resize="right"
          onPointerDown={handleResizeRight}
          style={{
            ...RESIZE_HANDLE_STYLE,
            right: 0,
            left: undefined,
          }}
        />
      )}
    </div>
  );
});

export default TimelineBar;
