// "use server";

import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Theme } from "./components/Theme";
import TopArrowIcon from "./components/TopArrowIcon";
import Breadcrumbs from "./components/Breadcrumbs";

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
