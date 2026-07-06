// ── HandoverScheduleWrapper — bridges HandoverDialog → SchedulingModal API ─
//
// Adapts the new HandoverDialog (from @hive-flow/ui) to the existing
// schedule-view data layer.  Accepts the same props as the old
// SchedulingModal so it can be dropped in as a replacement.

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import moment from 'moment';
import { HandoverDialog } from '@hive-flow/ui';
import type {
  HandoverProject,
  HandoverTask,
  HandoverPerson,
  HandoverAssignment,
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
  };
}

function mapPerson(p: any): HandoverPerson {
  return { id: p.id, name: p.name ?? p.id };
}

function deriveState(selected: any, projects: any[], estimates: any[]) {
  const projectId: string = selected?.groupBy?.id ?? '';
  const startDate = toISO(selected?.start ?? new Date());
  const endDate = toISO(selected?.end ?? new Date());

  const source =
    projects.find((p: any) => p.id === projectId) ??
    estimates.find((e: any) => e.id === projectId);
  const availableTasks: HandoverTask[] = (source?.tasks ?? []).map(mapTask);

  const storedTaskIds: Set<string> = new Set(
    (selected?.data?.tasks ?? []) as string[],
  );
  const selectedTasks = availableTasks.filter((t) =>
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

  const comment: string =
    selected?.data?.comment ??
    selected?.data?.comments?.[0]?.message ??
    '';

  return {
    projectId,
    startDate,
    endDate,
    availableTasks,
    selectedTasks,
    managers,
    assignments,
    comment,
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
  const [comment, setComment] = useState('');
  const [extraPeople, setExtraPeople] = useState<HandoverPerson[]>([]);

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      const s = deriveState(selected, projects, estimates);
      setProjectId(s.projectId);
      setStartDate(s.startDate);
      setEndDate(s.endDate);
      setSelectedTasks(s.selectedTasks);
      setManagers(s.managers);
      setAssignments(s.assignments);
      setComment(s.comment);

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
    return (source?.tasks ?? []).map(mapTask);
  }, [projectId, projects, estimates]);

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
        comment: comment || undefined,
        comments: selected?.data?.comments ?? [],
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
    comment,
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
      comment={comment}
      onCommentChange={setComment}
      extraPeople={extraPeople}
      onExtraPeopleChange={setExtraPeople}
      onExportPdf={() => {
        console.log('Export PDF clicked');
      }}
      onSubmit={handleSubmit}
    />
  );
};
