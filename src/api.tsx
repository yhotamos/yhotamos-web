export const getMarkdown = async (url: string) => {
  const response = await fetch(url);
  const markdown = await response.text();

  return markdown;
};

export const getQiitaList = async () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_QIITA;
  const range = "article";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  // console.log("apiを叩いたz",data);
  const formatted: any = data.values.slice(1).map((item: string[]) => {
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
