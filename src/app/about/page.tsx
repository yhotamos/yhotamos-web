import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import Image from "next/image";
import { SnsLinks } from "@/components/layout/snsLinks";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "About", href: "/about" },
];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - About",
};

export default function Blog() {
  return (
    <main className="max-w-7xl mx-auto p-5 flex flex-col gap-20">
      <Breadcrumbs paths={pathnames} />
      <div className="text-center font-bold text-3xl">About</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-0">
        {/* ブランド */}
        <div className="flex flex-col gap-5 items-center justify-center">
          <Image
            className="rounded-4xl border-2 border-violet-600"
            src="/imgs/icon.jpg"
            alt="icon"
            width={200}
            height={200}
            title="ブランドロゴ"
          />
          <div>
            <span className="font-bold text-2xl after:content-['_-_']">
              ブランド
            </span>
            <span className="font-bold text-2xl">YHOTAMOS</span>
            {/* <span className="font-bold text-xl">(ヨタモス)</span> */}
          </div>
          <div className="flex flex-col max-w-lg gap-3 mx-auto">
            <div>
              自作のツールや拡張機能，ブログなどを公開しています．気に入っていただけたら，応援やシェアも大歓迎です．
            </div>
            <div>
              誰かの作業がちょっと楽になるようなものを目指して開発しています．
            </div>
          </div>
        </div>
        {/* 著者 */}
        <div className="flex flex-col gap-5 justify-between items-center">
          <Image
            className="rounded-full"
            src="/imgs/admin_icon.png"
            alt="icon"
            width={200}
            height={200}
            title="admin icon"
          />
          <div className="font-bold text-2xl">著者 - yhotta240</div>
          <div>
            駆け出しエンジニア．最近はChrome拡張機能開発にハマってます．
            <br />
            Web以外にも，センサーやマイコンなどの制御系にも興味があります．
          </div>
        </div>
      </div>
      <SnsLinks className="flex justify-center gap-10 " />
    </main>
  );
}
