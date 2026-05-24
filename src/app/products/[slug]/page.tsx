import Link from "next/link";
import { getProductBySlug } from "@/lib/getProducts";
import { getProductItems } from "@/lib/googleSheets";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/types/product";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faBug } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import NotFoundPage from "@/components/layout/notFound";
import TabController from "./_components/tabController";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const items = await getProductItems().catch(() => []);
  return items.map((item) => ({ slug: item.repo_name }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const item = await getProductBySlug(slug);
  return {
    title: item?.name ?? "Products",
    description: "YHOTAMOS - My Products",
  };
}

export const revalidate = 60;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const item = await getProductBySlug(slug);

  if (!item) {
    return <NotFoundPage className="min-h-screen mt-20 text-center font-bold" backTop={true} />;
  }

  const pathnames: BreadcrumbsProps["paths"] = [
    { name: "Products", href: "/products" },
    { name: item.name, href: `/products/${item.repo_name}` },
  ];

  return (
    <main>
      <div className="bg-background pt-5">
        <Breadcrumbs paths={pathnames} className="max-w-7xl mx-auto px-5 pb-3" />
        <ProductItem item={item} className="px-5 max-w-7xl mx-auto pb-3" />
      </div>
      <TabController item={item} />
    </main>
  );
}

function ProductItem({ item, className }: { item: Product; className?: string }) {
  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row md:gap-5 md:items-stretch">
        <div className="relative w-full h-36 md:w-48 md:h-full md:flex-shrink-0 min-h-[96px] md:min-h-[120px]">
          <Image src={item.thumbnail} alt={item.name} fill sizes="(max-width:768px) 100vw, 192px" className="object-cover rounded-sm border" title={item.name} priority />
        </div>
        <div className="flex-1 min-w-0 mt-2 md:mt-0 grid gap-1.5 md:max-w-[800px]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                <Link href={item.store_url} className="font-bold text-xl hover:underline truncate text-wrap" target="_blank">
                  {item.name}
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="justify-center w-fit md:w-auto mt-0 mb-2 md:mt-0 md:mb-0 shrink md:shrink-0 bg-violet-500 text-white hover:bg-violet-800 dark:bg-violet-500 dark:hover:bg-violet-800 text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 h-8 md:h-8 rounded-sm inline-flex items-center gap-2"
                >
                  <Link href={item.store_url} target="_blank">
                    今すぐダウンロード
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Link href={`/products?category=${item.category}`}>
                  <Badge className="cursor-pointer hover:bg-secondary-foreground/70 px-3 py-0.5 rounded-full text-xs">{item.category}</Badge>
                </Link>
                {item.tags?.map((tag: string) => (
                  <Link key={tag} href={`/products?category=${tag}`}>
                    <Badge className="cursor-pointer hover:bg-secondary-foreground/70 px-3 py-0.5 rounded-full text-xs">{tag}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <span>★ {item.rating} 評価</span>
            <span>·</span>
            <span>{item.users} ユーザー</span>
            <span>·</span>
            <span>v{item.version}</span>
            <span>·</span>
            <span>{item.provider || "yhotta240"}</span>
            <span className="hidden md:inline">·</span>
            <Link href={`/support/issue?tool=${item.repo_name}`} className="inline-flex items-center gap-1 hover:text-foreground hover:underline transition-colors text-xs md:text-sm">
              <FontAwesomeIcon icon={faBug} className="text-[12px]" />
              バグを報告する
            </Link>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
