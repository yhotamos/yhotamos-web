"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FormattedDate, DiffDate } from "@/components/ui/formatted-date";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { iconMap } from "@/components/config/iconMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { filterItems, SortType } from "@/utils/filterItems";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Blog } from "@/components/types/blog";

function BlogsInner({ title, className, qittaBlogs, blogs, blogTags, changelogs }: { title?: string; className?: string; qittaBlogs?: any; blogs?: any; blogTags?: any; changelogs?: any }) {
  const trigger =
    "relative !bg-secondary dark:!bg-black border-0 after:content-[''] after:block data-[state=active]:after:w-1/2 after:h-[2px] after:bg-black dark:after:bg-white after:absolute after:bottom-0";
  const triggerText = "!shadow-none text-secondary-foreground/50 data-[state=active]:text-secondary-foreground";
  const searchParams = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>(() => searchParams.get("tag")?.split(",") || []);
  const [tab, setTab] = useState(searchParams.get("tab") || "all");
  const [sort, setSort]: any = useState("blog-new");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(25);
  const [selectedExternalTags, setSelectedExternalTags] = useState<string[]>([]);
  const [externalSort, setExternalSort]: any = useState("blog-new");
  const [externalSortOrder, setExternalSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setTab(searchParams.get("tab") || "all");
    setSelectedTags(searchParams.get("tag")?.split(",") || []);
  }, [searchParams]);

  const filteredBlogs = filterItems({ items: blogs, tags: selectedTags, filter: "", sort: sort, order: sortOrder, limit: limit });

  const blogTagCounts = useMemo<Record<string, number>>(() => {
    const items = (blogs as Blog[]) ?? [];
    const counts: Record<string, number> = {};
    items.forEach((b) => {
      (b.tags ?? []).forEach((t) => {
        counts[t] = (counts[t] ?? 0) + 1;
      });
    });
    return counts;
  }, [blogs]);

  const allExternalTags = useMemo<string[]>(() => {
    const blogs = (qittaBlogs as any[]) ?? [];
    const tags = blogs.flatMap((b: any) => b.tags.map((t: string) => t.trim()));
    return [...new Set(tags)];
  }, [qittaBlogs]);

  const externalTagCounts = useMemo<Record<string, number>>(() => {
    const items = (qittaBlogs as any[]) ?? [];
    const counts: Record<string, number> = {};
    items.forEach((b: any) => {
      (b.tags ?? [])
        .map((t: string) => t.trim())
        .forEach((t: string) => {
          counts[t] = (counts[t] ?? 0) + 1;
        });
    });
    return counts;
  }, [qittaBlogs]);

  const filteredQiitaBlogs = useMemo(() => {
    const blogs = (qittaBlogs as any[]) ?? [];
    // desc = 大きい順（デフォルト）、asc = 小さい順
    const dir = externalSortOrder === "asc" ? -1 : 1;

    const filtered =
      selectedExternalTags.length === 0
        ? blogs
        : blogs.filter((b: any) => {
            const blogTags = b.tags.map((t: string) => t.trim());
            return selectedExternalTags.some((t) => blogTags.includes(t));
          });

    return [...filtered].sort((a: any, b: any) => {
      if (externalSort === "blog-likes") {
        return dir * (Number(b.likes) - Number(a.likes));
      }
      if (externalSort === "blog-views") {
        return dir * (Number(b.views) - Number(a.views));
      }
      return dir * (new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    });
  }, [qittaBlogs, selectedExternalTags, externalSort, externalSortOrder]);

  const handleExternalTagClick = (tag: string) => {
    setSelectedExternalTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const pushURL = (params: URLSearchParams) => {
    window.history.replaceState(null, "", `/blog?${params.toString()}`);
  };

  const handleTabChange = (newTab: string) => {
    setSelectedTags([]);
    setTab(newTab);
    const params = new URLSearchParams();
    params.set("tab", newTab);
    pushURL(params);
  };

  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
    setSelectedTags(newTags);

    const params = new URLSearchParams();
    params.set("tab", tab);
    if (newTags.length > 0) {
      params.set("tag", newTags.join(","));
    }
    pushURL(params);
  };

  return (
    <div className={`${className} w-full min-h-screen`}>
      <BlogHero className="mb-6" title={title || "ブログ記事"} description="最新のガジェットレビューや技術記事をお届けします．" />
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
              <BlogTags tags={blogTags} selectedTags={selectedTags} handleTagClick={handleTagClick} tagCounts={blogTagCounts} />
              <BlogSectionHeader
                total={filteredBlogs.length}
                currentCategory={selectedTags.length === 1 ? selectedTags[0] : undefined}
                sort={sort}
                setSort={setSort}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
              <BlogCards blogs={filteredBlogs} />
            </div>
            <div className="lg:w-96 shrink-0 space-y-4">
              <div className="border border-gray-200 dark:border-secondary-foreground/30 rounded-lg py-2">
                <button className="text-base font-bold p-3 hover:underline block" onClick={() => handleTabChange("external")}>
                  外部の記事 &gt;
                </button>
                <BlogList currentTab="all" limit={3} className="bg-white dark:bg-background" qittaBlogs={qittaBlogs} />
              </div>
              <div className="border border-gray-200 dark:border-secondary-foreground/30 rounded-lg p-4">
                <button className="text-base font-bold hover:underline block w-fit pb-3" onClick={() => handleTabChange("update")}>
                  更新情報 &gt;
                </button>
                <ChangeLog changelogs={changelogs} />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="space-y-5" value="external">
          <BlogTags tags={allExternalTags} selectedTags={selectedExternalTags} handleTagClick={handleExternalTagClick} tagCounts={externalTagCounts} />
          <BlogSectionHeader
            total={filteredQiitaBlogs.length}
            currentCategory={selectedExternalTags.length === 1 ? selectedExternalTags[0] : undefined}
            sort={externalSort}
            setSort={setExternalSort}
            sortOrder={externalSortOrder}
            setSortOrder={setExternalSortOrder}
            hasLikes
            hasViews
          />
          <BlogList className="bg-white dark:bg-background" qittaBlogs={filteredQiitaBlogs} />
        </TabsContent>
        <TabsContent className="ms-3" value="update">
          <Update changelogs={changelogs} />
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

export function BlogHero({ title, description, className = "" }: { title: string; description: string; className?: string }) {
  return (
    <section className={`${className} text-center`}>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-secondary-foreground/70">{description}</p>
    </section>
  );
}

export function BlogSearch({ tags, className = "" }: { tags: string[]; className?: string }) {
  return (
    <div className={`${className}`}>
      {/* 検索バー */}
      <input type="text" placeholder="記事を検索" className="w-full border border-muted-foreground/50 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500" />
    </div>
  );
}

export function BlogTags({
  className,
  tags,
  selectedTags,
  handleTagClick,
  tagCounts,
}: {
  className?: string;
  tags: string[];
  selectedTags: string[];
  handleTagClick: (tag: string) => void;
  tagCounts?: Record<string, number>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${className} flex items-center justify-between border border-muted-foreground/50 p-2 rounded-lg`}>
      {/* タグフィルタ */}
      <div className={cn(isOpen ? "h-auto" : "max-h-[73px] overflow-auto", "flex flex-wrap gap-2 ")}>
        {tags.map((tag) => {
          const isActive = selectedTags?.includes(tag);
          return (
            <Button
              key={tag}
              size={"sm"}
              className={cn(
                isActive ? "!bg-violet-500 !text-white" : "",
                "px-4 py-2 text-black dark:text-white bg-gray-200 dark:bg-secondary rounded-full",
                "hover:bg-gray-300 text-sm whitespace-nowrap",
              )}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
              {tagCounts?.[tag] !== undefined && <span className="text-xs opacity-50">{tagCounts[tag]}</span>}
              {isActive && " ✕"}
            </Button>
          );
        })}
      </div>
      <Button title={isOpen ? "開く" : "閉じる"} onClick={() => setIsOpen((o) => !o)} variant={"ghost"} size={"icon"} className={cn("px-4 py-2 ms-2 rounded-full hover:bg-gray-300 text-sm ")}>
        <FontAwesomeIcon className={cn(isOpen ? "" : " rotate-180", "transition-transform duration-300 ease-in-out")} icon={iconMap["faAngleDown"]} />
      </Button>
    </div>
  );
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
}: {
  total: number;
  currentCategory?: string;
  sort: string;
  setSort: (s: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (o: "asc" | "desc") => void;
  hasLikes?: boolean;
  hasViews?: boolean;
}) {
  const sortOptions: { value: SortType; label: string }[] = [
    { value: "blog-new", label: "新着順" },
    ...(hasLikes ? [{ value: "blog-likes" as SortType, label: "人気順" }] : []),
    ...(hasViews ? [{ value: "blog-views" as SortType, label: "閲覧順" }] : []),
  ];

  const toggleOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  return (
    <div className="flex items-center justify-between">
      {/* 件数表示 */}
      <h2 className="ms-1 text-lg font-semibold">
        {currentCategory ? `${currentCategory}の記事` : "すべての記事"}（{total}件）
      </h2>

      {/* 並べ替えオプション */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {sortOptions.map(({ value, label }, index) => (
          <React.Fragment key={value}>
            <button id={value} className={`${sort === value ? "text-black underline dark:text-white" : ""} cursor-pointer hover:text-black dark:hover:text-white`} onClick={() => setSort(value)}>
              {label}
            </button>
            {index < sortOptions.length - 1 && <span>|</span>}
          </React.Fragment>
        ))}
        <Button title={sortOrder === "desc" ? "降順" : "昇順"} variant="ghost" size="icon" className="w-7 h-7 ms-1 rounded hover:bg-gray-300" onClick={toggleOrder}>
          <FontAwesomeIcon icon={sortOrder === "desc" ? iconMap["faArrowDownWideShort"] : iconMap["faArrowUpWideShort"]} />
        </Button>
      </div>
    </div>
  );
}

export function BlogCards({ title, className, blogs, currentTab }: { title?: string; className?: string; blogs?: Blog[]; currentTab?: string }) {
  const allClassName = currentTab === "all" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className={cn(className)}>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div className={allClassName}>
        {blogs &&
          blogs.map((blog: any, index) => (
            <Link href={"/blog/" + blog.id} key={index} className="block bg-background dark:bg-secondary border rounded-lg overflow-hidden shadow hover:shadow-sm transition">
              {/* サムネイル */}
              {blog.thumbnail && <img src={blog.thumbnail} alt={blog.title} className="w-full h-40 object-cover" />}

              {/* 本文 */}
              <div className="flex flex-col justify-between p-4 h-full ">
                <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>

                {blog.excerpt && <p className="text-sm text-secondary-foreground/70 mb-2">{blog.excerpt}</p>}

                <div>
                  <p className="text-sm text-secondary-foreground/70 mb-2">
                    <FormattedDate isoDate={blog.date} isTime={false} /> ・ <DiffDate isoDate={blog.date} />
                  </p>
                  {/* タグ */}
                  <div className="flex flex-wrap gap-2">
                    {blog.tags?.map((tag: string) => (
                      <span key={tag} className="text-xs text-secondary-foreground/80 bg-secondary-foreground/10 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export function BlogList({ className, qittaBlogs, currentTab, limit }: { className?: string; qittaBlogs?: string[]; currentTab?: string; limit?: number }) {
  const allClassName = currentTab === "all" ? "" : "md:pe-15";
  qittaBlogs = qittaBlogs?.slice(0, limit);

  return (
    <div className={className}>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {qittaBlogs &&
          qittaBlogs.map((blog: any, index: number) => (
            <li key={index}>
              <Link href={blog.url} target="_blank" className={cn(allClassName, "flex justify-between items-center p-4 hover:bg-accent")} title={blog.title}>
                <div>
                  <div className="flex items-center gap-2">
                    <Image src="/imgs/qiita_icon.png" alt="icon" width={16} height={16} />
                    <h3 className="text-lg font-semibold line-clamp-1">{blog.title}</h3>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex flex-wrap items-center gap-x-5 ms-6">
                      <time className="text-sm text-accent-foreground/50">
                        <FormattedDate isoDate={blog.publishDate} />
                      </time>
                      <div className="text-sm text-accent-foreground/50">
                        <FontAwesomeIcon icon={iconMap["faEye"]} /> {blog.views}
                      </div>
                      <div className="text-sm text-accent-foreground/50">
                        <FontAwesomeIcon icon={iconMap["faHeart"]} /> {blog.likes}
                      </div>
                      <div className="text-sm text-accent-foreground/50">
                        <FontAwesomeIcon icon={iconMap["faBookmark"]} /> {blog.bookmarks}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-1 ms-5">
                      {blog.tags.length > 1 &&
                        blog.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
                <FontAwesomeIcon className="text-accent-foreground/60" icon={iconMap["faChevronRight"]} />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

function Update({ changelogs }: { changelogs: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="border border-muted-foreground/50 rounded-lg p-4">
        <div className="text-lg font-semibold mb-2">本サイトの更新情報</div>
        <ChangeLog changelogs={changelogs} />
      </div>
      <div className="border border-muted-foreground/50 rounded-lg p-4">
        <div className="text-lg font-semibold mb-2">プロダクト・ツールの更新履歴</div>
        <NotFound />
      </div>
      <div className="border border-muted-foreground/50 rounded-lg p-4">
        <div className="text-lg font-semibold mb-2">ブログ・記事の追加・更新情報</div>
        <NotFound />
      </div>
      <div className="border border-muted-foreground/50 rounded-lg p-4">
        <div className="text-lg font-semibold mb-2">メディア・コミュニティ活動情報</div>
        <NotFound />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-lg">更新情報はありません</div>
    </div>
  );
}

function ChangeLog({ className, changelogs }: { className?: string; changelogs: any }) {
  return (
    <div className={cn(className, "space-y-4")}>
      {changelogs ? (
        changelogs.map((log: any, index: number) => (
          <div key={index}>
            <div className="flex gap-3 my-2">
              <div>{log.title}</div>
              <div>・</div>
              <FormattedDate isoDate={log.date} />
            </div>
            <div
              className={cn(
                "prose prose-sm prose-neutral dark:prose-invert ",
                "[&_p]:mb-0 [&_ul]:mt-1 md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h1]:scroll-mt-20 [&_h2]:border-b [&_h2]:border-secondary-foreground/30 [&_h2]:scroll-mt-20",
                "[&_h3]:scroll-mt-20",
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {log.content}
              </ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <NotFound />
      )}
    </div>
  );
}
