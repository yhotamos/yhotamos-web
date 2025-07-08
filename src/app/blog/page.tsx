// "use server";

import { Theme } from "@/components/layout/theme";

export default async function Home() {
  const theme = await Theme();

  return <main className="h-screen"></main>;
}
