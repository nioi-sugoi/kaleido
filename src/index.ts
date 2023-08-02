import { PrismaClient } from "@prisma/client";
import { saveDailyActivityOfPachinkoType } from "saveDailyActivityOfPachinkoType";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { createInterface } from "readline/promises";
import { savePachinkoTypesOnDailyPost } from "savePachinkoTypesOnDailyPost";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

const prisma = new PrismaClient();

const main = async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const parlorId = Number(await rl.question("parlorId: "));
  const startYmd = await rl.question("開始のYYYYMMDD: ");
  const endYmd = await rl.question("終了のYYYYMMDD: ");

  const parlor = await prisma.parlor.findUniqueOrThrow({
    where: {
      id: parlorId,
    },
  });

  const dayDiff = dayjs(endYmd).diff(dayjs(startYmd), "day");

  for (let i = 0; i <= dayDiff; i++) {
    const ymd = dayjs(startYmd).add(i, "day").format("YYYYMMDD");

    try {
      await prisma.$transaction(
        async (tx) => {
          await savePachinkoTypesOnDailyPost(parlor, ymd, tx);

          const pachinkoTypes = await tx.pachinko_type.findMany();

          for (const pachinkoType of pachinkoTypes) {
            console.log("****************************");
            console.log(pachinkoType.name);
            console.log(dayjs(ymd).format("YYYY-MM-DD"));

            await saveDailyActivityOfPachinkoType(
              parlor,
              pachinkoType,
              ymd,
              tx
            );

            console.log("****************************");
          }
        },
        { timeout: 100000000 }
      );
    } catch (e) {
      console.error(e);
      console.log(`${ymd}からリトライしてください`);
    }
  }

  rl.close();
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
