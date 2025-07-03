// "use server";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Theme } from "../components/Theme";
import TopArrowIcon from "../components/TopArrowIcon";

export default async function Home() {
  const theme = await Theme();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen max-w-5xl mx-auto p-8 pb-20 gap-16 font-(family-name:--font-geist-sans)">
      <Header initialTheme={theme} />
      <main className="h-screen"></main>
      <TopArrowIcon />
      <Footer />
    </div>
  );
}
