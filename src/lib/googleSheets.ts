import type { ContactEntry } from "@/components/types/contact";
import type { FeedbackEntry, IssueEntry } from "@/components/types/feedback";
import type { Product } from "@/components/types/product";
import { google } from "googleapis";
import { cache } from "react";

const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const contactSheetId = process.env.GOOGLE_SPREADSHEET_ID_CONTACT!;
const sheetId = process.env.GOOGLE_SPREADSHEET_ID_BLOG!;
const chromeWebStoreSheetId = process.env.GOOGLE_SPREADSHEET_ID;
const qittaSheetId = process.env.GOOGLE_SPREADSHEET_ID_QIITA!;
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!sheetId || !clientEmail || !privateKey) {
  console.warn("[googleSheets] Missing env variables．");
}

let sheetsClient: ReturnType<typeof google.sheets> | null = null;

async function initializeSheetsClient() {
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes,
  });
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

export async function getSheetsClient() {
  if (!sheetsClient) {
    sheetsClient = await initializeSheetsClient();
  }
  return sheetsClient;
}

export type SheetComment = {
  blogId: string;
  id: string;
  text: string;
  author: string;
  createdAt: string;
  likes: number;
};

/** GET: idに紐づくコメント一覧を返す */
export async function getComments(postId: string): Promise<SheetComment[]> {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Comments!A2:F",
    fields: "values",
  });

  const rows = res.data.values || [];
  const comments: SheetComment[] = rows.map((r) => ({
    blogId: String(r[0] ?? ""),
    id: String(r[1] ?? ""),
    text: String(r[2] ?? ""),
    author: String(r[3] ?? ""),
    createdAt: String(r[4] ?? ""),
    likes: Number(r[5] ?? 0),
  }));

  const filtered = comments.filter((c) => c.blogId === postId);
  if (filtered.length === 0) return [];

  // 最新順にソート
  filtered.sort((a, b) => Number(b.id) - Number(a.id));
  return filtered;
}

/** POST:コメントを末尾に追加 */
export async function appendComment(c: SheetComment) {
  const sheets = await getSheetsClient();

  const values = [[c.blogId, c.id, c.text, c.author, c.createdAt, c.likes]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Comments!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
    insertDataOption: "INSERT_ROWS",
  });

  return c;
}

/** GET: いいね数を取得 */
export async function getLikes(postId: string): Promise<number> {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Likes!A2:B",
  });

  const rows = res.data.values || [];
  const row = rows.find((r) => r[0] === postId);
  return row ? Number(row[1]) : 0;
}

/** POST: いいね数を1増やす */
export async function updateLikes(postId: string): Promise<number> {
  const sheets = await getSheetsClient();
  // いいね数を取得
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Likes!A2:B",
  });

  const rows = res.data.values || [];
  // 指定した記事IDの行を探す
  let index = rows.findIndex((r) => r[0] === postId);
  let newLikes = 1;

  if (index >= 0) {
    newLikes = Number(rows[index][1]) + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Likes!B${index + 2}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[newLikes]] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Likes!A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[postId, newLikes]] },
    });
  }
  return newLikes;
}

/** GET: Chrome Web Store一覧を返す（キャッシュ対応） */
export const getChromeWebStoreItems = cache(async () => {
  const sheets = await getSheetsClient();
  const range = "Main!A1:AM100";
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: chromeWebStoreSheetId,
    range: range,
    fields: "values",
  });
  const data = res.data.values || [];
  // console.log(res.data.range);
  const formatted: Product[] = data.slice(1).map((item: string[]) => {
    return {
      repo_name: item[1],
      repo_full_name: item[2],
      repo_html_url: item[3],
      repo_doc: item[15],
      repo_usage: item[16],
      extension_id: item[17],
      icon_url: item[18],
      name: item[19],
      rating: Number(item[20]),
      review_count: Number(item[21]),
      thumbnail: item[22],
      description: item[23],
      category: item[24],
      users: Number(item[25]),
      promotion_image: item[26],
      screenshot_url: item[27],
      overview: item[28],
      developer: item[29],
      version: item[30],
      size: item[31],
      languages: item[32] ? JSON.parse(item[32]) : [], // [["日本語", "英語"]]のような形式
      store_url: item[33],
      created_at: item[34],
      updated_at: item[35],
      provider: item[36],
      tags: item[37].split(","),
    };
  });

  return formatted;
});

/** POST: お問い合わせを Contacts シートに追記 */
export async function appendContact(entry: ContactEntry) {
  const sheets = await getSheetsClient();
  const createdAt = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: contactSheetId,
    range: "Contacts!A:E",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[createdAt, entry.name, entry.email, entry.subject, entry.message]],
    },
  });
}

/** POST: フィードバックを Feedback シートに追記 */
export async function appendFeedback(entry: FeedbackEntry) {
  const sheets = await getSheetsClient();
  const createdAt = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: contactSheetId,
    range: "Feedback!A:E",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        createdAt,
        entry.type,
        entry.title,
        entry.detail,
        entry.contact ?? "",
      ]],
    },
  });
}

/** POST: ツール Issue を Issues シートに追記 */
export async function appendIssue(entry: IssueEntry) {
  const sheets = await getSheetsClient();
  const createdAt = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: contactSheetId,
    range: "Issues!A:I",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        createdAt,
        entry.toolName,
        entry.type,
        entry.browser ?? "",
        entry.bugType ?? "",
        entry.title,
        entry.detail,
        entry.contact ?? "",
        "",
      ]],
    },
  });
}

/** GET: Qiita一覧を返す（キャッシュ対応） */
export const getQiitaList = cache(async () => {
  const sheets = await getSheetsClient();
  const range = "article";
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: qittaSheetId,
    range: range,
    fields: "values",
  });
  const data = res.data.values || [];
  // console.log("apiを叩いたz",data);
  const formatted: any = data.slice(1).map((item: string[]) => {
    return {
      title: item[0],
      url: item[1],
      id: item[2],
      views: item[3],
      likes: item[4],
      bookmarks: item[5],
      updateDate: item[6],
      publishDate: item[7],
      tags: item[8].split(","),
    };
  });

  return formatted;
});
