-- CreateEnum
CREATE TYPE "edge_type" AS ENUM ('inner', 'outer');

-- AlterTable
ALTER TABLE "pachinko_daily_activity" ADD COLUMN     "edge_distance" INTEGER,
ADD COLUMN     "edge_ref" "edge_type";
