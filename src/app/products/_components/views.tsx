import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

export function ProductThumbnails({ items }: { items: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 px-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.repo_name} className="min-w-0">
          <Link href={`/products/${item.repo_name}`} className="relative block aspect-video overflow-hidden rounded-md transition-transform duration-200 hover:scale-[1.03] focus-visible:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none motion-reduce:transition-none">
            <Image
              src={item.thumbnail}
              alt=""
              fill
              sizes="(min-width: 1280px) 289px, (min-width: 1024px) calc(25vw - 31px), (min-width: 768px) calc((100vw - 104px) / 3), (min-width: 640px) calc(50vw - 42px), calc(100vw - 64px)"
              className="object-cover"
            />
            <h3
              className="absolute inset-x-0 bottom-0 px-3 pt-8 pb-3 text-sm font-medium text-white"
              style={{ backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))" }}
            >
              <span className="block truncate">{item.name}</span>
            </h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ProductRows({ items }: { items: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
      {items.map((item) => (
        <li key={item.repo_name} className="min-w-0 border-b">
          <Link href={`/products/${item.repo_name}`} className="flex items-start gap-4 rounded px-3 py-5 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2">
            <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded sm:w-36">
              <Image src={item.thumbnail} alt="" fill sizes="(min-width: 640px) 144px, 96px" className="object-cover" />
            </div>
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
      ))}
    </ul>
  );
}
