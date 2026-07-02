// ── SidebarLayout — Navigation sidebar + routed content ──────────────
//
// Drop-in replacement for @hexhive/ui's SidebarView that correctly
// highlights the active sidebar item for all subviews (prefix matching).
//
// Usage:
//   <SidebarLayout
//     views={[
//       { path: 'recurring', label: 'Recurring', icon: <Icon />, component: <RecurringView /> },
//       { path: '',          label: 'Schedule',  icon: <Icon />, component: <ScheduleView /> },
//     ]}
//   />

import React from 'react';
import {
  Box,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation, useRoutes } from 'react-router-dom';

// ── Types ────────────────────────────────────────────────────────────

export interface SidebarMenuItem {
  /** Relative route path, e.g. "recurring".  Empty string for root. */
  path: string;
  /** Display label shown next to the icon. */
  label: string;
  /** Icon element rendered before the label. */
  icon: React.ReactNode;
  /** Component rendered when this route matches. */
  component?: React.ReactNode;
}

export interface SidebarLayoutProps {
  /** Menu items that define the sidebar and routes. */
  views: SidebarMenuItem[];
  /** Padding applied to the content viewport. */
  viewportPadding?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Returns true when `location.pathname` is at or under `itemPath`.
 *
 * Prefix matching ensures sidebar items stay visibly selected when the
 * user drills into a subview (e.g. /recurring → /recurring/:id).
 *
 * The root path (empty string) only matches exactly "/" so it doesn't
 * steal the active state from every other item.
 */
function itemIsActive(locationPathname: string, itemPath: string): boolean {
  if (!itemPath) {
    // Root / dashboard — only highlight when exactly at "/"
    return locationPathname === '/' || locationPathname === '';
  }
  const absPath = '/' + itemPath;
  return (
    locationPathname === absPath ||
    locationPathname.startsWith(absPath + '/')
  );
}

// ── Component ────────────────────────────────────────────────────────

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  views,
  viewportPadding = '4px',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();

  // ── Routes ──────────────────────────────────────────────────────
  // Mirror @hexhive/ui SidebarView: each path gets a "/*" suffix so
  // nested sub-routes (like :id) are handled by the view's own <Routes>.
  const routingTable = React.useMemo(
    () =>
      (views || []).map((item) => ({
        path: item.path ? `${item.path}/*` : '*',
        element: item.component ?? undefined,
        children: [],
      })),
    [views],
  );
  const routes = useRoutes(routingTable);

  // ── Navigation ───────────────────────────────────────────────────
  const handleSelect = React.useCallback(
    (item: SidebarMenuItem) => {
      // Navigate to the absolute path so clicks always land on the
      // list / root view regardless of current sub-route depth.
      navigate('/' + item.path);
    },
    [navigate],
  );

  // ── Sizing ───────────────────────────────────────────────────────
  const sidebarWidth = !isMobile ? (!isTablet ? '175px' : '50px') : '100%';
  const sidebarHeight = isMobile ? '55px' : '100%';
  const sidebarDirection = isMobile ? 'row' : 'column';
  const iconSize = isMobile ? '50px' : '20px';
  const minified = isTablet && !isMobile;

  // ── Render ───────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        flex: 1,
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: sidebarDirection,
          width: sidebarWidth,
          height: sidebarHeight,
          bgcolor: 'primary.main',
          flexShrink: 0,
          overflow: isMobile ? 'auto' : 'visible',
        }}
      >
        <List
          sx={{
            display: 'flex',
            flexDirection: sidebarDirection,
            width: '100%',
            padding: 0,
          }}
        >
          {(views || []).map((item) => {
            const active = itemIsActive(location.pathname, item.path);

            return (
              <ListItem
                key={item.path}
                button
                onClick={() => handleSelect(item)}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  padding: '6px',
                  alignItems: 'center',
                  justifyContent: minified ? 'center' : undefined,
                  background: active ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    background: active
                      ? 'rgba(0, 0, 0, 0.20)'
                      : 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: iconSize,
                    height: iconSize,
                    marginRight: minified ? undefined : '6px',
                    marginLeft: !isMobile && !minified ? '6px' : undefined,
                    padding: isMobile ? '8px' : undefined,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                {!minified && (
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* ── Content ─────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          padding: viewportPadding,
          minWidth: 0,
        }}
      >
        {routes}
      </Box>
    </Box>
  );
};
