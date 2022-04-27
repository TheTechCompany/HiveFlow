-- CreateTable
CREATE TABLE "Timeline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineItem" (
    "id" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "timelineId" TEXT NOT NULL,

    CONSTRAINT "TimelineItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimelineItem" ADD CONSTRAINT "TimelineItem_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "Timeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
