import { getChromeWebStoreItems } from "@/lib/googleSheets";
import { Product } from "@/components/types/product";

export const getProductCategoriesByItems = async (items: Product[], setItem: string) => {
  const tags: string[] = items.map((item: any) => item.tags).flat();

  // 冗長なタグは除く
  const tagsSet = new Set(tags);
  const tag = [setItem, ...tagsSet];

  return tag;
};

export const getUserProductCategories = async () => {
  const items = await getChromeWebStoreItems();
  const userItems: Product[] = items.filter((item: Product) => item.type === "user");

  return getProductCategoriesByItems(userItems, userItems[0]?.category);
};

export const getDevProductCategories = async () => {
  const items = await getChromeWebStoreItems();
  const devItems: Product[] = items.filter((item: Product) => item.type === "dev");

  return getProductCategoriesByItems(devItems, devItems[0]?.category);
};

export const getProductBySlug = async (slug: string) => {
  const items = await getChromeWebStoreItems();
  const item = items.find((item: Product) => item.name === slug);
  return item;
};
