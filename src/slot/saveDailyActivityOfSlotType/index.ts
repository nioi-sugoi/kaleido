import { JSDOM } from "jsdom";
import { slot_type, parlor, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { getPostId } from "slot/getPostId";
import { toTokyoDate } from "utils/toTokyoDate";

export const saveDailyActivityOfSlotType = async (
  parlor: parlor,
  slotType: slot_type,
  ymd: string,
  prisma: Prisma.TransactionClient
) => {
  const postId = await getPostId(parlor.name, ymd);

  if (postId === undefined) {
    console.log("該当日付のデータがありません");
    return;
  }

  const url = `${process.env.WEBSITE_ENDPOINT}/${postId}/?kishu=${slotType.name}`;

  const res = await fetch(url);
  const body = await res.text();
  const dom = new JSDOM(body);

  const article = dom.window.document.getElementById(`post-${postId}`);

  if (!article) {
    throw new Error(`article is null(postId = ${postId})`);
  }

  const table = article.querySelector(".table_wrap table");

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

  for (let i = 0; i < contentTrs.length; i++) {
    const contentTr = contentTrs[i];

    const tds = contentTr.querySelectorAll("td");

    // ヘッダー行はスキップ（設置台数が多い場合はヘッダー行が複数存在する）
    if (tds.length === 0) {
      continue;
    }

    // 「平均」の行はスキップ
    if (i === contentTrs.length - 1) {
      continue;
    }

    const locationStr = tds[0].querySelector("a")?.textContent;

    if (locationStr == null) {
      console.log(tds[0], i);
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

    const existing = await prisma.slot_daily_activity.findUnique({
      where: {
        slot_type_id_location_date_parlor_id: {
          parlor_id: parlor.id,
          location,
          date: toTokyoDate(dayjs(ymd).toDate()),
          slot_type_id: slotType.id,
        },
      },
    });

    if (existing) {
      continue;
    }

    await prisma.slot_daily_activity.create({
      data: {
        date: toTokyoDate(dayjs(ymd).toDate()),
        location,
        payout,
        total_games: totalGames,
        slot_type_id: slotType.id,
        parlor_id: parlor.id,
      },
    });
  }
};
