"use client";

import { useEffect, useState, useRef } from "react";
import { getMarkdown } from "@/api";
import Loading from "./loading";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  getTocFromMarkdown,
  TocItem,
} from "@/components/utils/getTocFromMarkdown";
import { Product } from "@/components/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hr } from "@/components/layout/hr";
import NotFoundPage from "@/components/layout/notFound";

export function Document({
  item,
  className,
}: {
  item: Product;
  className?: string;
}) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  return (
    <Tabs
      defaultValue="usage"
      className="min-h-screen grid grid-cols-5 mt-5 gap-0"
    >
      <TabsList className="sticky top-38 md:top-25 flex flex-col gap-4 w-full h-fit py-5 rounded-none rounded-l-xl">
        <TabsTrigger
          className="cursor-pointer w-full h-fit rounded-none rounded-l-xl"
          value="usage"
        >
          使い方
        </TabsTrigger>
        <TabsTrigger
          className="cursor-pointer w-full h-fit rounded-none rounded-l-xl"
          value="options"
        >
          オプション
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="usage"
        className="col-span-4 grid gap-y-4 md:grid-cols-4 bg-secondary rounded-none rounded-tr-xl rounded-b-xl"
      >
        <div className="border-1 rounded-xl border-gray-200 dark:border-gray-700 lg:border-none m-2 lg:m-0 lg:sticky lg:top-20 h-fit py-5 px-3 lg:ps-0 col-span-3 lg:col-span-1">
          目次
          <Hr />
          <div className="flex flex-col gap-4 pt-5">
            {tocItems.map((item, index) => (
              <div key={index}>
                <a
                  className={`${
                    item.depth === 3 && "pl-3 "
                  }  text-secondary-foreground/70 hover:underline`}
                  href={`#${item.id}`}
                >
                  {item.text}
                </a>
              </div>
            ))}
          </div>
        </div>
        <DocHtml
          src={item.usage}
          className="p-3 lg:p-5 col-span-3 lg:order-first"
          onTocGenerated={setTocItems}
        />
      </TabsContent>
    </Tabs>
  );
}

export function DocHtml({
  src,
  className,
  onTocGenerated,
}: {
  src: string;
  className?: string;
  onTocGenerated?: (toc: TocItem[]) => void;
}) {
  const [markdown, setMarkdown] = useState("");
  const [notFound, setNotFound] = useState(false);

  let toc;
  useEffect(() => {
    getMarkdown(src).then((markdown) => {
      const isHtml = markdown.startsWith("<!DOCTYPE");
      if (!isHtml) {
        setMarkdown(markdown);
        toc = getTocFromMarkdown(markdown);
        onTocGenerated?.(toc);
      } else {
        setNotFound(true);
      }
    });
  }, []);

  if (!src || notFound) {
    return (
      <NotFoundPage className={`${className} mt-10 text-center font-bold`} />
    );
  }

  if (!markdown) {
    return <Loading />;
  }

  return (
    <div
      className={`prose prose-sm prose-neutral dark:prose-invert md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h2]:border-b [&_h2]:border-gray-200 dark:[&_h2]:border-gray-700  max-w-none ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
