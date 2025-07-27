export type Project = {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  progress: "構想中" | "開発中" | "試作中" | "完成" | "中断" | "リリース済み";
  updated: string;
};

export type Issue = {
  title: string;
  url: string;
  labels: string[];
  updated: string;
};