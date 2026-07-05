-- AlterTable
ALTER TABLE "ProjectTask" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ProjectTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
