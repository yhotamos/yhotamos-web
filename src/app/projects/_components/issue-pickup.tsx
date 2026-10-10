"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { ChevronDown, ChevronUp, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Issue } from "@/types/project";

export function IssuePickup({ className, issues = [] }: { className?: string; issues?: Issue[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={cn("min-w-0", className)}>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <FontAwesomeIcon icon={faBug} className="text-base text-muted-foreground" aria-hidden="true" />
        Picked Issues
      </h2>
      {issues.length === 0 && <p className="py-4 text-sm text-muted-foreground">表示できるIssueはありません</p>}
      <IssueList issues={issues.slice(0, 5)} />
      {issues.length > 5 && (
        <>
          <div id="picked-issues-list" inert={!expanded} className={cn("grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none", expanded && "grid-rows-[1fr]")}>
            <div className="min-h-0 overflow-hidden">
              <IssueList issues={issues.slice(5)} />
            </div>
          </div>
          <Button type="button" variant="outline" size="icon" className="mx-auto mt-2 flex rounded-full text-muted-foreground" aria-label={expanded ? "Issueを折りたたむ" : "すべてのIssueを表示"} aria-expanded={expanded} aria-controls="picked-issues-list" onClick={() => setExpanded(!expanded)}>
            {expanded && <ChevronUp aria-hidden="true" />}
            {!expanded && <ChevronDown aria-hidden="true" />}
          </Button>
        </>
      )}
    </section>
  );
}

function IssueList({ issues }: { issues: Issue[] }) {
  return (
    <ul className="space-y-4">
      {issues.map((issue) => (
        <IssueItem key={issue.url} issue={issue} />
      ))}
    </ul>
  );
}

function IssueItem({ issue }: { issue: Issue }) {
  return (
    <li className="flex min-w-0 items-start gap-2">
      <CircleDot className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <IssueContent issue={issue} />
      </div>
    </li>
  );
}

function IssueContent({ issue }: { issue: Issue }) {
  const path = issue.url.split("/");
  const repository = path.slice(3, 5).join("/");
  const number = path.at(-1);

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">
        <span className="min-w-0 flex-1 break-words">{repository} · #{number}</span>
      </div>
      <a href={issue.url} target="_blank" rel="noopener noreferrer" title={issue.title} className="block text-sm font-medium leading-relaxed break-words hover:text-blue-600 hover:underline dark:hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2">
        {issue.title}
      </a>
      {issue.labels.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="ラベル">
          {issue.labels.map((label) => (
            <li key={label} className="max-w-full break-words rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{label}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
