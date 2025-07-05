type ExtensionRawData = [
  string,
  string,
  string,
  string,
  string | number,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

export const getChromeWebStoreItems = async () => {
  // スプレッドシートIDをenvから取得する
  const apiKey = process.env.GOOGLE_API_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const range = "シート1";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  const formatted = data.values.slice(1).map((item: ExtensionRawData) => {
    const [title, version] = item[0].split("\n");
    return {
      title,
      version,
      category: item[1],
      releaseDate: item[2],
      updateDate: item[3],
      rate: item[4],
      users: item[5],
      status: item[6],
      url: item[7],
      src: item[8],
      description: item[9],
      tags: item[10],
      github: item[11],
    };
  });

  const items = formatted;
  return items;
};
