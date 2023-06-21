import { pachinko_daily_activity, Prisma } from "@prisma/client";

export const savePayoutSnapshots = async (
  script: HTMLScriptElement,
  dailyActivityId: pachinko_daily_activity["id"],
  prisma: Prisma.TransactionClient
) => {
  const existing = await prisma.pachinko_payout_snapshot.findFirst({
    where: {
      pachinko_daily_activity_id: dailyActivityId,
    },
  });

  if (existing) {
    return;
  }

  const payoutsStr = script?.textContent?.match(
    /data: \[\s*((?:-?\d*\.?\d+,)*-?\d*\.?\d+)\s*]/
  )?.[1];

  if (payoutsStr == null) {
    throw new Error("payoutsStr is null");
  }

  const payouts = payoutsStr
    .split(",")
    .map((payoutStr) => Math.round(Number(payoutStr)));

  await prisma.pachinko_payout_snapshot.createMany({
    data: payouts.map((payout, i) => ({
      pachinko_daily_activity_id: dailyActivityId,
      payout,
      order: i,
    })),
  });
};
