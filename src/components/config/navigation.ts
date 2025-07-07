import { NavigationItem } from "../types/navigationItem";

export const navigationItems: NavigationItem[] = [
  {
    name: "Home",
    ja: "ホーム",
    href: "/",
    icon: "faHouse",
    description: "トップページ",
  },
  {
    name: "Products",
    ja: "プロダクト",
    href: "/products",
    icon: "faBox",
    description: "開発した拡張機能・Webアプリ一覧",
  },
  {
    name: "Projects",
    ja: "プロジェクト",
    href: "/projects",
    icon: "faDiagramProject",
    description: "GitHubを中心とした開発プロジェクト",
  },
  {
    name: "Blog",
    ja: "ブログ",
    href: "/blog",
    icon: "faBlog",
    description: "技術記事（Qiita・noteなど）",
  },
  {
    name: "Support",
    ja: "サポート",
    href: "/support",
    icon: "faCircleQuestion",
    description: "お問い合わせ・寄付・FAQ",
  },
  {
    name: "About",
    ja: "このサイトについて",
    href: "/about",
    icon: "faCircleInfo",
    description: "プロフィール・開発目的など",
  },
];
