import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { ProjectPage } from "@/components/layout/project";
import { getReposWithIssues } from "@/lib/getRepository";

export const revalidate = 60;

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Projects", href: "/projects" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - My Projects",
};

export default async function Projects() {
  const { repos, issues } = await getReposWithIssues("updated", 5).catch(() => ({ repos: [], issues: [] }));

  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <ProjectPage repos={repos} issues={issues} />
    </main>
  );
}
