-- AlterTable
ALTER TABLE "TimelineItem" ADD COLUMN     "belowId" TEXT;

-- AddForeignKey
ALTER TABLE "TimelineItem" ADD CONSTRAINT "TimelineItem_belowId_fkey" FOREIGN KEY ("belowId") REFERENCES "TimelineItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
