import { Product } from "@/components/types/product";
import { google } from "googleapis";

const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const sheetId = process.env.GOOGLE_SPREADSHEET_ID_BLOG!;
const chromeWebStoreSheetId = process.env.GOOGLE_SPREADSHEET_ID;
const qittaSheetId = process.env.GOOGLE_SPREADSHEET_ID_QIITA!;
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!sheetId || !clientEmail || !privateKey) {
  console.warn("[googleSheets] Missing env variables．");
}

let sheetsClient: ReturnType<typeof google.sheets> | null = (globalThis as any)._sheetsClient || null;

export async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes,
  });

  await auth.authorize();

  sheetsClient = google.sheets({ version: "v4", auth });

  (globalThis as any)._sheetsClient = sheetsClient;

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
  }
  else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Likes!A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[postId, newLikes]] },
    });
  }
  return newLikes;
}

/** GET: Chrome Web Store一覧を返す */
export async function getChromeWebStoreItems() {
  const sheets = await getSheetsClient();
  const range = "シート1!A1:V100";
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: chromeWebStoreSheetId,
    range: range,
  });
  const data = res.data.values || [];
  // console.log(res.data.range);
  const formatted: Product[] = data.slice(1).map((item: string[]) => {
    const [title, version] = item[0].split("\n");
    // "バージョン 1.0.3" => ["バージョン", "1.0.3"]　に変換
    const versionSplit = version.split(" ");

    return {
      title,
      version: versionSplit[1],
      category: "Chrome " + item[1],
      releaseDate: item[2],
      updateDate: item[3],
      rate: item[4],
      users: Number(item[5]),
      status: item[6],
      url: item[7],
      src: item[8],
      description: item[9],
      tags: item[10].split(","),
      github: item[11],
      author: item[12],
      doc: item[13],
      usage: item[14],
      language: item[15],
      price: item[16],
      id: item[17],
      name: item[18],
      icon: item[19],
      type: "user",
    };
  });

  return formatted;
};

/** GET: Qiita一覧を返す */
export async function getQiitaList() {
  const sheets = await getSheetsClient();
  const range = "article";
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: qittaSheetId,
    range: range,
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
};