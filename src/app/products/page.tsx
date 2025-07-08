import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import { ProductItems } from "@/components/layout/productItems";
import { getChromeWebStoreItems } from "@/api";

const pathnames: string[] = ["Products"];

export const metadata: Metadata = {
  title: pathnames[0],
  description: "YHOTAMOS - My Products",
};

export default async function Products() {
  const items = await getChromeWebStoreItems();

  return (
    <main className="w-full">
      <Breadcrumbs urls={pathnames} />
      <ProductItems items={items} />
    </main>
  );
}
