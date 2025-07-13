import Link from "next/link";

export default function NotFoundPage({
  className,
  backTop,
}: {
  className?: string;
  backTop?: boolean;
}) {
  return (
    <div className={`${className} text-center pt-20`}>
      <div className="grid gap-1">
        <h1 className="font-bold">ページが見つかりません．</h1>
        <p className="mt-4 text-gray-500">
          指定されたコンテンツは存在しないか，読み込めませんでした．
        </p>
        {backTop && (
          <Link href="/" className="mt-4 block underline">
            トップへ戻る
          </Link>
        )}
      </div>
    </div>
  );
}
