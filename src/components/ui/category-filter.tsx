"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CategoryFilterProps = {
  heading?: string;
  categories: string[];
  selectedCategories: string[];
  onCategoryClick: (category: string) => void;
  counts?: Record<string, number>;
};

const collapsedMaxHeight = 94;

export function CategoryFilter({ heading, categories, selectedCategories, onCategoryClick, counts }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(([entry]) => {
      setCanExpand(entry.contentRect.height > collapsedMaxHeight);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-label={heading ?? "カテゴリから絞り込む"} className="space-y-2 rounded-lg border border-muted-foreground/50 p-2">
      {heading && <h2 className="font-medium">{heading}</h2>}
      <div className="flex items-center justify-between gap-2">
        <div id={listId} className={cn("min-w-0 flex-1", !isOpen && "overflow-auto")} style={{ maxHeight: isOpen ? undefined : collapsedMaxHeight }}>
          <div ref={contentRef} className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategories.includes(category);
              return (
                <Badge
                  key={category}
                  asChild
                  variant="outline"
                  className={cn(
                    "cursor-pointer rounded-full border-0 px-2.5 py-1 text-[13px] leading-4",
                    "bg-gray-200 text-black hover:bg-gray-300 dark:bg-secondary dark:text-white dark:hover:bg-muted",
                    isActive && "bg-violet-500 text-white hover:bg-violet-600 dark:bg-violet-500 dark:text-white dark:hover:bg-violet-600"
                  )}
                >
                  <button type="button" aria-pressed={isActive} onClick={() => onCategoryClick(category)}>
                    {category}
                    {counts?.[category] !== undefined && <span className="tabular-nums opacity-60">{counts[category]}</span>}
                    {isActive && <span aria-hidden="true">✕</span>}
                  </button>
                </Badge>
              );
            })}
            {categories.length === 0 && <p className="text-sm text-muted-foreground">カテゴリがありません</p>}
          </div>
        </div>
        {canExpand && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isOpen ? "カテゴリを折りたたむ" : "カテゴリを展開する"}
            aria-expanded={isOpen}
            aria-controls={listId}
            className="shrink-0 cursor-pointer rounded-full"
            onClick={() => setIsOpen((open) => !open)}
          >
            <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
          </Button>
        )}
      </div>
    </section>
  );
}
