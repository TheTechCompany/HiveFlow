-- DropForeignKey
ALTER TABLE "ScheduleItemPermission" DROP CONSTRAINT "ScheduleItemPermission_scheduleItemId_fkey";

-- AddForeignKey
ALTER TABLE "ScheduleItemPermission" ADD CONSTRAINT "ScheduleItemPermission_scheduleItemId_fkey" FOREIGN KEY ("scheduleItemId") REFERENCES "ScheduleItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
