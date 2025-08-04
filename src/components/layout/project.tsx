"use client";

import { useEffect, useState } from "react";
import { OpenGraphEmbed } from "./embed";
import { Hr } from "./hr";
import Loading from "./loading";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/components/config/iconMap";
import { Issue, Project } from "@/components/types/project";
import getProjects from "@/lib/getProjects";
import { getRepos, getIssues } from "@/lib/getRepository";

export function ProjectPage({ title, limit = 5 }: { title?: string; limit?: number }) {
  const [repos, setRepos] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const repos: any = await getRepos("updated", limit);
        setRepos(repos);

        const allIssuesNested = await Promise.all(
          repos.map(async (repo: any) => {
            try {
              const issuesRes = await getIssues(repo, 10);
              if (issuesRes.length === 0) return [];

              const issue: Issue = {
                title: issuesRes[0].title,
                url: issuesRes[0].html_url,
                labels: issuesRes[0].labels.map((label: any) => label.name),
                updated: issuesRes[0].updated_at,
              };

              return issue;
            } catch (e) {
              console.warn(`スキップ: ${repo.name} の issue 取得失敗`, e);
              return [];
            }
          })
        );
        const allIssues: Issue[] = allIssuesNested.flat();

        setIssues(allIssues as never[]);
      } catch (e) {
        console.error("Issue fetch error", e);
      }
    };
    fetchRepos();
  }, []);

  return (
    <div className="w-full space-y-10">
      <ProjectHero title={title || "Projects"} className="" />
      <Hr />
      <ProjectPickup />
      <Hr />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ProjectIdea className="rounded-2xl border border-muted-foreground/50 p-4" />
        <IssuePickup issues={issues} className="rounded-2xl border border-muted-foreground/50 p-4" />
        <Labs className="rounded-2xl border border-muted-foreground/50 p-4" />
        <Contribute className="rounded-2xl border border-muted-foreground/50 p-4" />
      </div>
      <Hr />
      <ProjectRepos repos={repos} limit={10} />
      <ProjectFooter />
    </div>
  );
}

export function ProjectHero({ title, description, className = "" }: { title: string; description?: string; className?: string }) {
  return (
    <section className={cn(className, "text-center space-y-4")}>
      <h1 className="text-3xl font-bold">{title}</h1>
      <div>
        <p className="text-muted-foreground text-sm md:text-base">現在進行中のプロジェクトや実験的なアイデアを紹介します．</p>
      </div>
    </section>
  );
}

export function ProjectPickup({ className = "", open = false }: { className?: string; open?: boolean }) {
  const [projects, setProjectRepos] = useState([] as Project[]);

  useEffect(() => {
    getProjects().then((res: Project[]) => {
      setProjectRepos(res);
    });
  }, []);

  return (
    <section className={cn(className)}>
      <h2 className="text-xl font-bold mb-6">🚀 注目のプロジェクト</h2>
      {projects.length === 0 && <Loading className="w-full mt-10" />}
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => {
          if (
            !project ||
            [project.title, project.description, project.githubUrl, project.progress, project.updated].some((v) => v === "")
          ) {
            return null;
          }
          return (
            <Card key={index} className="justify-between gap-3 rounded-2xl shadow hover:shadow-md transition">
              <CardContent className="pt-4 space-y-4">
                <div className="flex gap-2 items-center">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                </div>

                <p className="text-sm text-muted-foreground">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                  <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">
                    {project.progress}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">最終更新: {project.updated}</p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="" variant="link">
                    <FontAwesomeIcon icon={iconMap["faGithub"]} />
                    GitHubで見る →
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {open && (
        <div className="text-right mt-4 me-3">
          <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:underline">
            すべてのプロジェクトを見る ＞
          </Link>
        </div>
      )}
    </section>
  );
}

export function ProjectIdea({ className = "" }: { className?: string }) {
  return (
    <section className={cn(className, "py-10")}>
      <h2 className="text-xl font-bold mb-2">💡 アイデアを投稿しませんか？</h2>
      <p className="text-muted-foreground mb-4 text-base">
        「こんなツールがあったら便利」 「こういう機能が欲しい」など，あなたのアイデアを教えてください．
        気軽な投稿が，次のプロジェクトの種になるかもしれません．
      </p>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        アイデアを投稿する
      </a>
    </section>
  );
}

export function IssuePickup({ className = "", issues = [] }: { className?: string; issues?: Issue[] }) {
  return (
    <section className={cn(className, "py-10")}>
      <h2 className="text-2xl font-bold mb-4">🐛 Picked Issues</h2>
      <ul className="space-y-3">
        {issues.length === 0 && <Loading className="w-full mt-10" />}
        {issues &&
          issues.map((issue) => {
            return (
              <li key={issue.url} className="text-sm">
                <a href={issue.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {issue.title}
                </a>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                  {issue.labels.map((label) => (
                    <span key={label} className="bg-gray-100 px-2 py-0.5 rounded">
                      {label}
                    </span>
                  ))}
                  <span>更新日: {issue.updated}</span>
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
}

const experiments = [
  "CanvasにPNG画像+メタ情報を合成して再表示（.deg形式）",
  "ブラウザ上でOAuth2のローカルテスト→ESP32連携",
  "Vercel Functionsを使ったスプレッドシートAPI Proxy化",
];

export function Labs({ className = "" }: { className?: string }) {
  return (
    <section className={cn(className, "py-10")}>
      <h2 className="text-xl font-bold mb-4">🧪 開発ラボ - 技術検証ログ</h2>
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
    <section className={cn(className, "py-10")}>
      <h2 className="text-xl font-bold mb-2">🤝 貢献してみませんか？</h2>
      <p className="text-muted-foreground text-base mb-4">
        気になるプロジェクトがあれば，ぜひIssueのコメントやPRで参加してみてください． コードだけでなく，アイデアやレビューも大歓迎です！
      </p>
      <a
        href="https://github.com/yhotta240"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
      >
        GitHubでプロジェクトを見る
      </a>
    </section>
  );
}

export function ProjectRepos({ className, title, repos, limit = 5 }: { className?: string; title?: string; repos?: any; limit?: number }) {
  if (repos.length === 0) {
    return <Loading className="mt-10" />;
  }

  return (
    <div className={cn(className, "space-y-3")}>
      <h1 className="font-bold text-xl mb-3">{title || "Githubリポジトリ一覧"}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {repos.length > 0 &&
          repos.map((repo: any, index: number) => {
            if (index < limit) {
              return <ProjectCard repo={repo} key={index} />;
            }
          })}
      </div>
    </div>
  );
}

function ProjectCard({ className = "", repo }: { className?: string; repo: any }) {
  return (
    <div className={cn(className, "")}>
      <Card className="h-full gap-3 rounded-2xl shadow hover:shadow-md transition">
        <CardContent className="grid grid-cols-3  pt-4 pe-0 ps-2">
          <div className="col-span-2 space-y-3">
            <div className="flex gap-2 items-center">
              <h3 className="text-xl font-semibold">{repo.full_name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{repo.description}</p>
            <div className="flex flex-wrap gap-2">
              {repo.topics.map((tag: string, index: number) => {
                if (index > 2) return null;
                return (
                  <Badge key={tag} variant="outline" className="rounded-full">
                    {tag}
                  </Badge>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">最終更新: {repo.updated_at}</p>
          </div>
          <OpenGraphEmbed repo_name={repo.full_name} className="ps-0 pe-2" />
        </CardContent>
        <CardFooter className="flex justify-center sm:justify-end">
          <Link href={repo.html_url} className=" p-0 text-sm" target="_blank" rel="noopener noreferrer">
            <Button className="cursor-pointer " variant="link">
              <FontAwesomeIcon className="p-0" icon={iconMap["faGithub"]} />
              GitHubで見る →
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
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
