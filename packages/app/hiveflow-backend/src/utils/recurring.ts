// ── Pure date-math utility: expand a recurring event template into concrete occurrence dates ──

import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

export interface RecurringEventShape {
  startDate: string;       // "YYYY-MM-DD"
  endDate?: string | null;  // null = forever
  frequency: string;        // daily | weekly | monthly | quarterly | yearly
  exceptionDates?: Array<{ originalDate: string }> | null;
}

/**
 * Generate all occurrence dates for a recurring event within [horizonStart, horizonEnd].
 * Dates are returned as "YYYY-MM-DD" strings, sorted ascending.
 *
 * Edge cases handled:
 *  - Respects the event's own `endDate` (stops generating after it)
 *  - Skips dates listed in `exceptionDates`
 *  - Safety cap at 500 iterations (avoid infinite loops)
 *  - Month-end clamping: Jan 31 + 1 month → Feb 28, Mar 31 → Apr 30, etc.
 */
export function generateOccurrences(
  event: RecurringEventShape,
  horizonStart: Date,
  horizonEnd: Date,
): string[] {
  const occurrences: string[] = [];

  // Build lookup set of exception dates
  const exceptionSet = new Set(
    (event.exceptionDates ?? []).map((ex) => ex.originalDate),
  );

  const start = parseYMD(event.startDate);
  if (!start) return []; // invalid start, bail

  const endBound = event.endDate ? parseYMD(event.endDate) : null;

  const horizonStartMs = horizonStart.getTime();
  const horizonEndMs = horizonEnd.getTime();

  let cursor = new Date(start);
  let iterations = 0;

  while (iterations < 500) {
    const cursorMs = cursor.getTime();

    // Past the horizon window → stop
    if (cursorMs >= horizonEndMs) break;

    // Past the event's own end date → stop
    if (endBound && cursorMs > endBound.getTime()) break;

    // Within the horizon, and not an exception → include
    if (cursorMs >= horizonStartMs) {
      const dateStr = formatYMD(cursor);
      if (!exceptionSet.has(dateStr)) {
        occurrences.push(dateStr);
      }
    }

    // Advance by frequency
    cursor = advanceDate(cursor, event.frequency);
    iterations++;
  }

  return occurrences;
}

// ── Task materialization (Prisma-dependent) ────────────────────

/**
 * Find or create the auto-managed "Recurring Tasks" project for an organisation.
 */
export async function getOrCreateRecurringProject(
  prisma: PrismaClient,
  org: string,
): Promise<string> {
  let project = await prisma.project.findFirst({
    where: { organisation: org, name: 'Recurring Tasks' },
    select: { id: true },
  });
  if (!project) {
    project = await prisma.project.create({
      data: {
        id: nanoid(),
        name: 'Recurring Tasks',
        organisation: org,
        status: 'active',
      },
      select: { id: true },
    });
  }
  return project.id;
}

/**
 * Ensure ProjectTask rows exist for upcoming occurrences of a recurring event
 * within [horizonStart, horizonEnd].  Idempotent — skips dates that already
 * have a task.
 *
 * @returns count of newly created tasks
 */
export async function ensureGeneratedTasks(
  prisma: PrismaClient,
  event: {
    id: string;
    name: string;
    description?: string | null;
    startDate: string;
    endDate?: string | null;
    frequency: string;
    exceptionDates?: Array<{ originalDate: string }> | null;
    assignedTo?: string | null;
    scheduleId?: string;
    organisation: string;
  },
  horizonStart: Date,
  horizonEnd: Date,
): Promise<number> {
  const dates = generateOccurrences(event, horizonStart, horizonEnd);
  if (dates.length === 0) return 0;

  const projectId = await getOrCreateRecurringProject(prisma, event.organisation);

  // Find which dates already materialized
  const existing = await prisma.projectTask.findMany({
    where: {
      recurringEventId: event.id,
      startDate: { in: dates.map((d) => new Date(d)) },
    },
    select: { startDate: true },
  });
  const existingDates = new Set(
    existing.map((t) => t.startDate!.toISOString().slice(0, 10)),
  );

  const toCreate = dates.filter((d) => !existingDates.has(d));
  if (toCreate.length === 0) return 0;

  await Promise.all(
    toCreate.map((dateStr) =>
      prisma.projectTask.create({
        data: {
          id: nanoid(),
          title: event.name,
          description: event.description ?? null,
          status: 'Backlog',
          projectId,
          startDate: new Date(dateStr),
          members: event.assignedTo ? [event.assignedTo] : [],
          recurringEventId: event.id,
          lastUpdated: new Date(),
        },
      }),
    ),
  );

  return toCreate.length;
}

// ── Internal helpers ────────────────────────────────────────────

/** Parse "YYYY-MM-DD" to local midnight Date. Returns null on invalid input. */
function parseYMD(ymd: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!match) return null;
  return new Date(+match[1], +match[2] - 1, +match[3], 0, 0, 0);
}

/** Format a Date to "YYYY-MM-DD" in local time. */
function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Advance `d` by one interval for the given frequency (returns a new Date). */
function advanceDate(d: Date, frequency: string): Date {
  const next = new Date(d);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      addMonths(next, 1);
      break;
    case 'quarterly':
      addMonths(next, 3);
      break;
    case 'yearly':
      addMonths(next, 12);
      break;
    default:
      addMonths(next, 1);
  }

  return next;
}

/**
 * Add `n` months to `d` in-place, clamping the day if it overflows the target
 * month's length (e.g. Jan 31 + 1 month → Feb 28, not Mar 3).
 */
function addMonths(d: Date, n: number): void {
  const originalDay = d.getDate();
  d.setMonth(d.getMonth() + n);
  // If the day changed, we overflowed — clamp to last day of the new month
  if (d.getDate() !== originalDay) {
    d.setDate(0); // setDate(0) = last day of previous month → last day of current month
  }
}
