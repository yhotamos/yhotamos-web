"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Hr } from "@/components/layout/hr";
import { getTocFromMarkdown } from "@/utils/getTocFromMarkdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/components/config/iconMap";
import clsx from "clsx";
import { shareFacebook, shareHatena, shareTwitter } from "@/utils/share";
import React, { useEffect, useState } from "react";
import { BlogComments } from "./comments";

export const BlogBody: React.FC<{ blogId: any; body: any }> = ({ blogId, body }) => {
  const tocItems = getTocFromMarkdown(body.content);

  return (
    <div className="flex gap-3 md:items-start">
      <BlogSidebar blogId={blogId} data={body.data} />
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 目次 */}
        <div className="bg-white dark:bg-secondary lg:sticky lg:top-20 h-fit py-5 px-3 ">
          目次
          <Hr />
          <div className="flex flex-col gap-2 pt-5">
            {tocItems.map((item, index) => (
              <div key={index}>
                <a className={`${item.depth === 3 && "pl-3 "} text-base text-secondary-foreground/80 hover:underline`} href={`#${item.id}`}>
                  {item.text}
                </a>
              </div>
            ))}
          </div>
        </div>
        {/* 本文 */}
        <div
          className={clsx(
            "bg-white dark:bg-secondary lg:col-span-2 min-w-full lg:order-first p-2 md:p-5 prose prose-sm prose-neutral dark:prose-invert ",
            "md:[&_ol]:text-base md:[&_p]:text-base [&_h1]:text-2xl [&_h1]:scroll-mt-20 [&_h2]:border-b [&_h2]:border-secondary-foreground/30 [&_h2]:scroll-mt-20"
            ,"[&_h3]:scroll-mt-20"
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
        <BlogComments blogId={blogId} className="lg:col-span-2" />
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

const BlogSidebar: React.FC<{ blogId: any; data: any; className?: string }> = ({ blogId, data, className }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const title: string = data.title || "";
  const tags = data.tags || [];

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/blog/${blogId}/likes`);
      const data = await res.json();
      setLikes(data.likes);
      // いいね済みフラグ(ローカルストレージから取得)
      const setIsLocalLiked = localStorage.getItem(`isLiked-${blogId}`) === "true";
      setIsLiked(setIsLocalLiked);
    };
    load();
  }, []);

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
    <div className={clsx(className, "fixed bottom-0 left-0 border-t md:border-t-0 bg-secondary w-full md:mt-5", "md:sticky md:top-20 md:w-fit")}>
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
    { type: "fontAwesome", icon: "faXTwitter", title: "Twitterでシェアする", onClick: () => shareTwitter({ text: title, tags: tags }) },
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
              <img src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png" alt={item.title} width="20" height="20" />
            </div>
          </div>
        )
      )}
    </div>
  );
};
