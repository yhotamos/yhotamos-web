"use client";

import Link from "next/link";
import { FormattedDate, DiffDate } from "@/components/ui/formatted-date";
import { cn } from "@/lib/utils";
import { Blog } from "@/components/types/blog";

export function BlogCards({ title, className, blogs, currentTab }: { title?: string; className?: string; blogs?: Blog[]; currentTab?: string }) {
  const gridClass = currentTab === "all" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className={cn(className)}>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div className={gridClass}>
        {blogs?.map((blog: any, index) => (
          <Link
            href={"/blog/" + blog.id}
            key={index}
            className="block bg-background dark:bg-secondary border rounded-lg overflow-hidden shadow hover:shadow-sm transition"
          >
            {blog.thumbnail && <img src={blog.thumbnail} alt={blog.title} className="w-full h-40 object-cover" />}
            <div className="flex flex-col justify-between p-4 h-full">
              <h2 className="text-lg font-semibold mb-2 line-clamp-3">{blog.title}</h2>
              {blog.excerpt && <p className="text-sm text-secondary-foreground/70 mb-2 line-clamp-3">{blog.excerpt}</p>}
              <div>
                <p className="text-sm text-secondary-foreground/70 mb-2">
                  <FormattedDate isoDate={blog.date} isTime={false} /> ・ <DiffDate isoDate={blog.date} />
                </p>
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
