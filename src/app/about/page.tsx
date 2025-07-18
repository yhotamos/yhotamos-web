import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import Image from "next/image";
import { SnsLinks } from "@/components/layout/snsLinks";
import Link from "next/link";

const pathnames: BreadcrumbsProps["paths"] = [{ name: "About", href: "/about" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - About",
};

export default function About() {
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
            <span className="font-bold text-2xl after:content-['_-_']">ブランド</span>
            <span className="font-bold text-2xl">YHOTAMOS</span>
          </div>
          <div className="flex flex-col max-w-lg gap-3 mx-auto">
            <div>自作ツールや拡張機能，技術ブログをまとめた個人開発サイトです．Next.js 15 と Tailwind CSS v4 で構築しています．</div>
            <div>気に入っていただけたら，応援やシェアも大歓迎です．</div>
          </div>
        </div>
        {/* 著者 */}
        <div className="flex flex-col gap-5 justify-between items-center">
          <Image className="rounded-full" src="/imgs/admin_icon.png" alt="icon" width={200} height={200} title="admin icon" />
          <div className="font-bold text-2xl">著者 - yhotta240</div>
          <div>
            駆け出しエンジニア． 最近はChrome拡張機能開発にハマってます．
            <br />
            誰かの作業がちょっと楽になるようなものを目指して開発しています．
          </div>
        </div>
      </div>
      <SnsLinks className="flex justify-center gap-8" />
      <div className="flex flex-col items-center gap-5">
        <Link href="/about/terms" className="flex justify-center ">
          <button className="btn btn-primary cursor-pointer">利用規約</button>
        </Link>
        <Link href="/about/privacy" className="flex justify-center">
          <button className="btn btn-primary cursor-pointer">プライバシーポリシー</button>
        </Link>
      </div>
    </main>
  );
}
