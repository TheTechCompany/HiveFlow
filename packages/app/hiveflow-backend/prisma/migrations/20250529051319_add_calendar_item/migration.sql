-- CreateTable
CREATE TABLE "CalendarItem" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "data" JSONB,
    "organisation" TEXT NOT NULL,

    CONSTRAINT "CalendarItem_pkey" PRIMARY KEY ("id")
);
