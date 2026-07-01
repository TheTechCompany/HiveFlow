-- AlterTable
ALTER TABLE "Estimate" ADD COLUMN     "managers" TEXT[];

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "managers" TEXT[];

-- AlterTable
ALTER TABLE "SkillAssignment" DROP COLUMN "created",
ALTER COLUMN "organisation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "_blocksTimeline" ADD CONSTRAINT "_blocksTimeline_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_blocksTimeline_AB_unique";

-- AlterTable
ALTER TABLE "_dependencyOf" ADD CONSTRAINT "_dependencyOf_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_dependencyOf_AB_unique";

-- AlterTable
ALTER TABLE "_dependencyOfEstimateTask" ADD CONSTRAINT "_dependencyOfEstimateTask_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_dependencyOfEstimateTask_AB_unique";

-- AlterTable
ALTER TABLE "_scheduleEquipment" ADD CONSTRAINT "_scheduleEquipment_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_scheduleEquipment_AB_unique";

-- CreateTable
CREATE TABLE "PlanBatch" (
    "id" TEXT NOT NULL,
    "displayId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "projectId" TEXT NOT NULL,
    "reviewer" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation" TEXT NOT NULL,

    CONSTRAINT "PlanBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchComment" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batchId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "BatchComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanBatchItem" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "parentItemId" TEXT,
    "scheduledStart" TIMESTAMP(3),
    "scheduledEnd" TIMESTAMP(3),
    "estimatedHours" DOUBLE PRECISION,
    "rank" TEXT,
    "notes" TEXT,
    "organisation" TEXT NOT NULL,

    CONSTRAINT "PlanBatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringSchedule" (
    "id" TEXT NOT NULL,
    "displayId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organisation" TEXT NOT NULL,

    CONSTRAINT "RecurringSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringEvent" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "frequency" TEXT NOT NULL DEFAULT 'monthly',
    "startDate" TEXT NOT NULL,
    "assignedTo" TEXT,
    "organisation" TEXT NOT NULL,

    CONSTRAINT "RecurringEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regulation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT,
    "isoClause" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "linkStatus" TEXT NOT NULL DEFAULT 'unchecked',
    "storedHash" TEXT,
    "storedPdf" TEXT,
    "storedMarkdown" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organisation" TEXT NOT NULL,

    CONSTRAINT "Regulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulationVersion" (
    "id" TEXT NOT NULL,
    "regulationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "changes" TEXT,
    "file" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegulationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreakoutPoint" (
    "id" TEXT NOT NULL,
    "regulationId" TEXT NOT NULL,
    "sectionRef" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "pageRef" INTEGER,
    "markdownSnippet" TEXT,
    "understanding" TEXT NOT NULL DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BreakoutPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofEntry" (
    "id" TEXT NOT NULL,
    "regulationId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProofEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanBatch_organisation_displayId_key" ON "PlanBatch"("organisation", "displayId");

-- CreateIndex
CREATE UNIQUE INDEX "RecurringSchedule_organisation_displayId_key" ON "RecurringSchedule"("organisation", "displayId");

-- AddForeignKey
ALTER TABLE "PlanBatch" ADD CONSTRAINT "PlanBatch_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchComment" ADD CONSTRAINT "BatchComment_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "PlanBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchComment" ADD CONSTRAINT "BatchComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BatchComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanBatchItem" ADD CONSTRAINT "PlanBatchItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "PlanBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanBatchItem" ADD CONSTRAINT "PlanBatchItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ProjectTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanBatchItem" ADD CONSTRAINT "PlanBatchItem_parentItemId_fkey" FOREIGN KEY ("parentItemId") REFERENCES "PlanBatchItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringEvent" ADD CONSTRAINT "RecurringEvent_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "RecurringSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringEvent" ADD CONSTRAINT "RecurringEvent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "RecurringEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulationVersion" ADD CONSTRAINT "RegulationVersion_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakoutPoint" ADD CONSTRAINT "BreakoutPoint_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofEntry" ADD CONSTRAINT "ProofEntry_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
