import type { Metadata } from "next";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import Link from "next/link";
import clsx from "clsx";
import { Icon } from "@radix-ui/react-select";
import { faqItems } from "@/components/config/faqItems";

const pathnames: BreadcrumbsProps["paths"] = [{ name: "Support", href: "/support" }];

export const metadata: Metadata = {
  title: pathnames[0].name,
  description: "YHOTAMOS - " + pathnames[0].name,
};

export default async function Support() {
  return (
    <main className="max-w-7xl mx-auto p-5 grid gap-3">
      <Breadcrumbs paths={pathnames} />
      <div className="space-y-12">
        <SupportHero />

        {/* 概要カード（すぐに各詳細ページへ遷移可能） */}
        <SectionGrid>
          <SupportCard title="FAQ" href="/support/faq" description="よくある質問と回答を参照できます．" icon="faq" />
          <SupportCard
            title="フィードバック"
            href="/support/feedback"
            description="改善提案や不具合報告を送信してください．"
            icon="feedback"
          />
          <SupportCard title="寄付・支援" href="/support/donate" description="開発継続を支える支援方法を案内します．" icon="donate" />
          <SupportCard title="お問い合わせ" href="/support/contact" description="個別の連絡や依頼はこちら．" icon="contact" />
        </SectionGrid>

        <div className="grid gap-10 md:grid-cols-2">
          <FAQPreview />
          <FeedbackPreview />
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <DonatePreview />
          <ContactPreview />
        </div>
      </div>
    </main>
  );
}

export const SupportHero: React.FC = () => {
  return (
    <header className="text-center space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">サポートセンター</h1>
      <p className="text-secondary-foreground/70 text-sm md:text-base">
        FAQ，フィードバック，寄付・支援，お問い合わせにアクセスできます．必要なトピックを選んでください．
      </p>
    </header>
  );
};

export const SectionGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-5 md:gap-10 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
);

interface Props {
  title: string;
  description: string;
  href: string;
  icon?: string;
  className?: string;
}
export const SupportCard: React.FC<Props> = ({ title, description, href, icon, className }) => {
  return (
    <Link
      href={href}
      className={clsx(
        className,
        "flex flex-col justify-between rounded-xl border border-secondary-foreground/30 p-5 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      )}
    >
      <div className="flex items-start gap-3">
        {icon && <Icon className="h-6 w-6 text-blue-500" />}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-secondary-foreground/70 leading-relaxed">{description}</p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">詳しく見る →</span>
    </Link>
  );
};

export const FAQPreview: React.FC = () => {
  const top = faqItems.slice(0, 3);
  return (
    <section className="rounded-xl border border-secondary-foreground/30 p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">FAQ（抜粋）</h3>
      <ul className="space-y-3">
        {top.map((item) => (
          <li key={item.id} className="text-sm">
            <Link href={`/support/faq#${item.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {item.question}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-right">
        <Link href="/support/faq" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          すべてを見る →
        </Link>
      </div>
    </section>
  );
};

export const FeedbackPreview: React.FC = () => {
  return (
    <section className="rounded-xl border border-secondary-foreground/30 p-6 shadow-sm flex flex-col">
      <h3 className="text-lg font-semibold mb-2">フィードバック</h3>
      <p className="text-sm text-secondary-foreground/70 flex-grow">
        改善案やバグ報告はフォームまたはGitHub Issueで受け付けています．再現手順と期待動作を添えてください．
      </p>
      <div className="mt-4 space-x-3">
        <Link href="/support/feedback" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          フォームを開く →
        </Link>
      </div>
    </section>
  );
};

export const DonatePreview: React.FC = () => (
  <section className="rounded-xl border border-secondary-foreground/30 p-6 shadow-sm">
    <h3 className="text-lg font-semibold mb-2">寄付・支援</h3>
    <p className="text-sm text-secondary-foreground/70">
      開発継続を支援いただける場合は各プラットフォームをご利用ください．少額でも励みになります．
    </p>
    <div className="mt-4">
      <Link href="/support/donate" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
        支援方法を見る →
      </Link>
    </div>
  </section>
);

export const ContactPreview: React.FC = () => (
  <section className="rounded-xl border border-secondary-foreground/30 p-6 shadow-sm">
    <h3 className="text-lg font-semibold mb-2">お問い合わせ</h3>
    <p className="text-sm text-secondary-foreground/70">
      ライセンス相談，コラボ依頼，その他個別連絡はこちらからお願いします．返信には数日いただく場合があります．
    </p>
    <div className="mt-4">
      <Link href="/support/contact" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
        問い合わせる →
      </Link>
    </div>
  </section>
);
