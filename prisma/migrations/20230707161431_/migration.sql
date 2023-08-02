/*
  Warnings:

  - Made the column `parlor_id` on table `pachinko_daily_activity` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "pachinko_daily_activity" DROP CONSTRAINT "pachinko_daily_activity_parlor_id_fkey";

-- AlterTable
ALTER TABLE "pachinko_daily_activity" ALTER COLUMN "parlor_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "pachinko_daily_activity" ADD CONSTRAINT "pachinko_daily_activity_parlor_id_fkey" FOREIGN KEY ("parlor_id") REFERENCES "parlor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
