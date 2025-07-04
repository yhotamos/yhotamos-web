"use server";

import { cookies } from "next/headers";

export async function Theme() {
  const cookieStore = await cookies();
  const getTheme: string = cookieStore.get("theme")?.value || "light";
  return getTheme;
}

export async function useSetTheme(data: string) {
  const cookieStore = await cookies()
  cookieStore.set('theme', data)
}