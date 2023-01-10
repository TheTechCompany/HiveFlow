/*
  Warnings:

  - You are about to drop the column `belowId` on the `TimelineItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimelineItem" DROP CONSTRAINT "TimelineItem_belowId_fkey";

-- AlterTable
ALTER TABLE "TimelineItem" DROP COLUMN "belowId",
ADD COLUMN     "rank" TEXT;
