import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { getRepos } from "@/api";
import { ProjectPage } from "@/components/layout/project";

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Projects", href: "/projects" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - My Projects",
};

export default async function Projects() {
  const repos = await getRepos("updated", 5);
  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <ProjectPage limit={5} />
    </main>
  );
}
