// ── GanttView — Reusable split-view layout ───────────────────────────
//
// Thin wrapper around Timeline that provides:
//  - A flex column layout (fills parent)
//  - Sidebar + timeline split via sidebarWidth or an embedded sidebar node
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
  sidebar,
  sidebarFlex = '320px',
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
  highlightedDays,
  callbacks,
  renderers,
  selectedItemIds,
  selectedLinkIds,
  loading,
}) => {
  // ── Split layout with sidebar node ──────────────────────────────
  if (sidebar !== undefined) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            minHeight: 0,
            gap: 0,
          }}
        >
          {/* Sidebar column */}
          <Box
            sx={{
              flex: `0 0 ${sidebarFlex}`,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRight: '1px solid #d0d0d0',
            }}
          >
            {sidebar}
          </Box>

          {/* Timeline column */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
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
              highlightedDays={highlightedDays}
              sidebarWidth={0}
              callbacks={callbacks}
              renderers={renderers}
              selectedItemIds={selectedItemIds}
              selectedLinkIds={selectedLinkIds}
              loading={loading}
            />
          </Box>
        </Box>
        {contextMenu}
      </Box>
    );
  }

  // ── Legacy mode: sidebarWidth-based split ────────────────────────
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
        highlightedDays={highlightedDays}
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
