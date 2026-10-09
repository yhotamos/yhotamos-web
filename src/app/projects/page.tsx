import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { ProjectPage } from "./_components/projects";
import { getFeaturedRepos, getReposWithIssues } from "@/lib/getRepository";

export const revalidate = 60;

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Projects", href: "/projects" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - My Projects",
};

export default async function Projects() {
  const [{ repos, issues }, featuredRepos] = await Promise.all([
    getReposWithIssues("updated", 5).catch(() => ({ repos: [], issues: [] })),
    getFeaturedRepos().catch(() => []),
  ]);

  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <ProjectPage repos={repos} featuredRepos={featuredRepos} issues={issues} />
    </main>
  );
}
