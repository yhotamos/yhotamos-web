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
}: Filter & { items: any; title?: string }) {
  const filteredItems = filterItems({ items, filter, sort, limit });

  return (
    <div className="w-full">
      {title && <h1 className="font-bold text-xl mb-3">{title}</h1>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredItems.map((item: any, index: number) => (
          <Card
            key={index}
            className="rounded-md gap-4 transition-transform duration-300 hover:scale-102 hover:shadow-md hover:shadow-gray-500 hover:cursor-pointer"
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
                <CardTitle className="flex justify-between">
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
                    <span>{item.releaseDate}</span>
                    <span>{item.users !== "—" ? item.users : 0} ユーザー</span>
                  </div>
                  <span className="flex gap-1 pt-1">
                    <Badge>{item.category}</Badge>
                    {item.tags
                      ? item.tags.map((tag: string) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))
                      : null}
                  </span>
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
        <div className="w-full p-2 rounded-md border">
          <Table className="grid grid-cols-1">
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
