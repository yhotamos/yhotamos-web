import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogRoot = path.join(process.cwd(), "content/blog");
const indexFilePath = path.join(blogRoot, "blogIndex.json");

function generateBlogIndex() {
  const directories = fs.readdirSync(blogRoot).filter((file) =>
    fs.statSync(path.join(blogRoot, file)).isDirectory()
  );
  const blogs = directories.map((dirName) => {
    const [date, ...titleParts] = dirName.split("-");
    const titleFromDir = titleParts.join("_");

    const mdPath = path.join(blogRoot, dirName, "index.md");
    if (!fs.existsSync(mdPath)) {
      console.warn(`⚠ index.md が ${dirName} にありません`);
      return null;
    }

    const source = fs.readFileSync(mdPath, "utf-8");
    const { data } = matter(source);

    // idがなかったらhushを作成し，dataの一番上に入れてindex.mdのdataの一番上（）に書き込む
    if (data.id === undefined) {
      data.id = Math.random().toString(36).slice(2);
      fs.writeFileSync(mdPath, matter.stringify(source, data));
    }

    return {
      id: data.id,
      title: data.title || titleFromDir,
      slug: data.slug || titleFromDir,
      thumbnail: data.thumbnail,
      description: data.description,
      date: data.date || "date missing",
      updateDate: data.updateDate || "date missing",
      type: data.type || "user",
      version: data.version,
      tags: data.tags || [],
      dirName: dirName,
    };
  }).filter(Boolean);

  blogs.sort((a, b) => (a.date < b.date ? 1 : -1));

  fs.writeFileSync(indexFilePath, JSON.stringify(blogs, null, 2));
  console.log(`✅ blogIndex.json (${blogs.length} 件) を生成しました`);
}

generateBlogIndex();
