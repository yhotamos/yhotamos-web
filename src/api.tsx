export const getChromeWebStoreItems = async () => {
  // スプレッドシートIDをenvから取得する
  const apiKey = process.env.GOOGLE_API_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const range = "シート1";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  const items = data.values.slice(1);
  return items;
};
