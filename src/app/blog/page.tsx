import type { Metadata } from "next";
import { Blogs } from "./_components/blogs";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { getQiitaList } from "@/lib/googleSheets";
import { getBlogData, getAllBlogTags } from "@/lib/getBlog";

export const revalidate = 60;

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Blog", href: "/blog" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - Blog",
};

export default async function Blog() {
  const [qittaBlogs, blogData, blogTags] = await Promise.all([
    getQiitaList(),
    getBlogData(),
    getAllBlogTags(),
  ]);

  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <Blogs title={pathnames[0].name} qittaBlogs={qittaBlogs} blogs={blogData} blogTags={blogTags} />
    </main>
  );
}
