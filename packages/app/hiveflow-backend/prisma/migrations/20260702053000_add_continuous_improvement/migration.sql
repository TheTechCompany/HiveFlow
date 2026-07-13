-- CreateTable
CREATE TABLE "ContinuousImprovement" (
    "id" TEXT NOT NULL,
    "displayId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'identified',
    "priority" TEXT,
    "impact" TEXT,
    "rootCause" TEXT,
    "actionTaken" TEXT,
    "outcomeMeasured" TEXT,
    "createdBy" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "organisation" TEXT NOT NULL,

    CONSTRAINT "ContinuousImprovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContinuousImprovement_organisation_displayId_key" ON "ContinuousImprovement"("organisation", "displayId");
