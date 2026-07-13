import { Timeline } from "@hive-flow/ui";
import type { TimelineItem, TimelineLink, TimelineStep, ItemChange } from "@hive-flow/ui";
import { stringToColor } from "@hexhive/utils";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EstimateSingleContext } from "../context";
import { Box } from '@mui/material'
import { useMutation as useApolloMutation } from '@apollo/client'
import { UPDATE_ESTIMATE_TASK, UPDATE_ESTIMATE_TASK_TIMELINE_ORDER } from '@hive-flow/api';

export const TimelinePane = () => {
  const { estimateId, tasks, createTask, createDependency, finishTtl, deleteDependency, refetch, updateTask, deleteTask } = useContext(EstimateSingleContext);

  const [timelineTasks, setTasks] = useState<any[]>(tasks || []);

  useEffect(() => {
    setTasks(tasks);
  }, [JSON.stringify(tasks)])

  const [updateTaskDirect] = useApolloMutation(UPDATE_ESTIMATE_TASK)

  const [updateTimelineItemOrder] = useApolloMutation(UPDATE_ESTIMATE_TASK_TIMELINE_ORDER, {
    refetchQueries: ['GetProject']
  })

  // ── Horizon ──────────────────────────────────────────────────────
  const [horizon, setHorizon] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 7 * 86400000),
    end: new Date(Date.now() + 7 * 86400000),
  })

  // ── Derived step ─────────────────────────────────────────────────
  const step: TimelineStep = useMemo(() => {
    const ms = horizon.end.getTime() - horizon.start.getTime();
    const days = ms / 86400000;
    if (days < 2) return 'hour';
    if (days < 14) return 'day';
    if (days < 180) return 'month';
    return 'year';
  }, [horizon])

  // ── Links ────────────────────────────────────────────────────────
  const links: TimelineLink[] = useMemo(() =>
    tasks
      .filter((a: any) => a.status !== "Finished")
      .map((task: any) =>
        (task.dependencyOf || []).map((dep: any) => ({
          id: `${task.id}-${dep.id}`,
          source: task.id,
          target: dep.id,
        }))
      )
      .flat(),
    [tasks]
  )

  // ── Items ────────────────────────────────────────────────────────
  const items: TimelineItem[] = useMemo(() =>
    timelineTasks
      .map((task: any) => ({
        id: task.id,
        start: new Date(task.startDate),
        end: new Date(task.endDate),
        label: task.title,
        color: stringToColor(task.title),
        showLabel: true,
        data: task,
      }))
      .filter((task: TimelineItem) => {
        const t = task.data as any;
        if (!(task.end > horizon.start && task.start < horizon.end)) return false;
        if (t.status === "Finished") return false;
        return true;
      })
      .sort((a: any, b: any) => (a.data?.timelineRank ?? '').localeCompare(b.data?.timelineRank ?? ''))
    ,
    [timelineTasks, horizon]
  )

  // ── Link selection for delete ────────────────────────────────────
  const [selectedLink, setSelectedLink] = useState<{ source: string; target: string } | null>(null);

  const handleSelect = useCallback((sel: { itemIds: string[]; linkIds: string[] }) => {
    if (sel.linkIds.length > 0) {
      const link = links.find((l) => l.id === sel.linkIds[0]);
      if (link) {
        setSelectedLink({ source: link.source, target: link.target });
        return;
      }
    }
    setSelectedLink(null);
  }, [links])

  const keyHandler = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === "Delete" || e.key === "Backspace") && selectedLink) {
      deleteDependency(selectedLink.source, selectedLink.target);
      setSelectedLink(null);
    }
    if (e.key === "Escape") {
      setSelectedLink(null);
    }
  }, [selectedLink, deleteDependency])

  return (
    <Box sx={{ flex: 1, display: 'flex', '& .color-dot': { margin: '8px' } }} tabIndex={0} onKeyDown={keyHandler}>
      <Timeline
        items={items}
        links={links}
        start={horizon.start}
        end={horizon.end}
        step={step}
        callbacks={{
          onHorizonChange: (start: Date, end: Date) => {
            setHorizon({ start, end });
          },
          onItemCreate: (start: Date, end: Date) => {
            createTask({ start, end });
          },
          onItemChange: (change: ItemChange) => {
            setTasks((prev) => {
              const next = prev.slice();
              const ix = next.findIndex((x: any) => x.id === change.id);
              if (ix >= 0) {
                next[ix] = {
                  ...next[ix],
                  startDate: change.start ?? next[ix].startDate,
                  endDate: change.end ?? next[ix].endDate,
                };
              }
              return next;
            });
            updateTaskDirect({
              variables: {
                id: change.id,
                input: {
                  startDate: change.start,
                  endDate: change.end,
                  estimateId,
                },
              },
            }).then(() => refetch?.());
          },
          onLinkCreate: (link: Omit<TimelineLink, 'id'>) => {
            createDependency(link.source, link.target);
          },
          onSelect: handleSelect,
        }}
      />
    </Box>
  )
}
