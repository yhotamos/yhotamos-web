"use server";

import { Project } from "@/components/types/project";
import { getNotion } from "./getNotion";

export default async function getProjects(): Promise<Project[]> {
  const results = await getNotion();
  
  const projects = results.map((result) => {
    if ('properties' in result) {
      const properties: any = result.properties;
      console.log(properties);

      return {
        title: properties["プロジェクト名"].title[0].plain_text,
        description: properties["概要"].rich_text[0].plain_text,
        tags: properties["タグ"].multi_select.map((tag: any) => tag.name),
        githubUrl: properties["URL"].url,
        progress: properties["ステータス"].status.name,
        updated: properties["開始日"].date.start,
      }
    }
  });

  return projects.filter(Boolean) as Project[];
}
