import { Hr } from "@/components/layout/hr";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { ProjectRepositoryTabs } from "./repository-tabs";
import { ProjectPickup } from "@/components/layout/project-pickup";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCodeFork, faFlask, faHandshake, faStar } from "@fortawesome/free-solid-svg-icons";
import type { FeaturedRepository, Issue, PullRequest, Repository } from "@/types/project";
import { IssuePickup, PRPickup } from "./activity-pickup";

interface ProjectPageProps {
  title: string;
  repos: Repository[];
  featuredRepos: FeaturedRepository[];
  issues: Issue[];
  pullRequests: PullRequest[];
}

export function ProjectPage({ title, repos, featuredRepos, issues, pullRequests }: ProjectPageProps) {
  return (
    <div className="w-full space-y-10">
      <ProjectHero title={title} className="" />
      <ProjectPickup repos={featuredRepos} />
      <Hr />
      <div className="grid grid-cols-1 items-start gap-x-3 gap-y-6 md:grid-cols-2">
        <Labs className="rounded-2xl border border-muted-foreground/50 p-4" />
        <Contribute className="rounded-2xl border border-muted-foreground/50 p-4" />
        <IssuePickup items={issues} className="rounded-2xl border border-muted-foreground/50 p-4" />
        <PRPickup items={pullRequests} className="rounded-2xl border border-muted-foreground/50 p-4" />
      </div>
      <Hr />
      <ProjectRepos repos={repos} />
      <ProjectFooter />
    </div>
  );
}

export function ProjectHero({ title, className = "" }: { title: string; description?: string; className?: string }) {
  return (
    <section className={cn(className, "text-center space-y-4")}>
      <h1 className="text-3xl font-bold">{title}</h1>
      <div>
        <p className="text-muted-foreground text-sm md:text-base">現在進行中のプロジェクトや実験的なアイデアを紹介します．</p>
      </div>
    </section>
  );
}

const experiments = ["CanvasにPNG画像+メタ情報を合成して再表示（.deg形式）", "ブラウザ上でOAuth2のローカルテスト→ESP32連携", "Vercel Functionsを使ったスプレッドシートAPI Proxy化"];

export function Labs({ className = "" }: { className?: string }) {
  return (
    <section className={className}>
      <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
        <FontAwesomeIcon icon={faFlask} className="text-base text-muted-foreground" aria-hidden="true" />
        開発ラボ - 技術検証ログ
      </h2>
      <ul className="text-muted-foreground text-base list-disc pl-5 space-y-2">
        {experiments.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function Contribute({ className = "" }: { className?: string }) {
  return (
    <section className={className}>
      <h2 className="flex items-center gap-2 text-xl font-bold mb-2">
        <FontAwesomeIcon icon={faHandshake} className="text-base text-muted-foreground" aria-hidden="true" />
        貢献してみませんか？
      </h2>
      <p className="text-muted-foreground text-base mb-4">気になるプロジェクトがあれば，ぜひIssueのコメントやPRで参加してみてください． コードだけでなく，アイデアやレビューも大歓迎です！</p>
      <a href="https://github.com/yhotta240" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition">
        GitHubでプロジェクトを見る
      </a>
    </section>
  );
}

export function ProjectRepos({ className, title, repos }: { className?: string; title?: string; repos?: Repository[] }) {
  if (!repos || repos.length === 0) {
    return null;
  }

  const owners = [...new Set(repos.map((repo) => repo.owner.login))];
  const groups = [
    { value: "all", label: "すべて", repos },
    ...owners.map((owner) => ({ value: `owner:${owner}`, label: owner, repos: repos.filter((repo) => repo.owner.login === owner) })),
  ];

  return (
    <section className={cn(className, "space-y-3")}>
      <h2 className="font-bold text-xl mb-3">{title || "GitHubリポジトリ一覧"}</h2>
      <ProjectRepositoryTabs groups={groups.map((group) => ({ value: group.value, label: group.label, count: group.repos.length }))}>
        {groups.map((group) => (
          <TabsContent key={group.value} value={group.value}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.repos.map((repo) => <ProjectCard repo={repo} key={repo.id} />)}
            </div>
          </TabsContent>
        ))}
      </ProjectRepositoryTabs>
    </section>
  );
}

function ProjectCard({ repo }: { repo: Repository }) {
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-md border border-border p-4">
      <h3 className="flex items-start gap-2 text-base font-semibold">
        <FontAwesomeIcon icon={faBook} className="mt-1 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Link href={repo.html_url} target="_blank" rel="noopener noreferrer" className="min-w-0 break-words text-blue-600 hover:underline dark:text-blue-400">
          {repo.full_name}
        </Link>
      </h3>
      {repo.description && <p className="text-sm leading-relaxed text-muted-foreground">{repo.description}</p>}
      {(repo.topics ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {repo.topics?.slice(0, 3).map((topic) => <Badge key={topic} variant="outline" className="rounded-full">{topic}</Badge>)}
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-muted-foreground">
        {repo.language && <span>{repo.language}</span>}
        <Link href={`${repo.html_url}/stargazers`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground" aria-label={`${repo.name}のスター ${repo.stargazers_count ?? 0}件`}>
          <FontAwesomeIcon icon={faStar} aria-hidden="true" />{repo.stargazers_count ?? 0}
        </Link>
        <Link href={`${repo.html_url}/forks`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground" aria-label={`${repo.name}のフォーク ${repo.forks_count ?? 0}件`}>
          <FontAwesomeIcon icon={faCodeFork} aria-hidden="true" />{repo.forks_count ?? 0}
        </Link>
        <span className="sm:ml-auto">更新 {repo.updated_at?.slice(0, 10)}</span>
      </div>
    </article>
  );
}

export function ProjectFooter() {
  return (
    <section className="flex justify-end py-10">
      <Link href="/products" className=" underline">
        完成したプロダクト一覧はこちら（Products ページへ）
      </Link>
    </section>
  );
}
