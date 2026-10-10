"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { filterProducts, type ProductFilter } from "@/utils/filterProducts";
import { cn } from "@/lib/utils";

// 初期表示：スマホ1件，smで2件，mdで3件，lgで4件。
const previewVisibility = ["", "hidden sm:block", "hidden md:block", "hidden lg:block"];
// 2件目以降の表示条件。展開後の合計：スマホ4件，mdで6件，lgで8件。
const additionalVisibility = ["sm:hidden", "md:hidden", "lg:hidden", "hidden md:block", "hidden md:block", "hidden lg:block", "hidden lg:block"];

interface ProductGridProps extends ProductFilter {
  items: Product[];
  title?: string;
  expandable?: boolean;
}

export function ProductGrid({ items, title, filter, sort, limit, expandable = false }: ProductGridProps) {
  const filteredItems = filterProducts({ items, filter, sort, limit });

  return (
    <div className="w-full">
      {title && <h1 className="font-bold text-xl mb-3">{title}</h1>}
      {expandable && <ExpandableProducts items={filteredItems} />}
      {!expandable && <ProductCards items={filteredItems} className="pb-5" />}
    </div>
  );
}

function ExpandableProducts({ items }: { items: Product[] }) {
  const [expanded, setExpanded] = useState(false);
  const gridId = useId();
  const hasAdditionalItems = items.length > 1;
  const expansionVisibility = cn(items.length <= 2 && "sm:hidden", items.length <= 3 && "md:hidden", items.length <= 4 && "lg:hidden");

  return (
    <>
      <ProductCards items={items.slice(0, previewVisibility.length)} visibility={previewVisibility} />
      {hasAdditionalItems && (
        <>
          <div id={gridId} inert={!expanded} className={cn("grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none", expanded && "grid-rows-[1fr]", expansionVisibility)}>
            <div className="min-h-0 overflow-hidden">
              <ProductCards items={items.slice(1, additionalVisibility.length + 1)} visibility={additionalVisibility} className="pt-3" />
            </div>
          </div>
          <Button type="button" variant="outline" size="icon" className={cn("mx-auto mt-5 flex rounded-full", expansionVisibility)} aria-label={expanded ? "プロダクトを折りたたむ" : "残りのプロダクトを表示"} aria-expanded={expanded} aria-controls={gridId} onClick={() => setExpanded(!expanded)}>
            {expanded && <ChevronUp aria-hidden="true" />}
            {!expanded && <ChevronDown aria-hidden="true" />}
          </Button>
        </>
      )}
      <div className="mt-4 text-right">
        <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          一覧を見る ＞
        </Link>
      </div>
    </>
  );
}

function ProductCards({ items, visibility, className }: { items: Product[]; visibility?: readonly string[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", className)}>
      {items.map((item, index) => (
        <li key={item.repo_name} className={cn("min-w-0", visibility?.[index])}>
          <ProductCard item={item} />
        </li>
      ))}
    </ul>
  );
}

function ProductCard({ item }: { item: Product }) {
  return (
    <Link href={`/products/${item.repo_name}`} className="group block h-full overflow-hidden rounded-lg border hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={item.thumbnail}
          alt=""
          fill
          sizes="(min-width: 1280px) 295px, (min-width: 1024px) calc(25vw - 25px), (min-width: 768px) calc((100vw - 88px) / 3), (min-width: 640px) calc(50vw - 38px), calc(100vw - 64px)"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
        />
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start gap-2">
          <Image src={item.icon_url} alt="" width={24} height={24} className="size-6 shrink-0 rounded object-contain" />
          <h3 className="line-clamp-2 text-sm font-medium break-words">{item.name}</h3>
        </div>
        <p className="line-clamp-1 text-sm text-muted-foreground break-words">{item.description}</p>
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
  );
}
