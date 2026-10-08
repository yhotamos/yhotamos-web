import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { TocItem } from "@/utils/getTocFromMarkdown";

export function BlogToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <aside className="h-fit rounded-[4px] bg-white dark:bg-secondary lg:sticky lg:top-20">
      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
          目次
          <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground group-open:rotate-180" />
        </summary>
        <TocLinks items={items} />
      </details>
      <div className="hidden lg:block">
        <h2 className="px-4 py-3 text-sm font-medium">目次</h2>
        <TocLinks items={items} />
      </div>
    </aside>
  );
}

function TocLinks({ items }: { items: TocItem[] }) {
  const minDepth = Math.min(...items.map((item) => item.depth));

  return (
    <nav aria-label="本文の目次" className="px-4 pt-3 pb-4 lg:max-h-[calc(100dvh-10rem)] lg:overflow-y-auto">
      <ul className="space-y-0.5 border-l">
        {items.map((item, index) => (
          <li key={index}>
            <a
              href={`#${item.id}`}
              className={clsx(
                "block rounded-r-sm py-1 pr-2 text-sm leading-relaxed text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2",
                item.depth === minDepth && "font-medium text-foreground"
              )}
              style={{ paddingLeft: `${12 + (item.depth - minDepth) * 12}px` }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
