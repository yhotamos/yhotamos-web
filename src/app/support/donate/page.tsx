import { Donate } from "./donate";
import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "Support", href: "/support" },
  { name: "Donate", href: "/support/donate" },
];

export const metadata: Metadata = {
  title: pathnames[1].name,
  description: "YHOTAMOS - " + pathnames[1].name,
};

export default function DonatePage() {
  return (
    <main className="max-w-7xl mx-auto p-5">
      <Breadcrumbs paths={pathnames} className="mb-3" />
      <div className="space-y-8 max-w-2xl mx-auto">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">寄付・支援</h1>
          <p className="text-secondary-foreground/70 text-sm">プロジェクト継続のための支援方法です．任意金額での支援が可能です．</p>
        </header>
        <Donate />
        <p className="text-xs text-gray-400">支援は任意です．優先度の高いIssue解決の保証にはなりませんが励みになります．</p>
      </div>
    </main>
  );
}
