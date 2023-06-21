-- CreateTable
CREATE TABLE "PachinkoType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PachinkoType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PachinkoDailyActivity" (
    "id" SERIAL NOT NULL,
    "pachinko_type_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" INTEGER NOT NULL,
    "total_games" INTEGER NOT NULL,
    "payout" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PachinkoDailyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutSnapshot" (
    "id" SERIAL NOT NULL,
    "pachinko_daily_activity_id" INTEGER NOT NULL,
    "payout" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayoutSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PayoutSnapshot_pachinko_daily_activity_id_order_key" ON "PayoutSnapshot"("pachinko_daily_activity_id", "order");

-- AddForeignKey
ALTER TABLE "PachinkoDailyActivity" ADD CONSTRAINT "PachinkoDailyActivity_pachinko_type_id_fkey" FOREIGN KEY ("pachinko_type_id") REFERENCES "PachinkoType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutSnapshot" ADD CONSTRAINT "PayoutSnapshot_pachinko_daily_activity_id_fkey" FOREIGN KEY ("pachinko_daily_activity_id") REFERENCES "PachinkoDailyActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
