// ── GanttView — Reusable split-view layout ───────────────────────────
//
// Thin wrapper around Timeline that provides:
//  - A flex column layout (fills parent)
//  - Sidebar + timeline split via sidebarWidth
//  - An optional contextMenu slot
//
// All Timeline props are passed through.

import React from 'react';
import { Box } from '@mui/material';
import { Timeline } from '../Timeline';
import type { GanttViewProps } from './types';

// ── Component ────────────────────────────────────────────────────────

export const GanttView: React.FC<GanttViewProps> = ({
  sidebarWidth,
  contextMenu,
  // ── Timeline pass-through ───────────────────────────────────────
  items,
  links,
  groups,
  start,
  end,
  step,
  stepCount,
  itemHeight,
  groupHeaderHeight,
  headerHeight,
  minBarWidth,
  resizable,
  movable,
  multiSelect,
  showLinks,
  showToday,
  fitContainer,
  readonly,
  fullHeight,
  stickyHeader,
  callbacks,
  renderers,
  selectedItemIds,
  selectedLinkIds,
  loading,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <Timeline
        items={items}
        links={links}
        groups={groups}
        start={start}
        end={end}
        step={step}
        stepCount={stepCount}
        itemHeight={itemHeight}
        groupHeaderHeight={groupHeaderHeight}
        headerHeight={headerHeight}
        minBarWidth={minBarWidth}
        resizable={resizable}
        movable={movable}
        multiSelect={multiSelect}
        showLinks={showLinks}
        showToday={showToday}
        fitContainer={fitContainer}
        readonly={readonly}
        fullHeight={fullHeight}
        stickyHeader={stickyHeader}
        sidebarWidth={sidebarWidth}
        callbacks={callbacks}
        renderers={renderers}
        selectedItemIds={selectedItemIds}
        selectedLinkIds={selectedLinkIds}
        loading={loading}
      />
      {contextMenu}
    </Box>
  );
};

export default GanttView;
