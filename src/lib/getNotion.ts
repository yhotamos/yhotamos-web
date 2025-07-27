"use server"

import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_API_KEY! });

export async function getNotion() {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  return response.results;
}