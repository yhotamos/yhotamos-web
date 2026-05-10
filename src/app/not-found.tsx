import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-8xl font-black tracking-tight text-violet-500">404</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">ページが見つかりません</h1>
        <p className="text-secondary-foreground/60 text-sm">
          URLが間違っているか、ページが削除または非公開になっています。
        </p>
      </div>
      <Button asChild>
        <Link href="/">トップへ戻る</Link>
      </Button>
    </main>
  );
}
