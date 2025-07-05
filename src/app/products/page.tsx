import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Theme } from "@/components/layout/theme";
import TopArrowIcon from "@/components/layout/topArrowIcon";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import Cards from "@/components/layout/cards";
import { getChromeWebStoreItems } from "@/api";

export const metadata: Metadata = {
  title: "Products",
  description: "YHOTAMOS - My Products",
};

export default async function Products() {
  const theme = await Theme();
  const urls: string[] = ["products"];
  const items = await getChromeWebStoreItems();

  return (
    <div className="grid grid-rows-[20px_1fr] items-center justify-items-center min-h-screen max-w-5xl mx-auto p-8 pb-20 gap-14 font-(family-name:--font-geist-sans)">
      <Header initialTheme={theme} />
      <main className="h-full w-full">
        <Breadcrumbs urls={urls} />
        <Cards items={items} />
      </main>
      <TopArrowIcon />
      <Footer />
    </div>
  );
}
