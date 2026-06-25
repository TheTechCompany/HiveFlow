import React, { useCallback } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DragStart,
  type DragUpdate,
  type DropResult,
} from 'react-beautiful-dnd';
import { Box, Paper, Typography, Divider, Button } from '@mui/material';
import type { KanbanColumn, KanbanRow } from '../../types/kanban';
import { useAutoScroll } from '../../hooks/use-auto-scroll';

// ── Types ───────────────────────────────────────────────────────────

export interface KanbanBoardProps {
  /** Column definitions (including rows) */
  columns: KanbanColumn[];
  /** Render a single card. Receives the KanbanRow. */
  renderCard?: (row: KanbanRow) => React.ReactNode;
  /** Fired when a drag ends (card dropped). */
  onDragEnd?: (result: DropResult) => void;
  /** Fired when a card is clicked. */
  onSelectCard?: (row: KanbanRow) => void;
  /** Fired when "Add task" is clicked inside a column. */
  onCreateCard?: (columnId: string) => void;
  /** Optionally override the board container height. */
  containerHeight?: number;
  /** Callback to register a column's scroll element for auto-scroll */
  registerColumn?: (index: number, el: HTMLElement | null) => void;
}

// ── Sub-components ──────────────────────────────────────────────────

interface KanbanListProps {
  droppableId: string;
  rows: KanbanRow[];
  renderCard?: (row: KanbanRow) => React.ReactNode;
  onCreateCard?: () => void;
  onSelectCard?: (row: KanbanRow) => void;
}

const KanbanList: React.FC<KanbanListProps> = ({
  droppableId,
  rows,
  renderCard,
  onCreateCard,
  onSelectCard,
}) => (
  <Droppable droppableId={droppableId} type="LIST">
    {(dropProvided, dropSnapshot) => (
      <Box
        {...dropProvided.droppableProps}
        ref={dropProvided.innerRef}
        sx={{
          display: 'flex',
          minHeight: 'min-content',
          pt: '6px',
          pb: '6px',
          flexDirection: 'column',
          flex: 1,
          bgcolor: dropSnapshot.isDraggingOver ? 'rgba(144, 202, 249, 0.16)' : 'transparent',
          transition: 'background-color 0.2s ease',
        }}
      >
        {rows.map((row, index) => (
          <Draggable key={row.id} draggableId={row.id} index={index}>
            {(dragProvided, dragSnapshot) => (
              <Box
                onClick={() => onSelectCard?.(row)}
                sx={{
                  border: `${dragSnapshot.isDragging ? '2px' : '0px'} solid lightblue`,
                  borderRadius: dragSnapshot.isDragging ? '4px' : '0px',
                  mb: '4px',
                  opacity: dragSnapshot.isDragging ? 0.85 : 1,
                  boxShadow: dragSnapshot.isDragging
                    ? '0 4px 12px rgba(0,0,0,0.15)'
                    : 'none',
                }}
                ref={dragProvided.innerRef}
                {...dragProvided.draggableProps}
                {...dragProvided.dragHandleProps}
              >
                {renderCard?.(row) ?? <Paper sx={{ p: '6px' }}>{row.title}</Paper>}
              </Box>
            )}
          </Draggable>
        ))}
        {dropProvided.placeholder}
        <Button
          size="small"
          sx={{ textTransform: 'none', mt: '4px' }}
          onClick={onCreateCard}
        >
          Add task
        </Button>
      </Box>
    )}
  </Droppable>
);

interface KanbanColumnViewProps {
  column: KanbanColumn;
  index: number;
  renderCard?: (row: KanbanRow) => React.ReactNode;
  onCreateCard?: (columnId: string) => void;
  onSelectCard?: (row: KanbanRow) => void;
  registerColumn?: (index: number, el: HTMLElement | null) => void;
}

const KanbanColumnView: React.FC<KanbanColumnViewProps> = ({
  column,
  index,
  renderCard,
  onCreateCard,
  onSelectCard,
  registerColumn,
}) => {
  // Apply TTL filter if set
  const visibleRows = column.ttl
    ? column.rows.filter((r) => {
        if (!r.lastUpdated) return true;
        return Date.now() - new Date(r.lastUpdated).getTime() < column.ttl!;
      })
    : column.rows;

  return (
    <Paper
      sx={{
        mr: '6px',
        flexDirection: 'column',
        width: '300px',
        display: 'flex',
        flexShrink: 0,
      }}
    >
      {/* Column header */}
      <Box
        sx={{
          color: 'white',
          bgcolor: 'secondary.main',
          padding: '3px 6px',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid black',
          flexDirection: 'row',
          display: 'flex',
        }}
      >
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            {column.title}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {visibleRows.length}
        </Typography>
      </Box>
      <Divider />

      {/* Scrollable card list */}
      <Box
        ref={(el: HTMLDivElement | null) => registerColumn?.(index, el)}
        sx={{
          padding: '6px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          minHeight: 0,
        }}
        className="kanban-column-scroll"
      >
        <KanbanList
          droppableId={`${index}`}
          rows={visibleRows}
          renderCard={renderCard}
          onCreateCard={() => onCreateCard?.(column.id)}
          onSelectCard={onSelectCard}
        />
      </Box>
    </Paper>
  );
};

// ── Main KanbanBoard ────────────────────────────────────────────────

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  renderCard,
  onDragEnd,
  onSelectCard,
  onCreateCard,
  containerHeight,
}) => {
  const {
    registerColumn,
    onDragStart,
    onDragUpdate,
    onDragEnd: autoScrollDragEnd,
  } = useAutoScroll();

  const handleDragStart = useCallback(
    (start: DragStart) => {
      onDragStart();
    },
    [onDragStart],
  );

  const handleDragUpdate = useCallback(
    (update: DragUpdate) => {
      onDragUpdate(update);
    },
    [onDragUpdate],
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      autoScrollDragEnd();
      onDragEnd?.(result);
    },
    [autoScrollDragEnd, onDragEnd],
  );

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
      >
        {(provided) => (
          <Box
            sx={{
              padding: '6px',
              flexDirection: 'row',
              display: 'flex',
              flex: 1,
              overflow: 'auto',
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns.map((col, index) => (
              <KanbanColumnView
                key={col.id}
                column={col}
                index={index}
                renderCard={renderCard}
                onCreateCard={onCreateCard}
                onSelectCard={onSelectCard}
                registerColumn={registerColumn}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
