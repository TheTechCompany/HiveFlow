/*
  Warnings:

  - You are about to drop the column `timelineId` on the `TimelineItem` table. All the data in the column will be lost.
  - You are about to drop the `Timeline` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `timeline` to the `TimelineItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TimelineItem" DROP CONSTRAINT "TimelineItem_timelineId_fkey";

-- AlterTable
ALTER TABLE "TimelineItem" DROP COLUMN "timelineId",
ADD COLUMN     "data" JSONB,
ADD COLUMN     "timeline" TEXT NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL;

-- DropTable
DROP TABLE "Timeline";
