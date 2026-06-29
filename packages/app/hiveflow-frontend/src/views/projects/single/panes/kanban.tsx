import React, { useContext, useMemo } from "react";
import { CheckBoxOutlined, Subject } from '@mui/icons-material';
import { AvatarList } from "@hexhive/ui";
import { Box, Paper, Typography } from '@mui/material';
import { KanbanBoard } from "../../../../components/KanbanBoard";
import { KANBAN_STATUSES } from "../../../../types/kanban";
import type { KanbanColumn, KanbanRow } from "../../../../types/kanban";
import type { DropResult } from "react-beautiful-dnd";
import { ProjectSingleContext } from "../context";
import { extractChecklistFromHtml } from '@hive-flow/ui';

export const KanbanPane: React.FC = () => {
  const {
    tasks = [],
    updateTaskStatus,
    createTask,
    finishTtl,
    updateTask,
  } = useContext(ProjectSingleContext);

  // ── Derived columns ────────────────────────────────────────────

  const columns: KanbanColumn[] = useMemo(
    () =>
      KANBAN_STATUSES.map((status) => {
        const rows: KanbanRow[] = (tasks ?? [])
          .filter((t) => t.status === status)
          .sort((a, b) =>
            (a.columnRank ?? '').localeCompare(b.columnRank ?? ''),
          )
          .map((t) => ({
            id: t.id,
            title: t.title ?? t.name,
            _task: t,
            lastUpdated: t.lastUpdated ? new Date(t.lastUpdated) : undefined,
          }));
        return {
          id: status,
          title: status,
          rows,
          ttl: status === 'Finished' ? finishTtl : undefined,
        };
      }),
    [tasks, finishTtl],
  );

  // ── Handlers ───────────────────────────────────────────────────

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus =
      KANBAN_STATUSES[parseInt(result.destination.droppableId, 10)];
    if (!newStatus || newStatus === result.source?.droppableId) return;

    updateTaskStatus?.(
      result.draggableId,
      result.destination.index,
      newStatus,
    );
  };

  const handleSelectCard = (row: KanbanRow) => {
    const card = row._task;
    updateTask?.({
      ...card,
      start: card.startDate ? new Date(card.startDate) : undefined,
      end: card.endDate ? new Date(card.endDate) : undefined,
    });
  };

  const handleCreateCard = (columnId: string) => {
    createTask?.({
      status: columnId,
      start: new Date(),
      end: new Date(),
    });
  };

  // ── Render ─────────────────────────────────────────────────────

  return (
    <Box sx={{ flex: 1, display: 'flex', bgcolor: 'background.default' }}>
      <KanbanBoard
        columns={columns}
        onDragEnd={handleDragEnd}
        onSelectCard={handleSelectCard}
        onCreateCard={handleCreateCard}
        renderCard={(row) => (
          <Paper
            sx={{
              bgcolor: 'background.paper',
              minHeight: '24px',
              flexDirection: 'column',
              display: 'flex',
              padding: '6px',
              boxShadow: 1,
            }}
          >
            <Typography variant="body2">{row.title}</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: '4px',
              }}
            >
              <Box>
                {(() => {
                  const checklist = extractChecklistFromHtml(row._task.description);
                  if (checklist.length > 0) {
                    const done = checklist.filter(i => i.checked).length;
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <CheckBoxOutlined sx={{ fontSize: 13 }} />
                        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                          {done}/{checklist.length}
                        </Typography>
                      </Box>
                    );
                  }
                  if ((row._task.description?.length ?? 0) > 0) {
                    return <Subject fontSize="small" />;
                  }
                  return null;
                })()}
              </Box>
              <AvatarList size={20} users={row._task.members ?? []} />
            </Box>
          </Paper>
        )}
      />
    </Box>
  );
};
