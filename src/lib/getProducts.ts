import { getChromeWebStoreItems } from "@/lib/googleSheets";
import { Product } from "@/components/types/product";

export const getProductCategoriesByItems = async (items: Product[], setItem: string) => {
  const tags: string[] = items.map((item: Product) => item.tags).flat().map((t) => t.trim());

  // 同じカテゴリが複数ある場合は、1つだけ残す
  const uniqueTag = Array.from(new Set([setItem?.trim(), ...tags].filter(Boolean)));

  return uniqueTag;
};

export const getProductCategories = async () => {
  const items = await getChromeWebStoreItems();
  return getProductCategoriesByItems(items, items[0]?.category);
};

export const getProductBySlug = async (slug: string) => {
  const items = await getChromeWebStoreItems();
  const item = items.find((item: Product) => item.repo_name === slug);
  return item;
};
