import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import Image from "next/image";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "About", href: "/about" },
];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - About",
};

export default function Blog() {
  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <div className="text-center font-bold text-3xl mb-3">About</div>
      <div className="flex flex-col w-lg items-center gap-3 mx-auto">
        <div>
          自作の拡張機能やツール，その裏側をまとめたブログなどを公開しています．気に入っていただけたら，応援やシェア・寄付も大歓迎です．誰かの作業がちょっと楽になるようなものを目指して開発しています．
        </div>
        <div>
          <Image src="/imgs/icon.jpg" alt="icon" width={300} height={300} />
        </div>
        <div className="font-bold text-2xl">yhotta240</div>
        <div>駆け出しのエンジニア</div>
        <div>最近はChrome拡張機能開発にハマってます．</div>
      </div>
    </main>
  );
}
