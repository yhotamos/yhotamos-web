"use client";

import { Product } from "@/components/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocHtml, Document } from "./document";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const tabs: { name: string; value: string }[] = [
  { name: "概要", value: "description" },
  { name: "ドキュメント", value: "document" },
  { name: "パージョン情報", value: "version" },
  { name: "フィードバック", value: "feedback" },
  { name: "評価 & レビュー", value: "review" },
  { name: "情報", value: "info" },
];

export default function TabController({ item, className }: { item: Product; className?: React.ComponentProps<typeof Tabs>["className"] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabs.some((t) => t.value === tab)) {
      setActiveTab(tab);
    } else {
      handleTabChange("description"); // デフォルトに戻す
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs defaultValue={activeTab} className={className} id="tabs" value={activeTab} onValueChange={handleTabChange}>
      <div className="sticky top-12 px-5 z-50 bg-background border-b shadow-[0_1px_1px_rgba(0,0,0,0.10)]  border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto ">
          <TabsList id="tabs-list" className="flex flex-wrap gap-2 px-5 pb-0 h-fit bg-background">
            {tabs.map((tab: any) => (
              <TabsTrigger
                id={tab.value}
                key={tab.value}
                className="cursor-pointer w-fit md:min-w-[130px] p-2 rounded-none rounded-t-lg data-[state=active]:text-primary-foreground data-[state=active]:bg-secondary-foreground dark:data-[state=active]:bg-violet-500"
                value={tab.value}
                title={tab.name}
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-2 min-h-screen w-full">
        {/* 概要 */}
        <TabsContent className="grid md:grid-cols-5 pt-5" value="description">
          <Description item={item} className="min-h-screen col-span-3 md:col-start-2" />
        </TabsContent>
        {/* ドキュメント */}
        <TabsContent className="" value="document">
          <Document item={item} className="" />
        </TabsContent>
        {/* バージョン */}
        <TabsContent className="grid md:grid-cols-5 pt-5" value="version">
          <Version item={item} className="min-h-screen col-span-3 md:col-start-2" />
        </TabsContent>
        {/* フィードバック */}
        <TabsContent className="grid md:grid-cols-5 pt-5" value="feedback">
          <Feedback item={item} className="min-h-screen col-span-3 md:col-start-2" />
        </TabsContent>
        {/* 評価 & レビュー */}
        <TabsContent className="grid md:grid-cols-5 pt-5" value="review">
          <Review item={item} className="min-h-screen col-span-3 md:col-start-2" />
        </TabsContent>
        {/* 詳細情報 */}
        <TabsContent value="info" className="grid md:grid-cols-5 pt-5">
          <DetailInfo item={item} className="p-3 lg:p-5 col-span-3 md:col-start-2 bg-secondary rounded-xl " />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function Description({ item, className }: { item: Product; className?: string }) {
  return (
    <div className={`${className} bg-secondary dark:bg-secondary rounded-md p-3 lg:p-5 `}>
      <DocHtml src={item.doc} className="" />
    </div>
  );
}

function Version({ item, className }: { item: Product; className?: string }) {
  return (
    <div className={`${className} bg-secondary dark:bg-secondary rounded-md p-3 lg:p-5 `}>
      <div className="font-bold text-xl mb-3">バージョン情報</div>
      <p>{item.version}</p>
    </div>
  );
}

function Feedback({ item, className }: { item: Product; className?: string }) {
  return (
    <div className={`${className} w-full bg-secondary dark:bg-secondary rounded-md p-3 lg:p-5`}>
      <div className="font-bold text-xl mb-3">フィードバック</div>
      <div>feedback</div>
    </div>
  );
}

function Review({ item, className }: { item: Product; className?: string }) {
  return (
    <div className={`${className} bg-secondary dark:bg-secondary rounded-md p-3 lg:p-5`}>
      <div className="font-bold text-xl mb-3">レビュー</div>
      <div>review</div>
    </div>
  );
}

function DetailInfo({ item, className }: { item: Product; className?: string }) {
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
              <a className="underline" href={`https://chrome.google.com/webstore/detail/${item.id}`} id="store_link" target="_blank" rel="noopener noreferrer">
                ストアページに移動 <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </li>
            <li>
              <a className="underline" href="https://forms.gle/qkaaa2E49GQ5QKMT8" id="issue-link" target="_blank" rel="noopener noreferrer">
                問題を報告する <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
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
                <a href={item.value} className="underline" target="_blank" rel="noopener noreferrer">
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
