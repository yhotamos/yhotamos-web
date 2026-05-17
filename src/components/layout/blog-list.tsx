"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FormattedDate } from "@/components/ui/formatted-date";
import { iconMap } from "@/components/config/iconMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/utils";

export function BlogList({ className, qittaBlogs, currentTab, limit }: { className?: string; qittaBlogs?: any[]; currentTab?: string; limit?: number }) {
  const itemClass = currentTab === "all" ? "" : "md:pe-15";
  const items = qittaBlogs?.slice(0, limit);

  return (
    <div className={className}>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {items?.map((blog: any, index: number) => (
          <li key={index}>
            <Link
              href={blog.url}
              target="_blank"
              className={cn(itemClass, "flex justify-between items-center p-4 hover:bg-accent")}
              title={blog.title}
            >
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
                      blog.tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="outline">{tag}</Badge>
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
