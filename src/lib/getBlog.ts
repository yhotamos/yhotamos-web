import matter from "gray-matter";
import type { Blog, BlogBodyData, BlogIndexEntry } from "@/types/blog";

const contentBaseUrl = "https://yhotamos.github.io/yhotamos-web-content/";

async function fetchContent(relativePath: string): Promise<string> {
  const url = new URL(relativePath, contentBaseUrl);
  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`記事データの取得に失敗しました: ${url} (${response.status})`);
  }
  return response.text();
}

async function getBlogIndex(): Promise<BlogIndexEntry[]> {
  const entries: BlogIndexEntry[] = JSON.parse(await fetchContent("blog/index.json"));
  const slugs = new Set<string>();

  for (const entry of entries) {
    const { slug } = entry.meta;
    if (typeof slug !== "string" || !slug.trim()) {
      throw new Error(`記事のslugが未設定です: ${entry.path}`);
    }
    if (slugs.has(slug)) {
      throw new Error(`記事のslugが重複しています: ${slug}`);
    }
    slugs.add(slug);
  }

  return entries.sort((a, b) => new Date(b.meta.publishedAt).getTime() - new Date(a.meta.publishedAt).getTime());
}

export async function getBlogData(): Promise<Blog[]> {
  const entries = await getBlogIndex();
  return entries.map((entry) => entry.meta);
}

export async function getBlogBody(slug: string): Promise<BlogBodyData | undefined> {
  const entries = await getBlogIndex();
  const blog = entries.find((entry) => entry.meta.slug === slug);
  if (!blog) {
    return;
  }

  const source = await fetchContent(`blog/${blog.path}`);
  const { content } = matter(source);
  return { data: blog.meta, content };
}

export async function getAllBlogTags(): Promise<string[]> {
  const blogs = await getBlogData();
  return [...new Set(blogs.flatMap((blog) => blog.tags))];
}
