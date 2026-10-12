"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/config/iconMap";
import { cn } from "@/lib/utils";
import { Blog } from "@/types/blog";
import { FormattedDate } from "@/components/ui/formatted-date";

type ArchiveYear = {
  year: number;
  total: number;
  months: { month: number; articles: Blog[] }[];
};

function useArchive(blogs: Blog[] | undefined) {
  const grouped = useMemo<ArchiveYear[]>(() => {
    const items = blogs ?? [];
    const yearMap = new Map<number, Map<number, Blog[]>>();
    items.forEach((blog) => {
      const d = new Date(blog.publishedAt);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      if (!yearMap.has(year)) yearMap.set(year, new Map());
      const monthMap = yearMap.get(year)!;
      const articles = monthMap.get(month) ?? [];
      articles.push(blog);
      monthMap.set(month, articles);
    });
    return [...yearMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([year, monthMap]) => ({
        year,
        total: [...monthMap.values()].reduce((sum, articles) => sum + articles.length, 0),
        months: [...monthMap.entries()].sort((a, b) => b[0] - a[0]).map(([month, articles]) => ({ month, articles })),
      }));
  }, [blogs]);

  const [openYears, setOpenYears] = useState<Set<number>>(() => new Set(grouped[0]?.year ? [grouped[0].year] : []));
  const toggleYear = (year: number) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  return { grouped, openYears, toggleYear };
}

function EmptyArchive() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-lg">記事がありません</div>
    </div>
  );
}

function ArchiveYearButton({ year, total, isOpen, onClick }: { year: number; total: number; isOpen: boolean; onClick: () => void }) {
  return (
    <button
      className="flex items-center gap-2 w-full text-left py-1.5 text-sm font-semibold hover:text-foreground text-secondary-foreground"
      onClick={onClick}
      aria-expanded={isOpen}
    >
      <FontAwesomeIcon icon={isOpen ? iconMap["faAngleDown"] : iconMap["faChevronRight"]} className="w-3 h-3 shrink-0 transition-transform duration-200" />
      <span className="text-lg">{year}年</span>
      <span className="text-lg text-muted-foreground font-normal">({total})</span>
    </button>
  );
}

export function BlogArchiveDetail({ blogs, className, onMonthClick }: {
  blogs: Blog[] | undefined;
  className?: string;
  onMonthClick?: (year: number, month: number) => void;
}) {
  const { grouped, openYears, toggleYear } = useArchive(blogs);
  if (grouped.length === 0) {
    return <EmptyArchive />;
  }

  return (
    <div className={cn(className, "space-y-6")}>
      {grouped.map(({ year, total, months }) => (
        <section key={year} className="space-y-0.5">
          <ArchiveYearButton year={year} total={total} isOpen={openYears.has(year)} onClick={() => toggleYear(year)} />
          {openYears.has(year) && months.map(({ month, articles }) => (
            <div key={month} className="ml-5 space-y-2">
              <button
                className="text-sm font-semibold py-0.5 w-full text-left text-muted-foreground hover:text-foreground hover:underline"
                onClick={() => onMonthClick?.(year, month)}
              >
                {month}月 ({articles.length})
              </button>
              <ul className="space-y-2">
                {articles.map((article) => (
                  <li key={article.slug} className="flex items-baseline gap-3 text-sm">
                    <span className="shrink-0 text-muted-foreground">
                      <FormattedDate isoDate={article.publishedAt} />
                    </span>
                    <Link href={`/blog/${article.slug}`} className="min-w-0 hover:underline">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export function BlogArchive({ blogs, className, onMonthClick, selectedYear, selectedMonth }: {
  blogs: Blog[] | undefined;
  className?: string;
  onMonthClick?: (year: number, month: number) => void;
  selectedYear?: number;
  selectedMonth?: number;
}) {
  const { grouped, openYears, toggleYear } = useArchive(blogs);

  if (grouped.length === 0) {
    return <EmptyArchive />;
  }

  return (
    <div className={cn(className, "space-y-0.5")}>
      {grouped.map(({ year, total, months }) => {
        const isOpen = openYears.has(year);
        return (
          <div key={year}>
            <button
              className="flex items-center gap-2 w-full text-left py-1.5 text-sm font-semibold hover:text-foreground text-secondary-foreground"
              onClick={() => toggleYear(year)}
            >
              <FontAwesomeIcon
                icon={isOpen ? iconMap["faAngleDown"] : iconMap["faChevronRight"]}
                className="w-3 h-3 shrink-0 transition-transform duration-200"
              />
              <span>{year}</span>
              <span className="text-xs text-muted-foreground font-normal">({total})</span>
            </button>
            {isOpen && (
              <ul className="ml-5 mb-1 space-y-0.5">
                {months.map(({ month, articles }) => {
                  const isActive = selectedYear === year && selectedMonth === month;
                  return (
                    <li key={month}>
                      <button
                        className={cn(
                          "text-sm py-0.5 w-full text-left hover:text-foreground hover:underline",
                          isActive ? "text-foreground font-semibold" : "text-muted-foreground",
                        )}
                        onClick={() => onMonthClick?.(year, month)}
                      >
                        {year} / {month} ({articles.length})
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
