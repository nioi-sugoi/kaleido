import { PrismaClient } from "@prisma/client";
import { saveDailyActivityOfPachinkoType } from "saveDailyActivityOfPachinkoType";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { createInterface } from "readline/promises";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

const prisma = new PrismaClient();

const main = async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const startYmd = await rl.question("開始のYYYYMMDD: ");
  const endYmd = await rl.question("終了のYYYYMMDD: ");

  const pachinkoTypes = await prisma.pachinko_type.findMany();

  const dayDiff = dayjs(endYmd).diff(dayjs(startYmd), "day");

  await prisma.$transaction(
    async (tx) => {
      for (let i = 0; i <= dayDiff; i++) {
        const ymd = dayjs(startYmd).add(i, "day").format("YYYYMMDD");

        for (const pachinkoType of pachinkoTypes) {
          console.log("****************************");
          console.log(pachinkoType.name);
          console.log(dayjs(ymd).format("YYYY-MM-DD"));

          await saveDailyActivityOfPachinkoType(pachinkoType, ymd, tx);

          console.log("****************************");
        }
      }
    },
    { timeout: 1000000 }
  );

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
