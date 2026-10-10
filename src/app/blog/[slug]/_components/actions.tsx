"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/config/iconMap";
import clsx from "clsx";
import { shareFacebook, shareHatena, shareX } from "@/utils/share";
import type { Blog } from "@/types/blog";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export const BlogActions: React.FC<{ blogId: string; data: Blog; className?: string }> = ({ blogId, data, className }) => {
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

  return (
    <div className={clsx("flex flex-wrap items-center justify-between gap-1 py-1 text-sm", className)}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleLike}
          aria-label="いいねする"
          aria-pressed={isLiked}
          title="いいねする"
          className={clsx("inline-flex h-9 items-center gap-2 rounded px-2 hover:bg-muted", isLiked && "text-pink-500")}
        >
          <FontAwesomeIcon icon={iconMap["faThumbsUp"]} aria-hidden="true" />
          <span>{likes}</span>
        </button>
        <button
          type="button"
          onClick={() => moveCommentForm("#comment-form")}
          aria-label="コメントする"
          title="コメントする"
          className="inline-flex h-9 items-center gap-2 rounded px-2 hover:bg-muted"
        >
          <FontAwesomeIcon icon={iconMap["faCommentDots"]} aria-hidden="true" />
          <span id="comment-count" />
        </button>
      </div>
      <BlogShare title={title} tags={tags} />
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
    <div className="flex items-center gap-1">
      {share.map((item, index) =>
        item.type === "fontAwesome" ? (
          <button key={index} type="button" onClick={item.onClick} aria-label={item.title} title={item.title} className="inline-flex size-9 items-center justify-center rounded hover:bg-muted">
            <FontAwesomeIcon icon={iconMap[item.icon]} aria-hidden="true" />
          </button>
        ) : (
          <button
            key={index}
            type="button"
            className="hatena-bookmark-button inline-flex size-9 items-center justify-center rounded hover:bg-muted"
            data-hatena-bookmark-layout="touch-counter"
            title={item.title}
            aria-label={item.title}
            onClick={item.onClick}
          >
            <Image src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png" alt={item.title} width={20} height={20} unoptimized />
          </button>
        ),
      )}
    </div>
  );
};
