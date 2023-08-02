/*
  Warnings:

  - A unique constraint covering the columns `[pachinko_type_id,location,date,parlor_id]` on the table `pachinko_daily_activity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "pachinko_daily_activity_pachinko_type_id_location_date_key";

-- AlterTable
ALTER TABLE "pachinko_daily_activity" ADD COLUMN     "parlor_id" INTEGER;

-- CreateIndex
CREATE INDEX "pachinko_daily_activity_parlor_id_idx" ON "pachinko_daily_activity"("parlor_id");

-- CreateIndex
CREATE UNIQUE INDEX "pachinko_daily_activity_pachinko_type_id_location_date_parl_key" ON "pachinko_daily_activity"("pachinko_type_id", "location", "date", "parlor_id");

-- AddForeignKey
ALTER TABLE "pachinko_daily_activity" ADD CONSTRAINT "pachinko_daily_activity_parlor_id_fkey" FOREIGN KEY ("parlor_id") REFERENCES "parlor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
