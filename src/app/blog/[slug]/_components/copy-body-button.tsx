"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyText } from "@/utils/copyText";

export function CopyBodyButton({ content }: { content: string }) {
  async function handleCopy() {
    try {
      await copyText(content);
    } catch (error) {
      console.error("本文のコピーに失敗しました", error);
    }
  }

  return (
    <Button type="button" variant="ghost" size="icon" className="size-7 cursor-pointer opacity-0 transition-opacity group-hover/article:opacity-100 group-focus-within/article:opacity-100 [@media(hover:none)]:opacity-100" onClick={handleCopy} aria-label="本文をコピー">
      <Copy aria-hidden="true" />
    </Button>
  );
}
