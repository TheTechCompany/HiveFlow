// ── TaskDialog — Storybook stories ──────────────────────────────────

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  Autocomplete,
  TextField,
  Chip,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import { TaskDialog } from '../TaskDialog';
import type { TaskData } from '../types';

// ── Meta ─────────────────────────────────────────────────────────────

const meta: Meta<typeof TaskDialog> = {
  title: 'TaskDialog',
  component: TaskDialog,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['create', 'edit', 'view'],
    },
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TaskDialog>;

// ── Shared mock data ─────────────────────────────────────────────────

const populatedTask: TaskData = {
  title: 'Design the new onboarding flow',
  description: `
<h2>Overview</h2>
<p>Redesign the first-run experience for new users.  Focus on:</p>
<ul>
  <li>Fewer steps — target ≤ 3 screens</li>
  <li>Social login (Google / GitHub)</li>
  <li>Skip-to-dashboard escape hatch</li>
</ul>
<p>Wireframes are in <strong>Figma → Onboarding v3</strong>.</p>
  `.trim(),
  status: 'In Progress',
  startDate: '2025-09-01',
  endDate: '2025-09-15',
};

// ── Wrapper that manages open/close for interactive stories ──────────

const DialogWrapper: React.FC<{
  children: (open: boolean, setOpen: (v: boolean) => void) => React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(true);
  return <>{children(open, setOpen)}</>;
};

// ── Stories ──────────────────────────────────────────────────────────

/**
 * **Example 1 — Create.**  Blank dialog for creating a new task.
 * The user fills in title, description, status, and dates then hits
 * "Create".  Suitable for a "+ New Task" button in any project or
 * estimate view.
 */
export const Create: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <TaskDialog
          open={open}
          mode="create"
          onClose={() => setOpen(false)}
          onSubmit={async (task) => {
            action('create-task')(task);
            setOpen(false);
          }}
        />
      )}
    </DialogWrapper>
  ),
};

/**
 * **Example 2 — View.**  Read-only detail view of an existing task.
 * Title, rich-text description, status chip, and date range are
 * displayed.  A pencil icon lets the user switch to edit mode.
 * Use this when clicking a task row in a Gantt chart or timeline.
 */
export const View: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <TaskDialog
          open={open}
          mode="view"
          task={populatedTask}
          onClose={() => setOpen(false)}
        />
      )}
    </DialogWrapper>
  ),
};

/**
 * **Example 3 — Edit.**  Pre-filled dialog for updating a task.
 * The delete button is shown because `onDelete` is provided.
 * Use this after clicking "Edit" on a task detail page or from a
 * right-click context menu on a timeline bar.
 */
export const Edit: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <TaskDialog
          open={open}
          mode="edit"
          task={populatedTask}
          onClose={() => setOpen(false)}
          onSubmit={async (task) => {
            action('update-task')(task);
            setOpen(false);
          }}
          onDelete={async () => {
            action('delete-task')();
            setOpen(false);
          }}
        />
      )}
    </DialogWrapper>
  ),
};

/**
 * **Example 4 — With extra fields (slots).**  Demonstrates
 * `renderHeaderActions` (member chips) and `renderExtraFields`
 * (project selector + skills summary).  Use this pattern when the
 * host app needs to inject domain-specific fields — e.g. estimating
 * hours, linking to equipment, or selecting a recurring template —
 * without the base TaskDialog knowing about them.
 */
export const WithExtraFields: Story = {
  render: () => {
    const projects = [
      { id: 'hive', displayId: 'HF-101', name: 'HiveFlow Core' },
      { id: 'uv', displayId: 'UV-202', name: 'Ultraviolet Platform' },
    ];

    const users = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
    ];

    return (
      <DialogWrapper>
        {(open, setOpen) => (
          <TaskDialog
            open={open}
            mode="edit"
            task={populatedTask}
            onClose={() => setOpen(false)}
            onSubmit={async (task) => {
              action('update-task-with-extras')(task);
              setOpen(false);
            }}
            onDelete={async () => {
              action('delete-task')();
              setOpen(false);
            }}
            // ── Header actions: member avatars ─────────────────
            renderHeaderActions={() => (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {users.slice(0, 3).map((u) => (
                  <Chip
                    key={u.id}
                    avatar={<Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{u.name[0]}</Avatar>}
                    label={u.name}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
            // ── Extra fields: project + skills ──────────────────
            renderExtraFields={(editing) => (
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                <Typography variant="subtitle2">Extra fields</Typography>

                {/* Project selector */}
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Project
                  </Typography>
                  {editing ? (
                    <Autocomplete
                      size="small"
                      options={projects}
                      getOptionLabel={(p) => `${p.displayId} — ${p.name}`}
                      defaultValue={projects[0]}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  ) : (
                    <Typography variant="body2">
                      {projects[0].displayId} — {projects[0].name}
                    </Typography>
                  )}
                </Box>

                {/* Skills */}
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Required Skills
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.25 }}>
                    <Chip label="React" size="small" color="primary" variant="outlined" />
                    <Chip label="TypeScript" size="small" color="primary" variant="outlined" />
                    <Chip label="Figma" size="small" variant="outlined" />
                  </Box>
                </Box>
              </Box>
            )}
          />
        )}
      </DialogWrapper>
    );
  },
};
