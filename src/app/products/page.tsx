import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { ProductPage } from "@/components/layout/product";
import { getChromeWebStoreItems } from "@/lib/googleSheets";
import { getDevProductCategories, getUserProductCategories } from "@/lib/getProducts";
import { Product } from "@/components/types/product";

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Products", href: "/products" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - My Products",
};

export const revalidate = 60;

export default async function Products() {
  const items: Product[] = await getChromeWebStoreItems();
  const userCategories = await getUserProductCategories();
  const devCategories = await getDevProductCategories();

  return (
    <main className="max-w-7xl mx-auto p-5 min-h-screen">
      <Breadcrumbs paths={pathnames} />
      <ProductPage items={items} userCategories={userCategories} devCategories={devCategories} />
    </main>
  );
}
