import React from "react";
import { Feedback } from "./feedback";
import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "Support", href: "/support" },
  { name: "Feedback", href: "/support/feedback" },
];

export const metadata: Metadata = {
  title: pathnames[1].name,
  description: "YHOTAMOS - " + pathnames[1].name,
};

export default function FeedbackPage() {
  return (
    <main className="max-w-7xl mx-auto p-5 ">
      <Breadcrumbs paths={pathnames} className="mb-3" />
      <div className="space-y-8 max-w-2xl mx-auto">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">フィードバック</h1>
          <p className="text-secondary-foreground/70 text-sm">改善提案・バグ報告を受け付けています．必要に応じてIssue化します．</p>
        </header>
        <Feedback />
        <p className="text-xs text-secondary-foreground/70">送信内容には個人情報を含めないでください．</p>
      </div>
    </main>
  );
}
