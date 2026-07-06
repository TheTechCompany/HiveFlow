// ── TaskDialog — Storybook stories ──────────────────────────────────

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import {
  ChatBubbleOutline,
  History,
  People,
  Send,
} from '@mui/icons-material';
import { TaskDialog } from '../TaskDialog';
import type { TaskData, SidebarTab } from '../types';

// ── Meta ─────────────────────────────────────────────────────────────

const meta: Meta<typeof TaskDialog> = {
  title: 'TaskDialog',
  component: TaskDialog,
  tags: ['autodocs'],
  argTypes: {
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

const mockComments = [
  { id: '1', author: 'Alice', avatar: 'A', text: 'Wireframes look solid. One concern — the skip button is too prominent.', time: '2h ago' },
  { id: '2', author: 'Bob', avatar: 'B', text: "Agreed. Let's make it a text link instead of a button.", time: '1h ago' },
  { id: '3', author: 'Charlie', avatar: 'C', text: 'Added the updated Figma link to the description.', time: '30m ago' },
];

const mockActivity = [
  { id: 'a1', who: 'Alice', what: 'changed status to In Progress', when: '3h ago' },
  { id: 'a2', who: 'Bob', what: 'changed start date to Sep 1', when: '1d ago' },
  { id: 'a3', who: 'Alice', what: 'created this task', when: '2d ago' },
];

const mockPeople = [
  { id: '1', name: 'Alice', avatar: 'A', role: 'Designer' },
  { id: '2', name: 'Bob', avatar: 'B', role: 'Developer' },
  { id: '3', name: 'Charlie', avatar: 'C', role: 'Reviewer' },
  { id: '4', name: 'Diana', avatar: 'D', role: 'PM' },
];

const users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

// ── Sidebar tab factory ──────────────────────────────────────────────

function makeSidebarTabs(): SidebarTab[] {
  const CommentTabContent: React.FC = () => {
    const [comment, setComment] = useState('');
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flex: 1, overflow: 'auto', mb: 1.5 }}>
          {mockComments.map((c) => (
            <Box key={c.id} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.main' }}>
                {c.avatar}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.8rem' }}>
                    {c.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.time}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 0.25, fontSize: '0.8rem' }}>
                  {c.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Write a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && comment.trim()) {
                action('add-comment')(comment);
                setComment('');
              }
            }}
          />
          <IconButton
            size="small"
            color="primary"
            disabled={!comment.trim()}
            onClick={() => {
              action('add-comment')(comment);
              setComment('');
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const ActivityTabContent: React.FC = () => (
    <Box sx={{ p: 2 }}>
      {mockActivity.map((a) => (
        <Box key={a.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
          <History sx={{ fontSize: 14, color: 'text.secondary', mt: 0.25 }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              <strong>{a.who}</strong> {a.what}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {a.when}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );

  const PeopleTabContent: React.FC = () => {
    const [assigned, setAssigned] = useState([mockPeople[0], mockPeople[1]]);
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Assigned
        </Typography>
        {assigned.map((p) => (
          <Box
            key={p.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.75,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{p.avatar}</Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {p.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.role}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setAssigned((prev) => prev.filter((a) => a.id !== p.id))}
              sx={{ color: 'text.secondary' }}
            >
              <Send sx={{ fontSize: 14, transform: 'rotate(180deg)' }} />
            </IconButton>
          </Box>
        ))}
      </Box>
    );
  };

  return [
    {
      key: 'comments',
      label: 'Comments',
      icon: <ChatBubbleOutline fontSize="small" />,
      content: <CommentTabContent />,
      badge: mockComments.length,
    },
    {
      key: 'activity',
      label: 'Activity',
      icon: <History fontSize="small" />,
      content: <ActivityTabContent />,
    },
    {
      key: 'people',
      label: 'People',
      icon: <People fontSize="small" />,
      content: <PeopleTabContent />,
      badge: 2,
    },
  ];
}

// ── Wrapper that manages open/close for interactive stories ──────────

const DialogWrapper: React.FC<{
  children: (open: boolean, setOpen: (v: boolean) => void) => React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(true);
  return <>{children(open, setOpen)}</>;
};

// ── Stories ──────────────────────────────────────────────────────────

/**
 * **Create.**  Empty dialog for creating a new task.  The title field is
 * auto-focused and the Save button is immediately visible so the user can
 * start typing and hit Enter or click Create.
 */
export const Create: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <TaskDialog
          open={open}
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
 * **View / Edit (click-to-edit).**  Populated task in the default
 * click-to-edit posture.  Hover any field to reveal an edit icon; click
 * to edit just that field.  The Save button appears once anything changes.
 */
export const ViewEdit: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <TaskDialog
          open={open}
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
 * **With expandable sidebar.**  The header has a "Sidebar (3)" toggle.
 * Click it to widen the dialog and reveal Comments, Activity, and People
 * tabs in a right panel.
 */
export const WithSidebar: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <TaskDialog
          open={open}
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
          sidebar={makeSidebarTabs()}
        />
      )}
    </DialogWrapper>
  ),
};

/**
 * **With extra fields (slots).**  Demonstrates all render slots:
 * `headerPrefix` (parent breadcrumb), `renderHeaderActions` (member chips),
 * `renderExtraFields` (project selector + skills), `renderSubtasks`, and
 * `renderDependencies`.  Each section manages its own click-to-edit state
 * internally — the TaskDialog is just the shell.
 */
export const WithExtraFields: Story = {
  render: () => {
    const projects = [
      { id: 'hive', displayId: 'HF-101', name: 'HiveFlow Core' },
      { id: 'uv', displayId: 'UV-202', name: 'Ultraviolet Platform' },
    ];

    return (
      <DialogWrapper>
        {(open, setOpen) => (
          <TaskDialog
            open={open}
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
            // ── Parent breadcrumb ──────────────────────────
            headerPrefix={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
                >
                  HF-101 — HiveFlow Core
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ›
                </Typography>
              </Box>
            }
            // ── Header actions: member avatars ─────────────
            renderHeaderActions={() => (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {users.map((u) => (
                  <Chip
                    key={u.id}
                    avatar={
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {u.name[0]}
                      </Avatar>
                    }
                    label={u.name}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
            // ── Extra fields: project + skills ─────────────
            renderExtraFields={(activeField) => (
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

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Project
                  </Typography>
                  <Autocomplete
                    size="small"
                    options={projects}
                    getOptionLabel={(p) => `${p.displayId} — ${p.name}`}
                    defaultValue={projects[0]}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </Box>

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
            // ── Subtasks ───────────────────────────────────
            renderSubtasks={() => (
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1.5,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Subtasks
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Chip label="Wireframe v1" size="small" variant="outlined" />
                  <Chip label="Copy review" size="small" variant="outlined" />
                  <Chip label="A/B test plan" size="small" variant="outlined" />
                </Box>
              </Box>
            )}
            // ── Dependencies ───────────────────────────────
            renderDependencies={() => (
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1.5,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Dependencies
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  <Chip label="Needs: Brand guidelines" size="small" />
                  <Chip label="Needed by: Landing page" size="small" color="primary" variant="outlined" />
                </Box>
              </Box>
            )}
          />
        )}
      </DialogWrapper>
    );
  },
};
