import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faRocket } from "@fortawesome/free-solid-svg-icons";
import { ProjectThumbnail } from "./project-thumbnail";
import { cn } from "@/lib/utils";
import type { Repository } from "@/lib/getRepository";

export function ProjectPickup({ className, open = false, repos }: { className?: string; open?: boolean; repos: Repository[] }) {
  const projects = repos
    .filter((repo) => !repo.private)
    .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""))
    .slice(0, 4);

  if (projects.length === 0) return null;
  const featured = projects[0];

  return (
    <section className={cn("min-w-0", className)}>
      <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
        <FontAwesomeIcon icon={faRocket} className="text-base text-muted-foreground" aria-hidden="true" />
        注目のプロジェクト
      </h2>
      <div className="grid gap-5 md:grid-cols-2">
        <article className="min-w-0 overflow-hidden rounded-lg border border-border md:row-span-3">
          <Link href={featured.html_url} target="_blank" rel="noopener noreferrer" className="block border-b border-border">
            <ProjectThumbnail name={featured.full_name} />
          </Link>
          <div className="p-4 sm:p-5"><ProjectSummary repo={featured} featured /></div>
        </article>
        {projects.slice(1).map((repo) => (
          <article key={repo.id} className="flex min-w-0 items-center border-b border-border py-4 md:px-4">
            <ProjectSummary repo={repo} />
          </article>
        ))}
      </div>
      {open && (
        <div className="mt-4 text-right">
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
            すべてのプロジェクトを見る ＞
          </Link>
        </div>
      )}
    </section>
  );
}

function ProjectSummary({ repo, featured = false }: { repo: Repository; featured?: boolean }) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs text-muted-foreground">{repo.owner.login}</p>
      <h3 className={cn("font-semibold", featured ? "text-xl" : "text-lg")}>
        <Link href={repo.html_url} target="_blank" rel="noopener noreferrer" className="break-words hover:underline underline-offset-4">
          {repo.name}
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-2 text-xs text-muted-foreground" aria-label="GitHubで見る" />
        </Link>
      </h3>
      {repo.description && <p className="truncate text-sm leading-relaxed text-muted-foreground" title={repo.description}>{repo.description}</p>}
      {(repo.topics ?? []).length > 0 && (
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {repo.topics?.map((topic) => <li key={topic}>{topic}</li>)}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">更新 {repo.updated_at?.slice(0, 10)}</p>
    </div>
  );
}
