import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { ProductItems } from "@/components/layout/productItems";
import { getChromeWebStoreItems } from "@/api";
import { getDevProductCategories, getUserProductCategories } from "@/lib/getProducts";

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Products", href: "/products" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - My Products",
};

export default async function Products() {
  const items = await getChromeWebStoreItems();
  const userCategories = await getUserProductCategories();
  const devCategories = await getDevProductCategories();

  return (
    <main className="max-w-7xl mx-auto p-5 min-h-screen">
      <Breadcrumbs paths={pathnames} />
      <ProductItems items={items} userCategories={userCategories} devCategories={devCategories} />
    </main>
  );
}
