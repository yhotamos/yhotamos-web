"use server";

import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types";
import { Issue } from "@/components/types/project";

export type Repository = Awaited<ReturnType<typeof getRepos>>[number];

type SortType = "created" | "updated" | "pushed" | "full_name";

const repositorySources: { login: string; type: "user" | "org" }[] = [
  { login: "yhotta240", type: "user" },
  { login: "yhotamos", type: "org" },
];

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

function isPublicRepository(repo: { private: boolean; visibility?: string }) {
  return repo.private === false && (repo.visibility === undefined || repo.visibility === "public");
}

export async function getRepos(sort?: SortType, limit?: number) {

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

export const getIssues = async ( repo: components["schemas"]["repository"], limit?: number) => {
  if (!isPublicRepository(repo)) return [];

  const issuesRes = await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: repo.owner.login,
    repo: repo.name,
    state: "all",
    per_page: limit,
    sort: "updated",
    direction: "desc",
  });

  return issuesRes.data!;
};

/**
 * GitHub Search API で yhotta240 / yhotamos の最新issue を取得する。
 * user: と org: は AND になってしまうため、別クエリで並列取得してマージする。
 */
export async function getRecentIssues(limit = 10): Promise<Issue[]> {
  const searchOpts = {
    sort: "updated" as const,
    order: "desc" as const,
    per_page: limit,
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  };

  const [userRes, orgRes] = await Promise.allSettled([
    octokit.request("GET /search/issues", { q: "is:issue is:public user:yhotta240", ...searchOpts }),
    octokit.request("GET /search/issues", { q: "is:issue is:public org:yhotamos", ...searchOpts }),
  ]);

  const toIssue = (item: components["schemas"]["issue-search-result-item"]): Issue => ({
    title: item.title,
    url: item.html_url,
    labels: item.labels.map((label) => label.name ?? ""),
    updated: item.updated_at ?? "",
  });

  const userIssues = userRes.status === "fulfilled" ? userRes.value.data.items.map(toIssue) : [];
  const orgIssues  = orgRes.status  === "fulfilled" ? orgRes.value.data.items.map(toIssue)  : [];

  // 重複排除してupdated順に並べ直す
  const seen = new Set<string>();
  return [...userIssues, ...orgIssues]
    .filter((i) => { if (seen.has(i.url)) return false; seen.add(i.url); return true; })
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, limit);
}

export async function getReposWithIssues(sort?: SortType, limit?: number): Promise<{ repos: Repository[]; issues: Issue[] }> {
  const [repos, issues] = await Promise.all([
    getRepos(sort, limit),
    getRecentIssues(10).catch(() => [] as Issue[]),  // issues失敗でもreposは表示する
  ]);

  return { repos, issues };
}
