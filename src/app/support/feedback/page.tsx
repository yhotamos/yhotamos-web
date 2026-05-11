import { Feedback } from "./feedback";
import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { checkSupportEnabled } from "@/lib/support";
import { getChromeWebStoreItems } from "@/lib/googleSheets";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "Support", href: "/support" },
  { name: "Feedback", href: "/support/feedback" },
];

export const metadata: Metadata = {
  title: pathnames[1].name,
  description: "YHOTAMOS - " + pathnames[1].name,
};

export default async function FeedbackPage() {
  checkSupportEnabled(pathnames[1].href);
  const allProducts = await getChromeWebStoreItems();
  const products = allProducts.map((p) => ({ repo_name: p.repo_name, name: p.name, icon_url: p.icon_url, category: p.category }));
  return (
    <main className="max-w-7xl mx-auto p-5 ">
      <Breadcrumbs paths={pathnames} className="mb-3" />
      <div className="space-y-8 max-w-2xl mx-auto">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">フィードバック</h1>
          <p className="text-secondary-foreground/70 text-sm">サイトの感想・誤情報の報告や，公開ツールへのバグ報告・改善提案を受け付けています．</p>
        </header>
        <Feedback products={products} />
        <p className="text-xs text-secondary-foreground/70">送信内容には個人情報を含めないでください．</p>
      </div>
    </main>
  );
}
