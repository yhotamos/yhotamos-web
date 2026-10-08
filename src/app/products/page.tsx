import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { ProductPage } from "@/components/layout/product";
import { getProductItems } from "@/lib/googleSheets";
import { getProductCategories } from "@/lib/getProducts";
import { Product } from "@/components/types/product";

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Products", href: "/products" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - My Products",
};

export const revalidate = 60;

export default async function Products() {
  const items: Product[] = await getProductItems();
  const categories = await getProductCategories();
  const categoryCounts: Record<string, number> = {};
  for (const category of categories) {
    categoryCounts[category] = items.filter((item) => item.category === category || item.tags?.some((tag) => tag.trim() === category)).length;
  }

  return (
    <main className="max-w-7xl mx-auto p-5 min-h-screen">
      <Breadcrumbs paths={pathnames} />
      <ProductPage items={items} categories={categories} categoryCounts={categoryCounts} />
    </main>
  );
}
