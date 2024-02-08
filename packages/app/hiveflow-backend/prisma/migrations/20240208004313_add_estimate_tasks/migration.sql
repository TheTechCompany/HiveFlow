-- DropForeignKey
ALTER TABLE "ProjectTask" DROP CONSTRAINT "ProjectTask_projectId_fkey";

-- CreateTable
CREATE TABLE "EstimateTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT,
    "estimateId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "timelineRank" TEXT,
    "columnRank" TEXT,
    "members" TEXT[],
    "createdBy" TEXT,
    "lastUpdated" TIMESTAMP(3),

    CONSTRAINT "EstimateTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_dependencyOfEstimateTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EstimateTask_estimateId_id_key" ON "EstimateTask"("estimateId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "_dependencyOfEstimateTask_AB_unique" ON "_dependencyOfEstimateTask"("A", "B");

-- CreateIndex
CREATE INDEX "_dependencyOfEstimateTask_B_index" ON "_dependencyOfEstimateTask"("B");

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateTask" ADD CONSTRAINT "EstimateTask_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dependencyOfEstimateTask" ADD CONSTRAINT "_dependencyOfEstimateTask_A_fkey" FOREIGN KEY ("A") REFERENCES "EstimateTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dependencyOfEstimateTask" ADD CONSTRAINT "_dependencyOfEstimateTask_B_fkey" FOREIGN KEY ("B") REFERENCES "EstimateTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
