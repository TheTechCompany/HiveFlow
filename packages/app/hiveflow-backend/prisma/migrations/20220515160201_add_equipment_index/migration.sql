/*
  Warnings:

  - A unique constraint covering the columns `[displayId,organisation]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Equipment_displayId_organisation_key" ON "Equipment"("displayId", "organisation");
