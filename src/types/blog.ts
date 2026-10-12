export type Blog = {
  title: string
  slug: string
  thumbnail: string
  description: string
  publishedAt: string
  updatedAt?: string
  type: string
  version: string
  category: string
  tags: string[]
  excerpt?: string
  users?: number
  views?: number
  likes?: number
}

export type BlogIndexEntry = { meta: Blog; path: string };

export type QiitaBlog = {
  id: string;
  title: string;
  url: string;
  views: string;
  likes: string;
  bookmarks: string;
  updateDate: string;
  publishDate: string;
  tags: string[];
};

export type BlogBodyData = { data: Blog; content: string };
