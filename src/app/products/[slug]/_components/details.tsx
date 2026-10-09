import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faBug, faStar } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { DocHtml } from "./document";
import { ProductDocumentTabs } from "./document-tabs";

export function ProductDetails({ item }: { item: Product }) {
  return (
    <div className="mt-5">
      <ProductHeading item={item} />
      <div className="mt-6 border-t pt-5">
        <ProductDocumentTabs overview={<Overview item={item} />} usage={item.repo_usage && <Usage item={item} />} information={<ProductFacts item={item} />} />
      </div>
    </div>
  );
}

function ProductHeading({ item }: { item: Product }) {
  return (
    <header className="flex items-start gap-3">
      {item.icon_url && <Image src={item.icon_url} alt="" width={48} height={48} className="size-12 shrink-0 rounded-lg" />}
      <div className="min-w-0 space-y-2">
        <h1 className="text-2xl font-bold leading-snug break-words">{item.name}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <Badge asChild className="rounded-full px-3">
            <Link href={`/products?category=${encodeURIComponent(item.category)}`}>{item.category}</Link>
          </Badge>
          {item.tags.map((tag) => (
            <Badge key={tag} asChild className="rounded-full px-3">
              <Link href={`/products?category=${encodeURIComponent(tag.trim())}`}>{tag}</Link>
            </Badge>
          ))}
          <span className="inline-flex items-center gap-1.5"><FontAwesomeIcon icon={faStar} aria-hidden="true" />{item.rating} 評価</span>
          <span>{item.users.toLocaleString("ja-JP")} ユーザー</span>
          <span>v{item.version}</span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        <ProductActions item={item} />
      </div>
    </header>
  );
}

function ProductActions({ item }: { item: Product }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild size="sm" className="bg-violet-500 text-white hover:bg-violet-800 dark:bg-violet-500 dark:hover:bg-violet-800">
        <Link href={item.store_url} target="_blank" rel="noopener noreferrer">
          ストアで見る <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
        </Link>
      </Button>
      {item.repo_html_url && (
        <Link href={item.repo_html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-1.5 text-sm hover:underline">
          <FontAwesomeIcon icon={faGithub} aria-hidden="true" /> GitHub
        </Link>
      )}
      <Link href={`/support/issue?tool=${item.repo_name}`} className="inline-flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:underline">
        <FontAwesomeIcon icon={faBug} aria-hidden="true" /> 問題を報告
      </Link>
    </div>
  );
}

function ProductFacts({ item }: { item: Product }) {
  const facts = [
    { label: "バージョン", value: item.version },
    { label: "更新日", value: item.updated_at },
    { label: "公開日", value: item.created_at },
    { label: "提供元", value: item.provider || item.developer },
    { label: "サイズ", value: item.size },
    { label: "言語", value: item.languages.join(", ") },
  ].filter((fact) => fact.value);

  return (
    <section aria-labelledby="product-info-title" className="rounded-lg border bg-card p-4">
      <h2 id="product-info-title" className="mb-3 text-lg font-semibold">プロダクト情報</h2>
      <dl className="divide-y text-sm">
        {facts.map((fact) => (
          <div key={fact.label} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-3">
            <dt className="text-muted-foreground">{fact.label}</dt>
            <dd className="break-words">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Overview({ item }: { item: Product }) {
  return (
    <section>
      {item.repo_doc && <DocHtml src={item.repo_doc} notFoundFallback={<p className="text-sm text-muted-foreground">概要の本文を読み込めませんでした。ストアまたはGitHubをご覧ください。</p>} />}
      {!item.repo_doc && <p className="leading-relaxed text-muted-foreground">{item.overview || item.description}</p>}
    </section>
  );
}

function Usage({ item }: { item: Product }) {
  return (
    <section>
      <DocHtml src={item.repo_usage} notFoundFallback={<p className="text-sm text-muted-foreground">使い方の本文を読み込めませんでした。GitHubのドキュメントをご覧ください。</p>} />
    </section>
  );
}
