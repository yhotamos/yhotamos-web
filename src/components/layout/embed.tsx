"use client";

import { useRef, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Iframe from "react-iframe";
import Script from "next/script";
import Link from "next/link";

type XApi = {
  ready: (callback: (api: XApi) => void) => void;
  widgets: { load: (container: HTMLElement) => void };
};

function subscribe() {
  return () => {};
}

export const HatenaEmbed = ({ url }: { url: string }) => {
  const hatenaUrl = "https://hatenablog-parts.com/embed?url=" + url;
  return <Iframe url={hatenaUrl} className="w-full sm:w-xl border-solid rounded-md shadow hover:shadow-md transition" />;
};

export const XEmbed = ({ username, height }: { username: string; height: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  // サーバーと初回描画はlightにそろえ，描画後に選択中のテーマを反映する．
  const theme = useSyncExternalStore(subscribe, () => (resolvedTheme === "dark" ? "dark" : "light"), () => "light");

  return (
    <div ref={containerRef} className="not-italic w-full sm:w-1/2 mx-auto">
      <h2 className="font-bold text-xl mb-3">X/Twitter</h2>
      <a className="twitter-timeline" data-theme={theme} data-height={height} href={`https://x.com/${username}?ref_src=twsrc%5Etfw`}>
        Posts by {username}
      </a>
      <Script
        id="x-wjs"
        src="https://platform.x.com/widgets.js"
        charSet="utf-8"
        strategy="lazyOnload"
        onReady={() => {
          const xApi = (window as Window & { twttr?: XApi }).twttr;
          xApi?.ready((api) => {
            if (containerRef.current) {
              api.widgets.load(containerRef.current);
            }
          });
        }}
      />
    </div>
  );
};

export const OpenGraphEmbed = ({ repo_name, className }: { repo_name: string; className?: string }) => {
  const ogImageUrl = `https://opengraph.githubassets.com/1/${repo_name}`;
  return (
    <div className={className}>
      <Link href={`https://github.com/${repo_name}`} target="_blank" rel="noopener noreferrer">
        <Image src={ogImageUrl} alt={repo_name} title={repo_name} width={1200} height={600} unoptimized className="w-full h-auto" />
      </Link>
    </div>
  );
};
