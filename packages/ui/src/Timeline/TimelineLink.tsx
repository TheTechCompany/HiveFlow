// ── Timeline — Dependency links ─────────────────────────────────────
// Rendered as an absolutely-positioned overlay inside the timeline area.
// Uses the same coordinate origin (0,0 = top-left of timeline area) as rows.

import React, { useMemo } from 'react';
import type { TimelineLink } from './types';
import type { BarLayout } from './useTimeline';

export interface TimelineLinksProps {
  links: TimelineLink[];
  barLayouts: BarLayout[];
  /** Pixel width of the timeline area (matches row widths). */
  areaWidth: number;
  /** Total pixel height of all rows stacked. */
  areaHeight: number;
  /** Left offset for the sidebar so the SVG aligns with the grid rows. */
  sidebarWidth?: number;
  selectedLinkIds: string[];
  onSelectLink?: (linkId: string, additive: boolean) => void;
}

// ── Module-level style constants ──────────────────────────────────

const LINKS_SVG_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  pointerEvents: 'none',
  overflow: 'visible',
  zIndex: 3,
};

export const TimelineLinks: React.FC<TimelineLinksProps> = React.memo(
  function TimelineLinks({
    links,
    barLayouts,
    areaWidth,
    areaHeight,
    sidebarWidth = 0,
    selectedLinkIds,
    onSelectLink,
  }) {
    const layoutMap = useMemo(() => {
      const map = new Map<string, BarLayout>();
      for (const bl of barLayouts) map.set(bl.itemId, bl);
      return map;
    }, [barLayouts]);

    const paths = useMemo(() => {
      if (areaWidth <= 0 || areaHeight <= 0) return [];
      return links
        .map((link) => {
          const src = layoutMap.get(link.source);
          const tgt = layoutMap.get(link.target);
          if (!src || !tgt) return null;

          const sx = src.left + src.width;
          const sy = src.top + src.height / 2;
          const tx = tgt.left;
          const ty = tgt.top + tgt.height / 2;

          if (tx <= sx + 2) return null;

          const mx = (sx + tx) / 2;
          const d = `M${sx},${sy} L${mx},${sy} L${mx},${ty} L${tx},${ty}`;

          return {
            d,
            selected: selectedLinkIds.includes(link.id),
            linkId: link.id,
            color: link.color,
          };
        })
        .filter(Boolean) as Array<{ d: string; selected: boolean; linkId: string; color?: string }>;
    }, [links, layoutMap, selectedLinkIds, areaWidth, areaHeight]);

    if (paths.length === 0) return null;

    return (
      <svg
        data-timeline-links
        viewBox={`0 0 ${areaWidth} ${areaHeight}`}
        width={areaWidth}
        height={areaHeight}
        style={{
          ...LINKS_SVG_STYLE,
          left: `${sidebarWidth}px`,
        }}
      >
        {paths.map((p) => (
          <g key={p.linkId}>
            <path
              d={p.d}
              fill="none"
              stroke="transparent"
              strokeWidth={14}
              style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
              onClick={(e) => onSelectLink?.(p.linkId, e.ctrlKey || e.metaKey)}
            />
            <path
              d={p.d}
              fill="none"
              stroke={p.color ?? (p.selected ? '#1a73e8' : '#b0b0b0')}
              strokeWidth={p.selected ? 2 : 1.5}
              style={{ pointerEvents: 'none' }}
              markerEnd={p.selected ? 'url(#as)' : 'url(#an)'}
            />
          </g>
        ))}
        <defs>
          <marker id="an" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0,0 6,2 0,4" fill="#b0b0b0" />
          </marker>
          <marker id="as" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0,0 6,2 0,4" fill="#1a73e8" />
          </marker>
        </defs>
      </svg>
    );
  },
);

export default TimelineLinks;
