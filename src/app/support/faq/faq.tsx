"use client";

import React, { useMemo, useState } from "react";
import { faqItems } from "@/components/config/faqItems";
import clsx from "clsx";

export default function FAQ() {
  const [category, setCategory] = useState<string>("all");
  const filtered = useMemo(() => (category === "all" ? faqItems : faqItems.filter((f) => f.category === category)), [category]);

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">FAQ</h1>
        <p className="text-secondary-foreground/70 text-sm">よくある質問と回答です．カテゴリで絞り込みできます．</p>
      </header>

      <FAQCategoryFilter value={category} onChange={setCategory} items={faqItems} />

      <ul className="divide-y divide-secondary-foreground/30 rounded-xl border border-secondary-foreground/30  ">
        {filtered.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

interface Props {
  value: string;
  onChange: (c: string) => void;
  items: any[];
}

export const FAQCategoryFilter: React.FC<Props> = ({ value, onChange, items }) => {
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((i) => map.set(i.category, (map.get(i.category) || 0) + 1));
    return Array.from(map.entries());
  }, [items]);

  return (
    <div className="flex flex-wrap gap-2">
      <FilterChip label="すべて" active={value === "all"} onClick={() => onChange("all")} />
      {categories.map(([cat, count]) => (
        <FilterChip key={cat} label={`${cat} (${count})`} active={value === cat} onClick={() => onChange(cat)} />
      ))}
    </div>
  );
};

export const FAQItem: React.FC<{ item: any }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <li id={item.id} className="">
      {/* // クリックしたら開く */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left cursor-pointer px-4 py-3"
        aria-expanded={open}
        aria-controls={`faq-body-${item.id}`}
      >
        <span className="font-medium text-sm md:text-base pr-4">{item.question}</span>
        <span className={clsx("transition-transform text-gray-500 dark:text-gray-400", open && "rotate-90")}>▶</span>
      </button>
      <div id={`faq-body-${item.id}`} className={clsx("my-2 mx-4 text-sm text-secondary-foreground/80 leading-relaxed", !open && "hidden")}>
        <p>{item.answer}</p>
        {item.updatedAt && <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400">Updated: {item.updatedAt}</p>}
      </div>
    </li>
  );
};

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={[
      "px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer",
      active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400",
    ].join(" ")}
  >
    {label}
  </button>
);
