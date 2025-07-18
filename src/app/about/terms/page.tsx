import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "About", href: "/about" },
  { name: "Terms", href: "/about/terms" },
];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - Terms of Service",
};

export default function Terms() {
  return (
    <main className="max-w-7xl mx-auto p-5 flex flex-col gap-5">
      <Breadcrumbs paths={pathnames} />
      <div className="text-center font-bold text-2xl">サイトの利用規約</div>
      <div className="border-1 bg-secondary p-5">
        <p className="mb-4 text-base">
          本利用規約（以下，「本規約」といいます．）は，YHOTAMOS（以下，「当サイト」といいます．）が本サイト上で提供するサービス（以下，「本サービス」といいます．）の利用条件を定めるものです．
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">第1条（適用）</h2>
        <p className="mb-4 text-base">本規約は，ユーザーと当サイトとの間の本サービスの利用に関わる一切の関係に適用されます．</p>

        <h2 className="text-lg font-semibold mt-6 mb-2">第2条（禁止事項）</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>法令または公序良俗に違反する行為</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>当サイトまたは第三者の権利を侵害する行為</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-2">第3条（免責事項）</h2>
        <p className="mb-4 text-base">
          当サイトは，可能な限り正確な情報を掲載するよう努めますが，その正確性・完全性を保証するものではありません．本サービスの利用によって生じた損害について，当サイトは一切の責任を負いません．
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">第4条（規約の変更）</h2>
        <p className="mb-4 text-base">当サイトは，必要と判断した場合には，ユーザーに通知することなく本規約を変更できるものとします．</p>

        <p className="text-sm text-gray-500 mt-8">最終更新日：2025年7月18日</p>
      </div>
    </main>
  );
}
