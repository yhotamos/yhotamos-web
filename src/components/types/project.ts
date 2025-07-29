export type Project = {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  progress: "構想中" | "開発中" | "試作中" | "完了" | "中断" | "リリース" | "未着手";
  updated: string;
};

export type Issue = {
  title: string;
  url: string;
  labels: string[];
  updated: string;
};