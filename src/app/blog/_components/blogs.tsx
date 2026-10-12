"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Suspense, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { filterItems, type SortType } from "@/utils/filterItems";
import { Blog, QiitaBlog } from "@/types/blog";
import { useBlogDateFilter } from "@/hooks/useBlogDateFilter";
import { BlogSectionHeader } from "./section-header";
import { BlogCards } from "@/components/layout/blog-cards";
import { PageHero } from "@/components/layout/page-hero";
import { BlogList } from "./list";
import { BlogArchive, BlogArchiveDetail } from "./archive";
import { CategoryFilter } from "@/components/ui/category-filter";

interface BlogsProps {
  title: string;
  className?: string;
  qittaBlogs?: QiitaBlog[];
  blogs?: Blog[];
  blogTags?: string[];
}

function BlogsInner({ title, className, qittaBlogs = [], blogs = [], blogTags = [] }: BlogsProps) {
  const trigger =
    "relative !bg-secondary dark:!bg-black border-0 after:content-[''] after:block data-[state=active]:after:w-1/2 after:h-[2px] after:bg-black dark:after:bg-white after:absolute after:bottom-0";
  const triggerText = "!shadow-none text-secondary-foreground/50 data-[state=active]:text-secondary-foreground";
  const searchParams = useSearchParams();
  const selectedTags = useMemo(() => searchParams.getAll("tag"), [searchParams]);
  const tab = searchParams.get("tab") || "all";
  const [sort, setSort] = useState<SortType>("blog-new");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit] = useState(25);
  const [selectedExternalTags, setSelectedExternalTags] = useState<string[]>([]);
  const [externalSort, setExternalSort] = useState<SortType>("blog-new");
  const [externalSortOrder, setExternalSortOrder] = useState<"asc" | "desc">("desc");
  const [externalSearchQuery, setExternalSearchQuery] = useState("");

  const { selectedYear, selectedMonth, searchQuery, setSearchQuery, reset, handleMonthClick, handleYearChange, handleMonthSelectChange, handleClearDateFilter } = useBlogDateFilter({
    searchParams,
    tab,
    selectedTags,
  });

  const availableYears = useMemo(() => {
    const years = new Set<number>(blogs.map((b) => new Date(b.publishedAt).getFullYear()));
    return [...years].sort((a, b) => b - a);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    let result = filterItems({ items: blogs, tags: selectedTags, filter: "", sort: sort, order: sortOrder });
    if (selectedYear !== null) {
      result = result.filter((b) => new Date(b.publishedAt).getFullYear() === selectedYear);
    }
    if (selectedMonth !== null) {
      result = result.filter((b) => new Date(b.publishedAt).getMonth() + 1 === selectedMonth);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((b) => b.title.toLowerCase().includes(q) || (b.description ?? "").toLowerCase().includes(q));
    }
    return result.slice(0, limit);
  }, [blogs, selectedTags, sort, sortOrder, limit, selectedYear, selectedMonth, searchQuery]);

  const blogTagCounts = useMemo<Record<string, number>>(() => {
    const items = blogs;
    const counts: Record<string, number> = {};
    items.forEach((b) => {
      (b.tags ?? []).forEach((t) => {
        counts[t] = (counts[t] ?? 0) + 1;
      });
    });
    return counts;
  }, [blogs]);

  const allExternalTags = useMemo<string[]>(() => {
    const blogs = qittaBlogs ?? [];
    const tags = blogs.flatMap((b) => b.tags.map((t: string) => t.trim()));
    return [...new Set(tags)];
  }, [qittaBlogs]);

  const externalTagCounts = useMemo<Record<string, number>>(() => {
    const items = qittaBlogs ?? [];
    const counts: Record<string, number> = {};
    items.forEach((b) => {
      (b.tags ?? [])
        .map((t: string) => t.trim())
        .forEach((t: string) => {
          counts[t] = (counts[t] ?? 0) + 1;
        });
    });
    return counts;
  }, [qittaBlogs]);

  const filteredQiitaBlogs = useMemo(() => {
    const blogs = qittaBlogs ?? [];
    const dir = externalSortOrder === "asc" ? -1 : 1;

    let filtered =
      selectedExternalTags.length === 0
        ? blogs
        : blogs.filter((b) => {
            const blogTags = b.tags.map((t: string) => t.trim());
            return selectedExternalTags.some((t) => blogTags.includes(t));
          });

    if (externalSearchQuery.trim()) {
      const q = externalSearchQuery.trim().toLowerCase();
      filtered = filtered.filter((b) => b.title.toLowerCase().includes(q));
    }

    return [...filtered].sort((a, b) => {
      if (externalSort === "blog-likes") {
        return dir * (Number(b.likes) - Number(a.likes));
      }
      if (externalSort === "blog-views") {
        return dir * (Number(b.views) - Number(a.views));
      }
      return dir * (new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    });
  }, [qittaBlogs, selectedExternalTags, externalSort, externalSortOrder, externalSearchQuery]);

  const handleExternalTagClick = (tag: string) => {
    setSelectedExternalTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const pushURL = (params: URLSearchParams) => {
    window.history.replaceState(null, "", `/blog?${decodeURIComponent(params.toString())}`);
  };

  const handleTabChange = (newTab: string) => {
    reset();
    const params = new URLSearchParams();
    params.set("tab", newTab);
    pushURL(params);
  };

  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];

    const params = new URLSearchParams();
    params.set("tab", tab);
    newTags.forEach((t) => params.append("tag", t));
    pushURL(params);
  };

  return (
    <div className={`${className} w-full min-h-screen`}>
      <PageHero className="mb-6" title={title} description="技術記事や開発の記録をまとめています．" />
      {/* <BlogSearch className="mb-5" tags={blogTags} /> */}
      <Tabs defaultValue={tab} value={tab} className={`${className} flex flex-col`} onValueChange={(value) => handleTabChange(value)}>
        <TabsList className="flex flex-wrap gap-4 h-auto bg-secondary dark:bg-background mb-3">
          <TabsTrigger className={cn(trigger, triggerText, "h-fit px-0 py-2 dark:!bg-background")} value="all">
            すべて
          </TabsTrigger>
          <TabsTrigger className={cn(trigger, triggerText, "h-fit px-0 py-2 dark:!bg-background")} value="external">
            外部の記事
          </TabsTrigger>
          <TabsTrigger className={cn(trigger, triggerText, "h-fit px-0 py-2 dark:!bg-background")} value="update">
            更新情報
          </TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-5" value="all">
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="flex-1 min-w-0 space-y-5">
              <CategoryFilter categories={blogTags} selectedCategories={selectedTags} onCategoryClick={handleTagClick} counts={blogTagCounts} />
              <BlogSectionHeader
                total={filteredBlogs.length}
                currentCategory={selectedTags.length === 1 ? selectedTags[0] : undefined}
                sort={sort}
                setSort={setSort}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                selectedYear={selectedYear ?? undefined}
                selectedMonth={selectedMonth ?? undefined}
                onClearDateFilter={handleClearDateFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                availableYears={availableYears}
                onYearChange={handleYearChange}
                onMonthChange={handleMonthSelectChange}
              />
              <BlogCards blogs={filteredBlogs} columns={2} />
            </div>
            <div className="lg:w-96 shrink-0 space-y-4">
              <div className="border border-gray-200 dark:border-secondary-foreground/30 rounded-lg p-4">
                <button className="text-base font-bold hover:underline block w-fit pb-3" onClick={() => handleTabChange("update")}>
                  ブログ アーカイブ &gt;
                </button>
                <BlogArchive blogs={blogs} onMonthClick={handleMonthClick} selectedYear={selectedYear ?? undefined} selectedMonth={selectedMonth ?? undefined} />
              </div>
              <div className="border border-gray-200 dark:border-secondary-foreground/30 rounded-lg py-2">
                <button className="text-base font-bold p-3 hover:underline block" onClick={() => handleTabChange("external")}>
                  外部の記事 &gt;
                </button>
                <BlogList currentTab="all" limit={3} className="bg-white dark:bg-background" qittaBlogs={qittaBlogs} />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="space-y-5" value="external">
          <CategoryFilter categories={allExternalTags} selectedCategories={selectedExternalTags} onCategoryClick={handleExternalTagClick} counts={externalTagCounts} />
          <BlogSectionHeader
            total={filteredQiitaBlogs.length}
            currentCategory={selectedExternalTags.length === 1 ? selectedExternalTags[0] : undefined}
            sort={externalSort}
            setSort={setExternalSort}
            sortOrder={externalSortOrder}
            setSortOrder={setExternalSortOrder}
            hasLikes
            hasViews
            searchQuery={externalSearchQuery}
            onSearchChange={setExternalSearchQuery}
          />
          <BlogList className="bg-white dark:bg-background" qittaBlogs={filteredQiitaBlogs} />
        </TabsContent>
        <TabsContent value="update">
          <div className="border border-muted-foreground/50 rounded-lg p-4">
            <BlogArchiveDetail blogs={blogs} onMonthClick={handleMonthClick} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function Blogs(props: Parameters<typeof BlogsInner>[0]) {
  return (
    <Suspense fallback={null}>
      <BlogsInner {...props} />
    </Suspense>
  );
}

export function BlogSearch({ className = "" }: { tags: string[]; className?: string }) {
  return (
    <div className={`${className}`}>
      {/* 検索バー */}
      <input type="text" placeholder="記事を検索" className="w-full border border-muted-foreground/50 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500" />
    </div>
  );
}
