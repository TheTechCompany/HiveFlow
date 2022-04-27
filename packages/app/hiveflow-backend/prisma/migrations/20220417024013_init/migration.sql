-- DropForeignKey
ALTER TABLE "TimelineItem" DROP CONSTRAINT "TimelineItem_timelineId_fkey";

-- AddForeignKey
ALTER TABLE "TimelineItem" ADD CONSTRAINT "TimelineItem_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
