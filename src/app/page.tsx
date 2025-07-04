// "use server";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Theme } from "@/components/layout/theme";
import TopArrowIcon from "@/components/layout/topArrowIcon";
import Breadcrumbs from "@/components/layout/breadcrumbs";

export default async function Home() {
  const theme = await Theme();
  const urls: string[] = [];

  return (
    <div className="grid grid-rows-[20px_1fr] items-center justify-items-center min-h-screen max-w-5xl mx-auto p-8 pb-20 gap-14 font-(family-name:--font-geist-sans)">
      <Header initialTheme={theme} />
      <main className="h-screen w-full">
        <Breadcrumbs urls={urls} />
        メインコンテンツ
      </main>
      <TopArrowIcon />
      <Footer />
    </div>
  );
}
