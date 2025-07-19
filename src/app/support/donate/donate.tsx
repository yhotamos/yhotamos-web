"use client";
import React, { useState } from "react";

export const Donate: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const platforms = [
    { key: "github", label: "GitHub Sponsors", url: "https://github.com/sponsors/your-id", desc: "継続的支援が可能" },
    { key: "kofi", label: "Ko-fi", url: "https://ko-fi.com/your-id", desc: "1回の少額支援" },
    { key: "bmac", label: "Buy Me a Coffee", url: "https://www.buymeacoffee.com/your-id", desc: "シンプルな1回支援" },
  ];

  return (
    <div className="space-y-4">
      <ul className="grid gap-4 md:grid-cols-2">
        {platforms.map((p) => (
          <li key={p.key}>
            <button
              onClick={() => setSelected(p.key)}
              className={[
                "w-full rounded-lg border p-4 text-left transition shadow-sm cursor-pointer",
                selected === p.key
                  ? "border-violet-500 bg-violet-100 text-violet-900"
                  : "border-secondary-foreground/30 hover:border-violet-500",
              ].join(" ")}
            >
              <div className="font-medium">{p.label}</div>
              <p className="text-xs mt-1">{p.desc}</p>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="rounded-lg border border-violet-500 bg-violet-100 text-violet-900 p-4 text-sm">
          選択中: {platforms.find((p) => p.key === selected)?.label}．
          <a
            href={platforms.find((p) => p.key === selected)?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-700 underline"
          >
            支援ページを開く →
          </a>
        </div>
      )}
    </div>
  );
};
