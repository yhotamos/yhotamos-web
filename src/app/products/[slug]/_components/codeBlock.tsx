"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check, Copy, WrapText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CodeBlock({ children, className }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [wrap, setWrap] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timer = setTimeout(() => setCopyStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  async function handleCopy() {
    try {
      await copyText(preRef.current?.textContent ?? "");
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  let copyLabel = "コードをコピー";
  let CopyIcon = Copy;
  if (copyStatus === "copied") {
    copyLabel = "コピーしました";
    CopyIcon = Check;
  }
  if (copyStatus === "error") copyLabel = "コピーできませんでした";

  let wrapLabel = "コードを折り返す";
  if (wrap) wrapLabel = "折り返しを解除";

  return (
    <div className="not-prose group relative my-4">
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
        <Button type="button" variant="ghost" size="icon" className="size-8 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white" onClick={handleCopy} aria-label={copyLabel} title={copyLabel}>
          <CopyIcon aria-hidden="true" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-8 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white" onClick={() => setWrap(!wrap)} aria-label={wrapLabel} title={wrapLabel} aria-pressed={wrap}>
          <WrapText aria-hidden="true" />
        </Button>
      </div>
      <pre ref={preRef} className={cn("m-0 max-w-full overflow-x-auto rounded-md border border-neutral-200 bg-neutral-100 p-4 pt-12 font-mono text-[13px] leading-relaxed text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:font-[inherit] [&_code]:text-inherit", className, {
        "whitespace-pre-wrap break-words": wrap,
        "whitespace-pre": !wrap,
      })}>
        {children}
      </pre>
      <span role="status" className="sr-only">{copyStatus !== "idle" && copyLabel}</span>
    </div>
  );
}

async function copyText(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // HTTPでのスマホ確認ではClipboard APIが使えないため，従来のコピー処理を使う
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.readOnly = true;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  const previousFocus = document.activeElement;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    if (!document.execCommand("copy")) throw new Error("Copy failed");
  } finally {
    textarea.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  }
}
