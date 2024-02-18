import { JSDOM } from "jsdom";
import { Prisma, parlor } from "@prisma/client";
import { getPostId } from "slot/getPostId";
export const saveSlotTypesOnDailyPost = async (
  parlor: parlor,
  ymd: string,
  prisma: Prisma.TransactionClient
) => {
  const postId = await getPostId(parlor.name, ymd);

  if (postId === undefined) {
    console.log("該当日付のデータがありません");
    return;
  }

  const res = await fetch(`${process.env.WEBSITE_ENDPOINT}/${postId}/`);
  const body = await res.text();
  const dom = new JSDOM(body);

  const article = dom.window.document.getElementById(`post-${postId}`);

  if (!article) {
    throw new Error(`article is null(postId = ${postId})`);
  }

  // 最初のテーブル要素は除く
  const tables = Array.from(article.querySelectorAll("table:not(.sou)"));

  // 最後のテーブル要素も除く
  tables.pop()

  for (const table of tables) {
    const as = table.querySelectorAll("a");

    for (const a of as) {
      const slotTypeName = a.textContent;

      if (slotTypeName === null) {
        throw new Error('slotTypeName not found in "a" tag');
      }

      // 機種が登録されていなかったら登録する
      await prisma.slot_type.upsert({
        where: {
          name: slotTypeName,
        },
        update: {},
        create: {
          name: slotTypeName,
        },
      });
    }
  }
};
