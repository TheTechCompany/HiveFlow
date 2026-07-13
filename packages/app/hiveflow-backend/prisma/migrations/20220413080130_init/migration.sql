/*
  Warnings:

  - Added the required column `organisation` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "organisation" TEXT NOT NULL;
