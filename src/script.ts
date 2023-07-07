import { PrismaClient } from "@prisma/client";
import { calcEdgeDistance } from "calcEdgeDistance";
import dayjs from "dayjs";

const prisma = new PrismaClient();

type Datum = {
  id: number;
  edgeDistance?: number;
  edgeRef?: "inner" | "outer";
};

const main = async () => {
  return await prisma.$transaction(
    async (tx) => {
      const grouped = await tx.pachinko_daily_activity.groupBy({
        by: ["pachinko_type_id", "date"],
      });

      const allActivities = await tx.pachinko_daily_activity.findMany({});

      const data = grouped
        .map(({ pachinko_type_id, date }): Datum[] => {
          const activities = allActivities.filter(
            (activity) =>
              activity.pachinko_type_id === pachinko_type_id &&
              dayjs(activity.date).diff(dayjs(date), "day") === 0
          );

          const sameTypeLocations = activities.map(({ location }) => location);

          return activities.map(({ id, location }) => {
            return {
              id,
              ...calcEdgeDistance(location, sameTypeLocations),
            };
          });
        })
        .flat();

      console.log("calc done!");
      console.log(data.length)

      for (let i = 0; i < data.length; i++) {
        console.log("********************************");
        console.log(`${i + 1}/${data.length}`);
        const datum = data[i];

        await tx.pachinko_daily_activity.update({
          where: {
            id: datum.id,
          },
          data: {
            edge_distance: datum.edgeDistance,
            edge_ref: datum.edgeRef,
          },
        });
      }
    },
    { timeout: 100000000 }
  );
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
