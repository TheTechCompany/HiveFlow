-- CreateTable
CREATE TABLE "CalendarItemComment" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "CalendarItemComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CalendarItemComment" ADD CONSTRAINT "CalendarItemComment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CalendarItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
