import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronRight, ExpandMore } from '@mui/icons-material';

/* ──────────────────────────────────────────────────────────────────────
   TreeBranchVSCode — tree connector lines using a uniform 16 px indent
   grid.  Four visual variants, all driven by the same `connectors` data.

   Variants
   ────────
   • "solid-connectors"   — vertical lines + horizontal branch arm (T‑junctions)
   • "indent-guides"      — vertical ancestor lines only, no horizontal arm
   • "depth-borders"      — left-border bands colour-coded by depth
   • "minimal"            — pure indentation, no lines at all
   ─────────────────────────────────────────────────────────────────── */

// ── Public constants ────────────────────────────────────────────────
export const VSCODE_INDENT = 16;
export const VSCODE_TWISTY_WIDTH = VSCODE_INDENT;

/** Width of each depth-border band (used by "depth-borders" variant
 *  and for content indent alignment in SplitView). */
export const DEPTH_BORDER_WIDTH = 3;

// ── Types ───────────────────────────────────────────────────────────
export type TreeVariant =
    | 'solid-connectors'
    | 'indent-guides'
    | 'depth-borders'
    | 'minimal';

export interface TreeBranchVSCodeProps {
    depth: number;
    hasChildren: boolean;
    isCollapsed: boolean;
    onToggle: () => void;
    /** connectors[i] → show vertical │ at indent level i */
    connectors: boolean[];
    /** Visual style. Default "solid-connectors". */
    variant?: TreeVariant;
}

// ── Depth colour palette (for depth-borders variant) ──────────────
const DEPTH_COLORS = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#f43f5e', // rose
];

function depthColor(level: number): string {
    return DEPTH_COLORS[level % DEPTH_COLORS.length];
}

// ── Sub-components ─────────────────────────────────────────────────

/** A flex spacer that fills one indent level. */
const IndentSpacer: React.FC<{
    width: number;
    connector?: boolean;
    borderColor?: string;
    borderWidth?: number;
}> = ({ width, connector, borderColor, borderWidth }) => (
    <Box
        sx={{
            width,
            flexShrink: 0,
            height: '100%',
            position: 'relative',
            pointerEvents: 'none',
            // solid / indent-guides connector line
            ...(connector &&
                borderColor === undefined && {
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        borderLeft: '1px solid',
                        borderColor: 'grey.300',
                    },
                }),
            // depth-borders coloured band
            ...(borderColor !== undefined && {
                borderLeft: `${borderWidth ?? 2}px solid`,
                borderColor,
            }),
        }}
    />
);

// ══════════════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════════════

export const TreeBranchVSCode: React.FC<TreeBranchVSCodeProps> = ({
    depth,
    hasChildren,
    isCollapsed,
    onToggle,
    connectors,
    variant = 'solid-connectors',
}) => {
    const indent = VSCODE_INDENT;
    const half = indent / 2; // 8 px
    const showArm = variant === 'solid-connectors' && depth > 0;
    const showAncestors = variant === 'solid-connectors' || variant === 'indent-guides';
    const isDepthBorders = variant === 'depth-borders';

    const spacerW = isDepthBorders ? DEPTH_BORDER_WIDTH : indent;

    return (
        <>
            {/* ── Branch arm (only solid-connectors) ──────────────── */}
            {showArm && (
                <Box
                    sx={{
                        position: 'absolute',
                        left: half,
                        top: '50%',
                        width: depth * indent,
                        borderTop: '1px solid',
                        borderColor: 'grey.300',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* ── Twist column (indent level 0) ───────────────────── */}
            <Box
                sx={{
                    width: indent,
                    flexShrink: 0,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    // Level-0 connector (solid / indent-guides)
                    ...(showAncestors &&
                        connectors[0] && {
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: '50%',
                                top: 0,
                                bottom: 0,
                                borderLeft: '1px solid',
                                borderColor: 'grey.300',
                            },
                        }),
                    // Depth border at level 0
                    ...(isDepthBorders && {
                        borderLeft: `${DEPTH_BORDER_WIDTH}px solid`,
                        borderColor: depthColor(0),
                    }),
                    borderRight: '1px solid',
                    borderColor: 'grey.200',
                }}
            >
                {hasChildren ? (
                    <IconButton
                        size="small"
                        sx={{ p: 0, zIndex: 1, bgcolor: 'background.paper' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                        aria-label={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {isCollapsed ? (
                            <ChevronRight sx={{ fontSize: 16 }} />
                        ) : (
                            <ExpandMore sx={{ fontSize: 16 }} />
                        )}
                    </IconButton>
                ) : variant === 'minimal' ? null : (
                    <Box sx={{ width: 14 }} />
                )}
            </Box>

            {/* ── Indent guides for levels 1 … depth ──────────────── */}
            {Array.from({ length: depth }, (_, i) => {
                const level = i + 1;
                const showConnector = showAncestors && !!connectors[level];
                const borderCol = isDepthBorders ? depthColor(level) : undefined;

                return (
                    <IndentSpacer
                        key={`ig-${i}`}
                        width={spacerW}
                        connector={showConnector}
                        borderColor={borderCol}
                        borderWidth={isDepthBorders ? DEPTH_BORDER_WIDTH : undefined}
                    />
                );
            })}
        </>
    );
};

export default TreeBranchVSCode;
