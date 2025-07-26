// "use server";

import { Theme } from "@/components/layout/theme";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import Release from "@/components/layout/release";
import { ProductGrid } from "@/components/layout/productItems";
import { getChromeWebStoreItems, getRepos } from "@/api";
import { ProjectRepos, ProjectPickup } from "@/components/layout/project";
import { TwitterEmbed } from "@/components/layout/embed";
import { Hr } from "@/components/layout/hr";
import { getBlogData, getDevBlogTags, getUserBlogTags } from "@/lib/getBlog";
import { filterItems } from "@/utils/filterItems";
import { BlogAll } from "@/components/layout/blogs";

export default async function Home() {
  const theme = await Theme();
  const urls: BreadcrumbsProps["paths"] = [];
  const items = await getChromeWebStoreItems();
  const blogs = getBlogData();
  const filteredBlogs = filterItems({ items: blogs, tags: getUserBlogTags(), limit: 3 });
  const filteredDevBlogs = filterItems({ items: blogs, tags: getDevBlogTags(), limit: 3 });

  return (
    <main className="max-w-7xl mx-auto p-5 w-full grid gap-8">
      <Breadcrumbs paths={urls} />
      <Release title="最新リリース" />
      <Hr />
      <ProductGrid items={items} title="Chrome 拡張機能" sort={"users-desc"} limit={8} isOpen={true} />
      <Hr />
      <BlogAll className="space-y-5 my-3" tab="all" filteredBlogs={filteredBlogs} filteredDevBlogs={filteredDevBlogs} more={true} />
      <Hr />
      <ProjectPickup open={true} />
      <Hr />
      <TwitterEmbed username="yhotta240" theme={theme} height={600} />
    </main>
  );
}
