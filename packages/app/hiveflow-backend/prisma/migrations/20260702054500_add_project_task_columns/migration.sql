-- AlterTable
ALTER TABLE "ProjectTask" ADD COLUMN IF NOT EXISTS "taskType" TEXT DEFAULT 'task';

-- AlterTable
ALTER TABLE "ProjectTask" ADD COLUMN IF NOT EXISTS "category" TEXT;
