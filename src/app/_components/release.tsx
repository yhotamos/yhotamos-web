import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { getProductItems } from "@/lib/googleSheets";
import { Product } from "@/types/product";
import Image from "next/image";

export default async function Release({ title }: { title: string }) {
  const items: Product[] = await getProductItems();
  // itemの公開日内の最新を取得
  const pastReleases = items.filter((item: Product) => {
    const date = new Date(item.created_at);
    const today = new Date();
    return date <= today;
  });

  // 日付が新しい順にソートして，最初の1件を取得
  const latestItem = pastReleases.sort((a: Product, b: Product) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  if (!latestItem) return null;

  return (
    <div className="w-full max-w-4xl lg:pt-10">
      <h1 className="mb-3 flex items-center gap-3 text-xl font-bold lg:absolute lg:top-0 lg:left-0">
        {title}
        <span className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">NEW</span>
      </h1>
      <article className="relative rounded-lg border bg-card p-4 shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-x-6">
          <div className="relative aspect-video overflow-hidden rounded-md sm:row-span-3 sm:self-center">
            <Image
              src={latestItem.thumbnail}
              alt=""
              fill
              sizes="(min-width: 1280px) 321px, (min-width: 1024px) calc(40vw - 191px), (min-width: 936px) 330px, (min-width: 640px) calc(40vw - 46px), calc(100vw - 74px)"
              className="object-cover"
              preload
            />
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{latestItem.category}</span>
              <span>{latestItem.created_at}</span>
            </div>
            <h2 className="text-lg font-bold leading-snug break-words sm:text-xl">{latestItem.name}</h2>
          </div>
          <p className="text-sm text-muted-foreground break-words">{latestItem.description}</p>
          <div>
            <Button asChild variant="default" className="relative z-20">
              <Link href={latestItem.store_url} target="_blank" rel="noopener noreferrer">
                ストアで見る
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </Link>
            </Button>
          </div>
        </div>
        <Link href={`/products/${latestItem.repo_name}`} aria-label={`${latestItem.name}の詳細を見る`} className="absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2" />
      </article>
    </div>
  );
}
