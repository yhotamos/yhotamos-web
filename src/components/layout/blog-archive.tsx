"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/components/config/iconMap";
import { cn } from "@/lib/utils";
import { Blog } from "@/components/types/blog";

export function BlogArchive({
  className,
  blogs,
  onMonthClick,
  selectedYear,
  selectedMonth,
}: {
  className?: string;
  blogs: Blog[] | undefined;
  onMonthClick?: (year: number, month: number) => void;
  selectedYear?: number;
  selectedMonth?: number;
}) {
  const grouped = useMemo(() => {
    const items = (blogs as Blog[]) ?? [];
    const yearMap = new Map<number, Map<number, number>>();
    items.forEach((blog) => {
      const d = new Date(blog.date);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      if (!yearMap.has(year)) yearMap.set(year, new Map());
      const monthMap = yearMap.get(year)!;
      monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
    });
    return [...yearMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([year, monthMap]) => ({
        year,
        total: [...monthMap.values()].reduce((s, n) => s + n, 0),
        months: [...monthMap.entries()].sort((a, b) => b[0] - a[0]).map(([month, count]) => ({ month, count })),
      }));
  }, [blogs]);

  const [openYears, setOpenYears] = useState<Set<number>>(() => new Set(grouped[0]?.year ? [grouped[0].year] : []));

  if (grouped.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-lg">記事がありません</div>
      </div>
    );
  }

  const toggleYear = (year: number) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

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
                {months.map(({ month, count }) => {
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
                        {year} / {month} ({count})
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
