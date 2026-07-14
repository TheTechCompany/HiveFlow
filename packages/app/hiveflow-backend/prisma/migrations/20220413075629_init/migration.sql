-- CreateTable
CREATE TABLE "ScheduleItem" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "people" TEXT[],
    "notes" TEXT[],
    "organisation" TEXT NOT NULL,

    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
