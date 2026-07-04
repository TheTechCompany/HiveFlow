-- AlterTable
ALTER TABLE "ProjectTask" ADD COLUMN     "recurringEventId" TEXT;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_recurringEventId_fkey" FOREIGN KEY ("recurringEventId") REFERENCES "RecurringEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
