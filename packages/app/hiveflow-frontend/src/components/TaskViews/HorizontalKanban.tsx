import React, { useState, useCallback, useMemo } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  Button,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Add,
  UnfoldMore,
} from '@mui/icons-material';
import type { KanbanColumn, KanbanRow } from '../../types/kanban';

// ── Types ───────────────────────────────────────────────────────────

export interface HorizontalKanbanProps {
  columns: KanbanColumn[];
  renderCard?: (row: KanbanRow) => React.ReactNode;
  onDragEnd?: (result: DropResult) => void;
  onSelectCard?: (row: KanbanRow) => void;
  onCreateCard?: (columnId: string) => void;
  renderHeaderActions?: (column: KanbanColumn) => React.ReactNode;
}

// ── Group helper ────────────────────────────────────────────────────

interface RowGroup {
  key: string;
  label: string;
  rows: KanbanRow[];
}

function groupRows(rows: KanbanRow[]): RowGroup[] | null {
  if (rows.length === 0 || !rows[0]?.groupKey) return null;
  const groups: RowGroup[] = [];
  let current: RowGroup | null = null;
  for (const row of rows) {
    if (!current || current.key !== row.groupKey) {
      current = { key: row.groupKey!, label: row.groupLabel!, rows: [] };
      groups.push(current);
    }
    current.rows.push(row);
  }
  return groups;
}

// ── Column component ────────────────────────────────────────────────

const KanbanColumnView: React.FC<{
  column: KanbanColumn;
  index: number;
  renderCard?: (row: KanbanRow) => React.ReactNode;
  onSelectCard?: (row: KanbanRow) => void;
  onCreateCard?: (columnId: string) => void;
  renderHeaderActions?: (column: KanbanColumn) => React.ReactNode;
}> = ({
  column,
  index,
  renderCard,
  onSelectCard,
  onCreateCard,
  renderHeaderActions,
}) => {
  const [collapsed, setCollapsed] = useState(column.variant === 'collapsed');

  // Track which project groups are expanded (default: none = all collapsed)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const isSubtle = column.variant === 'subtle';

  const visibleRows = column.ttl
    ? column.rows.filter((r) => {
        if (!r.lastUpdated) return true;
        return Date.now() - new Date(r.lastUpdated).getTime() < column.ttl!;
      })
    : column.rows;

  const groups = useMemo(() => groupRows(visibleRows), [visibleRows]);
  const hasGroups = groups !== null;
  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (!groups) return;
    setExpandedGroups(new Set(groups.map((g) => g.key)));
  }, [groups]);
  const collapseAll = useCallback(() => setExpandedGroups(new Set()), []);

  const renderRow = (row: KanbanRow, rowIndex: number) => (
    <Draggable key={row.id} draggableId={row.id} index={rowIndex}>
      {(dragProvided, dragSnapshot) => (
        <Box
          onClick={() => onSelectCard?.(row)}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          sx={{
            mb: 0.75,
            opacity: dragSnapshot.isDragging ? 0.85 : 1,
            borderRadius: dragSnapshot.isDragging ? '6px' : '4px',
            boxShadow: dragSnapshot.isDragging
              ? '0 8px 20px rgba(0,0,0,0.3)'
              : '0 1px 3px rgba(0,0,0,0.12)',
            transform: dragSnapshot.isDragging
              ? 'rotate(3deg) scale(1.02)'
              : 'none',
            transition: 'box-shadow 0.15s, transform 0.15s',
          }}
        >
          {renderCard?.(row) ?? (
            <Paper sx={{ p: 1 }}>{row.title}</Paper>
          )}
        </Box>
      )}
    </Draggable>
  );

  return (
    <Paper
      sx={{
        width: 280,
        minWidth: 280,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        mx: 0.5,
        opacity: isSubtle ? 0.65 : 1,
        transition: 'opacity 0.2s',
        bgcolor: '#424242',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Column header */}
      <Box
        onClick={() =>
          (column.variant === 'collapsed') && setCollapsed((p) => !p)
        }
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: isSubtle ? 'rgba(66,66,66,0.5)' : '#616161',
          color: 'white',
          px: 1.5,
          py: 1,
          cursor: column.variant === 'collapsed' ? 'pointer' : 'default',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Status dot */}
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor:
                column.id === 'In Progress'
                  ? '#4caf50'
                  : column.id === 'Backlog'
                    ? '#ff9800'
                    : column.id === 'Reviewing'
                      ? '#2196f3'
                      : '#9e9e9e',
            }}
          />
          <Typography variant="subtitle2" fontWeight="bold">
            {column.title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              px: 1,
              py: 0.25,
              borderRadius: '10px',
              fontSize: '0.7rem',
            }}
          >
            {visibleRows.length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {renderHeaderActions?.(column)}
          {column.variant === 'collapsed' && (
            <IconButton size="small" sx={{ color: 'white' }}>
              {collapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Column body */}
      {!collapsed && (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <Droppable droppableId={`${index}`} type="LIST">
          {(dropProvided, dropSnapshot) => (
            <Box
              {...dropProvided.droppableProps}
              ref={dropProvided.innerRef}
              sx={{
                flex: 1,
                overflow: 'auto',
                minHeight: 0,
                p: 1,
                bgcolor: dropSnapshot.isDraggingOver
                  ? 'rgba(144,202,249,0.1)'
                  : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              {visibleRows.length === 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    textAlign: 'center',
                    py: 2,
                    fontStyle: 'italic',
                  }}
                >
                  Drop tasks here
                </Typography>
              )}

              {hasGroups && groups ? (
                /* ── Grouped view ─────────────────────── */
                <>
                  {/* Expand/collapse all */}
                  {groups.length > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                      <Tooltip title={
                        expandedGroups.size === 0 ? 'Expand all' : 'Collapse all'
                      }>
                        <IconButton
                          size="small"
                          onClick={
                            expandedGroups.size === 0 ? expandAll : collapseAll
                          }
                          sx={{ color: 'rgba(255,255,255,0.4)', p: 0.25 }}
                        >
                          <UnfoldMore sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  {groups.map((group) => {
                    const isCollapsed = !expandedGroups.has(group.key);
                    let globalIndex = 0;
                    // Compute the starting draggable index for this group
                    for (const g of groups) {
                      if (g.key === group.key) break;
                      globalIndex += g.rows.length;
                    }
                    return (
                      <Box key={group.key} sx={{ mb: 0.5 }}>
                        {/* Group header — clickable to expand/collapse */}
                        <Box
                          onClick={() => toggleGroup(group.key)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.5,
                            borderRadius: '4px',
                            bgcolor: 'secondary.main',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'secondary.dark' },
                            userSelect: 'none',
                          }}
                        >
                          {isCollapsed ? (
                            <ExpandMore sx={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }} />
                          ) : (
                            <ExpandLess sx={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }} />
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'white',
                              fontSize: '0.65rem',
                              fontWeight: 600,
                            }}
                          >
                            ({group.rows.length}) {group.label}
                          </Typography>
                        </Box>
                        {/* Group body — draggable cards */}
                        <Collapse in={!isCollapsed}>
                          <Box sx={{ pt: 0.5 }}>
                            {group.rows.map((row, i) =>
                              renderRow(row, globalIndex + i)
                            )}
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
                </>
              ) : (
                /* ── Flat view (no grouping) ─────────── */
                visibleRows.map((row, rowIndex) => renderRow(row, rowIndex))
              )}

              {dropProvided.placeholder}
            </Box>
          )}
        </Droppable>
        </Box>
      )}

      {/* Add task button at bottom — only when handler provided */}
      {onCreateCard && (
        <Collapse in={!collapsed}>
          <Button
            fullWidth
            size="small"
            startIcon={<Add fontSize="small" />}
            onClick={() => onCreateCard(column.id)}
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
              py: 0.75,
              fontSize: '0.75rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 0,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
            }}
          >
            Add task
          </Button>
        </Collapse>
      )}
    </Paper>
  );
};

// ── Main component ──────────────────────────────────────────────────

export const HorizontalKanban: React.FC<HorizontalKanbanProps> = ({
  columns,
  renderCard,
  onDragEnd,
  onSelectCard,
  onCreateCard,
  renderHeaderActions,
}) => {
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      onDragEnd?.(result);
    },
    [onDragEnd],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board-horizontal" type="COLUMN" direction="horizontal">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              display: 'flex',
              overflowX: 'auto',
              overflowY: 'hidden',
              px: 1,
              py: 1.5,
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
              },
            }}
          >
            {columns.map((col, index) => (
              <KanbanColumnView
                key={col.id}
                column={col}
                index={index}
                renderCard={renderCard}
                onSelectCard={onSelectCard}
                onCreateCard={onCreateCard}
                renderHeaderActions={renderHeaderActions}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default HorizontalKanban;
