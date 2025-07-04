// "use server";

import Image from "next/image";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import { Theme } from "../../components/layout/theme";
import TopArrowIcon from "../../components/layout/topArrowIcon";

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
