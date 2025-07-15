import { Product } from "./components/types/product";
import { SortType } from "./components/types/repo";

export const getChromeWebStoreItems = async () => {
  // スプレッドシートIDをenvから取得する
  const apiKey = process.env.GOOGLE_API_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const range = "シート1";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  const formatted: Product[] = data.values.slice(1).map((item: string[]) => {
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
      users: item[5],
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
    };
  });

  const items = formatted;
  return items;
};

export const getRepos = async (sort?: SortType, limit?: number) => {
  const response = await fetch(
    `https://api.github.com/users/yhotta240/repos?sort=${sort}&per_page=${limit}`
  );
  const repos = await response.json();

  return repos;
};

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
