-- CreateTable
CREATE TABLE "_scheduleEquipment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_scheduleEquipment_AB_unique" ON "_scheduleEquipment"("A", "B");

-- CreateIndex
CREATE INDEX "_scheduleEquipment_B_index" ON "_scheduleEquipment"("B");

-- AddForeignKey
ALTER TABLE "_scheduleEquipment" ADD FOREIGN KEY ("A") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_scheduleEquipment" ADD FOREIGN KEY ("B") REFERENCES "ScheduleItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
