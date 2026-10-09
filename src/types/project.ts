export type Issue = {
  title: string;
  url: string;
  labels: string[];
  updated: string;
};

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
