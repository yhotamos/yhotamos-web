import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogPathName = "content/blog";
const blogIndexPath = path.join(blogPathName, "blogIndex.json");
const blogDir = path.join(process.cwd(), blogPathName);

export function getBlogData() {
  if (!fs.existsSync(blogIndexPath)) {
    return;
  }
  const blogIndex = fs.readFileSync(blogIndexPath, "utf-8");
  const blogIndexJson = JSON.parse(blogIndex);

  return blogIndexJson;
}

export function getBlogBody(id: string) {
  // blogIndexPathの中から、dirNameに合致するものを探す
  const blogIndex = getBlogData();
  const dirName = blogIndex.find((blog: any) => blog.id === id)?.dirName;
  if (!dirName) {
    return;
  }
  const mdPath = path.join(blogDir, dirName, "index.md");
  const source = fs.readFileSync(mdPath, "utf-8");
  const { data, content } = matter(source);
  return {
    data: data,
    content: content
  };
}

export function getUserBlogTags() {
  const blogIndex = getBlogData();
  // ユーザー向けの記事のタグを取得
  const blogType = blogIndex.filter((blog: any) => blog.type === "user");
  const tags = blogType.map((blog: any) => blog.tags);
  // 冗長なタグは除く
  const tagsSet = new Set(tags.flat());
  const tag = [...tagsSet];

  return tag as string[];
}

export function getDevBlogTags() {
  const blogIndex = getBlogData();
  const devType = blogIndex.filter((blog: any) => blog.type === "dev");
  const devTags = devType.map((blog: any) => blog.tags);
  // 冗長なタグは除く
  const tagsSet = new Set(devTags.flat());
  const devTagSet = [...tagsSet];

  return devTagSet as string[];
}

const changelogPath = path.join(process.cwd(), "content/changelog");

export function getChangelog() {
  if (!fs.existsSync(changelogPath)) {
    return;
  }

  const files = fs.readdirSync(changelogPath).filter((file) => file.endsWith(".md"));

  const changelogs = files.map((file) => {
    const filePath = path.join(changelogPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // ファイル名から日付とslugを抽出（例：20250719_タイトル.md）
    const [date, ...titleParts]: string[] = file.replace(/\.md$/, "").split("_");
    const slug = titleParts.join("_");
    const newdate = new Date(`${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`);
    return {
      slug,
      date: newdate.toLocaleString().split(" ")[0], // 日付をYYYY/MM/DD形式に変換
      title: data.title || slug,
      version: data.version || null,
      tags: data.tags || [],
      content,
    };
  });

  // 日付で降順ソート
  return changelogs.sort((a, b) => (a.date < b.date ? 1 : -1));
}