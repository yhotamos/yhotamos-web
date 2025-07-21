import React from "react";
import Image from "next/image";
import json from "@/data/footer.json";
import { SnsLinks } from "./snsLinks";
import Link from "next/link";
import { nicoMoji } from "@/app/fonts";

export default function Footer() {
  // ../data/footer.jsonから取得
  const footerData = json;

  return (
    <footer className="mt-10 bg-white dark:bg-background border-t border-gray-200 dark:border-gray-700 pb-[6rem]">
      <div className="pt-[3rem] max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 px-4">
          <div className="flex flex-col gap-3 mb-5 xl:col-span-2">
            <div className="flex items-center cursor-pointer">
              <Image className="rounded-full" src="/imgs/icon.jpg" alt="icon" width={40} height={40} />
              <a href="/" className={`ps-3 text-4xl font-bold ${nicoMoji.className}`}>
                YHOTAMOS
              </a>
            </div>
            <div>自作ツールや拡張機能，技術ブログをまとめた個人開発サイト</div>
            <SnsLinks className="flex gap-2 h-10" />
          </div>

          <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 ">
            {footerData.map((item, index) => (
              <div key={index}>
                <div className="text-secondary-foreground/70 dark:text-gray-400">{item.title}</div>
                <div className="my-2 flex flex-col gap-1">
                  {item.items?.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link?.path}
                      className="text-base flex items-center justify-between w-full"
                      target={link.external ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                    >
                      {link?.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-end text-gray-700 dark:text-gray-400 mt-5">&copy; 2025 yhotta240. All rights reserved.</p>
      </div>
    </footer>
  );
}
