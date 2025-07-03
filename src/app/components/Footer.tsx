import React from "react";
import Image from "next/image";
import json from "../data/footer.json";

const githubSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-github"
    viewBox="0 0 16 16"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path>
  </svg>
);

export default function Footer() {
  // ../data/footer.jsonから取得
  const footerData = json.footer;

  return (
    <footer
      className="w-full border-t border-gray-200 dark:border-gray-700"
      style={{ height: "500px" }}
    >
      <div style={{ paddingTop: "3rem" }}>
        <div>
          <div className="">
            <div className="flex flex-col justify-center mb-5">
              <div className="flex items-center mb-5">
                <a className="me-3" href="https://qiita.com/yhotta240">
                  <Image
                    aria-hidden
                    src="/imgs/icon.jpg"
                    alt="icon"
                    width={32}
                    height={32}
                  />
                </a>
                <h1 className="font-bold text-2xl">YHOTAMOS - ヨタモス</h1>
              </div>
              <div className="ps-4">
                <p>
                  YHOTMOSは、私の個人ブログ、ポートフォリオ、オープンソースプロジェクトを紹介するサイトです。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
              {footerData.map((item, index) => (
                <div key={index}>
                  <div className="text-gray-700 dark:text-gray-400">
                    {item.title}
                  </div>
                  <div className="my-2 me-10">
                    {item.items?.map((link, idx) => {
                      let icon = null;
                      if (link?.title === "GitHub") {
                        icon = githubSvg;
                      } else if (link?.icon) {
                        icon = (
                          <Image
                            src={link.icon.src}
                            alt="icon"
                            width={16}
                            height={16}
                          />
                        );
                      }
                      return (
                        <div key={idx} className="text-lg mb-2">
                          <a
                            href={link?.path}
                            className="flex items-center justify-between w-full"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link?.title}
                            {icon}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-end text-gray-700 dark:text-gray-400 my-2">
            &copy; 2025 yhotta240. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
