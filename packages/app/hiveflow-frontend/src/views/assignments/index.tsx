import React, { useState, useMemo, useCallback } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Alert,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import {
  CheckBoxOutlined,
  Subject,
  TableChart,
  Timeline,
  Dashboard,
  AccountTree,
} from '@mui/icons-material';
import { AvatarList } from '@hexhive/ui';
import {
  HorizontalKanban,
  TableView,
  TimelineView,
} from '../../components/TaskViews';
import { useAssignments } from '../../hooks/use-assignments';
import { TaskModal } from '../../modals/new-task';
import { HandoverModal } from '../../components/HandoverModal';
import { extractChecklistFromHtml } from '@hive-flow/ui';
import type {
  KanbanTask,
  KanbanRow,
  TaskFilterOption,
} from '../../types/kanban';

// ── View switcher types ─────────────────────────────────────────────

type TaskViewMode = 'horizontal' | 'table' | 'timeline';

const VIEW_OPTIONS: Array<{
  value: TaskViewMode;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: 'horizontal', label: 'Kanban', icon: <Dashboard fontSize="small" /> },
  { value: 'table', label: 'Table', icon: <TableChart fontSize="small" /> },
  { value: 'timeline', label: 'Timeline', icon: <Timeline fontSize="small" /> },
];

// ── Helpers ─────────────────────────────────────────────────────────

type GroupByMode = 'none' | 'project';

function taskToSelected(task: KanbanTask) {
  return {
    ...task,
    start: task.startDate ? new Date(task.startDate) : undefined,
    end: task.endDate ? new Date(task.endDate) : undefined,
  };
}

/** Returns true if the HTML string contains visible text (not just empty tags or whitespace). */
function hasVisibleContent(html: string | null | undefined): boolean {
  if (!html) return false;
  // Strip HTML tags and trim whitespace
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > 0;
}

// ── Render-card sub-component ───────────────────────────────────────

const TaskCard: React.FC<{ row: KanbanRow }> = ({ row }) => {
  const t = row._task;
  const src = t.project ?? t.estimate;
  return (
    <Paper
      sx={{
        bgcolor: 'background.paper',
        minHeight: '24px',
        flexDirection: 'column',
        display: 'flex',
        boxShadow: 1,
      }}
    >
      {src && (
        <Box sx={{ bgcolor: 'secondary.main', padding: '6px' }}>
          <Typography variant="caption" sx={{ color: 'white' }}>
            {src.displayId} - {src.name}
          </Typography>
        </Box>
      )}
      <Box sx={{ padding: '6px' }}>
        <Typography variant="body2">{t.title}</Typography>
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
              const checklist = extractChecklistFromHtml(t.description);
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
              if (hasVisibleContent(t.description)) {
                return <Subject fontSize="small" />;
              }
              return null;
            })()}
          </Box>
          <AvatarList size={20} users={t.members ?? []} />
        </Box>
      </Box>
    </Paper>
  );
};

// ── Main view ───────────────────────────────────────────────────────

export const Assignments: React.FC = () => {
  const {
    loading,
    error,
    users,
    taskFilters,
    buildColumns,
    onDrag,
    updateTask,
    deleteProjectTask,
    deleteEstimateTask,
    refetch,
    pendingHandover,
    submitHandover,
    cancelHandover,
    startNextTask,
  } = useAssignments();

  // ── Local UI state ─────────────────────────────────────────────

  const [filter, setFilter] = useState<TaskFilterOption[]>([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [viewMode, setViewMode] = useState<TaskViewMode>('horizontal');
  const [groupBy, setGroupBy] = useState<GroupByMode>('none');

  // ── Derived columns ────────────────────────────────────────────

  const columns = useMemo(() => buildColumns(filter, groupBy), [buildColumns, filter, groupBy]);

  // ── Handlers ───────────────────────────────────────────────────

  const taskType = selectedTask?.project
    ? 'project'
    : selectedTask?.estimate
      ? 'estimate'
      : undefined;

  const handleAutoSaveDescription = useCallback(
    (html: string) => {
      if (!selectedTask || !taskType) return;
      updateTask(selectedTask.id, { description: html }, taskType);
    },
    [selectedTask, taskType, updateTask],
  );

  const handleSelectCard = useCallback((row: KanbanRow) => {
    setSelectedTask(row._task);
    setTaskModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setTaskModalOpen(false);
    setSelectedTask(null);
  }, []);

  const handleDeleteTask = useCallback(async () => {
    if (!selectedTask) return;
    try {
      if (selectedTask.project) {
        await deleteProjectTask(selectedTask.id);
      } else if (selectedTask.estimate) {
        await deleteEstimateTask(selectedTask.id);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      return;
    }
    refetch();
    handleCloseModal();
  }, [selectedTask, deleteProjectTask, deleteEstimateTask, refetch, handleCloseModal]);

  const handleSubmitTask = useCallback(
    async (task: Record<string, unknown>) => {
      if (!task.id || !selectedTask || !taskType) return;
      await updateTask(
        selectedTask.id,
        {
          title: task.title,
          description: task.description,
          startDate: task.startDate,
          endDate: task.endDate,
          status: task.status,
        },
        taskType,
      );
      refetch();
      handleCloseModal();
    },
    [selectedTask, taskType, updateTask, refetch, handleCloseModal],
  );

  // ── Render states ──────────────────────────────────────────────

  if (loading) {
    return (
      <Paper
        sx={{
          flex: 1,
          bgcolor: 'secondary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ flex: 1, p: 2 }}>
        <Alert severity="error">
          Failed to load assignments: {error.message}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        flex: 1,
        bgcolor: 'secondary.main',
        flexDirection: 'column',
        display: 'flex',
      }}
    >
      {/* ── Task edit modal ──────────────────────────────────── */}
      <TaskModal
        users={users}
        open={taskModalOpen}
        selected={selectedTask ? taskToSelected(selectedTask) : null}
        onClose={handleCloseModal}
        onDelete={handleDeleteTask}
        onSubmit={handleSubmitTask}
        onAutoSaveDescription={handleAutoSaveDescription}
      />

      {/* ── Handover modal ───────────────────────────────────── */}
      <HandoverModal
        open={!!pendingHandover}
        task={pendingHandover}
        onSubmit={submitHandover}
        onCancel={cancelHandover}
      />

      {/* ── Header ───────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            sx={{ color: 'navigation.main', padding: '6px' }}
            fontWeight="bold"
          >
            Assigned tasks
          </Typography>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            size="small"
            onChange={(_ev, val) => val && setViewMode(val)}
            sx={{
              '& .MuiToggleButton-root': {
                color: 'text.secondary',
                borderColor: 'rgba(255,255,255,0.12)',
                textTransform: 'none',
                px: 1.25,
                py: 0.25,
                fontSize: '0.7rem',
                '&.Mui-selected': {
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.12)',
                },
              },
            }}
          >
            {VIEW_OPTIONS.map((opt) => (
              <Tooltip key={opt.value} title={opt.label}>
                <ToggleButton value={opt.value}>
                  {opt.icon}
                </ToggleButton>
              </Tooltip>
            ))}
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={groupBy}
            exclusive
            size="small"
            onChange={(_ev, val) => val !== null && setGroupBy(val)}
            sx={{
              '& .MuiToggleButton-root': {
                color: 'text.secondary',
                borderColor: 'rgba(255,255,255,0.12)',
                textTransform: 'none',
                px: 1.25,
                py: 0.25,
                fontSize: '0.7rem',
                '&.Mui-selected': {
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.12)',
                },
              },
            }}
          >
            <Tooltip title="Group by project">
              <ToggleButton value="project">
                <AccountTree fontSize="small" />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Box>

        <Autocomplete
          multiple
          sx={{ minWidth: '200px', padding: '6px' }}
          value={filter}
          onChange={(_ev, values) => setFilter(values)}
          getOptionLabel={(opt) => `${opt.displayId} - ${opt.name}`}
          options={taskFilters}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Filter" />
          )}
        />
      </Box>

      {/* ── Task list area ────────────────────────────────────── */}
      <Box sx={{ bgcolor: 'background.default', display: 'flex', flex: 1, overflow: 'hidden' }}>
        {columns.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography>No tasks assigned</Typography>
          </Box>
        ) : viewMode === 'horizontal' ? (
          <HorizontalKanban
            columns={columns}
            renderCard={(row) => <TaskCard row={row} />}
            onDragEnd={onDrag}
            onSelectCard={handleSelectCard}
            renderHeaderActions={(col) =>
              col.id === 'In Progress' ? (
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    py: 0.25,
                    px: 1,
                    minWidth: 0,
                  }}
                  onClick={startNextTask}
                >
                  Start next task
                </Button>
              ) : null
            }
          />
        ) : viewMode === 'table' ? (
          <TableView
            columns={columns}
            onSelectCard={handleSelectCard}
          />
        ) : viewMode === 'timeline' ? (
          <TimelineView
            columns={columns}
            onSelectCard={handleSelectCard}
            updateTask={updateTask}
            refetch={refetch}
          />
        ) : null}
      </Box>
    </Paper>
  );
};

export default Assignments;
