// "use server";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Theme } from "@/components/layout/theme";
import TopArrowIcon from "@/components/layout/topArrowIcon";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import Release from "@/components/layout/release";
import { ProductGrid } from "@/components/layout/productItems";
import { getChromeWebStoreItems, getRepos } from "@/api";
import { Project } from "@/components/layout/project";
import { TwitterEmbed } from "@/components/layout/embed";
import { Hr } from "@/components/layout/hr";

export default async function Home() {
  const theme = await Theme();
  const urls: string[] = [];
  const items = await getChromeWebStoreItems();
  const repos = await getRepos("updated", 3);

  return (
    <main className=" w-full grid gap-8">
      <Breadcrumbs urls={urls} />
      <Release title="最新リリース" />
      <Hr />
      <ProductGrid
        items={items}
        title="Chrome 拡張機能"
        sort={"users-desc"}
        limit={3}
        isOpen={true}
      />
      <Hr />
      <Project title="プロジェクト" repos={repos} limit={2} />
      <Hr />
      <TwitterEmbed username="yhotta240" theme={theme} height={600} />
    </main>
  );
}
