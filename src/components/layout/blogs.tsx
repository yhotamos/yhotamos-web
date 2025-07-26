"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FormattedDate, DiffDate } from "@/components/ui/formatted-date";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { iconMap } from "@/components/config/iconMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { filterItems, SortType } from "@/utils/filterItems";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Loading from "@/components/layout/loading";
import { Blog } from "@/components/types/blog";

export function Blogs({
  title,
  className,
  qittaBlogs,
  blogs,
  blogTags,
  devBlogTags,
  changelogs,
}: {
  title?: string;
  className?: string;
  qittaBlogs?: any;
  blogs?: any;
  blogTags?: any;
  devBlogTags?: any;
  changelogs?: any;
}) {
  const trigger =
    "relative !bg-secondary dark:!bg-black border-0 after:content-[''] after:block data-[state=active]:after:w-1/2 after:h-[2px] after:bg-black dark:after:bg-white after:absolute after:bottom-0";
  const triggerText = "!shadow-none text-secondary-foreground/50 data-[state=active]:text-secondary-foreground";
  const router = useRouter(); // ルーター(urlに書き込む用)
  const searchParams = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>(() => searchParams.get("tag")?.split(",") || []);
  const [tab, setTab] = useState(searchParams.get("tab") || "all");
  const [sort, setSort]: any = useState("blog-new");
  const [limit, setLimit] = useState(3); // 初期表示は3件

  const filteredBlogs = filterItems({ items: blogs, tags: blogTags, filter: "", sort: sort, limit: limit });
  const filteredDevBlogs = filterItems({ items: blogs, tags: devBlogTags, filter: "", sort: sort, limit: limit });

  const updateURL = (params: URLSearchParams) => {
    router.replace(`/blog?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const tabParams = searchParams.get("tab")?.split("?")[0];
    if (tabParams != "all") {
      setLimit(25); // ユーザー向け，開発者向けの記事は25件表示
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setSelectedTags([]); // 選択したタグをリセット
    setLimit(tab === "all" ? 3 : 25); // 全ての記事は3件，他は25件表示
    setTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.delete("tag"); // タグをリセット
    updateURL(params);
  };

  const handleTagClick = (tag: string) => {
    let newTags = [...selectedTags];
    if (newTags.includes(tag)) {
      // 選択済み → 削除
      newTags = newTags.filter((c) => c !== tag);
    } else {
      // 未選択 → 追加
      newTags.push(tag);
    }
    setSelectedTags(newTags);

    const params = new URLSearchParams(searchParams.toString());
    if (newTags.length > 0) {
      params.set("tag", newTags.join(","));
    } else {
      params.delete("tag");
    }
    updateURL(params);
  };

  return (
    <div className={`${className} w-full min-h-screen`}>
      <BlogHero className="mb-6" title={title || "ブログ記事"} description="最新のガジェットレビューや技術記事をお届けします．" />
      {/* <BlogSearch className="mb-5" tags={blogTags} /> */}
      <Tabs defaultValue={tab} className={`${className} flex flex-col`} onValueChange={(value) => handleTabChange(value)}>
        <TabsList className="flex flex-wrap gap-4 h-auto bg-secondary dark:bg-background mb-3">
          <TabsTrigger className={cn(trigger, triggerText, "h-fit px-0 py-2 dark:!bg-background")} value="all">
            すべて
          </TabsTrigger>
          <TabsTrigger className={cn(trigger, triggerText, "h-fit px-0 py-2 dark:!bg-background")} value="user">
            ユーザー向け
          </TabsTrigger>
          <TabsTrigger className={cn(trigger, triggerText, "h-fit px-0 py-2 dark:!bg-background")} value="dev">
            開発者向け
          </TabsTrigger>
          <TabsTrigger className={cn(trigger, triggerText, "h-fit px-0 py-2 dark:!bg-background")} value="external">
            外部の記事
          </TabsTrigger>
          <TabsTrigger className={cn(trigger, triggerText, "h-fit px-0 py-2 dark:!bg-background")} value="update">
            更新情報
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <BlogAll
            tab={tab}
            filteredBlogs={filteredBlogs}
            filteredDevBlogs={filteredDevBlogs}
            blogs={blogs}
            qittaBlogs={qittaBlogs}
            changelogs={changelogs}
            more={false}
          />
        </TabsContent>
        {/* ユーザー向けのコンテンツ */}
        <TabsContent className="space-y-5" value="user">
          <BlogTags tags={blogTags} selectedTags={selectedTags} handleTagClick={handleTagClick} />
          <BlogSectionHeader total={filteredBlogs.length} currentCategory={selectedTags[0]} sort={sort} setSort={setSort} />
          <BlogCards blogs={filteredBlogs} />
        </TabsContent>
        {/* 開発者向けのコンテンツ */}
        <TabsContent className="space-y-5" value="dev">
          <BlogTags tags={devBlogTags} selectedTags={selectedTags} handleTagClick={handleTagClick} />
          <BlogSectionHeader total={filteredDevBlogs.length} currentCategory={selectedTags[0]} sort={sort} setSort={setSort} />
          <BlogCards blogs={filteredDevBlogs} />
        </TabsContent>
        {/* 外部の記事  */}
        <TabsContent value="external">
          <div>
            <div className="text-xl font-bold my-5"> 外部の記事 </div>
            <BlogList className="bg-white dark:bg-background" qittaBlogs={qittaBlogs} />
          </div>
        </TabsContent>
        {/* 更新情報 */}
        <TabsContent className="ms-3" value="update">
          <Update changelogs={changelogs} />
        </TabsContent>
      </Tabs>
    </div>
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
      <input
        type="text"
        placeholder="記事を検索"
        className="w-full border border-muted-foreground/50 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500"
      />
    </div>
  );
}

export function BlogAll({
  className,
  tab = "all",
  filteredBlogs,
  filteredDevBlogs,
  blogs,
  qittaBlogs,
  changelogs,
  more = false,
}: {
  className?: string;
  tab?: string;
  filteredBlogs: Blog[];
  filteredDevBlogs: Blog[];
  blogs?: Blog[];
  qittaBlogs?: string[];
  changelogs?: string[];
  more: boolean;
}) {
  return (
    <div className={cn(className, "space-y-5")}>
      <a className="block text-lg font-bold mx-3 hover:underline w-fit" href="?tab=user">
        ユーザー向け &gt;
      </a>
      {tab != "all" ? <Loading className="w-full h-[150px]" /> : <BlogCards blogs={filteredBlogs} />}
      <a className="block text-lg font-bold mx-3 hover:underline w-fit" href="?tab=dev">
        開発者向け &gt;
      </a>
      {tab != "all" ? <Loading className="w-full h-[150px]" /> : <BlogCards blogs={filteredDevBlogs} />}
      {more && (
        <div className="text-right mt-4 me-3">
          <a href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
            ブログを見る ＞
          </a>
        </div>
      )}
      {qittaBlogs && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border-1 border-gray-200 dark:border-secondary-foreground/30 rounded-lg py-2 mt-4">
            <a className="text-lg font-bold p-3 hover:underline block" href="?tab=external">
              外部の記事 &gt;
            </a>
            <BlogList currentTab="all" limit={3} className="bg-white dark:bg-background" qittaBlogs={qittaBlogs} />
          </div>
          <div className="border-1 border-gray-200 dark:border-secondary-foreground/30 rounded-lg p-4 mt-4">
            <a className="text-lg font-bold hover:underline block w-fit pb-3" href="?tab=update">
              更新情報 &gt;
            </a>
            <h3 className="text-lg font-bold block ">▼ 本サイトの更新情報</h3>
            <ChangeLog changelogs={changelogs} />
          </div>
        </div>
      )}
      {!more && <BlogCards title="すべて" className="border border-muted-foreground/50 rounded-lg p-2" blogs={blogs} />}
    </div>
  );
}

export function BlogTags({
  className,
  tags,
  selectedTags,
  handleTagClick,
}: {
  className?: string;
  tags: string[];
  selectedTags: string[];
  handleTagClick: (tag: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

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
                "hover:bg-gray-300 text-sm whitespace-nowrap"
              )}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
              {/* <div className="text-xs text-muted-foreground">10</div> */}
              {isActive && " ✕"}
            </Button>
          );
        })}
      </div>
      <Button
        title={isOpen ? "開く" : "閉じる"}
        onClick={toggleOpen}
        variant={"ghost"}
        size={"icon"}
        className={cn("px-4 py-2 ms-2 rounded-full hover:bg-gray-300 text-sm ")}
      >
        <FontAwesomeIcon
          className={cn(isOpen ? "" : " rotate-180", "transition-transform duration-300 ease-in-out")}
          icon={iconMap["faAngleDown"]}
        />
      </Button>
    </div>
  );
}

export function BlogSectionHeader({
  total,
  currentCategory,
  sort,
  setSort,
}: {
  total: number;
  currentCategory?: string;
  sort: string;
  setSort: any;
}) {
  // const [sort, setSort] = useState("sort-popular");

  const sortData: { value: SortType; label: string }[] = [
    // { value: "blog-popular", label: "人気順" },
    { value: "blog-new", label: "新着順" },
    { value: "blog-update", label: "更新順" },
  ];

  return (
    <div className="flex items-center justify-between">
      {/* 件数表示 */}
      <h2 className="ms-1 text-lg font-semibold">
        {currentCategory ? `${currentCategory}の記事` : "すべての記事"}（{total}件）
      </h2>

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
    </div>
  );
}

export function BlogCards({
  title,
  className,
  blogs,
  currentTab,
}: {
  title?: string;
  className?: string;
  blogs?: Blog[];
  currentTab?: string;
}) {
  const allClassName =
    currentTab === "all" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className={cn(className)}>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div className={allClassName}>
        {blogs &&
          blogs.map((blog: any, index) => (
            <a
              href={"/blog/" + blog.id}
              target="_self"
              key={index}
              className="block bg-background dark:bg-secondary border rounded-lg overflow-hidden shadow hover:shadow-sm transition"
            >
              {/* サムネイル */}
              {blog.thumbnail && (
                <img src={blog.thumbnail} alt={blog.title} className={`w-full ${blog.type === "dev" ? "h-32" : "h-48"} object-cover`} />
              )}

              {/* 本文 */}
              <div className="flex flex-col justify-between p-4 h-full ">
                <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>

                {/* 開発者向けなら抜粋を表示 */}
                {blog.type === "dev" && blog.excerpt && <p className="text-sm text-secondary-foreground/70 mb-2">{blog.excerpt}</p>}

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
            </a>
          ))}
      </div>
    </div>
  );
}

export function BlogList({
  className,
  qittaBlogs,
  currentTab,
  limit,
}: {
  className?: string;
  qittaBlogs: string[];
  currentTab?: string;
  limit?: number;
}) {
  const allClassName = currentTab === "all" ? "" : "md:pe-15";
  qittaBlogs = qittaBlogs.slice(0, limit);
  return (
    <div className={className}>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {qittaBlogs.map((blog: any, index: number) => (
          <li key={index}>
            <Link
              href={blog.url}
              target="_blank"
              className={cn(allClassName, "flex justify-between items-center p-4 hover:bg-accent")}
              title={blog.title}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Image src="/imgs/qiita_icon.png" alt="icon" width={16} height={16} />
                  <h3 className="text-lg font-semibold line-clamp-1">{blog.title}</h3>
                </div>
                <div className="flex flex-col flex-wrap gap-1 mt-2">
                  <div className="flex items-center gap-5 ms-7">
                    <time className="text-sm text-accent-foreground/50">
                      <FormattedDate isoDate={blog.publishDate} />
                    </time>
                    <span className="text-sm text-accent-foreground/50">{blog.views} views</span>
                    <span className="text-sm text-accent-foreground/50">{blog.likes} いいね</span>
                    <span className="text-sm text-accent-foreground/50">{blog.bookmarks} ブックマーク</span>
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
        <div className="text-lg font-semibold mb-5">本サイトの更新情報</div>
        <ChangeLog changelogs={changelogs} />
      </div>
      <div className="border border-muted-foreground/50 rounded-lg p-4">
        <div className="text-lg font-semibold mb-5">プロダクト・ツールの更新履歴</div>
        <NotFound />
      </div>
      <div className="border border-muted-foreground/50 rounded-lg p-4">
        <div className="text-lg font-semibold mb-5">ブログ・記事の追加・更新情報</div>
        <NotFound />
      </div>
      <div className="border border-muted-foreground/50 rounded-lg p-4">
        <div className="text-lg font-semibold mb-5">メディア・コミュニティ活動情報</div>
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
            <div className="flex gap-3">
              <div>{log.title}</div>
              <div>・</div>
              <FormattedDate isoDate={log.date} />
            </div>
            <div
              className={cn(
                "prose prose-sm prose-neutral dark:prose-invert ",
                "md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h1]:scroll-mt-20 [&_h2]:border-b [&_h2]:border-secondary-foreground/30 [&_h2]:scroll-mt-20",
                "[&_h3]:scroll-mt-20"
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
