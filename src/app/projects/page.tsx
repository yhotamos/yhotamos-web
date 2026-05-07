import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { ProjectPage } from "@/components/layout/project";
import { getReposWithIssues } from "@/lib/getRepository";
import getProjects from "@/lib/getProjects";
import { Issue, Project } from "@/components/types/project";

export const revalidate = 60;

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Projects", href: "/projects" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - My Projects",
};

export default async function Projects() {
  const [reposResult, projectsResult] = await Promise.allSettled([
    getReposWithIssues("updated", 5),
    getProjects(),
  ]);

  const repos = reposResult.status === "fulfilled" ? reposResult.value.repos : [];
  const issues = reposResult.status === "fulfilled" ? reposResult.value.issues : [];
  const projects = projectsResult.status === "fulfilled" ? projectsResult.value : [];

  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <ProjectPage repos={repos} issues={issues} projects={projects} />
    </main>
  );
}
