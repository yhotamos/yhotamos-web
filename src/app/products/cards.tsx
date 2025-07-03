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
import products from "../data/products.json";
import { Button } from "@/components/ui/button";

export default function cards() {
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
        {products.map((product, index) => (
          <Card
            key={index}
            className="transition-transform duration-300 hover:scale-102 hover:shadow-md hover:shadow-gray-500 hover:cursor-pointer"
          >
            <img src={product.src} alt="" />
            <CardHeader>
              <CardTitle>
                <a
                  href={product.url}
                  className="hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {product.name}
                </a>
              </CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
