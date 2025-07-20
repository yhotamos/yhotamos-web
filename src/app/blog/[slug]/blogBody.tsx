"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Hr } from "@/components/layout/hr";
import { getTocFromMarkdown } from "@/utils/getTocFromMarkdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/components/config/iconMap";
import clsx from "clsx";
import { shareFacebook, shareTwitter } from "@/utils/share";
import React, { useEffect } from "react";

export const BlogBody: React.FC<{ body: any }> = ({ body }) => {
  const tocItems = getTocFromMarkdown(body.content);
  console.log("toc", tocItems);

  return (
    <div className="flex gap-5">
      <BlogSidebar data={body.data} />
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 目次 */}
        <div className="bg-white dark:bg-secondary lg:sticky lg:top-20 h-fit py-5 px-3 ">
          目次
          <Hr />
          <div className="flex flex-col gap-2 pt-5">
            {tocItems.map((item, index) => (
              <div key={index}>
                <a className={`${item.depth === 3 && "pl-3 "} text-secondary-foreground/70 hover:underline`} href={`#${item.id}`}>
                  {item.text}
                </a>
              </div>
            ))}
          </div>
        </div>
        {/* 本文 */}
        <div
          className={clsx(
            "bg-white dark:bg-secondary lg:col-span-2 min-w-full lg:order-first p-5 lg:p-5 prose prose-sm prose-neutral dark:prose-invert ",
            "md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h2]:border-b [&_h2]:border-secondary-foreground/30"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: createHeading("h1"),
              h2: createHeading("h2"),
              h3: createHeading("h3"),
            }}
          >
            {body.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const createHeading = (Tag: any) => {
  return ({ children }: any) => {
    const text = children.toString();
    const id = text
      .toLowerCase()
      .replace(/[^\w一-龠ぁ-んァ-ンー]/g, "")
      .replace(/\s+/g, "-");
    return <Tag id={id}>{children}</Tag>;
  };
};

const BlogSidebar: React.FC<{ data: any; className?: string }> = ({ data, className }) => {
  // console.log("data", data.title);
  const title: string = data.title || "";
  const tags = data.tags || [];

  const action = [
    { type: "fontAwesome", icon: "faThumbsUp", title: "いいねする", onClick: () => console.log("いいね") },
    { type: "fontAwesome", icon: "faCommentDots", title: "コメント", onClick: () => console.log("コメント") },
  ];

  return (
    <div className={clsx(className, "sticky top-20 hidden md:flex flex-col items-center gap-4 mt-5 w-fit")}>
      {action.map((item, index) => (
        <div key={index} className="flex flex-col justify-center items-center ">
          <FontAwesomeIcon
            icon={iconMap[item.icon]}
            className={clsx("cursor-pointer rounded-full bg-white dark:bg-secondary text-pink-500 border-1 border-pink-500 p-3")}
            aria-label={item.title}
            titleId={item.title}
            title={item.title}
            size="xl"
          />
          <div className="text-sm text-secondary-foreground/70 pe-[1px]">13</div>
        </div>
      ))}
      <BlogShare title={title} tags={tags} />
    </div>
  );
};

const BlogShare: React.FC<{ title: string; tags: string[] }> = ({ title, tags }) => {
  const share = [
    { type: "fontAwesome", icon: "faXTwitter", title: "Twitterでシェアする", onClick: () => shareTwitter({ text: title, tags: tags }) },
    { type: "fontAwesome", icon: "faFacebook", title: "Facebookでシェアする", onClick: () => shareFacebook({ text: title, tags: tags }) },
    { type: "url", icon: "hatena", title: "はてなブックマークに追加", onClick: () => shareTwitter({ text: title, tags: tags }) },
  ];

  useEffect(() => {
    // Hatenaボタン用のスクリプトを動的ロード
    const script = document.createElement("script");
    script.src = "https://b.st-hatena.com/js/bookmark_button.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // クリーンアップ
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      {share.map((item, index) =>
        item.type === "fontAwesome" ? (
          <FontAwesomeIcon
            key={index}
            icon={iconMap[item.icon]}
            className="cursor-pointer rounded-full hover:bg-secondary p-3 "
            aria-label={item.title}
            titleId={item.title}
            title={item.title}
            size="lg"
            onClick={item.onClick}
          />
        ) : (
          <div key={index}>
            <a
              href="https://b.hatena.ne.jp/entry/"
              className="hatena-bookmark-button"
              data-hatena-bookmark-layout="touch-counter"
              title={item.title}
            >
              <img src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png" alt={item.title} width="20" height="20" />
            </a>
          </div>
        )
      )}
    </div>
  );
};
