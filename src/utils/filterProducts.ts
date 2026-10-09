import type { Product } from "@/types/product";

export type ProductFilter = {
  filter?: string;
  sort?: string;
  limit?: number;
};

export function filterProducts({ items, categories = [], filter, sort, limit }: ProductFilter & { items?: Product[]; categories?: string[] }) {
  let filtered = [...(items ?? [])];
  // カテゴリ処理
  if (categories.length > 0) {
    filtered = filtered.filter((item) => categories.includes(item.category) || item.tags?.some((tag: string) => categories.includes(tag.trim())));
  }

  // 検索処理
  if (filter) {
    filtered = filtered.filter((item) => item.category.includes(filter));
  }

  // ソート処理
  // 人気順
  if (sort === "users-desc" || sort === "sort-popular") {
    filtered = filtered.sort((a, b) => {
      const aUsers = a.users || 0;
      const bUsers = b.users || 0;
      return bUsers - aUsers;
    });
  }
  // 新着順
  if (sort === "sort-new") {
    filtered = filtered.sort((a, b) => {
      const aDate = new Date(a.created_at).getTime() || 0;
      const bDate = new Date(b.created_at).getTime() || 0;
      return bDate - aDate;
    });
  }
  // 更新順
  if (sort === "sort-update") {
    filtered = filtered.sort((a, b) => {
      const aDate = new Date(a.updated_at).getTime() || 0;
      const bDate = new Date(b.updated_at).getTime() || 0;
      return bDate - aDate;
    });
  }

  if (typeof limit === "number") {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}
