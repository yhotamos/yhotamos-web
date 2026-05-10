import { Product } from "@/components/types/product";
import { Blog } from "@/components/types/blog";

export type Filter = {
  filter?: string;
  sort?: SortType;
  order?: "asc" | "desc";
  limit?: number;
};

export type SortType = "" | "sort-popular" | "sort-new" | "sort-update" | "blog-popular" | "blog-new" | "blog-update" | "blog-views" | "blog-likes";

export function filterItems({ items, tags = [], filter, sort, order = "desc", limit }: { items: Product[] & Blog[]; tags?: string[] } & Filter) {
  let filtered = [...items];

  if (tags.length > 0) {
    filtered = filtered.filter((item) => tags.includes(item.category) || item.tags?.some((tag: string) => tags.includes(tag.trim())));
  }

  if (filter) {
    filtered = filtered.filter((item) => item.category.includes(filter));
  }

  // desc = 大きい順（デフォルト）、asc = 小さい順
  const dir = order === "asc" ? -1 : 1;

  if (sort === "blog-popular") {
    filtered = filtered.sort((a, b) => dir * ((b.users || 0) - (a.users || 0)));
  }

  if (sort === "blog-new") {
    filtered = filtered.sort((a, b) => dir * ((new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0)));
  }

  if (sort === "blog-update") {
    filtered = filtered.sort((a, b) => dir * ((new Date(b.updateDate).getTime() || 0) - (new Date(a.updateDate).getTime() || 0)));
  }

  if (sort === "blog-views") {
    filtered = filtered.sort((a, b) => dir * ((Number((b as any).views) || 0) - (Number((a as any).views) || 0)));
  }

  if (sort === "blog-likes") {
    filtered = filtered.sort((a, b) => dir * ((Number((b as any).likes) || 0) - (Number((a as any).likes) || 0)));
  }

  if (typeof limit === "number") {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}
