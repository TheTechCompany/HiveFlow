-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "colour" TEXT;

-- CreateTable
CREATE TABLE "SkillAssignment" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "skillData" JSONB,
    "organisation" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillAssignment_pkey" PRIMARY KEY ("id")
);
