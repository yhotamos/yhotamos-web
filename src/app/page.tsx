// "use server";

import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import Release from "./_components/release";
import { ProductGrid } from "@/components/layout/product";
import { getProductItems } from "@/lib/googleSheets";
import { ProjectPickup } from "@/components/layout/project-pickup";
import { XEmbed } from "@/components/layout/embed";
import { SnsPanel } from "@/components/layout/snsLinks";
import { Hr } from "@/components/layout/hr";
import { getBlogData } from "@/lib/getBlog";
import { filterItems } from "@/utils/filterItems";
import { BlogCards } from "@/components/layout/blog-cards";
import { getFeaturedRepos } from "@/lib/getRepository";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const urls: BreadcrumbsProps["paths"] = [];
  const [items, repos] = await Promise.all([
    getProductItems().catch(() => []),
    getFeaturedRepos().catch(() => []),
  ]);
  const blogs = getBlogData();
  const recentBlogs = filterItems({ items: blogs, tags: [], sort: "blog-new", limit: 6 });

  return (
    <main className="max-w-7xl mx-auto p-5 w-full grid grid-cols-1 gap-8">
      <Breadcrumbs paths={urls} />
      <div className="relative">
        <div className="grid w-full items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-5">
          <Release title="最新リリース" />
          <SnsPanel />
        </div>
      </div>
      <Hr />
      <ProductGrid items={items} title="Products" sort="users-desc" limit={8} expandable />
      <Hr />
      <div className="space-y-3 my-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">最新の記事</h2>
          <Link href="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">ブログを見る ＞</Link>
        </div>
        <BlogCards blogs={recentBlogs} />
      </div>
      <Hr />
      <ProjectPickup open={true} repos={repos} />
      <Hr />
      <XEmbed username="yhotta240" height={600} />
    </main>
  );
}
