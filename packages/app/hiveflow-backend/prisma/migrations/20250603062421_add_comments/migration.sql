-- AlterTable
ALTER TABLE "CalendarItem" ADD COLUMN     "createdBy" TEXT;

-- CreateTable
CREATE TABLE "CalendarItemPermissions" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "permissions" TEXT[],
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalendarItemPermissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CalendarItemPermissions" ADD CONSTRAINT "CalendarItemPermissions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CalendarItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
