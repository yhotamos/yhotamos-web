"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { getMarkdown } from "@/lib/getMarkdown";
import Loading from "@/components/layout/loading";
import { Markdown } from "@/components/markdown/markdown";
import NotFoundPage from "@/components/layout/notFound";
import { getTocFromMarkdown } from "@/utils/getTocFromMarkdown";
import { cn } from "@/lib/utils";

interface DocHtmlProps {
  src: string;
  className?: string;
  top?: number;
  notFoundFallback?: ReactNode;
  information?: ReactNode;
}

export function DocHtml({ src, className, top = 100, notFoundFallback, information }: DocHtmlProps) {
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

  const toc = !notFound && tocItems.length > 0 && (
    <nav aria-label="本文の目次" className="text-sm">
      <ul className="space-y-2">
        {tocItems.map((item, index) => (
          <li key={index} style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 12}px` }}>
            <a href={`#${headingPrefix}-${item.id}`} className="text-muted-foreground hover:text-foreground hover:underline">{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );

  let content: ReactNode;
  if (!src || notFound) {
    content = notFoundFallback ?? <NotFoundPage className={cn(className, "mt-10 text-center font-bold")} />;
  } else if (!markdown) {
    content = <Loading className={cn(className, "text-center")} />;
  } else {
    content = (
      <div className={className}>
        <div className="prose prose-sm prose-neutral dark:prose-invert md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h2]:border-b [&_h2]:border-gray-200 dark:[&_h2]:border-gray-700 max-w-none">
          <Markdown content={markdown} headingPrefix={headingPrefix} top={top} codeTheme="adaptive" />
        </div>
      </div>
    );
  }

  return <ProductDocumentLayout information={information} toc={toc}>{content}</ProductDocumentLayout>;
}

interface ProductDocumentLayoutProps {
  children: ReactNode;
  toc?: ReactNode;
  information?: ReactNode;
}

export function ProductDocumentLayout({ children, toc, information }: ProductDocumentLayoutProps) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0">
        {toc && <DocumentToc className="mb-5 lg:hidden">{toc}</DocumentToc>}
        {children}
      </div>
      <aside className="min-w-0 space-y-5 lg:sticky lg:top-20">
        {toc && <DocumentToc open className="hidden lg:block">{toc}</DocumentToc>}
        {information}
      </aside>
    </div>
  );
}

function DocumentToc({ children, className, open = false }: { children: ReactNode; className?: string; open?: boolean }) {
  return (
    <details open={open} className={cn("rounded-md border px-3 py-2 text-sm", className)}>
      <summary className="cursor-pointer font-medium">目次</summary>
      <div className="pt-3 pb-1">{children}</div>
    </details>
  );
}
