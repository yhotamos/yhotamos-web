"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/components/config/iconMap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SortType } from "@/utils/filterItems";

interface FilterPopupProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  availableYears: number[];
  selectedYear?: number;
  onYearChange?: (year: number | null) => void;
  selectedMonth?: number;
  onMonthChange?: (month: number | null) => void;
  hasFilter: boolean;
  onClear: () => void;
  onClose: () => void;
}

function BlogFilterPopup({ searchQuery, onSearchChange, availableYears, selectedYear, onYearChange, selectedMonth, onMonthChange, hasFilter, onClear, onClose }: FilterPopupProps) {
  return (
    <div className="absolute left-0 top-9 z-50 w-64 bg-popover border border-border rounded-lg shadow-lg p-3 space-y-3 text-foreground">
      <div className="relative">
        <FontAwesomeIcon icon={iconMap["faMagnifyingGlass"]} className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="タイトルで検索"
          className="w-full pl-7 pr-3 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      {availableYears.length > 0 && onYearChange && (
        <select
          value={selectedYear ?? ""}
          onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-2 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">すべての年</option>
          {availableYears.map((y) => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
      )}
      {availableYears.length > 0 && onYearChange && onMonthChange && (
        <select
          value={selectedMonth ?? ""}
          onChange={(e) => onMonthChange(e.target.value ? Number(e.target.value) : null)}
          disabled={!selectedYear}
          className="w-full px-2 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40"
        >
          <option value="">すべての月</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}月</option>
          ))}
        </select>
      )}
      {hasFilter && (
        <button
          onClick={() => { onClear(); onClose(); }}
          className="w-full text-xs text-center text-muted-foreground hover:text-foreground py-1"
        >
          絞り込みをリセット
        </button>
      )}
    </div>
  );
}

export interface BlogSectionHeaderProps {
  total: number;
  currentCategory?: string;
  sort: string;
  setSort: (s: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (o: "asc" | "desc") => void;
  hasLikes?: boolean;
  hasViews?: boolean;
  selectedYear?: number;
  selectedMonth?: number;
  onClearDateFilter?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  availableYears?: number[];
  onYearChange?: (year: number | null) => void;
  onMonthChange?: (month: number | null) => void;
}

export function BlogSectionHeader({
  total,
  currentCategory,
  sort,
  setSort,
  sortOrder,
  setSortOrder,
  hasLikes = false,
  hasViews = false,
  selectedYear,
  selectedMonth,
  onClearDateFilter,
  searchQuery = "",
  onSearchChange,
  availableYears = [],
  onYearChange,
  onMonthChange,
}: BlogSectionHeaderProps) {
  const sortOptions: { value: SortType; label: string }[] = [
    { value: "blog-new", label: "新着順" },
    ...(hasLikes ? [{ value: "blog-likes" as SortType, label: "人気順" }] : []),
    ...(hasViews ? [{ value: "blog-views" as SortType, label: "閲覧順" }] : []),
  ];

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  const toggleOrder = () => setSortOrder(sortOrder === "desc" ? "asc" : "desc");

  const dateLabel = selectedYear ? (selectedMonth ? `${selectedYear}年${selectedMonth}月` : `${selectedYear}年`) : null;
  const hasFilter = !!dateLabel || !!searchQuery.trim();

  const handleClear = () => {
    onClearDateFilter?.();
    onSearchChange?.("");
  };

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      {/* 左: 件数 + フィルタアイコン（ポップアップ付き）+ 絞り込みバッジ */}
      <div className="flex items-center gap-1 flex-wrap">
        <h2 className="ms-1 text-lg font-semibold">
          {currentCategory ? `${currentCategory}の記事` : "すべての記事"}（{total}件）
        </h2>
        <div className="relative" ref={filterRef}>
          <Button
            variant="ghost"
            size="icon"
            className={cn("w-7 h-7 rounded hover:bg-gray-300", hasFilter && "text-violet-500")}
            title="絞り込み"
            onClick={() => setFilterOpen((o) => !o)}
          >
            <FontAwesomeIcon icon={iconMap["faFilter"]} className="w-3 h-3" />
          </Button>
          {filterOpen && onSearchChange && (
            <BlogFilterPopup
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              availableYears={availableYears}
              selectedYear={selectedYear}
              onYearChange={onYearChange}
              selectedMonth={selectedMonth}
              onMonthChange={onMonthChange}
              hasFilter={hasFilter}
              onClear={handleClear}
              onClose={() => setFilterOpen(false)}
            />
          )}
        </div>
        {hasFilter && (
          <span className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-full">
            {[dateLabel, searchQuery.trim() ? `「${searchQuery.trim()}」` : null].filter(Boolean).join(" ・ ")}
            <button onClick={handleClear} className="ml-1 text-muted-foreground hover:text-foreground" title="絞り込みを解除">
              ✕
            </button>
          </span>
        )}
      </div>

      {/* 右: ソートオプション + 昇順降順ボタン */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {sortOptions.map(({ value, label }, index) => (
          <React.Fragment key={value}>
            <button
              id={value}
              className={`${sort === value ? "text-black underline dark:text-white" : ""} cursor-pointer hover:text-black dark:hover:text-white`}
              onClick={() => setSort(value)}
            >
              {label}
            </button>
            {index < sortOptions.length - 1 && <span>|</span>}
          </React.Fragment>
        ))}
        <Button
          title={sortOrder === "desc" ? "降順" : "昇順"}
          variant="ghost"
          size="icon"
          className="w-7 h-7 rounded hover:bg-gray-300"
          onClick={toggleOrder}
        >
          <FontAwesomeIcon icon={sortOrder === "desc" ? iconMap["faArrowDownWideShort"] : iconMap["faArrowUpWideShort"]} />
        </Button>
      </div>
    </div>
  );
}
