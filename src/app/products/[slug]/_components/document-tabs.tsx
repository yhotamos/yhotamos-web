"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProductDocumentTabs({ overview, usage }: { overview: ReactNode; usage?: ReactNode }) {
  return (
    <Tabs defaultValue="overview" orientation="vertical" className="grid items-start gap-6 md:grid-cols-[144px_minmax(0,1fr)]">
      <TabsList aria-label="ドキュメント" className="h-fit w-full flex-col items-stretch justify-start gap-1 rounded-none bg-transparent p-0 md:sticky md:top-20">
        <TabsTrigger value="overview" className="h-10 flex-none justify-start border-0 px-3 data-[state=active]:bg-neutral-200 data-[state=active]:text-neutral-900 data-[state=active]:shadow-none dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-100">概要</TabsTrigger>
        {usage && <TabsTrigger value="usage" className="h-10 flex-none justify-start border-0 px-3 data-[state=active]:bg-neutral-200 data-[state=active]:text-neutral-900 data-[state=active]:shadow-none dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-100">使い方</TabsTrigger>}
      </TabsList>
      <div className="min-w-0 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_img]:h-auto [&_img]:max-w-full md:border-l md:pl-6">
        <TabsContent value="overview" forceMount className="data-[state=inactive]:hidden">{overview}</TabsContent>
        {usage && <TabsContent value="usage" forceMount className="data-[state=inactive]:hidden">{usage}</TabsContent>}
      </div>
    </Tabs>
  );
}
