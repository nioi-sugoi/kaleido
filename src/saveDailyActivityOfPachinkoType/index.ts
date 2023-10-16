import { JSDOM } from "jsdom";
import { pachinko_type, parlor, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { savePayoutSnapshots } from "saveDailyActivityOfPachinkoType/savePayoutSnapshots";
import { getPostId } from "saveDailyActivityOfPachinkoType/getPostId";
import { toTokyoDate } from "utils/toTokyoDate";

export const saveDailyActivityOfPachinkoType = async (
  parlor: parlor,
  pachinkoType: pachinko_type,
  ymd: string,
  prisma: Prisma.TransactionClient
) => {
  const postId = await getPostId(parlor.name, ymd);

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
    return;
  }

  const contentTrs: HTMLTableRowElement[] = [];

  trs.forEach((tr) => {
    const tds = tr.querySelectorAll("td");

    // ヘッダー行はスキップ（設置台数が多い場合はヘッダー行が複数存在する）
    if (tds.length === 0) {
      return;
    }

    contentTrs.push(tr);
  });

  const slumpList = article.querySelector(".slump_list");

  if (!slumpList) {
    return;
  }

  const scripts = slumpList.querySelectorAll("script");

  for (let i = 0; i < contentTrs.length; i++) {
    const contentTr = contentTrs[i];

    const tds = contentTr.querySelectorAll("td");

    // ヘッダー行はスキップ（設置台数が多い場合はヘッダー行が複数存在する）
    if (tds.length === 0) {
      continue;
    }

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
        pachinko_type_id_location_date_parlor_id: {
          parlor_id: parlor.id,
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
        parlor_id: parlor.id,
      },
    });

    // 総回転数0の場合はグラフが存在しない
    if (totalGames === 0) {
      return;
    }

    const script = scripts[i];

    if (!script) {
      console.log(i);
      throw new Error("script is null");
    }

    await savePayoutSnapshots(script, dailyActivity.id, prisma);
  }
};
