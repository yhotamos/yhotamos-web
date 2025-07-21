"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import FormattedDate from "@/components/ui/formatted-date";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { iconMap } from "@/components/config/iconMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Blogs({
  title,
  className,
  qittaBlogs,
  blogs,
  blogTags,
}: {
  title?: string;
  className?: string;
  qittaBlogs?: any;
  blogs?: any;
  blogTags?: any;
}) {
  return (
    <div className={`${className} w-full`}>
      <BlogHero className="mb-6" title={title || "ブログ記事"} description="最新のガジェットレビューや技術記事をお届けします．" />
      <BlogSearch className="mb-5" tags={blogTags} />
      <BlogTabs className="">
        {/* ユーザー向けのコンテンツ */}
        <TabsContent className="flex flex-col gap-2 w-full" value="user">
          <BlogTags tags={blogTags} />
          <BlogSectionHeader total={10} currentCategory="React" />
          <BlogCards blogs={blogs} />
        </TabsContent>
        {/* 開発者向けのコンテンツ */}
        <TabsContent value="dev">
          <BlogList qittaBlogs={qittaBlogs} />
        </TabsContent>
        {/* その他 */}
        <TabsContent value="other">a</TabsContent>
        {/* 更新情報 */}
        <TabsContent value="update">a</TabsContent>
      </BlogTabs>
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
      <input type="text" placeholder="記事を検索" className="w-full border-2 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500" />
    </div>
  );
}

export function BlogTabs({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const trigger =
    "relative !bg-secondary dark:!bg-black border-0 after:content-[''] after:block data-[state=active]:after:w-1/2 after:h-[2px] after:bg-black dark:after:bg-white after:absolute after:bottom-0";
  const triggerText = "!shadow-none text-secondary-foreground/50 data-[state=active]:text-secondary-foreground";
  return (
    <Tabs defaultValue="user" className={`${className} flex flex-col`}>
      <TabsList className="flex gap-4 h-10 bg-secondary dark:bg-black mb-3">
        <TabsTrigger className={`h-fit px-0 py-2 ${trigger} ${triggerText}`} value="user">
          ユーザー向け
        </TabsTrigger>
        <TabsTrigger className={`h-fit px-0 py-2 ${trigger} ${triggerText}`} value="dev">
          開発者向け
        </TabsTrigger>
        <TabsTrigger className={`h-fit px-0 py-2 ${trigger} ${triggerText}`} value="other">
          その他
        </TabsTrigger>
        <TabsTrigger className={`h-fit px-0 py-2 ${trigger} ${triggerText}`} value="update">
          更新情報
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

export function BlogTags({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <div className={`${className}`}>
      {/* タグフィルタ */}
      <div className="flex overflow-x-auto gap-2">
        {tags.map((tag) => (
          <Button
            key={tag}
            size={"sm"}
            className="px-4 py-2 text-black bg-gray-200 rounded-full hover:bg-gray-300 text-sm whitespace-nowrap "
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function BlogSectionHeader({ total, currentCategory }: { total: number; currentCategory?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* 件数表示 */}
      <h2 className="text-lg font-semibold">
        {currentCategory ? `${currentCategory}の記事` : "すべての記事"}（{total}件）
      </h2>

      {/* 並べ替えオプション */}
      <div className="flex gap-2 text-sm text-gray-500">
        <button className="hover:text-black">最新順</button>
        <span>|</span>
        <button className="hover:text-black">人気順</button>
      </div>
    </div>
  );
}

function BlogCards({ blogs }: { blogs: any[] }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
      {blogs.map((blog: any, index) => (
        <a
          href={"/blog/" + blog.id}
          target="_self"
          key={index}
          className="block border rounded-lg overflow-hidden shadow hover:shadow-sm transition"
        >
          {/* サムネイル */}
          {blog.thumbnail && (
            <img src={blog.thumbnail} alt={blog.title} className={`w-full ${blog.type === "dev" ? "h-32" : "h-48"} object-cover`} />
          )}

          {/* 本文 */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
            <p className="text-sm text-secondary-foreground/70 mb-2">{blog.date}</p>

            {/* 開発者向けなら抜粋を表示 */}
            {blog.type === "dev" && blog.excerpt && <p className="text-sm text-secondary-foreground/70 mb-2">{blog.excerpt}</p>}

            {/* タグ */}
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map((tag: string) => (
                <span key={tag} className="text-xs text-secondary-foreground/80 bg-secondary-foreground/10 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export function BlogList({ qittaBlogs }: { qittaBlogs: any }) {
  // const qittaBlogs = await getQiitaList();

  return (
    <div className="w-full">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {qittaBlogs.map((blog: any, index: number) => (
          <li key={index}>
            <Link
              href={blog.url}
              target="_blank"
              className="flex justify-between items-center p-4 md:pe-15 hover:bg-accent"
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
