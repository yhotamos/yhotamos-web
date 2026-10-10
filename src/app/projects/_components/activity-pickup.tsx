"use client";

import { useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faCodePullRequest } from "@fortawesome/free-solid-svg-icons";
import { ChevronDown, ChevronUp, CircleDot, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RepositoryActivity } from "@/types/project";

interface ActivityPickupProps {
  kind: "issue" | "pr";
  className?: string;
  items?: RepositoryActivity[];
}

const activityTypes = {
  issue: { title: "Picked Issues", label: "Issue", headingIcon: faBug, Icon: CircleDot },
  pr: { title: "Picked PRs", label: "PR", headingIcon: faCodePullRequest, Icon: GitPullRequest },
};

export function IssuePickup({ items = [], className = "" }: { items?: RepositoryActivity[]; className?: string }) {
  return <ActivityPickup kind="issue" items={items} className={className} />;
}

export function PRPickup({ items = [], className = "" }: { items?: RepositoryActivity[]; className?: string }) {
  return <ActivityPickup kind="pr" items={items} className={className} />;
}

export function ActivityPickup({ kind, className, items = [] }: ActivityPickupProps) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const { title, label, headingIcon, Icon } = activityTypes[kind];

  return (
    <section className={cn("min-w-0", className)}>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <FontAwesomeIcon icon={headingIcon} className="text-base text-muted-foreground" aria-hidden="true" />
        {title}
      </h2>
      {items.length === 0 && <p className="py-4 text-sm text-muted-foreground">表示できる{label}はありません</p>}
      <ActivityList items={items.slice(0, 5)} Icon={Icon} />
      {items.length > 5 && (
        <>
          <div
            id={listId}
            inert={!expanded}
            className={cn("grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none", expanded && "grid-rows-[1fr]")}
          >
            <div className="min-h-0 overflow-hidden">
              <ActivityList items={items.slice(5)} Icon={Icon} className="pt-3" />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="mx-auto mt-2 flex rounded-full text-muted-foreground"
            aria-label={expanded ? `${label}を折りたたむ` : `すべての${label}を表示`}
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded && <ChevronUp aria-hidden="true" />}
            {!expanded && <ChevronDown aria-hidden="true" />}
          </Button>
        </>
      )}
    </section>
  );
}

function ActivityList({ items, Icon, className }: { items: RepositoryActivity[]; Icon: typeof CircleDot; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <ActivityItem key={item.url} item={item} Icon={Icon} />
      ))}
    </ul>
  );
}

function ActivityItem({ item, Icon }: { item: RepositoryActivity; Icon: typeof CircleDot }) {
  return (
    <li className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <ActivityContent item={item} />
      </div>
    </li>
  );
}

function ActivityContent({ item }: { item: RepositoryActivity }) {
  const path = item.url.split("/");
  const repository = path.slice(3, 5).join("/");
  const number = path.at(-1);

  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">
        <span className="min-w-0 flex-1 break-words">
          {repository} · #{number}
        </span>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        title={item.title}
        className="block text-sm font-medium leading-relaxed break-words hover:text-blue-600 hover:underline dark:hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {item.title}
      </a>
      {item.labels.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="ラベル">
          {item.labels.map((label) => (
            <li key={label} className="max-w-full break-words rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
