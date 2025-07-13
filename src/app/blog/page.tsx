// "use server";
import { Blogs } from "@/components/layout/blogs";

export default async function Home() {
  return (
    <main className="max-w-7xl mx-auto p-5">
      <Blogs />
    </main>
  );
}
