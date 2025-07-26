import type { Metadata } from "next";
import { Blogs } from "@/components/layout/blogs";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { getQiitaList } from "@/lib/googleSheets";
import { getBlogData, getUserBlogTags, getChangelog, getDevBlogTags } from "@/lib/getBlog";

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Blog", href: "/blog" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - Blog",
};

export default async function Blog() {
  const qittaBlogs = await getQiitaList();
  const blogData = getBlogData();
  const blogTags = getUserBlogTags();
  const devBlogTags = getDevBlogTags();
  const changelogs = getChangelog();

  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <Blogs qittaBlogs={qittaBlogs} blogs={blogData} blogTags={blogTags} devBlogTags={devBlogTags} changelogs={changelogs} />
    </main>
  );
}
