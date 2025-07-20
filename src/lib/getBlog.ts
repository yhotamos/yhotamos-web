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
  // console.log("files", blogIndexJson);

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

export function getBlogTags() {
  const files = fs.readdirSync(blogDir);
  const tags = files.map((dirName) => {
    const mdPath = path.join(blogDir, dirName, "index.md");
    // console.log(mdPath);
    if (!fs.existsSync(mdPath)) {
      return;
    }
    const source = fs.readFileSync(mdPath, "utf-8");
    const { data } = matter(source);

    return data.tags;
  }).flat();
  // 冗長なタグは除く
  const tagsSet = new Set(tags);
  const tag = [...tagsSet];

  return tag;
}