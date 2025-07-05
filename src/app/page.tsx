// "use server";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Theme } from "@/components/layout/theme";
import TopArrowIcon from "@/components/layout/topArrowIcon";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import Release from "@/components/layout/release";

export default async function Home() {
  const theme = await Theme();
  const urls: string[] = [];

  return (
    <div className="grid grid-rows-[20px_1fr] items-center justify-items-center min-h-screen max-w-5xl mx-auto p-8 pb-20 gap-14 font-(family-name:--font-geist-sans)">
      <Header initialTheme={theme} />
      <main className="h-screen w-full">
        <Breadcrumbs urls={urls} />
        <div className="mt-5 p-6 border-y border-gray-200 dark:border-gray-700">
          <Release title="Release"/>
        </div>
      </main>
      <TopArrowIcon />
      <Footer />
    </div>
  );
}
