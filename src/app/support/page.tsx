import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import Link from "next/link";
import clsx from "clsx";
import { Icon } from "@radix-ui/react-select";
import { supportItems } from "@/components/config/supportItem";
import type { SupportItem } from "@/components/types/support";

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Support", href: "/support" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - " + pathnames[0].name,
};

export default function Support() {
  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <div className="space-y-12">
        <SupportHero />

        {/* 概要カード（すぐに各詳細ページへ遷移可能） */}
        <SectionGrid>
          {supportItems.map((item, index) => (
            <SupportCard key={index} {...item} />
          ))}
        </SectionGrid>
      </div>
    </main>
  );
}

const SupportHero: React.FC = () => {
  return (
    <header className="text-center space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">サポートセンター</h1>
      <p className="text-secondary-foreground/70 text-sm md:text-base">
        {supportItems.map((item, index) => (
          <span key={index}>
            {item.title}
            {index < supportItems.length - 1 ? "，" : ""}
          </span>
        ))}
        にアクセスできます．必要なトピックを選んでください．
      </p>
    </header>
  );
};

const SectionGrid = ({ children }: { children: React.ReactNode }) => <div className="grid gap-5 md:gap-10 sm:grid-cols-2">{children}</div>;

const SupportCard: React.FC<SupportItem & { className?: string }> = ({ title, description, href, className }) => {
  return (
    <Link
      href={href}
      className={clsx(className, "flex flex-col justify-between rounded-xl border border-secondary-foreground/30 p-5 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50")}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-6 w-6 text-blue-500" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-secondary-foreground/70 leading-relaxed">{description}</p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">詳しく見る →</span>
    </Link>
  );
};
