-- AlterTable
ALTER TABLE "Estimate" ADD COLUMN     "expiry" TIMESTAMP(3),
ADD COLUMN     "terms" TEXT;

-- CreateTable
CREATE TABLE "EstimateLineItem" (
    "id" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "estimateId" TEXT NOT NULL,

    CONSTRAINT "EstimateLineItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EstimateLineItem" ADD CONSTRAINT "EstimateLineItem_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
