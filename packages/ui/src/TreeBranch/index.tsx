import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronRight, ExpandMore } from '@mui/icons-material';

/* ──────────────────────────────────────────────────────────────────────
   TreeBranch — renders tree connector lines + twisty toggle for a single
   row in a hierarchical tree table.

   Intended to be placed inside a row container that has
   position: relative and display: flex.  The component injects:
     • Absolutely-positioned SVG-ish connector lines (ancestor │ bars,
       current-level ─┤ branch arm)
     • A fixed-width twisty column with expand/collapse icon
   ─────────────────────────────────────────────────────────────────── */

// ── Public constants (exported so callers can align headers/columns) ──
export const TREE_INDENT_PER_DEPTH = 12;
export const TREE_TWISTY_WIDTH = 36;

// ── Props ─────────────────────────────────────────────────────────────
export interface TreeBranchProps {
    /** Current depth level (0 = root, no indent / no branch lines) */
    depth: number;
    /** Whether this node has children → shows twisty chevron */
    hasChildren: boolean;
    /** Collapse state — controls chevron direction */
    isCollapsed: boolean;
    /** Called when the user clicks the twisty icon */
    onToggle: () => void;
    /**
     * Connector line visibility per level.
     * connectors[i] === true  → draw a vertical │ line at level i.
     * Length should be depth + 1 (index depth = current level).
     */
    connectors: boolean[];
}

// ── Component ─────────────────────────────────────────────────────────
export const TreeBranch: React.FC<TreeBranchProps> = ({
    depth,
    hasChildren,
    isCollapsed,
    onToggle,
    connectors,
}) => {
    const indent = TREE_INDENT_PER_DEPTH;
    const twisty = TREE_TWISTY_WIDTH;
    const halfTwisty = twisty / 2; // 18 — also the position of the twisty icon center

    return (
        <>
            {/* ── Ancestor vertical connector lines ──────────────── */}
            {connectors.slice(0, depth).map(
                (show, i) =>
                    show && (
                        <Box
                            key={`tree-anc-${i}`}
                            sx={{
                                position: 'absolute',
                                left: i * indent + halfTwisty,
                                top: 0,
                                bottom: 0,
                                borderLeft: '1px solid',
                                borderColor: 'grey.300',
                                pointerEvents: 'none',
                            }}
                        />
                    ),
            )}

            {/* ── Current-level branch lines (depth > 0) ─────────── */}
            {depth > 0 && (
                <>
                    {/* Horizontal branch arm — twisty → content indent */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: halfTwisty,
                            top: '50%',
                            width: twisty - halfTwisty + depth * indent,
                            borderTop: '1px solid',
                            borderColor: 'grey.300',
                            pointerEvents: 'none',
                        }}
                    />
                    {/* Vertical line up → parent */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: depth * indent + halfTwisty,
                            top: 0,
                            height: '50%',
                            borderLeft: '1px solid',
                            borderColor: 'grey.300',
                            pointerEvents: 'none',
                        }}
                    />
                    {/* Vertical line down → next sibling */}
                    {connectors[depth] && (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: depth * indent + halfTwisty,
                                top: '50%',
                                bottom: 0,
                                borderLeft: '1px solid',
                                borderColor: 'grey.300',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </>
            )}

            {/* ── Twisty column ──────────────────────────────────── */}
            <Box
                sx={{
                    width: twisty,
                    flexShrink: 0,
                    borderRight: '1px solid',
                    borderColor: 'grey.200',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                ) : (
                    <Box sx={{ width: 28 }} />
                )}
            </Box>
        </>
    );
};

export default TreeBranch;
