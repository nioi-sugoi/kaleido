import { JSDOM } from "jsdom";
import { pachinko_type, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { savePayoutSnapshots } from "saveDailyActivityOfPachinkoType/savePayoutSnapshots";
import { getPostId } from "saveDailyActivityOfPachinkoType/getPostId";
import { toTokyoDate } from "utils/toTokyoDate";

export const saveDailyActivityOfPachinkoType = async (
  pachinkoType: pachinko_type,
  ymd: string,
  prisma: Prisma.TransactionClient
) => {
  const postId = await getPostId(ymd);

  if (postId === undefined) {
    console.log("該当日付のデータがありません");
    return;
  }

  const res = await fetch(
    `${process.env.WEBSITE_ENDPOINT}/pachinko/${postId}/?kishu=${pachinkoType.name}`
  );
  const body = await res.text();
  const dom = new JSDOM(body);

  const article = dom.window.document.getElementById(`post-${postId}`);

  if (!article) {
    throw new Error(`article is null(postId = ${postId})`);
  }

  const table = article.querySelector("table");

  if (!table) {
    throw new Error("table is null");
  }

  const trs = table.querySelectorAll("tr");

  if (trs.length === 0) {
    console.log("存在しない機種のようです");
  }

  // i = 0 はヘッダーなのでスキップ
  for (let i = 1; i < trs.length; i++) {
    const tr = trs[i];

    const tds = tr.querySelectorAll("td");

    const locationStr = tds[0].querySelector("a")?.textContent;

    if (locationStr == null) {
      throw new Error("location is null");
    }

    const payoutStr = tds[1].textContent?.replace(/,/, "");

    if (payoutStr == null) {
      throw new Error("payout is null");
    }

    const totalGamesStr = tds[2].textContent?.replace(/,/, "");

    if (totalGamesStr == null) {
      throw new Error("totalGames is null");
    }

    const location = Number(locationStr);
    const payout = Number(payoutStr);
    const totalGames = Number(totalGamesStr);

    const existing = await prisma.pachinko_daily_activity.findUnique({
      where: {
        pachinko_type_id_location_date: {
          location,
          date: toTokyoDate(dayjs(ymd).toDate()),
          pachinko_type_id: pachinkoType.id,
        },
      },
    });

    if (existing) {
      continue;
    }

    const dailyActivity = await prisma.pachinko_daily_activity.create({
      data: {
        date: toTokyoDate(dayjs(ymd).toDate()),
        location,
        payout,
        total_games: totalGames,
        pachinko_type_id: pachinkoType.id,
      },
    });

    const scripts = article
      .querySelector(".slump_list")
      ?.querySelectorAll("script");

    if (!scripts || scripts.length === 0) {
      throw new Error("scripts is null");
    }

    await savePayoutSnapshots(scripts[i - 1], dailyActivity.id, prisma);
  }
};
