import Link from "next/link";
import { getChromeWebStoreItems } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/types/product";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { DocHtml, Document } from "@/components/layout/document";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import React from "react";
import NotFoundPage from "@/components/layout/notFound";

const tabs: { name: string; value: string }[] = [
  { name: "概要", value: "description" },
  { name: "ドキュメント", value: "document" },
  { name: "パージョン情報", value: "version" },
  { name: "問題報告", value: "issue" },
  { name: "評価 & レビュー", value: "review" },
  { name: "情報", value: "info" },
];

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug: any = await params;
  const decodedSlug = decodeURIComponent(slug.slug);
  const items: Product[] = await getChromeWebStoreItems();
  const item = items.find((item: Product) => item.name === decodedSlug);
  const pathname: string = item ? item.title : "";
  const pathnames: BreadcrumbsProps["paths"] = [
    { name: "Products", href: "/products" },
    { name: pathname },
  ];

  if (!item) {
    return (
      <NotFoundPage
        className={`min-h-screen mt-20 text-center font-bold`}
        backTop={true}
      />
    );
  }

  // console.log(decodedSlug, item);
  return (
    <main className=" pt-5 grid gap-3">
      <div className="">
        <Breadcrumbs paths={pathnames} className="max-w-7xl mx-auto px-5" />
      </div>
      <ProductItem item={item} className="px-5 max-w-7xl mx-auto" />
      <Tabs defaultValue="description" className="">
        <div className="sticky top-12 px-5 z-60 bg-background border-b shadow-[0_1px_1px_rgba(0,0,0,0.10)]  border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto ">
            <TabsList className="flex flex-wrap gap-2 px-5 pb-0 h-fit bg-background">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  className="cursor-pointer min-w-[130px] p-2 rounded-none rounded-t-lg data-[state=active]:text-primary-foreground data-[state=active]:bg-secondary-foreground dark:data-[state=active]:bg-violet-500"
                  value={tab.value}
                  title={tab.name}
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto md:px-2 min-h-screen">
          {/* 概要 */}
          <TabsContent className="grid md:grid-cols-5 pt-5" value="description">
            <Description
              item={item}
              className="min-h-screen col-span-3 md:col-start-2"
            />
          </TabsContent>
          {/* ドキュメント */}
          <TabsContent className="" value="document">
            <Document item={item} className="" />
          </TabsContent>
          {/* バージョン */}
          <TabsContent className="grid md:grid-cols-5 pt-5" value="version">
            <Version
              item={item}
              className="min-h-screen col-span-3 md:col-start-2"
            />
          </TabsContent>
          {/* 問題報告 */}
          <TabsContent className="grid md:grid-cols-5 pt-5" value="issue">
            <Issue
              item={item}
              className="min-h-screen col-span-3 md:col-start-2"
            />
          </TabsContent>
          {/* 評価 & レビュー */}
          <TabsContent className="grid md:grid-cols-5 pt-5" value="review">
            <Review
              item={item}
              className="min-h-screen col-span-3 md:col-start-2"
            />
          </TabsContent>
          {/* 詳細情報 */}
          <TabsContent value="info" className="grid md:grid-cols-5 pt-5">
            <DetailInfo
              item={item}
              className="p-3 lg:p-5 col-span-3 md:col-start-2 bg-secondary rounded-xl "
            />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}

function ProductItem({
  item,
  className,
}: {
  item: Product;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-col sm:grid gap-2 md:gap-10 sm:grid-cols-5">
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-40 md:h-fit object-cover rounded-sm border-solid"
          title={item.title}
        />
        <div className="col-span-4 grid gap-1">
          <div className="font-bold text-xl">
            <Link href={item.url} className="hover:underline" target="_blank">
              {item.title}
            </Link>
            <div className="flex flex-wrap gap-x-1 mt-1">
              <Badge>{item.category}</Badge>
              {item.tags &&
                item.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <span className="font-bold">{item.rate} 評価</span>
            <span className="after:content-['|']"></span>
            <span className="font-bold">{item.users} ユーザー </span>
            <span className="after:content-['|']"></span>
            <span className="font-bold">バージョン : {item.version}</span>
            <span className="after:content-['|']"></span>
            <span className="font-bold">
              作成者 : {item.author || "yhotta240"}
            </span>
          </div>
          <div>{item.description}</div>
          <Button
            asChild
            variant="outline"
            className="w-fit bg-violet-500 text-white hover:bg-violet-800 hover:text-white dark:bg-violet-500 dark:hover:bg-violet-800"
          >
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

function Description({
  item,
  className,
}: {
  item: Product;
  className?: string;
}) {
  return (
    <div
      className={`${className} bg-secondary dark:bg-secondary rounded-md p-3 lg:p-5 `}
    >
      <DocHtml src={item.doc} className="" />
    </div>
  );
}

function Version({ item, className }: { item: Product; className?: string }) {
  return (
    <div
      className={`${className} bg-secondary dark:bg-secondary rounded-md p-3 lg:p-5 `}
    >
      <div className="font-bold text-xl mb-3">バージョン情報</div>
      <p>{item.version}</p>
    </div>
  );
}

function Issue({ item, className }: { item: Product; className?: string }) {
  return (
    <div
      className={`${className} bg-secondary dark:bg-secondary rounded-md p-3 lg:p-5`}
    >
      <div className="font-bold text-xl mb-3">問題報告</div>
      <div>issue</div>
    </div>
  );
}

function Review({ item, className }: { item: Product; className?: string }) {
  return (
    <div
      className={`${className} bg-secondary dark:bg-secondary rounded-md p-3 lg:p-5`}
    >
      <div className="font-bold text-xl mb-3">レビュー</div>
      <div>review</div>
    </div>
  );
}

function DetailInfo({
  item,
  className,
}: {
  item: Product;
  className?: string;
}) {
  const info = [
    { name: "タイトル", value: item.title },
    { name: "カテゴリ", value: item.category },
    { name: "ステータス", value: item.status },
    { name: "バージョン", value: item.version },
    { name: "作成者", value: item.author },
    { name: "評価", value: item.rate },
    { name: "ユーザー", value: item.users },
    { name: "作成日", value: item.releaseDate },
    { name: "更新日", value: item.updateDate },
    { name: "言語", value: item.language },
    { name: "GitHub", value: item.github, link: true },
  ];

  return (
    <div className={"h-fit" + (className ? " " + className : "")}>
      <div className="font-bold text-xl mb-3">詳細情報</div>
      <ul className="grid gap-2">
        <li>
          <ul>
            <li>
              <a
                className="underline after:content-['_↗']"
                href={`https://chrome.google.com/webstore/detail/${item.id}`}
                id="store_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                ストアページに移動{" "}
              </a>
            </li>
            <li>
              <a
                className="underline after:content-['_↗']"
                href="https://forms.gle/qkaaa2E49GQ5QKMT8"
                id="issue-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                問題を報告する{" "}
              </a>
            </li>
          </ul>
        </li>
        <hr />
        {info.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              {item.name}: <br />
              {item.link ? (
                <a
                  href={item.value}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </li>
            <hr />
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
