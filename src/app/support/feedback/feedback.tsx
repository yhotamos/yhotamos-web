"use client";
import React, { useState } from "react";

interface FormState {
  type: "suggestion" | "bug" | "other";
  title: string;
  detail: string;
  contact?: string;
}

export const Feedback: React.FC = () => {
  const [state, setState] = useState<FormState>({ type: "suggestion", title: "", detail: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/support/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error("送信に失敗しました");
      setDone(true);
      setState({ type: "suggestion", title: "", detail: "", contact: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {done && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">送信が完了しました．ありがとうございました．</div>}
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="flex gap-4 text-sm">
        {(["suggestion", "bug", "other"] as const).map((t) => (
          <label key={t} className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name="type" value={t} checked={state.type === t} onChange={() => setState((s) => ({ ...s, type: t }))} />
            <span>{t === "suggestion" ? "改善提案" : t === "bug" ? "バグ" : "その他"}</span>
          </label>
        ))}
      </div>
      <div>
        <label className="block text-xs font-medium text-secondary-foreground/70 mb-1">タイトル</label>
        <input
          className="w-full rounded-md border border-secondary-foreground/40 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={state.title}
          maxLength={80}
          required
          onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
        />
        <p className="mt-1 text-[10px] text-secondary-foreground/70">80文字以内で概要を記述してください．</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-secondary-foreground/70 mb-1">詳細</label>
        <textarea
          className="w-full rounded-md border border-secondary-foreground/40 px-3 py-2 text-sm h-40 resize-vertical focus:border-blue-500 focus:outline-none"
          value={state.detail}
          required
          onChange={(e) => setState((s) => ({ ...s, detail: e.target.value }))}
        />
        <p className="mt-1 text-[10px] text-secondary-foreground/70">再現手順・期待結果などを具体的に記載してください．</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-secondary-foreground/70 mb-1">連絡手段（任意）</label>
        <input
          className="w-full rounded-md border border-secondary-foreground/40 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="メールやXユーザー名など"
          value={state.contact || ""}
          onChange={(e) => setState((s) => ({ ...s, contact: e.target.value }))}
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:opacity-50"
      >
        {sending ? "送信中…" : "送信する"}
      </button>
    </form>
  );
};
