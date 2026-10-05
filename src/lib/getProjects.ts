"use server";

import { Project } from "@/components/types/project";
import { getNotion } from "./getNotion";

export default async function getProjects(): Promise<Project[]> {
  const results = await getNotion();

  const projects = results.map((result) => {
    if (result.object === "page" && "properties" in result) {
      const properties = result.properties;
      const title = properties["プロジェクト名"];
      const description = properties["概要"];
      const tags = properties["タグ"];
      const url = properties["URL"];
      const status = properties["ステータス"];
      const date = properties["開始日"];

      return {
        title: title?.type === "title" ? title.title[0]?.plain_text ?? "" : "",
        description: description?.type === "rich_text" ? description.rich_text[0]?.plain_text ?? "" : "",
        tags: tags?.type === "multi_select" ? tags.multi_select.map((tag) => tag.name) : [],
        githubUrl: url?.type === "url" ? url.url ?? "" : "",
        progress: (status?.type === "status" ? status.status?.name ?? "構想中" : "構想中") as Project["progress"],
        updated: date?.type === "date" ? date.date?.start ?? "" : "",
      }
    }
  });

  return projects.filter(Boolean) as Project[];
}
