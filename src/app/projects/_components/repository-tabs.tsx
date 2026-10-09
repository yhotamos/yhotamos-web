"use client";

import { useState, type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RepositoryTab = { value: string; label: string; count: number };

export function ProjectRepositoryTabs({ groups, children }: { groups: RepositoryTab[]; children: ReactNode }) {
  const [value, setValue] = useState("all");
  const selectedGroup = groups.find((group) => group.value === value);

  return (
    <Tabs value={value} onValueChange={setValue}>
      <div className="flex items-center justify-between gap-3">
        <TabsList aria-label="リポジトリのアカウント" className="h-auto min-w-0 flex-wrap justify-start gap-x-4 gap-y-1 rounded-none bg-transparent p-0">
          {groups.map((group) => (
            <TabsTrigger
              key={group.value}
              value={group.value}
              className="relative h-auto flex-none rounded-none border-0 bg-transparent px-0 py-2 text-muted-foreground shadow-none data-[state=active]:bg-transparent data-[state=active]:text-violet-600 data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-violet-400 after:absolute after:bottom-0 after:left-1/4 after:h-0.5 after:w-1/2 after:content-[''] data-[state=active]:after:bg-violet-600 dark:data-[state=active]:after:bg-violet-400"
            >
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <p className="shrink-0 text-xs text-muted-foreground">更新順・{selectedGroup?.count ?? 0}件</p>
      </div>
      {children}
    </Tabs>
  );
}
