import React, { useState, useCallback } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DragStart,
  type DragUpdate,
} from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import type { KanbanColumn, KanbanRow } from '../../types/kanban';

// ── Types ───────────────────────────────────────────────────────────

export interface StackedTaskListProps {
  columns: KanbanColumn[];
  renderCard?: (row: KanbanRow) => React.ReactNode;
  onDragEnd?: (result: DropResult) => void;
  onSelectCard?: (row: KanbanRow) => void;
  onCreateCard?: (columnId: string) => void;
  /** Extra actions rendered in a column's header (receives the column) */
  renderHeaderActions?: (column: KanbanColumn) => React.ReactNode;
}

// ── Section component ───────────────────────────────────────────────

interface TaskSectionProps {
  column: KanbanColumn;
  index: number;
  renderCard?: (row: KanbanRow) => React.ReactNode;
  onSelectCard?: (row: KanbanRow) => void;
  onCreateCard?: (columnId: string) => void;
  renderHeaderActions?: (column: KanbanColumn) => React.ReactNode;
}

const TaskSection: React.FC<TaskSectionProps> = ({
  column,
  index,
  renderCard,
  onSelectCard,
  onCreateCard,
  renderHeaderActions,
}) => {
  const [expanded, setExpanded] = useState(column.variant !== 'collapsed');

  const isSubtle = column.variant === 'subtle';
  const isCollapsed = column.variant === 'collapsed';

  // Apply TTL filter
  const visibleRows = column.ttl
    ? column.rows.filter((r) => {
        if (!r.lastUpdated) return true;
        return Date.now() - new Date(r.lastUpdated).getTime() < column.ttl!;
      })
    : column.rows;

  const header = (
    <Box
      onClick={() => isCollapsed && setExpanded((p) => !p)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: isSubtle ? 'rgba(0,0,0,0.04)' : 'secondary.main',
        color: 'white',
        px: 1.5,
        py: 0.75,
        cursor: isCollapsed ? 'pointer' : 'default',
        opacity: isSubtle ? 0.7 : 1,
        transition: 'opacity 0.2s',
        '&:hover': isCollapsed ? { opacity: 0.85 } : {},
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" fontWeight="bold">
          {column.title}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {visibleRows.length}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {renderHeaderActions?.(column)}
        {isCollapsed && (
          <IconButton size="small" sx={{ color: 'white' }}>
            {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        )}
      </Box>
    </Box>
  );

  return (
    <Paper
      sx={{
        mb: 1.5,
        flexShrink: 0,
        opacity: isSubtle ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {header}

      <Collapse in={expanded}>
        <Droppable droppableId={`${index}`} type="LIST">
          {(dropProvided, dropSnapshot) => (
            <Box
              {...dropProvided.droppableProps}
              ref={dropProvided.innerRef}
              sx={{
                p: 1,
                minHeight: visibleRows.length === 0 ? 40 : 'min-content',
                bgcolor: dropSnapshot.isDraggingOver
                  ? 'rgba(144, 202, 249, 0.12)'
                  : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              {visibleRows.length === 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', px: 0.5 }}
                >
                  No tasks
                </Typography>
              )}
              {visibleRows.map((row, rowIndex) => (
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
                        borderRadius: dragSnapshot.isDragging ? '4px' : '0px',
                        boxShadow: dragSnapshot.isDragging
                          ? '0 4px 12px rgba(0,0,0,0.15)'
                          : 'none',
                        border: dragSnapshot.isDragging
                          ? '2px solid lightblue'
                          : '0px solid lightblue',
                      }}
                    >
                      {renderCard?.(row) ?? (
                        <Paper sx={{ p: 1 }}>{row.title}</Paper>
                      )}
                    </Box>
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
              <Button
                size="small"
                sx={{ textTransform: 'none', mt: 0.5 }}
                onClick={() => onCreateCard?.(column.id)}
              >
                Add task
              </Button>
            </Box>
          )}
        </Droppable>
      </Collapse>
    </Paper>
  );
};

// ── Main component ──────────────────────────────────────────────────

export const StackedTaskList: React.FC<StackedTaskListProps> = ({
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
      <Droppable droppableId="board" type="COLUMN" direction="vertical">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              overflow: 'auto',
              px: 1,
              py: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {columns.map((col, index) => (
              <TaskSection
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

export default StackedTaskList;
