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
      category: item[1],
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
