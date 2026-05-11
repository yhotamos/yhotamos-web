"use client";
import React, { useState } from "react";
import type { FeedbackEntry, SiteFeedbackType } from "@/components/types/feedback";

interface FormState {
  type: SiteFeedbackType;
  title: string;
  detail: string;
  contact: string;
}

const FEEDBACK_TYPES: { value: SiteFeedbackType; label: string }[] = [
  { value: "typo", label: "誤字・誤情報" },
  { value: "impression", label: "感想" },
  { value: "other", label: "その他" },
];

const INITIAL_STATE: FormState = {
  type: "typo",
  title: "",
  detail: "",
  contact: "",
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-secondary-foreground/70 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export function Feedback() {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const payload: FeedbackEntry = {
        type: state.type,
        title: state.title,
        detail: state.detail,
        contact: state.contact || undefined,
      };
      const res = await fetch("/api/support/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setDone(true);
      setState(INITIAL_STATE);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {done && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">送信が完了しました．ありがとうございました．</div>}
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div>
        <FieldLabel required>種別</FieldLabel>
        <div className="flex gap-4 text-sm flex-wrap">
          {FEEDBACK_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="type" value={t.value} checked={state.type === t.value} onChange={() => setState((s) => ({ ...s, type: t.value }))} />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel required>タイトル</FieldLabel>
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
        <FieldLabel required>詳細</FieldLabel>
        <textarea
          className="w-full rounded-md border border-secondary-foreground/40 px-3 py-2 text-sm h-40 resize-vertical focus:border-blue-500 focus:outline-none"
          value={state.detail}
          required
          onChange={(e) => setState((s) => ({ ...s, detail: e.target.value }))}
        />
      </div>

      <div>
        <FieldLabel>連絡手段（任意）</FieldLabel>
        <input
          className="w-full rounded-md border border-secondary-foreground/40 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="メールやXユーザー名など"
          value={state.contact}
          onChange={(e) => setState((s) => ({ ...s, contact: e.target.value }))}
        />
      </div>

      <button type="submit" disabled={sending} className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:opacity-50">
        {sending ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}
