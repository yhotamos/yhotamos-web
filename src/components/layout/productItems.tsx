"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faList, faGrip } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export { ProductItems, ProductGrid, ProductList };

function ProductItems({ items }: any) {
  const [chromeFilter, setChromeFilter] = useState(false);
  const [vsCodeFilter, setVsCodeFilter] = useState(false);
  const [view, setView] = useState<"list" | "grid">("grid");

  const iconMap = {
    list: faList,
    grid: faGrip,
  };

  const ViewMap = ({ view, items }: any) => {
    switch (view) {
      case "list":
        return ProductList({ items });
      case "grid":
        return ProductGrid({ items });
      default:
        return ProductGrid({ items });
    }
  };

  return (
    <div className="max-w-full grid gap-4 my-3">
      <h1 className="font-bold text-xl">拡張機能</h1>

      <div className="">
        <Button
          variant={chromeFilter ? undefined : "outline"}
          onClick={() => setChromeFilter(!chromeFilter)}
          className="mr-3 "
        >
          Chrome 拡張機能
          {chromeFilter ? <FontAwesomeIcon icon={faXmark} /> : ""}
        </Button>
        <Button
          variant={vsCodeFilter ? undefined : "outline"}
          onClick={() => setVsCodeFilter(!vsCodeFilter)}
          className="mr-3 "
        >
          VS Code 拡張機能
          {vsCodeFilter ? <FontAwesomeIcon icon={faXmark} /> : ""}
        </Button>
      </div>

      <div className="flex justify-end">
        <Select
          defaultValue={view}
          onValueChange={(value) => setView(value as "list" | "grid")}
        >
          <SelectTrigger className="justify-center">
            <FontAwesomeIcon icon={iconMap[view]} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">
              <FontAwesomeIcon icon={faGrip} />
              グリッド表示
            </SelectItem>
            <SelectItem value="list">
              <FontAwesomeIcon icon={faList} />
              リスト表示
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ViewMap view={view} items={items} className="my-3" />
    </div>
  );
}

type Filter = {
  filter?: string;
  sort?: string;
  limit?: number;
};

function ProductGrid({
  items,
  title,
  filter,
  sort,
  limit,
  isOpen = false,
}: Filter & { items: any; title?: string; isOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const filteredItems = filterItems({
    items,
    filter,
    sort,
    limit: open ? 9 : limit,
  });

  const scrollView = (id: string) => {
    const el = document.getElementById(id);
    el?.previousElementSibling?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="product-grid" className="w-full">
      {title && <h1 className="font-bold text-xl mb-3">{title}</h1>}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 transition-all duration-500 ease-in px-3 pb-5 ${
          isOpen && (open ? "max-h-full" : "max-h-[600px]")
        }  overflow-hidden`}
      >
        {filteredItems.map((item: any, index: number) => (
          <Card
            key={index}
            className={`rounded-md gap-4 mb-3 transition-transform duration-300 ease-out ${
              !open
                ? "opacity-100 translate-y-0 delay-[" + index * 1000 + "ms]"
                : "delay-[" + index * 1000 + "ms]"
            }
            translate-y-4 hover:scale-102 hover:shadow-md hover:shadow-gray-500 hover:cursor-pointer`}
            title={item.title}
          >
            <div className="relative">
              {item.rate !== "—" ? (
                <div className="bg-gray-900 text-yellow-400 rounded-full opacity-80 w-fit absolute top-2 px-2 right-2 ">
                  {item.rate}
                </div>
              ) : null}
              <img src={item.src} alt="" />
            </div>
            <div className="col-span-2 grid gap-1">
              <CardHeader className="px-4">
                <CardTitle className="leading-none font-semibold grid grid-cols-[1fr_auto] items-start gap-2 whitespace-normal break-words">
                  <a
                    href={item.url}
                    className="hover:underline line-clamp-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.title}
                  </a>
                  <span className="text-sm text-end ms-2">v{item.version}</span>
                </CardTitle>
                <div className="">
                  <div className="text-sm flex justify-between">
                    <div>{item.releaseDate}</div>
                    <div>{item.users !== "—" ? item.users : 0} ユーザー</div>
                  </div>
                  <div className="flex gap-1 pt-1 flex-wrap">
                    <Badge>{item.category}</Badge>
                    {item.tags
                      ? item.tags.map((tag: string) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))
                      : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4">
                <CardDescription className="line-clamp-2">
                  {item.description}
                </CardDescription>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
      {isOpen &&
        (!open ? (
          <Button
            variant="default"
            className="w-fit flex justify-center mx-auto mt-4 hover:scale-101 hover:shadow-sm bg-violet-700 hover:bg-violet-800 text-white"
            onClick={() => setOpen(true)}
          >
            もっと見る
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-fit flex justify-center mx-auto mt-4 hover:scale-101 hover:shadow-sm bg-violet-700 hover:bg-violet-800 text-white"
            onClick={() => {
              setOpen(false);
              scrollView("product-grid");
            }}
          >
            閉じる
          </Button>
        ))}
    </div>
  );
}

function ProductList({
  items,
  title,
  filter,
  sort,
  limit,
}: Filter & { items: any; title?: string }) {
  return (
    <div className="w-full">
      <h1 className="font-bold text-xl mb-3">{title}</h1>
      <div className="overflow-x-auto ">
        <div className="w-full p-2 rounded-md border grid">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>タイトル</TableHead>
                <TableHead>バージョン</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead>ユーザー数</TableHead>
                <TableHead>説明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="truncate w-50">
                      <a
                        href={item.url}
                        className="hover:underline"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {item.title}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>v{item.version}</TableCell>
                  <TableCell>{item.releaseDate}</TableCell>
                  <TableCell>{item.users}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* <Image
        src={item.src}
        alt=""
        width={100}
        height={100}
        className="rounded-sm border-solid"
      /> */}
        </div>
      </div>
    </div>
  );
}

function filterItems({ items, filter, sort, limit }: Filter & { items: any }) {
  let filtered = [...items];

  if (filter) {
    filtered = filtered.filter((item) => item.category.includes(filter));
  }

  // ソート処理
  if (sort === "users-desc") {
    filtered = filtered.sort((a, b) => {
      const aUsers = parseInt(a.users.replace(/,/g, "")) || 0;
      const bUsers = parseInt(b.users.replace(/,/g, "")) || 0;
      return bUsers - aUsers;
    });
  }

  if (typeof limit === "number") {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}
