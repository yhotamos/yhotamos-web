"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { getTocFromMarkdown } from "@/utils/getTocFromMarkdown";
import type { BlogBodyData } from "@/types/blog";
import { BlogActions } from "./actions";
import { BlogComments } from "./comments";
import { BlogToc } from "./toc";
import { CopyBodyButton } from "./copy-body-button";

export function BlogBody({ blogId, body, children }: { blogId: string; body: BlogBodyData; children: ReactNode }) {
  const [commentCount, setCommentCount] = useState(0);
  const tocItems = getTocFromMarkdown(body.content);

  return (
    <div className="grid grid-cols-1 items-start gap-5 pb-20 lg:grid-cols-3">
      <div className="min-w-0 space-y-2 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-16">
        <BlogToc items={tocItems} />
      </div>
      <div className={clsx(
        "group/article w-full min-w-0 max-w-none rounded-[4px] bg-white p-2 dark:bg-secondary md:px-6 md:py-3 prose prose-sm prose-neutral dark:prose-invert",
        "md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h1]:scroll-mt-20 [&_h2]:border-b [&_h2]:border-secondary-foreground/30 [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20",
        "lg:col-span-2 lg:col-start-1 lg:row-start-1"
      )}>
        <div className="not-prose mb-1 flex justify-end">
          <CopyBodyButton content={body.content} />
        </div>
        {children}
        <div className="not-prose mt-1 flex justify-end">
          <CopyBodyButton content={body.content} />
        </div>
        <div className="not-prose mt-4">
          <BlogActions blogId={blogId} data={body.data} commentCount={commentCount} />
        </div>
      </div>
      <BlogComments blogId={blogId} onCountChange={setCommentCount} className="lg:col-span-2 lg:col-start-1 lg:row-start-2" />
    </div>
  );
}
