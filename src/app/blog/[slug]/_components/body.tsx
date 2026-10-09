"use client";

import { getTocFromMarkdown } from "@/utils/getTocFromMarkdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/config/iconMap";
import clsx from "clsx";
import { shareFacebook, shareHatena, shareX } from "@/utils/share";
import type { Blog, BlogBodyData } from "@/types/blog";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BlogComments } from "./comments";
import { BlogToc } from "./toc";

export const BlogBody: React.FC<{ blogId: string; body: BlogBodyData; children: React.ReactNode }> = ({ blogId, body, children }) => {
  const tocItems = getTocFromMarkdown(body.content);

  return (
    <div className="flex gap-3 md:items-start">
      <BlogSidebar blogId={blogId} data={body.data} />
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 目次 */}
        <BlogToc items={tocItems} />
        {/* 本文 */}
        <div
          className={clsx(
            "rounded-[4px] bg-white dark:bg-secondary lg:col-span-2 min-w-full lg:order-first p-2 md:p-5 prose prose-sm prose-neutral dark:prose-invert ",
            "md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h1]:scroll-mt-20 [&_h2]:border-b [&_h2]:border-secondary-foreground/30 [&_h2]:scroll-mt-20",
            "[&_h3]:scroll-mt-20"
          )}
        >
          {children}
        </div>
        <BlogComments blogId={blogId} className="lg:col-span-2" />
      </div>
    </div>
  );
};

const BlogSidebar: React.FC<{ blogId: string; data: Blog; className?: string }> = ({ blogId, data, className }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const title: string = data.title || "";
  const tags = data.tags || [];

  useEffect(() => {
    let active = true;
    const load = async () => {
      const res = await fetch(`/api/blog/${blogId}/likes`);
      const data = await res.json();
      if (!active || !data.ok) return;
      setLikes(data.likes);
      // いいね済みフラグ(ローカルストレージから取得)
      const setIsLocalLiked = localStorage.getItem(`isLiked-${blogId}`) === "true";
      setIsLiked(setIsLocalLiked);
    };
    load();
    return () => { active = false; };
  }, [blogId]);

  // コメントフォームへ移動
  const moveCommentForm = (targetId: string) => {
    if (!targetId) return;
    const commentForm = document.querySelector(targetId);
    commentForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // いいねボタン クリックイベント
  const handleLike = async () => {
    const setIsLocalLiked = localStorage.getItem(`isLiked-${blogId}`) === "true";
    if (setIsLocalLiked) return; // いいね済みなら何もしない

    const res = await fetch(`/api/blog/${blogId}/likes`, { method: "POST" });
    const data = await res.json();
    // console.log("data", data);
    setLikes(data.likes);
    // いいね済みフラグ(ローカルストレージへ保存)
    localStorage.setItem(`isLiked-${blogId}`, "true");
    setIsLiked(true);
  };

  return (
    <div
      className={clsx(
        className,
        "fixed bottom-0 left-0 border-t md:border-t-0 bg-secondary w-full md:mt-5 dark:bg-background",
        "md:sticky md:top-20 md:w-fit"
      )}
    >
      <div className="flex justify-evenly items-center gap-4 p-2 md:p-0 md:flex-col">
        <div className="flex md:flex-col gap-1 justify-center items-center ">
          <FontAwesomeIcon
            onClick={handleLike}
            icon={iconMap["faThumbsUp"]}
            className={clsx(
              isLiked && "text-pink-500 border-pink-500 border-1",
              "cursor-pointer rounded-full  bg-white dark:bg-secondary p-3"
            )}
            aria-label="いいねする"
            titleId="いいねする"
            title="いいねする"
            size="lg"
          />
          <div className="text-sm text-secondary-foreground/70 pe-[1px]">{likes}</div>
        </div>
        <div className="flex md:flex-col gap-1 justify-center items-center ">
          <FontAwesomeIcon
            onClick={() => moveCommentForm("#comment-form")}
            icon={iconMap["faCommentDots"]}
            className={clsx("cursor-pointer rounded-full bg-white dark:bg-secondary p-3")}
            aria-label="コメントする"
            titleId="コメントする"
            title="コメントする"
            size="lg"
          />
          <div id="comment-count" className="text-sm text-secondary-foreground/70 pe-[1px]"></div>
        </div>
        <BlogShare title={title} tags={tags} />
      </div>
    </div>
  );
};

const BlogShare: React.FC<{ title: string; tags: string[] }> = ({ title, tags }) => {
  const share = [
    { type: "fontAwesome", icon: "faX", title: "X/Twitterでシェアする", onClick: () => shareX({ text: title, tags: tags }) },
    { type: "fontAwesome", icon: "faFacebook", title: "Facebookでシェアする", onClick: () => shareFacebook() },
    { type: "url", icon: "hatena", title: "はてなブックマークに追加", onClick: () => shareHatena() },
  ];

  return (
    <div className="flex md:flex-col items-center gap-2">
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
            <div
              className="hatena-bookmark-button p-3 cursor-pointer"
              data-hatena-bookmark-layout="touch-counter"
              title={item.title}
              onClick={item.onClick}
            >
              <Image src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png" alt={item.title} width={20} height={20} unoptimized />
            </div>
          </div>
        )
      )}
    </div>
  );
};
