"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faGrip, faBars, faAlignLeft, faImage } from "@fortawesome/free-solid-svg-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/types/product";
import Image from "next/image";
import { ProductCompact, ProductRows } from "./product-views";

export { ProductPage, ProductGrid, ProductList };

const viewOptions = [
  { value: "thumbnail", label: "サムネイル", icon: faImage },
  { value: "grid", label: "グリッド", icon: faGrip },
  { value: "list", label: "リスト", icon: faList },
  { value: "simple", label: "シンプル", icon: faAlignLeft },
  { value: "compact", label: "コンパクト", icon: faBars },
] as const;

type ProductView = (typeof viewOptions)[number]["value"];

function ProductPageInner({ items, categories }: { items?: Product[]; categories: string[] }) {
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
        <ProductCategory categories={categories} selectedCategories={selectedCategories} handleCategory={handleCategory} />
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

function ProductCategory({ categories, selectedCategories, handleCategory }: { categories: string[]; selectedCategories: string[]; handleCategory: (category: string) => void }) {
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

function ProductContents({ items, className, categories }: { items?: Product[]; className?: string; categories?: string[] }) {
  const [view, setView] = useState<ProductView>("thumbnail");
  const [sort, setSort] = useState("sort-popular");

  const sortData = [
    { value: "sort-popular", label: "人気順" },
    { value: "sort-new", label: "新着順" },
    { value: "sort-update", label: "更新順" },
  ];

  const filteredItems = filterItems({ items, categories, sort });
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

type Filter = {
  filter?: string;
  sort?: string;
  limit?: number;
};

function ProductGrid({ items, title, filter, sort, limit, isOpen = false }: Filter & { items: Product[]; title?: string; isOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const filteredItems = filterItems({
    items,
    filter,
    sort,
    limit: isOpen ? limit : 50,
  });

  const scrollView = (id: string) => {
    const el = document.getElementById(id);
    el?.previousElementSibling?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="product-grid" className="w-full">
      {title && <h1 className="font-bold text-xl mb-3">{title}</h1>}
      <ul
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-3 pb-5 ${
          isOpen && (open ? "max-h-full" : "max-h-[460px]")
        }  overflow-hidden`}
      >
        {filteredItems.map((item) => (
          <li key={item.repo_name} className="min-w-0">
            <Link href={`/products/${item.repo_name}`} className="block h-full overflow-hidden rounded-lg border hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2">
              <div className="relative aspect-video w-full">
                <Image
                  src={item.thumbnail}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 295px, (min-width: 1024px) calc(25vw - 25px), (min-width: 768px) calc((100vw - 88px) / 3), (min-width: 640px) calc(50vw - 38px), calc(100vw - 64px)"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start gap-2">
                  <Image src={item.icon_url} alt="" width={24} height={24} className="size-6 shrink-0 rounded object-contain" />
                  <h3 className="min-h-10 line-clamp-2 text-sm font-medium break-words">{item.name}</h3>
                </div>
                <p className="min-h-10 line-clamp-2 text-sm text-muted-foreground break-words">{item.description}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{item.category}</span>
                  <span>v{item.version}</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>更新 {item.updated_at}</span>
                  <span>{(item.users ?? 0).toLocaleString("ja-JP")} ユーザー</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {isOpen &&
        (!open ? (
          <Button variant="outline" className="flex mx-auto mt-4" onClick={() => setOpen(true)}>
            もっと見る
          </Button>
        ) : (
          <Button
            variant="outline"
            className="flex mx-auto mt-4"
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

function ProductList({ items, title }: Filter & { items: Product[]; title?: string }) {
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

function filterItems({ items, categories = [], filter, sort, limit }: Filter & { items?: Product[]; categories?: string[] }) {
  let filtered = [...(items ?? [])];
  // カテゴリ処理
  if (categories.length > 0) {
    filtered = filtered.filter((item) => categories.includes(item.category) || item.tags?.some((tag: string) => categories.includes(tag.trim())));
  }

  // 検索処理
  if (filter) {
    filtered = filtered.filter((item) => item.category.includes(filter));
  }

  // ソート処理
  // 人気順
  if (sort === "users-desc" || sort === "sort-popular") {
    filtered = filtered.sort((a, b) => {
      const aUsers = a.users || 0;
      const bUsers = b.users || 0;
      return bUsers - aUsers;
    });
  }
  // 新着順
  if (sort === "sort-new") {
    filtered = filtered.sort((a, b) => {
      const aDate = new Date(a.created_at).getTime() || 0;
      const bDate = new Date(b.created_at).getTime() || 0;
      return bDate - aDate;
    });
  }
  // 更新順
  if (sort === "sort-update") {
    filtered = filtered.sort((a, b) => {
      const aDate = new Date(a.updated_at).getTime() || 0;
      const bDate = new Date(b.updated_at).getTime() || 0;
      return bDate - aDate;
    });
  }

  if (typeof limit === "number") {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}
