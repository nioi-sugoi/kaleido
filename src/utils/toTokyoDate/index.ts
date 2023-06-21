import dayjs from "dayjs";

// Prisma がTimeZoneを考慮してくれないので、ここで補正する
export const toTokyoDate = (date: Date) => {
  return dayjs(date).add(9, "hour").toDate();
};
