/*
  Warnings:

  - A unique constraint covering the columns `[displayId,organisation]` on the table `Estimate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organisation,displayId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Estimate" ADD COLUMN     "displayId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "displayId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Estimate_displayId_organisation_key" ON "Estimate"("displayId", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Project_organisation_displayId_key" ON "Project"("organisation", "displayId");
