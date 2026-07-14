// ── TaskDialog — Tests ───────────────────────────────────────────────

import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaskDialog } from '../TaskDialog';
import type { TaskData } from '../types';

// ── Mocks ────────────────────────────────────────────────────────────

jest.mock('../../RichTextEditor', () => ({
  RichTextEditor: ({ value, editable, onChange }: any) => (
    <div data-testid="rich-text-editor" data-editable={editable}>
      {editable ? (
        <textarea
          aria-label="Description"
          value={value}
          onChange={(e: any) => onChange?.(e.target.value)}
        />
      ) : (
        value
      )}
    </div>
  ),
}));

// ── Helpers ──────────────────────────────────────────────────────────

const noop = () => {};

function renderDialog(task?: TaskData, overrides: Record<string, unknown> = {}) {
  return render(
    <TaskDialog open onClose={noop} task={task} {...overrides} />,
  );
}

// ── Tests ────────────────────────────────────────────────────────────

describe('TaskDialog create vs edit mode', () => {
  // ── Create mode ─────────────────────────────────────────────────

  describe('create mode', () => {
    it('renders "New Task" title when no task prop is passed', () => {
      renderDialog();
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    it('renders "New Task" title when task has no id', () => {
      renderDialog({ title: '', status: 'Backlog' });
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    it('shows the title text field in editable mode', () => {
      renderDialog();
      expect(
        screen.getByRole('textbox', { name: 'Title' }),
      ).toBeInTheDocument();
    });

    it('shows Cancel button', () => {
      renderDialog();
      expect(
        screen.getByRole('button', { name: 'Cancel' }),
      ).toBeInTheDocument();
    });

    it('shows Create button when onSubmit is provided', () => {
      renderDialog(undefined, { onSubmit: jest.fn() });
      expect(
        screen.getByRole('button', { name: 'Create' }),
      ).toBeInTheDocument();
    });

    it('does NOT show Create button when onSubmit is omitted', () => {
      renderDialog();
      expect(
        screen.queryByRole('button', { name: 'Create' }),
      ).not.toBeInTheDocument();
    });

    it('does NOT show Close button', () => {
      renderDialog();
      expect(
        screen.queryByRole('button', { name: 'Close' }),
      ).not.toBeInTheDocument();
    });

    it('does NOT show Delete button even when onDelete is provided', () => {
      renderDialog(undefined, { onDelete: jest.fn() });
      expect(
        screen.queryByRole('button', { name: 'Delete' }),
      ).not.toBeInTheDocument();
    });

    it('remains in create mode even with pre-filled dates and status', () => {
      // Pre-filled data should not flip the dialog into edit mode.
      // The id field is the sole determinant.
      renderDialog({
        startDate: '2025-07-01',
        endDate: '2025-07-10',
        status: 'In Progress',
      });
      expect(screen.getByText('New Task')).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Title' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' }),
      ).toBeInTheDocument();
    });

    it('renders all fields in edit mode simultaneously', () => {
      renderDialog(undefined, { onSubmit: jest.fn() });
      // Title is a text field
      expect(
        screen.getByRole('textbox', { name: 'Title' }),
      ).toBeInTheDocument();
      // Description is a textarea (mocked RichTextEditor)
      expect(
        screen.getByRole('textbox', { name: 'Description' }),
      ).toBeInTheDocument();
      // Status is a combobox (MUI Select), not a Chip
      expect(
        screen.getByRole('combobox'),
      ).toBeInTheDocument();
    });

    it('keeps fields editable after interacting with one field', () => {
      renderDialog(undefined, { onSubmit: jest.fn() });

      const titleInput = screen.getByRole('textbox', { name: 'Title' });
      // Simulate typing and blurring away
      titleInput.blur();

      // After blur, the title field should still be editable in create mode
      expect(
        screen.getByRole('textbox', { name: 'Title' }),
      ).toBeInTheDocument();
      // Description should still be editable too
      expect(
        screen.getByRole('textbox', { name: 'Description' }),
      ).toBeInTheDocument();
      // Footer still shows Cancel + Create
      expect(
        screen.getByRole('button', { name: 'Cancel' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Create' }),
      ).toBeInTheDocument();
    });
  });

  // ── Edit mode ───────────────────────────────────────────────────

  describe('edit mode', () => {
    it('renders "Task Details" title when task has an id', () => {
      renderDialog({ id: 'task-1', title: 'My Task' });
      expect(screen.getByText('Task Details')).toBeInTheDocument();
    });

    it('renders title as text in view mode (no text field)', () => {
      renderDialog({ id: 'task-1', title: 'Existing Task' });
      expect(screen.getByText('Existing Task')).toBeInTheDocument();
      expect(
        screen.queryByRole('textbox', { name: 'Title' }),
      ).not.toBeInTheDocument();
    });

    it('shows Close button in view mode', () => {
      renderDialog({ id: 'task-1', title: 'My Task' });
      expect(
        screen.getByRole('button', { name: 'Close' }),
      ).toBeInTheDocument();
    });

    it('does NOT show Cancel button in view mode', () => {
      renderDialog({ id: 'task-1', title: 'My Task' });
      expect(
        screen.queryByRole('button', { name: 'Cancel' }),
      ).not.toBeInTheDocument();
    });

    it('does NOT show Create/Save button in view mode', () => {
      renderDialog(
        { id: 'task-1', title: 'My Task' },
        { onSubmit: jest.fn() },
      );
      expect(
        screen.queryByRole('button', { name: 'Save' }),
      ).not.toBeInTheDocument();
    });

    it('shows Delete button when onDelete is provided', () => {
      renderDialog(
        { id: 'task-1', title: 'My Task' },
        { onDelete: jest.fn() },
      );
      expect(
        screen.getByRole('button', { name: 'Delete' }),
      ).toBeInTheDocument();
    });

    it('remains in edit mode even when title and description are empty', () => {
      // An id is the only signal — empty content should not flip to create.
      renderDialog({ id: 'task-1' });
      expect(screen.getByText('Task Details')).toBeInTheDocument();
      expect(
        screen.queryByRole('textbox', { name: 'Title' }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Close' }),
      ).toBeInTheDocument();
    });

    it('switches title to text field on click (click-to-edit)', () => {
      render(
        <TaskDialog
          open
          onClose={noop}
          task={{ id: 'task-1', title: 'My Task' }}
        />,
      );
      // Click the title area (MUI Dialog renders in a portal, so query document)
      const titleBox = document.querySelector('[data-edit-field="title"]');
      expect(titleBox).not.toBeNull();
      (titleBox as HTMLElement).click();

      // Now the text field should appear
      expect(
        screen.getByRole('textbox', { name: 'Title' }),
      ).toBeInTheDocument();
    });

    it('only one field is editable at a time in edit mode', () => {
      renderDialog({ id: 'task-1', title: 'My Task', status: 'In Progress' });
      // Initially no fields are in edit mode (view mode)
      expect(
        screen.queryByRole('textbox', { name: 'Title' }),
      ).not.toBeInTheDocument();

      // Click the title — only title should become editable
      const titleBox = document.querySelector('[data-edit-field="title"]');
      (titleBox as HTMLElement).click();
      expect(
        screen.getByRole('textbox', { name: 'Title' }),
      ).toBeInTheDocument();
      // Description should NOT be editable (no textarea, just rendered value)
      expect(
        screen.queryByRole('textbox', { name: 'Description' }),
      ).not.toBeInTheDocument();
      // Status should still render as a Chip (not a combobox) — but since
      // the Chip is always present in view mode, we verify no combobox
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
  });

  // ── Custom title override ───────────────────────────────────────

  it('uses custom title override when provided', () => {
    renderDialog(undefined, { title: 'Custom Title' });
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });
});
