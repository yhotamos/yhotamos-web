"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { filterProducts, type ProductFilter } from "@/utils/filterProducts";

export function ProductGrid({ items, title, filter, sort, limit, isOpen = false }: ProductFilter & { items: Product[]; title?: string; isOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const filteredItems = filterProducts({
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
