export type Blog = {
  id: string;
  title: string
  slug: string
  thumbnail: string
  description: string
  date: string
  updateDate: string
  type: string
  version: string
  category: string
  tags: string[]
  dirName?: string
  excerpt?: string
  users?: number
  views?: number
  likes?: number
}

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

export type Changelog = {
  slug: string;
  date: string;
  title: string;
  version: string | null;
  tags: string[];
  content: string;
};

export type BlogBodyData = { data: Blog; content: string };
