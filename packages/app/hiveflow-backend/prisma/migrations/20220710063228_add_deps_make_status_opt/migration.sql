-- AlterTable
ALTER TABLE "ProjectTask" ALTER COLUMN "status" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_dependencyOf" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_dependencyOf_AB_unique" ON "_dependencyOf"("A", "B");

-- CreateIndex
CREATE INDEX "_dependencyOf_B_index" ON "_dependencyOf"("B");

-- AddForeignKey
ALTER TABLE "_dependencyOf" ADD FOREIGN KEY ("A") REFERENCES "ProjectTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dependencyOf" ADD FOREIGN KEY ("B") REFERENCES "ProjectTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
