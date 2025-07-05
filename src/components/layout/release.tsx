import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getChromeWebStoreItems } from "@/api";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default async function Release({ title }: { title: string }) {
  const items = await getChromeWebStoreItems();
  // itemの公開日内の最新を取得
  const pastReleases = items.filter((item: any) => {
    const date = new Date(item.releaseDate);
    const today = new Date();
    return date <= today;
  });

  // 日付が新しい順にソートして，最初の1件を取得
  const latestItem = pastReleases.sort(
    (a: any, b: any) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  )[0];

  return (
    <div className="w-full ">
      <h1 className="font-bold text-xl mb-3">{title}</h1>
      <Card
        className="rounded-md bg-violet-200 grid grid-cols-3 px-3 dark:bg-violet-900"
        key="1"
      >
        <img src={latestItem.src} alt="" className="rounded-sm border-solid" />
        <div className="col-span-2 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{latestItem.title}</CardTitle>
            <div className="flex gap-1 pt-1">
              <Badge>{latestItem.category}</Badge>
              {latestItem.tags
                ? latestItem.tags
                    .split(",")
                    .map((tag: string, i: number) => (
                      <Badge key={i}>{tag.trim()}</Badge>
                    ))
                : null}
            </div>
          </CardHeader>
          <CardContent className="">
            <CardDescription>{latestItem.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href={latestItem.url} target="_blank">
                今すぐダウンロード
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </Link>
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
