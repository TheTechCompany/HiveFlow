/*
  Warnings:

  - A unique constraint covering the columns `[user,skill]` on the table `SkillAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SkillAssignment_user_skill_key" ON "SkillAssignment"("user", "skill");
