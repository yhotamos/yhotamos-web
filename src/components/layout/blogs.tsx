import Link from "next/link";
import { getQiitaList } from "@/api";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import FormattedDate from "@/components/ui/formatted-date";

export async function Blogs({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className={`${className} w-full`}>
      <h2 className="font-bold text-xl mb-3">ブログ記事</h2>
      <BlogList />
    </div>
  );
}

export async function BlogList() {
  const qittaBlogs = await getQiitaList();

  return (
    <div className="w-full">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {qittaBlogs.map((blog: any, index: number) => (
          <li key={index}>
            <Link
              href={blog.url}
              target="_blank"
              className="block py-3 hover:bg-accent"
              title={blog.title}
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/imgs/qiita_icon.png"
                  alt="icon"
                  width={16}
                  height={16}
                />
                <h3 className="text-lg font-semibold line-clamp-1">
                  {blog.title}
                </h3>
              </div>
              <div className="flex flex-col flex-wrap gap-1 mt-2">
                <div className="flex flex-wrap gap-x-1 ms-5">
                  {blog.tags.length > 1 &&
                    blog.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                </div>
                <div className="flex items-center gap-5">
                  <time className="ms-5 text-sm text-accent-foreground/50">
                    <FormattedDate isoDate={blog.publishDate} />
                  </time>
                  <span className="text-sm text-accent-foreground/50">
                    {blog.views} views
                  </span>
                  <span className="text-sm text-accent-foreground/50">
                    {blog.likes} いいね
                  </span>
                  <span className="text-sm text-accent-foreground/50">
                    {blog.bookmarks} ブックマーク
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
