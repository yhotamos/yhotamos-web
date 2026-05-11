"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { IssueEntry, ProductInfo, ToolFeedbackType } from "@/components/types/feedback";

interface FormState {
  toolName: string;
  type: ToolFeedbackType;
  title: string;
  detail: string;
  contact: string;
  browser: string;
  bugType: string;
}

const ISSUE_TYPES: { value: ToolFeedbackType; label: string }[] = [
  { value: "bug", label: "バグ報告" },
  { value: "suggestion", label: "改善提案" },
  { value: "impression", label: "感想" },
  { value: "other", label: "その他" },
];

const BROWSERS = ["Chrome", "Firefox", "Safari", "Edge", "Opera", "Vivaldi", "Brave", "その他"];
const BUG_TYPES = ["表示の崩れ", "機能が動作しない", "エラーが表示される", "パフォーマンスの問題", "セキュリティに関する問題", "その他"];
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

const INITIAL_STATE: FormState = {
  toolName: "",
  type: "bug",
  title: "",
  detail: "",
  contact: "",
  browser: "",
  bugType: "",
};

async function fileToBase64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-secondary-foreground/70 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function ToolDropdown({ products, value, onSelect }: { products: ProductInfo[]; value: string; onSelect: (repoName: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = products.find((p) => p.repo_name === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="w-full rounded-md border border-secondary-foreground/40 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none flex items-center justify-between bg-background"
        onClick={() => setOpen((v) => !v)}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <img src={selected.icon_url} alt="" className="w-4 h-4 flex-shrink-0 rounded-sm object-contain" />
            <span>{selected.name}</span>
          </span>
        ) : (
          <span className="text-secondary-foreground/50">選択してください</span>
        )}
        <svg className="w-4 h-4 text-secondary-foreground/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md border border-secondary-foreground/40 bg-background shadow-lg">
          {products.map((p) => (
            <li key={p.repo_name}>
              <button
                type="button"
                className="w-full px-3 py-2 text-sm hover:bg-secondary/50 flex items-center justify-between gap-2"
                onClick={() => {
                  onSelect(p.repo_name);
                  setOpen(false);
                }}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <img src={p.icon_url} alt="" className="w-4 h-4 flex-shrink-0 rounded-sm object-contain" />
                  <span className="truncate">{p.name}</span>
                </span>
                <span className="text-xs text-secondary-foreground/60 flex-shrink-0">{p.category}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BugExtraSection({ browser, bugType, onChange }: { browser: string; bugType: string; onChange: (field: "browser" | "bugType", value: string) => void }) {
  const data = [
    { label: "問題が発生したブラウザ", value: browser, options: BROWSERS, field: "browser" as const },
    { label: "問題の種類", value: bugType, options: BUG_TYPES, field: "bugType" as const },
  ];

  return (
    <>
      {data.map((d) => (
        <div key={d.field}>
          <FieldLabel required>{d.label}</FieldLabel>
          <select
            className="w-full rounded-md border border-secondary-foreground/40 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={d.value}
            required
            onChange={(e) => onChange(d.field, e.target.value)}
          >
            <option value="">選択してください</option>
            {d.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </>
  );
}

function AttachmentSection({ error, onChange }: { error: string | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <FieldLabel>スクリーンショット（任意）</FieldLabel>
      <input
        type="file"
        accept="image/*,application/pdf,video/*"
        className="w-full text-sm text-secondary-foreground/70 file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-secondary/80"
        onChange={onChange}
      />
      <p className={`mt-1 text-[10px] ${error ? "text-red-500" : "text-secondary-foreground/70"}`}>{error ?? "PDF・画像・動画（5MB以下）を添付できます．"}</p>
    </div>
  );
}

export function Issue({ products }: { products: ProductInfo[] }) {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get("tool") ?? "";
  const validToolParam = products.some((p) => p.repo_name === toolParam) ? toolParam : "";

  const [state, setState] = useState<FormState>(() => ({
    ...INITIAL_STATE,
    ...(validToolParam && { toolName: validToolParam }),
  }));
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBug = state.type === "bug";
  const showBugExtra = isBug;
  const showAttachment = isBug || state.type === "suggestion";

  const onAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_ATTACHMENT_SIZE) {
      setAttachmentError("ファイルサイズは5MB以下にしてください");
      setAttachmentFile(null);
      e.target.value = "";
      return;
    }
    setAttachmentError(null);
    setAttachmentFile(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.toolName) {
      setError("ツールを選択してください");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const payload: IssueEntry = {
        toolName: state.toolName,
        type: state.type,
        title: state.title,
        detail: state.detail,
        contact: state.contact || undefined,
        browser: showBugExtra ? state.browser : undefined,
        bugType: showBugExtra ? state.bugType : undefined,
        ...(attachmentFile && {
          attachmentName: attachmentFile.name,
          attachmentMimeType: attachmentFile.type,
          attachmentData: await fileToBase64(attachmentFile),
        }),
      };
      const res = await fetch("/api/support/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("送信に失敗しました");
      setDone(true);
      setState(INITIAL_STATE);
      setAttachmentFile(null);
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
        <FieldLabel required>ツール</FieldLabel>
        <ToolDropdown products={products} value={state.toolName} onSelect={(repoName) => setState((s) => ({ ...s, toolName: repoName }))} />
      </div>

      <div>
        <FieldLabel required>種別</FieldLabel>
        <div className="flex gap-4 text-sm flex-wrap">
          {ISSUE_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="type" value={t.value} checked={state.type === t.value} onChange={() => setState((s) => ({ ...s, type: t.value, browser: "", bugType: "" }))} />
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

      {showBugExtra && <BugExtraSection browser={state.browser} bugType={state.bugType} onChange={(field, value) => setState((s) => ({ ...s, [field]: value }))} />}

      <div>
        <FieldLabel required>詳細</FieldLabel>
        <textarea
          className="w-full rounded-md border border-secondary-foreground/40 px-3 py-2 text-sm h-40 resize-vertical focus:border-blue-500 focus:outline-none"
          value={state.detail}
          required
          onChange={(e) => setState((s) => ({ ...s, detail: e.target.value }))}
        />
        {showBugExtra && <p className="mt-1 text-[10px] text-secondary-foreground/70">再現手順・期待結果などを具体的に記載してください．</p>}
      </div>

      {showAttachment && <AttachmentSection error={attachmentError} onChange={onAttachmentChange} />}

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
