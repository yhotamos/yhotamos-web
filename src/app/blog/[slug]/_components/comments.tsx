"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

type Comment = {
  blogId: string;
  id: number;
  text: string;
  author: string;
  createdAt: string;
  likes: number;
};

export const BlogComments: React.FC<{ blogId: string; className?: string }> = ({ blogId, className }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [input, setInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // コメント取得
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/blog/${blogId}/comments`);
      const data = await res.json();
      if (!data.ok) return;
      // コメント数
      const commentCount = document.getElementById("comment-count");
      if (commentCount) {
        commentCount.textContent = data.comments.length || 0;
      }

      setComments(data.comments);
    };
    load();
  }, []);

  // コメント送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = author.trim();
    const text = input.trim();
    if (!text) return;

    const newComment: Comment = {
      blogId: blogId,
      id: Date.now(),
      text: input,
      author: name || "匿名ユーザー",
      createdAt: new Date().toLocaleString(),
      likes: 0,
    };

    const res = await fetch(`/api/blog/${blogId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });

    const data = await res.json();
    if (data.ok && data.comment) {
      setComments([data.comment, ...comments]); // コメントを先頭に追加
      setSuccessMsg("投稿しました．");
      setErrorMsg("");
      setInput(""); // 入力欄クリア
      // コメント数
      const commentCount = document.getElementById("comment-count");
      if (commentCount) {
        commentCount.textContent = data.comment.length || 0;
      }
    } else {
      setSuccessMsg("");
      setErrorMsg("投稿に失敗しました．");
    }
  };

  return (
    <div className={clsx(className, "bg-white dark:bg-secondary  space-y-5 p-6 ")}>
      <div className="flex  items-center gap-5">
        <h2 className="text-xl font-bold  ms-2">コメント</h2>
        {errorMsg && <div className="min-w-50 text-red-500 bg-red-100 p-2 rounded-lg text-xs">{errorMsg}</div>}
        {successMsg && <div className="min-w-50 text-emerald-700 bg-emerald-200  p-2 rounded-lg text-xs">{successMsg}</div>}
      </div>
      {/* コメント入力フォーム */}
      <form id="comment-form" onSubmit={handleSubmit} className="mb-4 scroll-mt-[120px] ">
        <input
          type="text"
          placeholder="ニックネーム"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full mb-4 p-2 border border-secondary-foreground/40 rounded-md focus:ring-2 focus:ring-violet-500"
        />
        <textarea
          className="w-full p-2 border rounded-md focus:ring-2 border-secondary-foreground/40 focus:ring-violet-500"
          placeholder="コメントを入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
        />
        <button type="submit" className=" px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition">
          投稿する
        </button>
      </form>

      {/* コメント一覧 */}
      <div className="space-y-3">
        {comments.length === 0 && <p className="text-secondary-foreground/70 text-sm">まだコメントはありません。</p>}
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 border border-secondary-foreground/40 rounded-lg shadow-sm">
            <p className="">{comment.text}</p>
            <div className="text-xs text-secondary-foreground/70 mt-1">
              {comment.author}・{comment.createdAt && new Date(comment.createdAt).toLocaleDateString().split("T")[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
