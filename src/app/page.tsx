// "use server";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Theme } from "@/components/layout/theme";
import TopArrowIcon from "@/components/layout/topArrowIcon";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import Release from "@/components/layout/release";
import { Grip } from "@/components/layout/productItems";
import { getChromeWebStoreItems } from "@/api"

export default async function Home() {
  const theme = await Theme();
  const urls: string[] = [];
  const items = await getChromeWebStoreItems();

  return (
    <div className="grid grid-rows-[20px_1fr] items-center justify-items-center min-h-screen max-w-5xl mx-auto p-8 pb-20 gap-14 font-(family-name:--font-geist-sans)">
      <Header initialTheme={theme} />
      <main className=" w-full grid gap-8">
        <Breadcrumbs urls={urls} />
        <Release title="New Release" />
        <hr className=" border-gray-200 dark:border-gray-700" />
        <Grip items={items} title="Extensions" sort={"users-desc"} limit={3} />
      </main>
      <TopArrowIcon />
      <Footer />
    </div>
  );
}
