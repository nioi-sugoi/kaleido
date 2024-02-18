-- CreateTable
CREATE TABLE "slot_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slot_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_daily_activity" (
    "id" SERIAL NOT NULL,
    "slot_type_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "location" INTEGER NOT NULL,
    "total_games" INTEGER NOT NULL,
    "payout" INTEGER NOT NULL,
    "parlor_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slot_daily_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slot_type_name_key" ON "slot_type"("name");

-- CreateIndex
CREATE INDEX "slot_daily_activity_parlor_id_idx" ON "slot_daily_activity"("parlor_id");

-- CreateIndex
CREATE UNIQUE INDEX "slot_daily_activity_slot_type_id_location_date_parlor_id_key" ON "slot_daily_activity"("slot_type_id", "location", "date", "parlor_id");

-- AddForeignKey
ALTER TABLE "slot_daily_activity" ADD CONSTRAINT "slot_daily_activity_slot_type_id_fkey" FOREIGN KEY ("slot_type_id") REFERENCES "slot_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_daily_activity" ADD CONSTRAINT "slot_daily_activity_parlor_id_fkey" FOREIGN KEY ("parlor_id") REFERENCES "parlor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
