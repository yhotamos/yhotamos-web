"use client";

import React from "react";
import { useState } from "react";

export default function Contact() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">お問い合わせ</h1>
        <p className="text-secondary-foreground/70 text-sm">
          個別連絡が必要な事項はこちらから送信してください．通常3営業日以内に返信します．
        </p>
      </header>
      <ContactForm />
      <p className="text-xs text-gray-400">返信を保証するものではありません．</p>
    </div>
  );
}

type ContactState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const ContactForm: React.FC = () => {
  const [state, setState] = useState<ContactState>({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error("送信に失敗しました");
      setDone(true);
      setState({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {done && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">送信が完了しました．</div>}
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="お名前" required>
          <input
            className="w-full rounded-md border border-secondary-foreground/30 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={state.name}
            onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
            required
          />
        </Field>
        <Field label="メールアドレス" required>
          <input
            type="email"
            className="w-full rounded-md border border-secondary-foreground/30 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={state.email}
            onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
            required
          />
        </Field>
      </div>
      <Field label="件名" required>
        <input
          className="w-full rounded-md border border-secondary-foreground/30 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={state.subject}
          onChange={(e) => setState((s) => ({ ...s, subject: e.target.value }))}
          required
        />
      </Field>
      <Field label="本文" required>
        <textarea
          className="w-full rounded-md border border-secondary-foreground/30 px-3 py-2 text-sm h-48 resize-vertical focus:border-blue-500 focus:outline-none"
          value={state.message}
          onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
          required
        />
      </Field>
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

const Field: React.FC<{ label: string; children: React.ReactNode; required?: boolean }> = ({ label, children, required }) => (
  <label className="block text-xs font-medium text-secondary-foreground/70 ">
    <span>
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </span>
    <div className="mt-1">{children}</div>
  </label>
);
