"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faGrip } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/types/product";

export { ProductPage, ProductGrid, ProductList };

function ProductPage({ items, userCategories, devCategories }: { items?: Product[]; userCategories: any; devCategories: any }) {
  const router = useRouter(); // ルーター(urlに書き込む用)
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => searchParams.get("category")?.split(",") || []);
  const [tab, setTab] = useState(searchParams.get("tab") || "user");

  const updateURL = (params: URLSearchParams) => {
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setTab("user");
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setTab(tab); // UI即時更新
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.delete("category"); // タブ切り替え時にカテゴリをリセット
    updateURL(params);
  };

  const handleCategory = (key: string) => {
    let newCategories = [...selectedCategories];
    if (selectedCategories.includes(key)) {
      // 選択済み → 削除
      newCategories = selectedCategories.filter((c) => c !== key);
    } else {
      // 未選択 → 追加
      newCategories.push(key);
    }
    setSelectedCategories(newCategories); // UI即時更新

    const params = new URLSearchParams(searchParams.toString());
    if (newCategories.length > 0) {
      params.set("category", newCategories.join(","));
    } else {
      params.delete("category");
    }

    updateURL(params); // URL更新
  };

  return (
    <div className="max-w-full my-3">
      <ProductHero className="mb-6" title={"Product"} description="開発したツールやWEBサービスなどをまとめています．" />

      <Tabs defaultValue={tab} className="flex items-center md:items-start" onValueChange={(value) => handleTabChange(value)}>
        <TabsList className="flex gap-3 h-10">
          <TabsTrigger className="h-fit cursor-pointer" value="user">
            ユーザー向け
          </TabsTrigger>
          <TabsTrigger className="h-fit cursor-pointer" value="developer">
            開発者向け
          </TabsTrigger>
        </TabsList>

        <TabsContent className="flex flex-col gap-5 w-full" value="user">
          <ProductCategory categories={userCategories} selectedCategories={selectedCategories} handleCategory={handleCategory} />
          <ProductContents items={items} categories={selectedCategories} />
        </TabsContent>
        <TabsContent className="flex flex-col gap-5 w-full" value="developer">
          <ProductCategory categories={devCategories} selectedCategories={selectedCategories} handleCategory={handleCategory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ProductHero({ title, description, className = "" }: { title: string; description: string; className?: string }) {
  return (
    <section className={`${className} text-center space-y-4`}>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-secondary-foreground/70 text-sm md:text-base">{description}</p>
    </section>
  );
}

function ProductCategory({ categories, selectedCategories, handleCategory }: any) {
  return (
    <div className="flex flex-col gap-2 text-white bg-gray-800 p-4 rounded-lg border">
      <p className="font-medium">カテゴリーから絞り込む</p>
      <div className="flex flex-wrap gap-2">
        {categories.map((category: string) => {
          category = category.trim();
          const isActive = selectedCategories.includes(category);
          return (
            <Badge
              key={category}
              variant={isActive ? undefined : "outline"}
              className={`${isActive ? "bg-yellow-300 " : "bg-white hover:bg-white/80"} text-black cursor-pointer  rounded-full`}
              onClick={() => handleCategory(category)} // クリックしたらhandleCategoryを呼び出す
            >
              {category} {isActive && "✕"}
            </Badge>
          );
        })}
        {categories.length === 0 && <div className="text-sm text-muted/70">カテゴリがありません</div>}
      </div>
    </div>
  );
}

function ProductContents({ items, className, categories }: { items?: any; className?: string; categories?: string[] }) {
  const [view, setView] = useState<"list" | "grid">("grid");
  const [sort, setSort] = useState("sort-popular");

  const sortData = [
    { value: "sort-popular", label: "人気順" },
    { value: "sort-new", label: "新着順" },
    { value: "sort-update", label: "更新順" },
  ];

  const iconMap = {
    list: faList,
    grid: faGrip,
  };

  const ViewMap = ({ view, items }: any) => {
    switch (view) {
      case "list":
        return ProductList({ items });
      case "grid":
        return ProductGrid({ items });
      default:
        return ProductGrid({ items });
    }
  };

  const filteredItems = filterItems({ items, categories, sort });

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        {/* 件数表示 */}
        <h2 className="text-lg font-semibold ms-3">{filteredItems.length}件</h2>
        <div className="flex gap-4 justify-end">
          {/* 並べ替えオプション */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {sortData.map(({ value, label }, index) => (
              <React.Fragment key={value}>
                <button
                  id={value}
                  className={`${
                    sort === value ? "text-black underline dark:text-white" : ""
                  } cursor-pointer hover:text-black dark:hover:text-white`}
                  onClick={() => setSort(value)}
                >
                  {label}
                </button>
                {index < sortData.length - 1 && <span>|</span>}
              </React.Fragment>
            ))}
          </div>
          {/* 表示オプション */}
          <Select defaultValue={view} onValueChange={(value) => setView(value as "list" | "grid")}>
            <SelectTrigger className="cursor-pointer justify-center">
              <FontAwesomeIcon icon={iconMap[view]} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="grid">
                <FontAwesomeIcon icon={faGrip} />
                グリッド表示
              </SelectItem>
              <SelectItem className="cursor-pointer" value="list">
                <FontAwesomeIcon icon={faList} />
                リスト表示
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ViewMap view={view} items={filteredItems} className="my-3" />
    </div>
  );
}

type Filter = {
  filter?: string;
  sort?: string;
  limit?: number;
};

function ProductGrid({ items, title, filter, sort, limit = 9, isOpen = false }: Filter & { items: any; title?: string; isOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const filteredItems = filterItems({
    items,
    filter,
    sort,
    limit: isOpen ? limit : 9,
  });

  const scrollView = (id: string) => {
    const el = document.getElementById(id);
    el?.previousElementSibling?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="product-grid" className="w-full">
      {title && <h1 className="font-bold text-xl mb-3">{title}</h1>}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 transition-all duration-500 ease-in px-3 pb-5 ${
          isOpen && (open ? "max-h-full" : "max-h-[460px]")
        }  overflow-hidden`}
      >
        {filteredItems.map((item: any, index: number) => (
          <Card
            key={index}
            className={`rounded-md gap-4 mb-3 transition-transform duration-300 ease-out ${
              !open ? "opacity-100 translate-y-0 delay-[" + index * 1000 + "ms]" : "delay-[" + index * 1000 + "ms]"
            }
            translate-y-4 hover:scale-102 hover:shadow-md hover:shadow-gray-500 hover:cursor-pointer`}
            title={item.title}
          >
            <div className="relative">
              {item.rate !== "—" && (
                <div className="bg-gray-900 text-yellow-400 rounded-full opacity-80 w-fit absolute top-2 px-2 right-2 ">{item.rate}</div>
              )}
              <img src={item.src} alt={item.title} />
            </div>
            <div className="col-span-2 grid gap-1">
              <CardHeader className="px-2">
                <CardTitle className="leading-none font-semibold flex items-start gap-2 whitespace-normal break-words">
                  <img src={item.icon} alt="" className="w-6 h-6" />
                  <a href={item.url} className="hover:underline line-clamp-2" rel="noopener noreferrer" target="_blank">
                    {item.title}
                  </a>
                  <span className="text-sm text-end">v{item.version}</span>
                </CardTitle>
                <div className="">
                  <div className="text-sm flex justify-between">
                    <div>{item.releaseDate}</div>
                    <div>{item.users !== "—" ? item.users : 0} ユーザー</div>
                  </div>
                  <div className="flex gap-1 pt-1 flex-wrap">
                    <Badge>{item.category}</Badge>
                    {item.tags ? item.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2">
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </CardContent>
            </div>
            <Link href={`/products/${item.name}`} className="absolute inset-0 z-10" />
          </Card>
        ))}
      </div>
      {isOpen &&
        (!open ? (
          <Button
            variant="default"
            className="w-fit flex justify-center mx-auto mt-4 hover:scale-101 hover:shadow-sm bg-violet-700 hover:bg-violet-800 text-white"
            onClick={() => setOpen(true)}
          >
            もっと見る
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-fit flex justify-center mx-auto mt-4 hover:scale-101 hover:shadow-sm bg-violet-700 hover:bg-violet-800 text-white"
            onClick={() => {
              setOpen(false);
              scrollView("product-grid");
            }}
          >
            閉じる
          </Button>
        ))}
      {isOpen && (
        <div className="text-right me-3">
          <Link href="/products" className="text-blue-600 dark:text-blue-400 hover:underline">
            すべてのプロダクトを見る ＞
          </Link>
        </div>
      )}
    </div>
  );
}

function ProductList({ items, title }: Filter & { items: any; title?: string }) {
  return (
    <div className="w-full">
      <h1 className="font-bold text-xl mb-3">{title}</h1>
      <div className="overflow-x-auto ">
        <div className="w-full p-2 rounded-md border grid">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>タイトル</TableHead>
                <TableHead>バージョン</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead>ユーザー数</TableHead>
                <TableHead>説明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="truncate w-50">
                      <a href={item.url} className="hover:underline" rel="noopener noreferrer" target="_blank">
                        {item.title}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>v{item.version}</TableCell>
                  <TableCell>{item.releaseDate}</TableCell>
                  <TableCell>{item.users}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* <Image
        src={item.src}
        alt=""
        width={100}
        height={100}
        className="rounded-sm border-solid"
      /> */}
        </div>
      </div>
    </div>
  );
}

function filterItems({ items, categories = [], filter, sort, limit }: Filter & { items: any; categories?: string[] }) {
  let filtered = [...items];
  // カテゴリ処理
  if (categories.length > 0) {
    filtered = filtered.filter(
      (item) => categories.includes(item.category) || item.tags?.some((tag: string) => categories.includes(tag.trim()))
    );
  }

  // 検索処理
  if (filter) {
    filtered = filtered.filter((item) => item.category.includes(filter));
  }

  // ソート処理
  // 人気順
  if (sort === "users-desc" || sort === "sort-popular") {
    filtered = filtered.sort((a, b) => {
      const aUsers = parseInt(a.users || 0);
      const bUsers = parseInt(b.users || 0);
      return bUsers - aUsers;
    });
  }
  // 新着順
  if (sort === "sort-new") {
    filtered = filtered.sort((a, b) => {
      const aDate = new Date(a.releaseDate).getTime() || 0;
      const bDate = new Date(b.releaseDate).getTime() || 0;
      return bDate - aDate;
    });
  }
  // 更新順
  if (sort === "sort-update") {
    filtered = filtered.sort((a, b) => {
      const aDate = new Date(a.updateDate).getTime() || 0;
      const bDate = new Date(b.updateDate).getTime() || 0;
      return bDate - aDate;
    });
  }

  if (typeof limit === "number") {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}
