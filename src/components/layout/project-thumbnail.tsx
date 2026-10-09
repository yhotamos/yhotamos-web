"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function subscribe() {
  return () => {};
}

export function ProjectThumbnail({ name }: { name: string }) {
  const { resolvedTheme } = useTheme();
  // テーマ確定前はアイコンを表示し、サーバーと初回描画をそろえる。
  const theme = useSyncExternalStore(subscribe, () => resolvedTheme, () => undefined);
  const [failedSrc, setFailedSrc] = useState<string>();
  let imageTheme = "Light";
  if (theme === "dark") imageTheme = "Dark";
  const src = `https://socialify.dev/${name}/image?forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit+Board&pulls=1&stargazers=1&theme=${imageTheme}`;

  if (!theme || failedSrc === src) {
    return (
      <div className="flex aspect-[2/1] flex-col items-center justify-center gap-3 bg-muted px-4 text-muted-foreground">
        <FontAwesomeIcon icon={faGithub} className="text-4xl" aria-hidden="true" />
        <span className="max-w-full break-words text-center text-sm">{name}</span>
      </div>
    );
  }

  return (
    <Image
      key={src}
      src={src}
      alt={name}
      width={1200}
      height={600}
      unoptimized
      className="aspect-[2/1] w-full object-cover"
      onError={() => setFailedSrc(src)}
    />
  );
}
