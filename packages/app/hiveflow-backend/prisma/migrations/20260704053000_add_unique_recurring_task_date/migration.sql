-- Remove duplicate generated recurring tasks, keeping the earliest per (recurringEventId, startDate)
DELETE FROM "ProjectTask" a
WHERE "recurringEventId" IS NOT NULL
  AND "startDate" IS NOT NULL
  AND a.id NOT IN (
    SELECT MIN(b.id)
    FROM "ProjectTask" b
    WHERE b."recurringEventId" IS NOT NULL
      AND b."startDate" IS NOT NULL
    GROUP BY b."recurringEventId", b."startDate"
  );

-- Add unique constraint to prevent future duplicates
CREATE UNIQUE INDEX "ProjectTask_recurringEventId_startDate_key"
  ON "ProjectTask" ("recurringEventId", "startDate");
