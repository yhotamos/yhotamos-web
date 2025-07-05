"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

export default function cards({ items }: any) {
  const [chromeFilter, setChromeFilter] = useState(false);
  const [vsCodeFilter, setVsCodeFilter] = useState(false);
  // console.log(items);
  return (
    <div>
      <h1 className="font-bold text-xl my-3">拡張機能</h1>

      <div className="my-3">
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items
          .sort((a: any, b: any) => {
            if (a[0] < b[0]) {
              return -1;
            }
            return 1;
          })
          .map((item: any, index: number) => (
            <Card
              key={index}
              className="rounded-md gap-4 transition-transform duration-300 hover:scale-102 hover:shadow-md hover:shadow-gray-500 hover:cursor-pointer"
            >
              <div className="relative">
                {item[4] !== "—" ? (
                  <div className="bg-gray-900 text-yellow-400 rounded-full opacity-80 w-fit absolute top-2 px-2 right-2 ">
                    {item[4]}
                  </div>
                ) : null}
                <img src={item[8]} alt="" />
              </div>
              <CardHeader className="px-4">
                <CardTitle>
                  <a
                    href={item[7]}
                    className="hover:underline line-clamp-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item[0].split("\n")[0]}
                  </a>
                </CardTitle>

                <div className="">
                  <div className="text-sm">
                    {item[5] !== "—" ? item[5] : 0} ユーザー
                  </div>
                  <span className="flex gap-1 pt-1">
                    <Badge>{item[1]}</Badge>
                    {item[10]
                      ? item[10]
                          .split(",")
                          .map((tag: string, i: number) => (
                            <Badge key={i}>{tag.trim()}</Badge>
                          ))
                      : null}
                  </span>
                </div>

                <CardDescription className="line-clamp-2">
                  {item[9]}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
      </div>
    </div>
  );
}
