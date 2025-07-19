import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import Contact from "./contact";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "Support", href: "/support" },
  { name: "Contact", href: "/support/contact" },
];

export const metadata: Metadata = {
  title: pathnames[1].name,
  description: "YHOTAMOS - " + pathnames[1].name,
};

export default async function ContactPage() {
  return (
    <main className="max-w-7xl mx-auto p-5">
      <Breadcrumbs paths={pathnames} className="mb-3" />
      <Contact />
    </main>
  );
}
