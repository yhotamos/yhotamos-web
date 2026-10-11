"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { iconMap } from "@/config/iconMap";
import clsx from "clsx";
import { shareHatena, shareX } from "@/utils/share";
import { copyText } from "@/utils/copyText";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/types/blog";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export const BlogActions: React.FC<{ blogId: string; data: Blog; commentCount: number; className?: string }> = ({ blogId, data, commentCount, className }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const title: string = data.title || "";
  const tags = data.tags || [];
  const prompt = `以下の記事を日本語で要約し、重要なポイントを説明してください。記事を取得できない場合は、その旨を伝えてください。\n\n${title}\nhttps://yhotamos.com/blog/${encodeURIComponent(blogId)}`;
  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;

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
    return () => {
      active = false;
    };
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

  const toolbar = (
    <div className={clsx("flex flex-wrap items-center justify-between gap-2 py-1 text-base", className)}>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          onClick={handleLike}
          aria-label="いいねする"
          aria-pressed={isLiked}
          title="いいねする"
          className={clsx("h-11 rounded px-3 text-base hover:bg-muted [&_svg]:text-xl cursor-pointer", isLiked && "text-pink-500 hover:text-pink-500")}
        >
          <FontAwesomeIcon icon={iconMap["faThumbsUp"]} className="size-5" aria-hidden="true" />
          <span>{likes}</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => moveCommentForm("#comment-form")}
          aria-label="コメントする"
          title="コメントする"
          className="h-11 rounded px-3 text-base hover:bg-muted [&_svg]:text-xl cursor-pointer"
        >
          <FontAwesomeIcon icon={iconMap["faCommentDots"]} className="size-5" aria-hidden="true" />
          <span>{commentCount}</span>
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <BlogShare title={title} tags={tags} />
        <Button asChild variant="ghost" size="icon" className="size-11 rounded hover:bg-muted">
          <a href={chatGptUrl} target="_blank" rel="noopener noreferrer" aria-label="ChatGPTに聞く" title="記事についてChatGPTに聞く">
            <Image src="/imgs/chatgpt.svg" alt="" width={20} height={20} className="dark:invert" />
          </a>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {toolbar}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-7xl justify-end px-5">
        <div className="pointer-events-auto max-w-full rounded-full border bg-background px-2 shadow-sm [&>div]:text-sm [&_a]:size-9 [&_button]:h-9 [&_button]:min-w-9 [&_button]:w-auto [&_button]:px-2 [&_button]:text-sm [&_button_svg]:size-[1em] [&_button_svg]:text-lg [&_img]:w-5 [&_img]:h-auto">
          {toolbar}
        </div>
      </div>
    </>
  );
};

const BlogShare: React.FC<{ title: string; tags: string[] }> = ({ title, tags }) => {
  async function handleCopyUrl() {
    try {
      await copyText(window.location.href);
    } catch (error) {
      console.error("URLのコピーに失敗しました", error);
    }
  }

  const share = [
    { type: "fontAwesome", icon: "faX", title: "X/Twitterでシェアする", onClick: () => shareX({ text: title, tags: tags }) },
    { type: "url", icon: "hatena", title: "はてなブックマークに追加", onClick: () => shareHatena() },
  ];

  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="ghost" size="icon" onClick={handleCopyUrl} aria-label="URLをコピー" title="URLをコピー" className="size-11 rounded hover:bg-muted cursor-pointer">
        <FontAwesomeIcon icon={faLink} className="size-4" style={{ fontSize: 16 }} aria-hidden="true" />
      </Button>
      {share.map((item, index) =>
        item.type === "fontAwesome" ? (
          <Button key={index} type="button" variant="ghost" size="icon" onClick={item.onClick} aria-label={item.title} title={item.title} className="size-11 rounded hover:bg-muted [&_svg]:text-xl cursor-pointer">
            <FontAwesomeIcon icon={iconMap[item.icon]} className="size-5" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="icon"
            className="hatena-bookmark-button size-11 rounded hover:bg-muted cursor-pointer"
            data-hatena-bookmark-layout="touch-counter"
            title={item.title}
            aria-label={item.title}
            onClick={item.onClick}
          >
            <Image src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png" alt={item.title} width={24} height={24} unoptimized />
          </Button>
        ),
      )}
    </div>
  );
};
