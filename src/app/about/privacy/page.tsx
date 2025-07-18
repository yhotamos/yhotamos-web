import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";

const pathnames: BreadcrumbsProps["paths"] = [
  { name: "About", href: "/about" },
  { name: "Privacy", href: "/about/privacy" },
];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - Privacy Policy",
};

export default function Privacy() {
  return (
    <main className="max-w-7xl mx-auto p-5 flex flex-col gap-5">
      <Breadcrumbs paths={pathnames} />
      <div className="text-center font-bold text-2xl">プライバシーポリシー</div>
      <div className="border-1 bg-secondary p-5">
        <p className="mb-4 text-base">
          YHOTAMOS（以下，「当サイト」といいます。）は，ユーザーの個人情報の重要性を認識し，以下の方針に基づき適切に取り扱います．
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">1. 収集する情報について</h2>
        <p className="mb-4 text-base">
          当サイトでは，アクセスログやクッキー等を利用して，ユーザーのアクセス状況を分析する場合があります．ただし，個人を特定できる情報は収集しません．
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">2. 個人情報の利用目的</h2>
        <p className="mb-4 text-base">収集した情報は，サービス向上のための分析や，必要に応じたお問い合わせ対応にのみ利用します．</p>

        <h2 className="text-lg font-semibold mt-6 mb-2">3. 第三者提供について</h2>
        <p className="mb-4 text-base">法令に基づく場合を除き，ユーザーの個人情報を第三者に提供することはありません．</p>

        <h2 className="text-lg font-semibold mt-6 mb-2">4. クッキー（Cookie）について</h2>
        <p className="mb-4 text-base">
          当サイトでは，ユーザーの利便性向上のためにクッキーを利用しています．クッキーの設定はブラウザ側で変更可能です．
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">5. プライバシーポリシーの変更</h2>
        <p className="mb-4 text-base">
          本ポリシーは，必要に応じて変更されることがあります．変更後の内容は当サイトに掲載した時点で効力を生じます．
        </p>

        <p className="text-sm text-gray-500 mt-8">最終更新日：2025年7月18日</p>
      </div>
    </main>
  );
}
