"use server";

import { Octokit } from "@octokit/core";
import type { components } from "@octokit/openapi-types";
import { repositorySources } from "@/config/github";
import type { FeaturedRepository, Issue, Repository, RepositorySort } from "@/types/project";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

function isPublicRepository(repo: { private: boolean; visibility?: string }) {
  return repo.private === false && (repo.visibility === undefined || repo.visibility === "public");
}

export async function getRepos(sort?: RepositorySort, limit?: number): Promise<Repository[]> {

  const params = {
    sort,
    per_page: limit,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  const results = await Promise.allSettled(repositorySources.map(async (source) => {
    if (source.type === "org") {
      const response = await octokit.request("GET /orgs/{org}/repos", { org: source.login, type: "public", ...params });
      return response.data;
    }
    const response = await octokit.request("GET /users/{username}/repos", { username: source.login, ...params });
    return response.data;
  }));

  return results.flatMap((result, index) => {
    if (result.status === "fulfilled") return result.value;
    console.error(`[getRepos] ${repositorySources[index].login}: リポジトリの取得に失敗しました`);
    return [];
  }).filter(isPublicRepository);
};

export async function getFeaturedRepos(): Promise<FeaturedRepository[]> {
  const results = await Promise.allSettled(repositorySources.map(async (source) => {
    const response = await octokit.request("GET /search/repositories", {
      q: `${source.type}:${source.login} topic:featured is:public`,
      sort: "updated",
      order: "desc",
      per_page: 4,
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    });
    return response.data.items.flatMap((repo) => {
      if (!repo.owner) return [];
      return [{ ...repo, owner: repo.owner }];
    });
  }));

  return results.flatMap((result, index) => {
    if (result.status === "fulfilled") return result.value;
    console.error(`[getFeaturedRepos] ${repositorySources[index].login}: 注目のプロジェクトの取得に失敗しました`);
    return [];
  })
    .filter(isPublicRepository)
    .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""))
    .slice(0, 4);
}

export const getIssues = async (repo: components["schemas"]["repository"], limit?: number) => {
  if (!isPublicRepository(repo)) return [];

  const issuesRes = await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: repo.owner.login,
    repo: repo.name,
    state: "all",
    per_page: limit,
    sort: "updated",
    direction: "desc",
  });

  return issuesRes.data;
};

/**
 * 設定したアカウントごとに最新issueを並列取得し、更新順で統合する。
 */
export async function getRecentIssues(limit = 10): Promise<Issue[]> {
  const searchOpts = {
    sort: "updated" as const,
    order: "desc" as const,
    per_page: limit,
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  };

  const results = await Promise.allSettled(repositorySources.map((source) =>
    octokit.request("GET /search/issues", {
      q: `is:issue is:public ${source.type}:${source.login}`,
      ...searchOpts,
    })
  ));

  const toIssue = (item: components["schemas"]["issue-search-result-item"]): Issue => ({
    title: item.title,
    url: item.html_url,
    labels: item.labels.map((label) => label.name ?? ""),
    updated: item.updated_at ?? "",
  });

  const issues = results.flatMap((result, index) => {
    if (result.status === "fulfilled") return result.value.data.items.map(toIssue);
    console.error(`[getRecentIssues] ${repositorySources[index].login}: issueの取得に失敗しました`);
    return [];
  });

  // 重複排除してupdated順に並べ直す
  const seen = new Set<string>();
  return issues
    .filter((issue) => {
      if (seen.has(issue.url)) return false;
      seen.add(issue.url);
      return true;
    })
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, limit);
}

export async function getReposWithIssues(sort?: RepositorySort, limit?: number): Promise<{ repos: Repository[]; issues: Issue[] }> {
  const [repos, issues] = await Promise.all([
    getRepos(sort, limit),
    getRecentIssues(10).catch(() => []),  // issues失敗でもreposは表示する
  ]);

  return { repos, issues };
}
