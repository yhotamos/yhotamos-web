// "use server";

import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import Release from "@/components/layout/release";
import { ProductGrid } from "@/components/layout/product";
import { getChromeWebStoreItems } from "@/lib/googleSheets";
import { ProjectPickup } from "@/components/layout/project";
import { TwitterEmbed } from "@/components/layout/embed";
import { Hr } from "@/components/layout/hr";
import { getBlogData, getAllBlogTags } from "@/lib/getBlog";
import { filterItems } from "@/utils/filterItems";
import { BlogCards } from "@/components/layout/blog-cards";
import getProjects from "@/lib/getProjects";

export default async function Home() {
  const urls: BreadcrumbsProps["paths"] = [];
  const [items, projects] = await Promise.all([
    getChromeWebStoreItems().catch(() => []),
    getProjects().catch(() => []),
  ]);
  const blogs = getBlogData();
  const recentBlogs = filterItems({ items: blogs, tags: [], sort: "blog-new", limit: 6 });

  return (
    <main className="max-w-7xl mx-auto p-5 w-full grid gap-8">
      <Breadcrumbs paths={urls} />
      <Release title="最新リリース" />
      <Hr />
      <ProductGrid items={items} title="Chrome 拡張機能" sort={"users-desc"} limit={8} isOpen={true} />
      <Hr />
      <div className="space-y-3 my-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">最新の記事</h2>
          <a href="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">ブログを見る ＞</a>
        </div>
        <BlogCards blogs={recentBlogs} />
      </div>
      <Hr />
      <ProjectPickup open={true} projects={projects} />
      <Hr />
      <TwitterEmbed username="yhotta240" height={600} />
    </main>
  );
}
