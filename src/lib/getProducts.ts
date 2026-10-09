import { getProductItems } from "@/lib/googleSheets";
import { Product } from "@/types/product";

export const getProductCategoriesByItems = async (items: Product[], setItem: string) => {
  const categories: string[] = items.map((item: Product) => item.category).filter(Boolean).map((c) => c.trim());
  const tags: string[] = items.map((item: Product) => item.tags).flat().map((t) => t.trim());
  const uniqueCategories = Array.from(new Set([setItem?.trim(), ...categories, ...tags].filter(Boolean)));
  return uniqueCategories;
};

export const getProductCategories = async () => {
  const items = await getProductItems();
  return getProductCategoriesByItems(items, items[0]?.category);
};

export const getProductBySlug = async (slug: string) => {
  const items = await getProductItems();
  const item = items.find((item: Product) => item.repo_name === slug);
  return item;
};
