import { JSDOM } from "jsdom";
import dayjs from "dayjs";

type PostIdByDate = { ymd: string; postId: string };

const getPostIdsByDate = async (parlorName: string) => {
  let page = 1;

  const result: PostIdByDate[] = [];

  while (true) {
    let res;

    if (page === 1) {
      res = await fetch(
        `${process.env.WEBSITE_ENDPOINT}/pachinko/tag/${parlorName}/`,
        { redirect: "manual" }
      );
    } else {
      res = await fetch(
        `${process.env.WEBSITE_ENDPOINT}/pachinko/tag/${parlorName}/page/${page}/`,
        { redirect: "manual" }
      );
    }

    if (res.status !== 200) {
      break;
    }

    const body = await res.text();
    const dom = new JSDOM(body);

    dom.window.document
      .querySelectorAll<HTMLLinkElement>(".table_wrap td a")
      .forEach((a) => {
        const postId = a.href.match(/pachinko\/(\d+)\//)?.[1];

        if (postId == null) {
          throw new Error("postId not found");
        }

        const dateMatchResult = a.textContent?.match(
          /(\d{4})?\/?(\d{1,2})\/(\d{1,2})/
        );

        if (!dateMatchResult) {
          throw new Error("date not found");
        }

        const year = dateMatchResult[1] ?? new Date().getFullYear();
        const month = dateMatchResult[2];
        const day = dateMatchResult[3];

        result.push({
          ymd: dayjs(`${year}-${month}-${day}`).format("YYYYMMDD"),
          postId,
        });
      });

    page++;
  }

  return result;
};

let postIdsByDate: PostIdByDate[];

export const getPostId = async (parlorName: string, ymd: string) => {
  if (postIdsByDate === undefined) {
    postIdsByDate = await getPostIdsByDate(parlorName);
  }

  return postIdsByDate.find((postIdByDate) => ymd === postIdByDate.ymd)?.postId;
};
