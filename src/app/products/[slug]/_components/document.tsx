"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { getMarkdown } from "@/lib/getMarkdown";
import Loading from "@/components/layout/loading";
import React from "react";
import { Markdown } from "@/components/markdown/markdown";
import NotFoundPage from "@/components/layout/notFound";
import { getTocFromMarkdown } from "@/utils/getTocFromMarkdown";

export function DocHtml({ src, className, top, notFoundFallback }: { src: string; className?: string; top?: number; notFoundFallback?: React.ReactNode }) {
  const [loaded, setLoaded] = useState({ src: "", markdown: "", notFound: false });
  const markdown = loaded.src === src ? loaded.markdown : "";
  const notFound = loaded.src === src && loaded.notFound;
  const headingPrefix = useId();
  const tocItems = useMemo(() => getTocFromMarkdown(markdown).filter((item) => item.depth <= 3 && item.id), [markdown]);

  useEffect(() => {
    if (!src) return;
    let active = true;
    getMarkdown(src).then((markdown) => {
      if (!active) return;
      const notFound = markdown.includes("Page not found") || markdown.trim() === "";
      setLoaded({ src, markdown, notFound });
    }).catch(() => {
      if (active) {
        setLoaded({ src, markdown: "", notFound: true });
      }
    });
    return () => { active = false; };
  }, [src]);

  if (!src || notFound) {
    if (notFoundFallback !== undefined) return <>{notFoundFallback}</>;
    return <NotFoundPage className={`${className} mt-10 text-center font-bold`} />;
  }

  if (!markdown) {
    return <Loading className={`${className} text-center`} />;
  }

  return (
    <div className={className}>
      {tocItems.length > 0 && (
        <details className="mb-5 rounded-md border px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium">目次</summary>
          <nav aria-label="本文の目次" className="pt-3 pb-1">
            <ul className="space-y-2">
              {tocItems.map((item, index) => (
                <li key={index} style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 12}px` }}>
                  <a href={`#${headingPrefix}-${item.id}`} className="text-muted-foreground hover:text-foreground hover:underline">{item.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      )}
      <div className="prose prose-sm prose-neutral dark:prose-invert md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h2]:border-b [&_h2]:border-gray-200 dark:[&_h2]:border-gray-700 max-w-none">
        <Markdown content={markdown} headingPrefix={headingPrefix} top={top ?? 100} codeTheme="adaptive" />
      </div>
    </div>
  );
}
