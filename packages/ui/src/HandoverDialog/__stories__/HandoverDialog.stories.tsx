// ── HandoverDialog — Storybook stories ──────────────────────────────

import React, { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { HandoverDialog } from '../HandoverDialog';
import type {
  HandoverProject,
  HandoverTask,
  HandoverPerson,
  HandoverAssignment,
  HandoverComment,
} from '../types';

// ── Meta ─────────────────────────────────────────────────────────────

const meta: Meta<typeof HandoverDialog> = {
  title: 'HandoverDialog',
  component: HandoverDialog,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    date: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof HandoverDialog>;

// ── Mock data ────────────────────────────────────────────────────────

const mockProjects: HandoverProject[] = [
  { id: 'hf-101', displayId: 'HF-101', name: 'HiveFlow Core' },
  { id: 'uv-202', displayId: 'UV-202', name: 'Ultraviolet Platform' },
  { id: 'hf-303', displayId: 'HF-303', name: 'Customer Portal Redesign' },
];

const allAvailableTasks: Record<string, HandoverTask[]> = {
  'hf-101': [
    { id: 't1', title: 'Design the new onboarding flow', description: 'Redesign the first-run experience for new users.', status: 'In Progress', startDate: '2026-06-01', endDate: '2026-07-15' },
    { id: 't2', title: 'Fix pagination bug in task list', description: 'Pages beyond 50 fail to load on production.', status: 'Reviewing', startDate: '2026-06-20', endDate: '2026-07-02' },
    { id: 't3', title: 'Update API documentation', status: 'Backlog' },
    { id: 't4', title: 'Migrate auth to OAuth 2.1', description: 'Replace the custom token flow with standard OAuth.', status: 'Backlog', startDate: '2026-08-01', endDate: '2026-08-20' },
    { id: 't5', title: 'Deploy v2.4 to staging', status: 'Finished', startDate: '2026-06-25', endDate: '2026-06-26' },
  ],
  'uv-202': [
    { id: 'u1', title: 'Build CI pipeline for microservices', status: 'In Progress' },
    { id: 'u2', title: 'Write integration tests for billing', description: 'Cover subscription lifecycle: create, upgrade, cancel.', status: 'Backlog' },
  ],
  'hf-303': [
    { id: 'c1', title: 'Wireframe the dashboard v2', status: 'In Progress', startDate: '2026-07-01', endDate: '2026-07-10' },
    { id: 'c2', title: 'User research sessions', description: 'Schedule and run 8 customer interviews.', status: 'Backlog' },
    { id: 'c3', title: 'Accessibility audit', status: 'Reviewing', startDate: '2026-06-15', endDate: '2026-07-05' },
  ],
};

const mockPeople: HandoverPerson[] = [
  { id: 'alice', name: 'Alice Chen' },
  { id: 'bob', name: 'Bob Martinez' },
  { id: 'charlie', name: 'Charlie Nguyen' },
  { id: 'diana', name: 'Diana Park' },
  { id: 'eric', name: 'Eric Johansson' },
  { id: 'fatima', name: 'Fatima Al-Rashid' },
];

const preselectedTasks = allAvailableTasks['hf-101'].slice(0, 3);

const mockAssignments: HandoverAssignment[] = [
  { taskId: 't1', personIds: ['alice', 'bob'] },
  { taskId: 't2', personIds: ['charlie'] },
  { taskId: 't5', personIds: ['diana'] },
];

const mockManagers: HandoverPerson[] = [
  { id: 'alice', name: 'Alice Chen' },
  { id: 'diana', name: 'Diana Park' },
];

const mockAdditional: HandoverPerson[] = [
  { id: 'eric', name: 'Eric Johansson' },
];

const mockComments: HandoverComment[] = [
  { id: 'c1', message: 'Morning shift handover — Alice covering Diana\'s tasks while she is on leave.', userName: 'Alice Chen', createdAt: '09:30am 06/07' },
  { id: 'c2', message: 'Noted. I\'ve updated the task list for tomorrow.', userName: 'Bob Martinez', createdAt: '10:15am 06/07' },
];

// ── Dialog wrapper ───────────────────────────────────────────────────

const DialogWrapper: React.FC<{
  children: (open: boolean, setOpen: (v: boolean) => void) => React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(true);
  return <>{children(open, setOpen)}</>;
};

// ── Shared action props ──────────────────────────────────────────────

const actionProps = {
  onProjectChange: action('project-change'),
  onStartDateChange: action('start-date-change'),
  onEndDateChange: action('end-date-change'),
  onTasksChange: action('tasks-change'),
  onAssignmentChange: action('assignment-change'),
  onManagersChange: action('managers-change'),
  onExtraPeopleChange: action('extra-people-change'),
  onAddComment: action('add-comment'),
  onDeleteComment: action('delete-comment'),
  onExportPdf: action('export-pdf'),
  onSubmit: action('submit'),
};

const emptyDefaults = {
  assignments: [] as HandoverAssignment[],
  managers: [] as HandoverPerson[],
  extraPeople: [] as HandoverPerson[],
  comments: [] as HandoverComment[],
};

// ── Stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <HandoverDialog
          open={open}
          onClose={() => setOpen(false)}
          date="06/07/2026"
          projects={mockProjects}
          selectedProjectId={undefined}
          startDate="2026-07-06"
          endDate="2026-07-10"
          availableTasks={[]}
          selectedTasks={[]}
          people={mockPeople}
          {...emptyDefaults}
          {...actionProps}
        />
      )}
    </DialogWrapper>
  ),
};

export const WithProject: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <HandoverDialog
          open={open}
          onClose={() => setOpen(false)}
          date="06/07/2026"
          projects={mockProjects}
          selectedProjectId="hf-101"
          startDate="2026-07-06"
          endDate="2026-07-10"
          availableTasks={allAvailableTasks['hf-101']}
          selectedTasks={[]}
          people={mockPeople}
          {...emptyDefaults}
          {...actionProps}
        />
      )}
    </DialogWrapper>
  ),
};

export const TasksSelected: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <HandoverDialog
          open={open}
          onClose={() => setOpen(false)}
          date="06/07/2026"
          projects={mockProjects}
          selectedProjectId="hf-101"
          startDate="2026-07-06"
          endDate="2026-07-10"
          availableTasks={allAvailableTasks['hf-101']}
          selectedTasks={preselectedTasks}
          people={mockPeople}
          {...emptyDefaults}
          {...actionProps}
        />
      )}
    </DialogWrapper>
  ),
};

export const FullyPopulated: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <HandoverDialog
          open={open}
          onClose={() => setOpen(false)}
          handoverId="existing-1"
          date="06/07/2026"
          projects={mockProjects}
          selectedProjectId="hf-101"
          startDate="2026-07-06"
          endDate="2026-07-10"
          availableTasks={allAvailableTasks['hf-101']}
          selectedTasks={preselectedTasks}
          people={mockPeople}
          assignments={mockAssignments}
          managers={mockManagers}
          extraPeople={mockAdditional}
          comments={mockComments}
          {...actionProps}
        />
      )}
    </DialogWrapper>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [projectId, setProjectId] = useState<string | undefined>('hf-101');
    const [startDate, setStartDate] = useState('2026-07-06');
    const [endDate, setEndDate] = useState('2026-07-10');
    const [selectedTasks, setSelectedTasks] = useState<HandoverTask[]>(preselectedTasks);
    const [assignments, setAssignments] = useState<HandoverAssignment[]>(mockAssignments);
    const [managers, setManagers] = useState<HandoverPerson[]>(mockManagers);
    const [extraPeople, setExtraPeople] = useState<HandoverPerson[]>(mockAdditional);
    const [comments, setComments] = useState<HandoverComment[]>(mockComments);

    const handleAssignmentChange = useCallback((a: HandoverAssignment) => {
      action('assignment-change')(a);
      setAssignments((prev) => {
        const rest = prev.filter((x) => x.taskId !== a.taskId);
        return [...rest, a];
      });
    }, []);

    return (
      <DialogWrapper>
        {(open, setOpen) => (
          <HandoverDialog
            open={open}
            onClose={() => setOpen(false)}
            handoverId="interactive-1"
            date="06/07/2026"
            projects={mockProjects}
            selectedProjectId={projectId}
            onProjectChange={(id) => {
              action('project-change')(id);
              setProjectId(id);
              setSelectedTasks([]);
              setAssignments([]);
            }}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(v) => { action('start-date-change')(v); setStartDate(v); }}
            onEndDateChange={(v) => { action('end-date-change')(v); setEndDate(v); }}
            availableTasks={projectId ? allAvailableTasks[projectId] ?? [] : []}
            selectedTasks={selectedTasks}
            onTasksChange={(tasks) => {
              action('tasks-change')(tasks);
              setSelectedTasks(tasks);
              const keepIds = new Set(tasks.map((t) => t.id));
              setAssignments((prev) => prev.filter((a) => keepIds.has(a.taskId)));
            }}
            people={mockPeople}
            assignments={assignments}
            onAssignmentChange={handleAssignmentChange}
            managers={managers}
            onManagersChange={(m) => { action('managers-change')(m); setManagers(m); }}
            extraPeople={extraPeople}
            onExtraPeopleChange={(p) => { action('extra-people-change')(p); setExtraPeople(p); }}
            comments={comments}
            onAddComment={(message) => {
              action('add-comment')(message);
              const newComment: HandoverComment = {
                id: `c${Date.now()}`,
                message,
                userName: 'You',
                createdAt: new Date().toLocaleString(),
              };
              setComments((prev) => [...prev, newComment]);
            }}
            onDeleteComment={(commentId) => {
              action('delete-comment')(commentId);
              setComments((prev) => prev.filter((c) => c.id !== commentId));
            }}
            onExportPdf={action('export-pdf')}
            onSubmit={action('submit')}
          />
        )}
      </DialogWrapper>
    );
  },
};

export const EmptyProject: Story = {
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <HandoverDialog
          open={open}
          onClose={() => setOpen(false)}
          date="06/07/2026"
          projects={mockProjects}
          selectedProjectId="hf-303"
          startDate="2026-07-06"
          endDate="2026-07-10"
          availableTasks={[]}
          selectedTasks={[]}
          people={mockPeople}
          {...emptyDefaults}
          {...actionProps}
        />
      )}
    </DialogWrapper>
  ),
};
