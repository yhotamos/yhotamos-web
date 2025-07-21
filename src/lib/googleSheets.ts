import { google } from "googleapis";

const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const sheetId = process.env.GOOGLE_SPREADSHEET_ID_BLOG!;
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!sheetId || !clientEmail || !privateKey) {
  console.warn("[googleSheets] Missing env variables．");
}

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes,
});

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
  const sheets = google.sheets({ version: "v4", auth });
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
  const sheets = google.sheets({ version: "v4", auth });

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
  const sheets = google.sheets({ version: "v4", auth });
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
  const sheets = google.sheets({ version: "v4", auth });
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