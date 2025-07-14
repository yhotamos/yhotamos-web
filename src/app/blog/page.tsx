import type { Metadata } from "next";
import { Blogs } from "@/components/layout/blogs";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "Blog", href: "/blog" },
];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - Blog",
};

export default function Blog() {
  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <Blogs />
    </main>
  );
}
