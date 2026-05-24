import Link from "next/link";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { getProductItems } from "@/lib/googleSheets";
import { Product } from "../types/product";
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
    <div className="w-full">
      <h1 className="font-bold text-xl mb-3">{title}</h1>
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-violet-700 to-violet-900 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] w-full cursor-pointer">
        {/* モバイル: カード上部にカバー画像 / SM以上: 非表示 */}
        <div className="relative w-full h-36 sm:hidden">
          <Image src={latestItem.thumbnail} alt={latestItem.name} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/80" />
        </div>

        <div className="flex flex-col sm:flex-row gap-0">
          {/* SM以上: 左サムネイル */}
          <div className="relative hidden sm:block w-90 flex-shrink-0">
            <Image src={latestItem.thumbnail} alt={latestItem.name} fill sizes="128px" className="object-cover" priority />
          </div>

          {/* テキスト部分 */}
          <div className="flex flex-col gap-2 p-4 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
              <span className="text-gray-300 text-xs">{latestItem.created_at}</span>
            </div>
            <p className="font-bold text-lg leading-snug truncate">{latestItem.name}</p>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{latestItem.category}</span>
              {latestItem.tags && latestItem.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
            <p className="text-sm text-gray-200 line-clamp-2">{latestItem.description}</p>
            <div className="mt-1">
              <Button asChild variant="default" className="relative z-20 bg-white text-violet-800 hover:bg-white/90 w-full sm:w-auto font-semibold">
                <Link href={latestItem.store_url} target="_blank" className="inline-flex items-center gap-2 justify-center relative z-20">
                  今すぐダウンロード
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Link href={`/products/${latestItem.repo_name}`} className="absolute inset-0 z-10" />
      </div>
    </div>
  );
}
