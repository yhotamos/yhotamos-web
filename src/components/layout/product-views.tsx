import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/components/types/product";

export function ProductRows({ items, thumbnails = false }: { items: Product[]; thumbnails?: boolean }) {
  return (
    <ul className="divide-y">
      {items.map((item) => {
        let image = <Image src={item.icon_url} alt="" width={36} height={36} className="size-9 shrink-0 rounded object-contain" />;
        if (thumbnails) {
          image = (
            <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded sm:w-36">
              <Image src={item.thumbnail} alt="" fill sizes="(min-width: 640px) 144px, 96px" className="object-cover" />
            </div>
          );
        }

        return (
          <li key={item.repo_name}>
            <Link href={`/products/${item.repo_name}`} className="flex items-start gap-4 rounded px-3 py-5 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2">
              {image}
              <div className="min-w-0 flex-1 space-y-2">
                <h3 className="font-semibold break-words">{item.name}</h3>
                <p className="text-sm text-muted-foreground break-words">{item.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{item.category}</span>
                  <span>v{item.version}</span>
                  <span>更新 {item.updated_at}</span>
                  <span>{(item.users ?? 0).toLocaleString("ja-JP")} ユーザー</span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ProductCompact({ items }: { items: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.repo_name} className="min-w-0 border-b">
          <Link href={`/products/${item.repo_name}`} className="flex items-start gap-3 rounded px-3 py-4 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2">
            <Image src={item.icon_url} alt="" width={28} height={28} className="size-7 shrink-0 rounded object-contain" />
            <div className="min-w-0 space-y-1">
              <h3 className="text-sm font-medium break-words">{item.name}</h3>
              <p className="line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
