"use server";

import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types";

type SortType = "created" | "updated" | "pushed" | "full_name";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function getRepos(sort?: SortType, limit?: number) {

  const params = {
    sort,
    per_page: limit,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  const [userRes, orgRes] = await Promise.all([
    octokit.request("GET /users/{username}/repos", {
      username: "yhotta240",
      ...params,
    }),
    octokit.request("GET /orgs/{org}/repos", {
      org: "yhotamos",
      ...params,
    }),
  ]);

  return [...userRes.data, ...orgRes.data];
};

export const getIssues = async ( repo: components["schemas"]["repository"], limit?: number) => {

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