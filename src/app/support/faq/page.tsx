import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import FAQ from "./faq";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "Support", href: "/support" },
  { name: "FAQ", href: "/support/faq" },
];

export const metadata: Metadata = {
  title: pathnames[1].name,
  description: "YHOTAMOS - " + pathnames[1].name,
};

export default function FaqPage() {
  return (
    <main className="max-w-7xl mx-auto p-5 ">
      <Breadcrumbs paths={pathnames} className="mb-3" />
      <FAQ />
    </main>
  );
}
