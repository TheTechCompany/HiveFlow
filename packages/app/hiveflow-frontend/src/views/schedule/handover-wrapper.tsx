// ── HandoverScheduleWrapper — bridges HandoverDialog → SchedulingModal API ─
//
// Adapts the new HandoverDialog (from @hive-flow/ui) to the existing
// schedule-view data layer.  Accepts the same props as the old
// SchedulingModal so it can be dropped in as a replacement.

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HandoverDialog } from '@hive-flow/ui';
import type {
  HandoverProject,
  HandoverTask,
  HandoverPerson,
  HandoverAssignment,
  HandoverComment,
} from '@hive-flow/ui';

// ── Types ────────────────────────────────────────────────────────────

interface WrapperProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (schedule: any) => void;
  onDelete?: () => void;

  selected?: any;

  projects?: any[];
  estimates?: any[];
  people?: any[];
  tasks?: any[];

  /** Discussion comments from CalendarItemComment[] relation. */
  discussionComments?: HandoverComment[];
  /** Called when the user adds a discussion comment. */
  onAddComment?: (message: string) => void;
  /** Called when the user deletes a discussion comment. */
  onDeleteComment?: (commentId: string) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────

const toISO = (d: any): string => {
  if (!d) return '';
  if (typeof d === 'string') return d.slice(0, 10);
  return moment(d).format('YYYY-MM-DD');
};

const toDate = (iso: string): Date | undefined => {
  if (!iso) return undefined;
  return new Date(iso);
};

function mapTask(t: any): HandoverTask {
  return {
    id: t.id,
    title: t.title ?? '',
    description: t.description ?? undefined,
    status: (t.status as any) ?? 'Backlog',
    startDate: t.startDate ? toISO(t.startDate) : undefined,
    endDate: t.endDate ? toISO(t.endDate) : undefined,
    memberIds: (t.members ?? []).map((m: any) => m.id),
    feedback: t.handoverNote ?? undefined,
  };
}

function mapPerson(p: any): HandoverPerson {
  return { id: p.id, name: p.name ?? p.id };
}

/**
 * Build the discussion comment list, auto-migrating legacy data.comment
 * as a synthetic comment when no relation-table comments exist yet.
 */
function deriveComments(
  selected: any,
  discussionComments?: HandoverComment[],
): HandoverComment[] {
  // If we have real relation-table comments, use them.
  if (discussionComments && discussionComments.length > 0) {
    return discussionComments;
  }
  // Auto-migrate legacy data.comment as a synthetic comment.
  const legacyComment: string | undefined =
    selected?.data?.comment ??
    selected?.data?.comments?.[0]?.message;
  if (legacyComment?.trim()) {
    return [
      {
        id: '__legacy__',
        message: legacyComment,
        userName: 'System',
        createdAt: '',
      },
    ];
  }
  return [];
}

function deriveState(selected: any, projects: any[], estimates: any[]) {
  const projectId: string = selected?.groupBy?.id ?? '';
  const startDate = toISO(selected?.start ?? new Date());
  const endDate = toISO(selected?.end ?? new Date());

  const source =
    projects.find((p: any) => p.id === projectId) ??
    estimates.find((e: any) => e.id === projectId);
  const allTasks: HandoverTask[] = (source?.tasks ?? []).map(mapTask);

  const storedTaskIds: Set<string> = new Set(
    (selected?.data?.tasks ?? []) as string[],
  );
  // Include finished tasks that were previously assigned to this handover.
  const selectedTasks = allTasks.filter((t) =>
    storedTaskIds.has(t.id),
  );

  // Managers come from permissions + createdBy (primary).
  // Fall back to data.managers only for backward compat with old records.
  const storedManagers: any[] =
    (selected?.id
      ? (selected?.permissions ?? [])
          .map((x: any) => x.user)
          .concat(selected?.createdBy ? [selected?.createdBy] : [])
      : []);
  if (storedManagers.length === 0 && selected?.data?.managers) {
    storedManagers.push(...selected.data.managers);
  }
  const managers: HandoverPerson[] = storedManagers.map(mapPerson);

  const storedAssignments: HandoverAssignment[] =
    selected?.data?.assignments ?? [];
  let assignments: HandoverAssignment[];
  if (storedAssignments.length > 0) {
    assignments = storedAssignments;
  } else {
    const flatPeople: string[] = selected?.data?.people ?? [];
    const taskIds = selectedTasks.map((t) => t.id);
    assignments =
      flatPeople.length > 0 && taskIds.length > 0
        ? [
            { taskId: taskIds[0], personIds: flatPeople },
            ...taskIds
              .slice(1)
              .map((id) => ({ taskId: id, personIds: [] as string[] })),
          ]
        : [];
  }

  return {
    projectId,
    startDate,
    endDate,
    selectedTasks,
    managers,
    assignments,
  };
}

// ── Component ────────────────────────────────────────────────────────

export const HandoverScheduleWrapper: React.FC<WrapperProps> = ({
  open,
  onClose,
  onSubmit,
  selected,
  projects = [],
  estimates = [],
  people = [],
  discussionComments,
  onAddComment,
  onDeleteComment,
}) => {
  const prevOpenRef = useRef(false);

  const allProjects: HandoverProject[] = useMemo(() => {
    const proj: HandoverProject[] = projects.map((p) => ({
      id: p.id,
      displayId: p.displayId ?? '',
      name: p.name ?? p.id,
    }));
    const est: HandoverProject[] = estimates.map((e) => ({
      id: e.id,
      displayId: e.displayId ?? '',
      name: e.name ?? e.id,
    }));
    return [...proj, ...est];
  }, [projects, estimates]);

  const allPeople: HandoverPerson[] = useMemo(
    () => people.map(mapPerson),
    [people],
  );

  // ── State ──────────────────────────────────────────────────────

  const [projectId, setProjectId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<HandoverTask[]>([]);
  const [managers, setManagers] = useState<HandoverPerson[]>([]);
  const [assignments, setAssignments] = useState<HandoverAssignment[]>([]);
  const [extraPeople, setExtraPeople] = useState<HandoverPerson[]>([]);

  // Discussion comments — derived from props + legacy auto-migration.
  const comments = useMemo(
    () => deriveComments(selected, discussionComments),
    [selected, discussionComments],
  );

  // Snapshot ref so the stable export callback always reads fresh state.
  const exportRef = useRef({
    projectId: '',
    startDate: '',
    endDate: '',
    selectedTasks: [] as HandoverTask[],
    managers: [] as HandoverPerson[],
    assignments: [] as HandoverAssignment[],
    extraPeople: [] as HandoverPerson[],
    allProjects: [] as HandoverProject[],
    allPeople: [] as HandoverPerson[],
    date: undefined as string | undefined,
  });
  exportRef.current = {
    projectId,
    startDate,
    endDate,
    selectedTasks,
    managers,
    assignments,
    extraPeople,
    allProjects,
    allPeople,
    date: selected?.start
      ? moment(selected.start).format('DD/MM/YY')
      : undefined,
  };

  // ── PDF Export ─────────────────────────────────────────────────

  const handleExportPdf = useCallback(() => {
    const s = exportRef.current;
    const doc = new jsPDF();

    const project = s.allProjects.find((p) => p.id === s.projectId);
    const projectLabel = project
      ? `${project.displayId} — ${project.name}`
      : '—';

    const managerNames = s.managers.map((m) => m.name).join(', ') || '—';

    const assignedIds = new Set(
      s.assignments.flatMap((a) => a.personIds),
    );
    const extraIds = s.extraPeople.map((p) => p.id);
    const allPeopleIds = [...new Set([...assignedIds, ...extraIds])];
    const peopleLabel =
      allPeopleIds
        .map((id) => s.allPeople.find((p) => p.id === id)?.name ?? id)
        .join(', ') || '—';

    // ── Date formatting ────────────────────────────────────────
    const fmtDate = (iso: string) => {
      if (!iso) return '—';
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yy = String(d.getFullYear()).slice(-2);
      return `${dd}/${mm}/${yy}`;
    };
    const dateRange = `${fmtDate(s.startDate)} - ${fmtDate(s.endDate)}`;

    // ── Handover Info ──────────────────────────────────────────
    const infoStartY = 22;
    const lineH = 7;
    const leftX = 14;
    const labelW = 32;
    const valueX = leftX + labelW;

    const infoLines: [string, string][] = [
      ['Project:', projectLabel],
      ['Date Range:', dateRange],
      ['Managers:', managerNames],
      ['People:', peopleLabel],
    ];

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Handover Info', leftX, infoStartY);
    doc.setFont(undefined, 'normal');

    infoLines.forEach(([label, value], i) => {
      const y = infoStartY + lineH + i * lineH;
      doc.setFont(undefined, 'bold');
      doc.text(label, leftX, y);
      doc.setFont(undefined, 'normal');
      doc.text(value, valueX, y);
    });

    // ── Tasks table ────────────────────────────────────────────
    const tableStartY = infoStartY + lineH + infoLines.length * lineH + 8;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Tasks', leftX, tableStartY);

    const head = [['Task', 'People']];
    const body: any[] = [];
    s.selectedTasks.forEach((task) => {
      const assignment = s.assignments.find(
        (a) => a.taskId === task.id,
      );
      const personIds = assignment?.personIds ?? [];
      const peopleNames =
        personIds
          .map((pid) => s.allPeople.find((p) => p.id === pid)?.name ?? pid)
          .join(', ') || '—';

      const desc = (task.description ?? '')
        .replace(/<[^>]*>/g, '')
        .substring(0, 120);

      const feedback = task.feedback?.trim() || '';

      // Row 1 — bold title + people (spans both rows)
      body.push([
        { content: task.title, styles: { fontStyle: 'bold' } },
        { content: peopleNames, rowSpan: 2 },
      ]);
      // Row 2 — description + feedback + blank writing space
      body.push([
        `${desc}\nFeedback: ${feedback}\n \n \n \n `,
        '',
      ]);
    });

    if (body.length > 0) {
      autoTable(doc, {
        startY: tableStartY + 4,
        head,
        body,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: {
          fillColor: [100, 100, 100],
          textColor: 255,
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 108 },
          1: { cellWidth: 60 },
        },
        margin: { left: 14, right: 14 },
        theme: 'grid',
      });
    }

    // ── Save ───────────────────────────────────────────────────
    const filename = `Handover${s.date ? `_${s.date.replace(/\//g, '-')}` : ''}.pdf`;
    doc.save(filename);
  }, []);

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      const s = deriveState(selected, projects, estimates);
      setProjectId(s.projectId);
      setStartDate(s.startDate);
      setEndDate(s.endDate);
      setSelectedTasks(s.selectedTasks);
      setManagers(s.managers);
      setAssignments(s.assignments);

      // Derive extra people: data.people IDs not covered by any assignment.
      const peopleIds: string[] = selected?.data?.people ?? [];
      const assignedIds = new Set(
        s.assignments.flatMap((a: HandoverAssignment) => a.personIds),
      );
      const extraIds = peopleIds.filter((id: string) => !assignedIds.has(id));
      const extraPeopleList: HandoverPerson[] = extraIds
        .map((id: string) => allPeople.find((p: any) => p.id === id))
        .filter(Boolean)
        .map(mapPerson);
      setExtraPeople(extraPeopleList);
    }
    prevOpenRef.current = open;
  }, [open, selected, projects, estimates]);

  const availableTasks: HandoverTask[] = useMemo(() => {
    if (!projectId) return [];
    const source =
      projects.find((p: any) => p.id === projectId) ??
      estimates.find((e: any) => e.id === projectId);
    const all = (source?.tasks ?? []).map(mapTask);
    const selIds = new Set(selectedTasks.map((t) => t.id));

    // Filter out finished tasks unless already selected.
    const filtered = all.filter(
      (t: HandoverTask) => t.status !== 'Finished' || selIds.has(t.id),
    );

    // Sort: tasks overlapping the handover window first, then the rest.
    const windowStart = startDate ? new Date(startDate) : null;
    const windowEnd = endDate ? new Date(endDate) : null;
    const inWindow = (t: HandoverTask): boolean => {
      if (!windowStart || !windowEnd) return false;
      const ts = t.startDate ? new Date(t.startDate) : null;
      const te = t.endDate ? new Date(t.endDate) : null;
      if (!ts || !te) return false;
      return ts <= windowEnd && te >= windowStart;
    };

    return [...filtered].sort((a, b) => {
      const aIn = inWindow(a) ? 0 : 1;
      const bIn = inWindow(b) ? 0 : 1;
      return aIn - bIn;
    });
  }, [projectId, projects, estimates, selectedTasks, startDate, endDate]);

  // ── Handlers ───────────────────────────────────────────────────

  const handleProjectChange = useCallback((id: string) => {
    setProjectId(id);
    setSelectedTasks([]);
    setAssignments([]);
  }, []);

  const handleAssignmentChange = useCallback(
    (a: HandoverAssignment) => {
      setAssignments((prev) => {
        const rest = prev.filter((x) => x.taskId !== a.taskId);
        return [...rest, a];
      });
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    const groupBySource =
      allProjects.find((p) => p.id === projectId) ?? null;

    const allAssignedPeople = [
      ...new Set(assignments.flatMap((a) => a.personIds)),
    ];
    const extraPeopleIds = extraPeople.map((p) => p.id);

    const schedule: any = {
      id: selected?.id,
      start: toDate(startDate),
      end: toDate(endDate),
      groupBy: groupBySource
        ? {
            id: groupBySource.id,
            displayId: groupBySource.displayId,
            name: groupBySource.name,
          }
        : undefined,
      data: {
        people: [...new Set([...allAssignedPeople, ...extraPeopleIds])],
        tasks: selectedTasks.map((t) => t.id),
        assignments: assignments.filter((a) => a.personIds.length > 0),
      },
    };

    onSubmit(schedule);
  }, [
    selected,
    projectId,
    startDate,
    endDate,
    assignments,
    selectedTasks,
    extraPeople,
    allProjects,
    onSubmit,
  ]);

  // ── Render ─────────────────────────────────────────────────────

  return (
    <HandoverDialog
      open={open}
      onClose={onClose}
      handoverId={selected?.id || undefined}
      date={
        selected?.start
          ? moment(selected.start).format('DD/MM/YY')
          : undefined
      }
      projects={allProjects}
      selectedProjectId={projectId || undefined}
      onProjectChange={handleProjectChange}
      startDate={startDate || undefined}
      endDate={endDate || undefined}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      availableTasks={availableTasks}
      selectedTasks={selectedTasks}
      onTasksChange={setSelectedTasks}
      managers={managers}
      onManagersChange={setManagers}
      people={allPeople}
      assignments={assignments}
      onAssignmentChange={handleAssignmentChange}
      comments={comments}
      onAddComment={onAddComment ?? (() => {})}
      onDeleteComment={onDeleteComment ?? (() => {})}
      extraPeople={extraPeople}
      onExtraPeopleChange={setExtraPeople}
      onExportPdf={handleExportPdf}
      onSubmit={handleSubmit}
    />
  );
};
