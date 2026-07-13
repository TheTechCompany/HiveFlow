-- CreateTable
CREATE TABLE "LeaveAssignment" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "LeaveAssignment_pkey" PRIMARY KEY ("id")
);
