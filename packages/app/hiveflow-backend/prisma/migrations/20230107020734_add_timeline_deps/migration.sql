-- CreateTable
CREATE TABLE "_blocksTimeline" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_blocksTimeline_AB_unique" ON "_blocksTimeline"("A", "B");

-- CreateIndex
CREATE INDEX "_blocksTimeline_B_index" ON "_blocksTimeline"("B");

-- AddForeignKey
ALTER TABLE "_blocksTimeline" ADD FOREIGN KEY ("A") REFERENCES "TimelineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocksTimeline" ADD FOREIGN KEY ("B") REFERENCES "TimelineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
