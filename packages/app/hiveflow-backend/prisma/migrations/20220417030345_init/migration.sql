/*
  Warnings:

  - You are about to drop the column `managers` on the `ScheduleItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScheduleItem" DROP COLUMN "managers";

-- CreateTable
CREATE TABLE "ScheduleItemPermission" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduleItemId" TEXT NOT NULL,

    CONSTRAINT "ScheduleItemPermission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduleItemPermission" ADD CONSTRAINT "ScheduleItemPermission_scheduleItemId_fkey" FOREIGN KEY ("scheduleItemId") REFERENCES "ScheduleItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
