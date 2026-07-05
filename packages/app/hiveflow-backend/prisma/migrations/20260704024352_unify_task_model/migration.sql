/*
  Warnings:

  - You are about to drop the `EstimateTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_dependencyOfEstimateTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EstimateTask" DROP CONSTRAINT "EstimateTask_estimateId_fkey";

-- DropForeignKey
ALTER TABLE "_dependencyOfEstimateTask" DROP CONSTRAINT "_dependencyOfEstimateTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_dependencyOfEstimateTask" DROP CONSTRAINT "_dependencyOfEstimateTask_B_fkey";

-- DropIndex
DROP INDEX "ProjectTask_projectId_id_key";

-- AlterTable
ALTER TABLE "ProjectTask" ADD COLUMN     "estimateId" TEXT,
ADD COLUMN     "handoverNote" TEXT,
ALTER COLUMN "projectId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RecurringEvent" ADD COLUMN     "taskTemplate" JSONB;

-- DropTable
DROP TABLE "EstimateTask";

-- DropTable
DROP TABLE "_dependencyOfEstimateTask";

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
