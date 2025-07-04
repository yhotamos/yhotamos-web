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

export default function cards({ items }: any) {
  const [chromeFilter, setChromeFilter] = useState(false);
  const [vsCodeFilter, setVsCodeFilter] = useState(false);
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              className="transition-transform duration-300 hover:scale-102 hover:shadow-md hover:shadow-gray-500 hover:cursor-pointer"
            >
              <img src={item[8]} alt="" />
              <CardHeader>
                <CardTitle>
                  <a
                    href={item[7]}
                    className="hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item[0].split("\n")[0]}
                  </a>
                </CardTitle>
                <CardDescription>{item[1]}</CardDescription>
              </CardHeader>
            </Card>
          ))}
      </div>
    </div>
  );
}
