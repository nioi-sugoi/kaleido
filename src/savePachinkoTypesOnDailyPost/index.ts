import { JSDOM } from "jsdom";
import { Prisma, parlor } from "@prisma/client";
import { getPostId } from "saveDailyActivityOfPachinkoType/getPostId";

export const savePachinkoTypesOnDailyPost = async (
  parlor: parlor,
  ymd: string,
  prisma: Prisma.TransactionClient
) => {
  const postId = await getPostId(parlor.name, ymd);

  if (postId === undefined) {
    console.log("該当日付のデータがありません");
    return;
  }

  const res = await fetch(
    `${process.env.WEBSITE_ENDPOINT}/pachinko/${postId}/`
  );
  const body = await res.text();
  const dom = new JSDOM(body);

  const article = dom.window.document.getElementById(`post-${postId}`);

  if (!article) {
    throw new Error(`article is null(postId = ${postId})`);
  }

  // 最初のテーブル要素は除く
  const tables = article.querySelectorAll("table:not(.sou)");

  for (const table of tables) {
    const as = table.querySelectorAll("a");

    for (const a of as) {
      const pachinkoTypeName = a.textContent;

      if (pachinkoTypeName === null) {
        throw new Error('pachikoTypeName not found in "a" tag');
      }

      console.log("%%%%%%%%%%%%%%%%%");
      console.log(pachinkoTypeName);
      console.log("%%%%%%%%%%%%%%%%%");

      // 機種が登録されていなかったら登録する
      await prisma.pachinko_type.upsert({
        where: {
          name: pachinkoTypeName,
        },
        update: {},
        create: {
          name: pachinkoTypeName,
        },
      });
    }
  }
};
