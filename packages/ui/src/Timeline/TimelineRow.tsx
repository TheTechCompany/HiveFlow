// ── Timeline — Row (group lane) ─────────────────────────────────────
// Renders one group's items packed into non-overlapping lanes.

import React, { useCallback, useMemo } from 'react';
import { TimelineBar } from './TimelineBar';
import type { TimelineItem, TimelineGroup } from './types';
import type { UseTimelineReturn } from './useTimeline';

export interface TimelineRowProps {
  groupId: string;
  group?: TimelineGroup;
  items: (TimelineItem & { laneIndex: number })[];
  laneCount: number;
  itemHeight: number;
  resizable: boolean;
  movable: boolean;
  rowHeight: number;
  isExpanded: boolean;
  renderItem?: (item: TimelineItem) => React.ReactNode;
  renderGroupHeader?: (group: TimelineGroup, expanded: boolean) => React.ReactNode;
  timeline: UseTimelineReturn;
  sidebarWidth: number;
  /** If true, render the group label on the left. */
  showSidebar?: boolean;
  /** Called when an empty row is double-clicked (for item creation). */
  onEmptyRowDoubleClick?: (e: React.MouseEvent) => void;
  /** If true, the row uses flex: 1 to fill remaining space. */
  flexFill?: boolean;
  /** Placeholder row — shows subtle hint text. */
  isPlaceholder?: boolean;
  /** Called when a bar is double-clicked. */
  onDoubleClickItem?: (itemId: string) => void;
  /** When false, the sidebar wrapper has no padding or border —
   *  the renderGroupHeader callback owns all styling. Default true. */
  sidebarPadding?: boolean;
}

// ── Module-level style constants ──────────────────────────────────

const ROW_BORDER_SOLID: React.CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid #e8e8e8',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
};

const ROW_BORDER_DASHED: React.CSSProperties = {
  ...ROW_BORDER_SOLID,
  borderBottom: '1px dashed #e8e8e8',
};

const SIDEBAR_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 12px',
  borderRight: '1px solid #d0d0d0',
  background: '#f5f5f5',
  fontWeight: 500,
  fontSize: 12,
  color: '#333',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  boxSizing: 'border-box',
  flexShrink: 0,
};

const BAR_AREA_STYLE: React.CSSProperties = {
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
};

const LANE_DIVIDER_STYLE: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: 0,
  borderTop: '1px dashed #e0e0e0',
  pointerEvents: 'none',
  zIndex: 0,
};

// ── Memo'd bar wrapper (isolates per-item callback creation) ──────

interface RowBarProps {
  item: TimelineItem & { laneIndex: number };
  style: React.CSSProperties;
  isSelected: boolean;
  resizable: boolean;
  isDragging: boolean;
  renderItem?: (item: TimelineItem) => React.ReactNode;
  onSelect: (itemId: string, additive: boolean) => void;
  onDragStart: (itemId: string, mode: 'move' | 'resize-left' | 'resize-right', clientX: number) => void;
  movable: boolean;
  onDoubleClick?: (itemId: string) => void;
}

const RowBar = React.memo(function RowBar({
  item,
  style,
  isSelected,
  resizable,
  isDragging,
  renderItem,
  onSelect,
  onDragStart,
  movable,
  onDoubleClick,
}: RowBarProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onSelect(item.id, e.ctrlKey || e.metaKey);
    },
    [item.id, onSelect],
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      onDoubleClick?.(item.id);
    },
    [item.id, onDoubleClick],
  );

  const handleMoveStart = useCallback(
    (e: React.PointerEvent) => {
      if (!movable) return;
      const bar = e.currentTarget as HTMLElement;
      bar.setPointerCapture(e.pointerId);
      onDragStart(item.id, 'move', e.clientX);
    },
    [item.id, movable, onDragStart],
  );

  const handleResizeLeftStart = useCallback(
    (e: React.PointerEvent) => {
      if (!resizable) return;
      const handle = e.currentTarget as HTMLElement;
      handle.setPointerCapture(e.pointerId);
      onDragStart(item.id, 'resize-left', e.clientX);
    },
    [item.id, resizable, onDragStart],
  );

  const handleResizeRightStart = useCallback(
    (e: React.PointerEvent) => {
      if (!resizable) return;
      const handle = e.currentTarget as HTMLElement;
      handle.setPointerCapture(e.pointerId);
      onDragStart(item.id, 'resize-right', e.clientX);
    },
    [item.id, resizable, onDragStart],
  );

  return (
    <TimelineBar
      item={item}
      style={style}
      isSelected={isSelected}
      resizable={resizable && item.resizable !== false}
      isDragging={isDragging}
      renderItem={renderItem}
      onMoveStart={handleMoveStart}
      onResizeLeftStart={handleResizeLeftStart}
      onResizeRightStart={handleResizeRightStart}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  );
});

// ── Row component ───────────────────────────────────────────────────

export const TimelineRow: React.FC<TimelineRowProps> = React.memo(
  function TimelineRow({
    groupId,
    group,
    items,
    laneCount,
    itemHeight,
    resizable,
    movable,
    rowHeight,
    isExpanded,
    renderItem,
    renderGroupHeader,
    timeline,
    sidebarWidth,
    showSidebar,
    onEmptyRowDoubleClick,
    isPlaceholder,
    onDoubleClickItem,
    sidebarPadding = true,
  }) {
    const {
      selection,
      selectItem,
      computeBarStyle,
      startDrag,
      dragState,
    } = timeline;

    // Stable per-row handlers (shared across all bars in the row)
    const handleSelect = useCallback(
      (itemId: string, additive: boolean) => {
        selectItem(itemId, additive);
      },
      [selectItem],
    );

    const handleDoubleClick = useCallback(
      (itemId: string) => {
        onDoubleClickItem?.(itemId);
      },
      [onDoubleClickItem],
    );

    const handleDragStart = useCallback(
      (itemId: string, mode: 'move' | 'resize-left' | 'resize-right', clientX: number) => {
        startDrag(itemId, mode, clientX);
      },
      [startDrag],
    );

    const borderStyle = isPlaceholder ? ROW_BORDER_DASHED : ROW_BORDER_SOLID;

    return (
      <div
        data-timeline-row={groupId}
        style={{ ...borderStyle, height: `${rowHeight}px` }}
      >
        {/* Sidebar gutter */}
        {showSidebar && sidebarWidth > 0 && (
          <div
            data-timeline-sidebar
            style={{
              ...SIDEBAR_STYLE,
              width: `${sidebarWidth}px`,
              minWidth: `${sidebarWidth}px`,
              ...(sidebarPadding
                ? {}
                : { padding: 0, borderRight: 'none' }),
            }}
          >
            {isPlaceholder
              ? ''
              : group
                ? renderGroupHeader
                  ? renderGroupHeader(group, isExpanded)
                  : group.label ?? groupId
                : groupId}
          </div>
        )}

        {/* Bar area */}
        <div
          style={BAR_AREA_STYLE}
          onDoubleClick={items.length === 0 ? onEmptyRowDoubleClick : undefined}
        >
          {/* Lane dividers */}
          {laneCount > 1 &&
            Array.from({ length: laneCount - 1 }, (_, i) => (
              <div
                key={`div-${i}`}
                style={{
                  ...LANE_DIVIDER_STYLE,
                  top: `${(i + 1) * (itemHeight + 4) - 2}px`,
                }}
              />
            ))}

          {items.map((item) => (
            <RowBar
              key={item.id}
              item={item}
              style={computeBarStyle(item)}
              isSelected={selection.itemIds.includes(item.id)}
              resizable={resizable}
              isDragging={dragState.mode !== 'idle' && dragState.itemId === item.id}
              renderItem={renderItem}
              onSelect={handleSelect}
              onDragStart={handleDragStart}
              movable={movable}
              onDoubleClick={handleDoubleClick}
            />
          ))}
        </div>
      </div>
    );
  },
);

export default TimelineRow;
