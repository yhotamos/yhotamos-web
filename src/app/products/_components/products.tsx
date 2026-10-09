"use client";

import React, { Suspense, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faGrip, faBars, faAlignLeft, faImage } from "@fortawesome/free-solid-svg-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "@/components/ui/category-filter";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/layout/product";
import { filterProducts, type ProductFilter } from "@/utils/filterProducts";
import { ProductCompact, ProductRows } from "./views";
import { ChevronDown } from "lucide-react";

export { ProductPage };

const viewOptions = [
  { value: "thumbnail", label: "サムネイル", icon: faImage },
  { value: "grid", label: "グリッド", icon: faGrip },
  { value: "list", label: "リスト", icon: faList },
  { value: "simple", label: "シンプル", icon: faAlignLeft },
  { value: "compact", label: "コンパクト", icon: faBars },
] as const;

type ProductView = (typeof viewOptions)[number]["value"];

const subscribeToHydration = () => () => undefined;

function ProductPageInner({ items, categories, categoryCounts }: { items?: Product[]; categories: string[]; categoryCounts: Record<string, number> }) {
  const searchParams = useSearchParams();
  const selectedCategories = searchParams.getAll("category");

  const updateURL = (params: URLSearchParams) => {
    window.history.replaceState(null, "", `/products?${decodeURIComponent(params.toString())}`);
  };

  const handleCategory = (key: string) => {
    let newCategories = [...selectedCategories];
    if (selectedCategories.includes(key)) {
      newCategories = selectedCategories.filter((c) => c !== key);
    } else {
      newCategories.push(key);
    }

    const params = new URLSearchParams();
    newCategories.forEach((c) => params.append("category", c));
    if (newCategories.length === 0) {
      params.delete("category");
    }

    updateURL(params);
  };

  return (
    <div className="max-w-full my-3">
      <ProductHero className="mb-6" title={"Products"} description="開発したツールやWEBサービスなどをまとめています．" />

      <div className="flex flex-col gap-5">
        <CategoryFilter heading="カテゴリから絞り込む" categories={categories} selectedCategories={selectedCategories} onCategoryClick={handleCategory} counts={categoryCounts} />
        <ProductContents items={items} categories={selectedCategories} />
      </div>
    </div>
  );
}

function ProductPage(props: Parameters<typeof ProductPageInner>[0]) {
  return (
    <Suspense fallback={null}>
      <ProductPageInner {...props} />
    </Suspense>
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

function ProductContents({ items, className, categories }: { items?: Product[]; className?: string; categories?: string[] }) {
  const [view, setView] = useState<ProductView>("thumbnail");
  const [sort, setSort] = useState("sort-popular");
  // iOS Chromeが初期HTMLの隠しselectに属性を追加するため，Selectはhydration後に描画する
  const hasHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  const sortData = [
    { value: "sort-popular", label: "人気順" },
    { value: "sort-new", label: "新着順" },
    { value: "sort-update", label: "更新順" },
  ];

  const filteredItems = filterProducts({ items, categories, sort });
  const selectedView = viewOptions.find((option) => option.value === view) ?? viewOptions[0];

  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* 件数表示 */}
        <h2 className="text-lg font-semibold ms-3">{filteredItems.length}件</h2>
        <div className="flex flex-wrap items-center gap-3 justify-end">
          {/* 並べ替えオプション */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {sortData.map(({ value, label }, index) => (
              <React.Fragment key={value}>
                <button id={value} className={`${sort === value ? "text-black underline dark:text-white" : ""} cursor-pointer hover:text-black dark:hover:text-white`} onClick={() => setSort(value)}>
                  {label}
                </button>
                {index < sortData.length - 1 && <span>|</span>}
              </React.Fragment>
            ))}
          </div>
          {/* 表示オプション */}
          {!hasHydrated && (
            <Button type="button" variant="outline" disabled className="h-9 gap-2 bg-transparent px-3 py-2 text-muted-foreground" aria-label="表示形式" title={selectedView.label}>
              <FontAwesomeIcon icon={selectedView.icon} />
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          )}
          {hasHydrated && (
            <Select value={view} onValueChange={(value) => setView(value as ProductView)}>
              <SelectTrigger className="cursor-pointer justify-center" aria-label="表示形式" title={selectedView.label}>
                <SelectValue>
                  <FontAwesomeIcon icon={selectedView.icon} />
                  <span className="sr-only">{selectedView.label}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {viewOptions.map(({ value, label, icon }) => (
                  <SelectItem key={value} className="cursor-pointer" value={value}>
                    <FontAwesomeIcon icon={icon} />
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {view === "grid" && <ProductGrid items={filteredItems} />}
      {view === "list" && <ProductList items={filteredItems} />}
      {view === "simple" && <ProductRows items={filteredItems} />}
      {view === "compact" && <ProductCompact items={filteredItems} />}
      {view === "thumbnail" && <ProductRows items={filteredItems} thumbnails />}
    </div>
  );
}

function ProductList({ items, title }: ProductFilter & { items: Product[]; title?: string }) {
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
              {items.map((item: Product, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="truncate w-50">
                      <Link href={`/products/${item.repo_name}`} className="hover:underline">
                        {item.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>v{item.version}</TableCell>
                  <TableCell>{item.created_at}</TableCell>
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
