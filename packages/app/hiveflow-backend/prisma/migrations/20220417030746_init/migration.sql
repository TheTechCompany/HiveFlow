/*
  Warnings:

  - A unique constraint covering the columns `[owner,scheduleItemId]` on the table `ScheduleItemPermission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScheduleItemPermission_owner_scheduleItemId_key" ON "ScheduleItemPermission"("owner", "scheduleItemId");
