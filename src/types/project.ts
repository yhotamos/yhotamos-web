export type RepositorySort = "created" | "updated" | "pushed" | "full_name";

export type RepositoryActivity = {
  title: string;
  url: string;
  labels: string[];
  updated: string;
};

export type Issue = RepositoryActivity;
export type PullRequest = RepositoryActivity;

export type FeaturedRepository = {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  html_url: string;
  description: string | null;
  topics?: string[];
  updated_at?: string | null;
};

export type Repository = FeaturedRepository & {
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
};
