// "use client";

import Image from "next/image";
// import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Theme } from "../components/Theme";
import TopArrowIcon from "../components/TopArrowIcon";
import Cards from "./cards";
import Breadcrumbs from "../components/Breadcrumbs";

export default async function Products() {
  const theme = await Theme();
  const urls: string[] = ["products"];
  // const [filter, setFilter] = useState("");

  return (
    <div className="grid grid-rows-[20px_1fr] items-center justify-items-center min-h-screen max-w-5xl mx-auto p-8 pb-20 gap-14 font-(family-name:--font-geist-sans)">
      <Header initialTheme={theme} />
      <main className="h-screen w-full">
        <Breadcrumbs urls={urls} />
        <Cards />
      </main>
      <TopArrowIcon />
      <Footer />
    </div>
  );
}
