"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { getTocFromMarkdown } from "@/utils/getTocFromMarkdown";
import type { BlogBodyData } from "@/types/blog";
import { BlogActions } from "./actions";
import { BlogComments } from "./comments";
import { BlogToc } from "./toc";

export function BlogBody({ blogId, body, children }: { blogId: string; body: BlogBodyData; children: ReactNode }) {
  const tocItems = getTocFromMarkdown(body.content);

  return (
    <div className="grid grid-cols-1 items-start gap-5 pb-20 lg:grid-cols-3">
      <div className="min-w-0 space-y-2 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-16">
        <BlogToc items={tocItems} />
      </div>
      <div className={clsx(
        "w-full min-w-0 max-w-none rounded-[4px] bg-white p-2 dark:bg-secondary md:px-6 md:py-5 prose prose-sm prose-neutral dark:prose-invert",
        "md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h1]:scroll-mt-20 [&_h2]:border-b [&_h2]:border-secondary-foreground/30 [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20",
        "lg:col-span-2 lg:col-start-1 lg:row-start-1"
      )}>
        {children}
      </div>
      <BlogComments blogId={blogId} className="lg:col-span-2 lg:col-start-1 lg:row-start-2" />
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-7xl justify-end px-5">
        <BlogActions
          blogId={blogId}
          data={body.data}
          className="pointer-events-auto max-w-full rounded-full border bg-background px-3 shadow-sm"
        />
      </div>
    </div>
  );
}
