import { Product } from "@/components/types/product";
import { Blog } from "@/components/types/blog";

export type Filter = {
  filter?: string;
  sort?: SortType;
  limit?: number;
};

export type SortType = "" | "sort-popular" | "sort-new" | "sort-update" | "blog-popular" | "blog-new" | "blog-update";

export function filterItems({ items, tags = [], filter, sort, limit }: { items: Product[] & Blog[]; tags?: string[] } & Filter) {
  let filtered = [...items];
  // カテゴリ処理
  if (tags.length > 0) {
    filtered = filtered.filter((item) => tags.includes(item.category) || item.tags?.some((tag: string) => tags.includes(tag.trim())));
  }

  // 検索処理
  if (filter) {
    filtered = filtered.filter((item) => item.category.includes(filter));
  }

  // ソート処理
  // 人気順
  if (sort === "blog-popular") {
    filtered = filtered.sort((a, b) => {
      const aUsers = a.users || 0;
      const bUsers = b.users || 0;
      return bUsers - aUsers;
    });
  }

  if (sort === "blog-new") {
    filtered = filtered.sort((a, b) => {
      const aDate = new Date(a.date).getTime() || 0;
      const bDate = new Date(b.date).getTime() || 0;
      return bDate - aDate;
    });
  }

  // 更新順
  if (sort === "blog-update") {
    filtered = filtered.sort((a, b) => {
      const aDate = new Date(a.updateDate).getTime() || 0;
      const bDate = new Date(b.updateDate).getTime() || 0;
      return bDate - aDate;
    });
  }

  if (typeof limit === "number") {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}