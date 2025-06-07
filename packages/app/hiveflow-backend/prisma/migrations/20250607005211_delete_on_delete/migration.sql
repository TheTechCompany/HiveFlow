-- DropForeignKey
ALTER TABLE "CalendarItemComment" DROP CONSTRAINT "CalendarItemComment_itemId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarItemPermissions" DROP CONSTRAINT "CalendarItemPermissions_itemId_fkey";

-- AddForeignKey
ALTER TABLE "CalendarItemPermissions" ADD CONSTRAINT "CalendarItemPermissions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CalendarItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarItemComment" ADD CONSTRAINT "CalendarItemComment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CalendarItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
