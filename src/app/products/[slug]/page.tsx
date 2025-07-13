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
      <div className="w-full">
        <h2 className="font-bold text-xl mb-3 text-center">Page not found</h2>
      </div>
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
        <div className="sticky top-12 px-5 z-60 bg-background border-b shadow-sm border-gray-200 dark:border-gray-700">
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

        <div className="max-w-7xl mx-auto md:px-5 min-h-screen">
          <TabsContent className="grid md:grid-cols-5 pt-5" value="description">
            <Description
              item={item}
              className="min-h-screen col-span-3 col-start-2"
            />
          </TabsContent>
          {/* <p>ドキュメント</p> */}
          <TabsContent className="" value="document">
            <Document item={item} className="" />
          </TabsContent>
          {/* バージョン */}
          <TabsContent className="grid md:grid-cols-5 pt-5" value="version">
            <div className="col-span-3 col-start-2">
              <p>{item.version}</p>
            </div>
          </TabsContent>
          <TabsContent value="faq">
            <p></p>
          </TabsContent>
          <TabsContent value="review">
            <p></p>
          </TabsContent>
          {/* 詳細情報 */}
          <TabsContent value="info" className="grid md:grid-cols-5 pt-5">
            <DetailInfo
              item={item}
              className="pt-5 md:ps-4 col-span-3 col-start-2 bg-secondary rounded-xl "
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
      className={`${className} bg-secondary dark:bg-secondary rounded-md pt-3 px-5`}
    >
      <DocHtml src={item.doc} className="" />
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
        <li>
          タイトル: <br /> {item.title}
        </li>
        <hr />
        <li>
          カテゴリ: <br />
          {item.category}
        </li>
        <hr />
        <li>
          ステータス: <br />
          {item.status}
        </li>
        <hr />
        <li>
          説明:
          <br /> {item.description}
        </li>{" "}
        <hr />
        <li>
          バージョン: <br />
          {item.version}
        </li>{" "}
        <hr />
        <li>
          評価: <br />
          {item.rate}
        </li>
        <hr />
        <li>
          ユーザー: <br />
          {item.users}
        </li>
        <hr />
        <li>
          作成日: <br />
          {item.releaseDate}
        </li>{" "}
        <hr />
        <li>
          更新日: <br />
          {item.updateDate}
        </li>{" "}
        <hr />
        <li>
          言語: <br />
          {item.language || "日本語"}
        </li>
        <hr />
        <li>
          作成者: <br />
          {item.author || "yhotta240"}
        </li>
        <hr />
        <li>
          GitHub: <br />
          <a
            href={item.github}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.github}
          </a>
        </li>
      </ul>
    </div>
  );
}
