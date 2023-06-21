/*
  Warnings:

  - You are about to drop the `PachinkoDailyActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PachinkoType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PayoutSnapshot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PachinkoDailyActivity" DROP CONSTRAINT "PachinkoDailyActivity_pachinko_type_id_fkey";

-- DropForeignKey
ALTER TABLE "PayoutSnapshot" DROP CONSTRAINT "PayoutSnapshot_pachinko_daily_activity_id_fkey";

-- DropTable
DROP TABLE "PachinkoDailyActivity";

-- DropTable
DROP TABLE "PachinkoType";

-- DropTable
DROP TABLE "PayoutSnapshot";

-- CreateTable
CREATE TABLE "pachinko_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pachinko_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pachinko_daily_activity" (
    "id" SERIAL NOT NULL,
    "pachinko_type_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "location" INTEGER NOT NULL,
    "total_games" INTEGER NOT NULL,
    "payout" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pachinko_daily_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pachinko_payout_snapshot" (
    "id" SERIAL NOT NULL,
    "pachinko_daily_activity_id" INTEGER NOT NULL,
    "payout" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pachinko_payout_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pachinko_type_name_key" ON "pachinko_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pachinko_daily_activity_pachinko_type_id_location_date_key" ON "pachinko_daily_activity"("pachinko_type_id", "location", "date");

-- CreateIndex
CREATE UNIQUE INDEX "pachinko_payout_snapshot_pachinko_daily_activity_id_order_key" ON "pachinko_payout_snapshot"("pachinko_daily_activity_id", "order");

-- AddForeignKey
ALTER TABLE "pachinko_daily_activity" ADD CONSTRAINT "pachinko_daily_activity_pachinko_type_id_fkey" FOREIGN KEY ("pachinko_type_id") REFERENCES "pachinko_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pachinko_payout_snapshot" ADD CONSTRAINT "pachinko_payout_snapshot_pachinko_daily_activity_id_fkey" FOREIGN KEY ("pachinko_daily_activity_id") REFERENCES "pachinko_daily_activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
