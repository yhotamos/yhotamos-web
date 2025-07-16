import Link from "next/link";
import { getChromeWebStoreItems } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/types/product";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import NotFoundPage from "@/components/layout/notFound";
import React from "react";
import TabController from "./_components/tabController";

const tabs: { name: string; value: string }[] = [
  { name: "概要", value: "description" },
  { name: "ドキュメント", value: "document" },
  { name: "パージョン情報", value: "version" },
  { name: "問題報告", value: "issue" },
  { name: "評価 & レビュー", value: "review" },
  { name: "情報", value: "info" },
];

function getTabQuery(tab: string) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set("tab", tab);
  return searchParams.toString();
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug: any = await params;
  const decodedSlug = decodeURIComponent(slug.slug);
  const items: Product[] = await getChromeWebStoreItems();
  const item = items.find((item: Product) => item.name === decodedSlug);
  const pathname: string = item ? item.title : "";
  const pathnames: BreadcrumbsProps["paths"] = [{ name: "Products", href: "/products" }, { name: pathname }];

  if (!item) {
    return <NotFoundPage className={`min-h-screen mt-20 text-center font-bold`} backTop={true} />;
  }

  // console.log(decodedSlug, item);
  return (
    <main className=" pt-5 grid gap-3">
      <div className="">
        <Breadcrumbs paths={pathnames} className="max-w-7xl mx-auto px-5" />
      </div>
      <ProductItem item={item} className="px-5 max-w-7xl mx-auto" />
      <TabController item={item} />
    </main>
  );
}

function ProductItem({ item, className }: { item: Product; className?: string }) {
  return (
    <div className={className}>
      <div className="flex flex-col sm:grid gap-2 md:gap-10 sm:grid-cols-5">
        <img src={item.src} alt={item.title} className="h-40 md:h-fit object-cover rounded-sm border-solid" title={item.title} height="100%" width="100%" />
        <div className="col-span-4 grid gap-1">
          <div className="font-bold text-xl">
            <Link href={item.url} className="hover:underline" target="_blank">
              {item.title}
            </Link>
            <div className="flex flex-wrap gap-x-1 mt-1">
              <Badge>{item.category}</Badge>
              {item.tags && item.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <span className="font-bold">{item.rate} 評価</span>
            <span className="after:content-['|']"></span>
            <span className="font-bold">{item.users} ユーザー </span>
            <span className="after:content-['|']"></span>
            <span className="font-bold">バージョン : {item.version}</span>
            <span className="after:content-['|']"></span>
            <span className="font-bold">作成者 : {item.author || "yhotta240"}</span>
          </div>
          <div>{item.description}</div>
          <Button asChild variant="outline" className="w-fit bg-violet-500 text-white hover:bg-violet-800 hover:text-white dark:bg-violet-500 dark:hover:bg-violet-800">
            <Link href={item.url} target="_blank">
              今すぐダウンロード
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
