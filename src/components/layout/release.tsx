import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { getChromeWebStoreItems } from "@/lib/googleSheets";
import { Product } from "../types/product";

export default async function Release({ title }: { title: string }) {
  const items: Product[] = await getChromeWebStoreItems();
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
      <Card
        key="1"
        className="flex relative rounded-lg sm:grid gap-4 sm:grid-cols-4 px-3 text-white bg-violet-900 dark:bg-violet-900 transition-transform duration-300 hover:scale-101 hover:shadow-md hover:shadow-gray-500 hover:cursor-pointer"
        title={latestItem.repo_name}
      >
        <img src={latestItem.thumbnail} alt="" className="rounded-sm border-solid" />
        <div className="col-span-3 grid gap-1">
          <CardHeader className="gap-1">
            <CardTitle>{latestItem.name}</CardTitle>
            <div className="flex gap-1">
              <Badge>{latestItem.category}</Badge>
              {latestItem.tags && latestItem.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
            </div>
            <div>{latestItem.created_at}</div>
          </CardHeader>
          <CardContent className="">
            <CardDescription className="text-gray-400 line-clamp-2">{latestItem.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="">
              <Link className="text-accent-foreground z-50" href={latestItem.store_url} target="_blank">
                今すぐダウンロード
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </Link>
            </Button>
          </CardFooter>
        </div>
        <Link href={`/products/${latestItem.repo_name}`} className="absolute inset-0 z-10" />
      </Card>
    </div>
  );
}
