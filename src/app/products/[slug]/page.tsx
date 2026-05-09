import Link from "next/link";
import { getProductBySlug } from "@/lib/getProducts";
import { getChromeWebStoreItems } from "@/lib/googleSheets";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/types/product";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import NotFoundPage from "@/components/layout/notFound";
import TabController from "./_components/tabController";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const items = await getChromeWebStoreItems().catch(() => []);
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

  const pathnames: BreadcrumbsProps["paths"] = [{ name: "Products", href: "/products" }, { name: item.repo_name }];

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
      <div className="grid gap-2 md:gap-3 grid-cols-1 md:grid-cols-5">
        <Image src={item.thumbnail} alt={item.name} className="object-cover rounded-sm border-solid w-full h-44 md:h-fit" title={item.name} width={300} height={300} priority></Image>
        <div className="md:col-span-4 grid gap-1">
          <div className="font-bold text-xl">
            <Link href={item.store_url} className="hover:underline" target="_blank">
              {item.repo_name}
            </Link>
            <div className="flex flex-wrap gap-x-2 mt-1">
              <Link href={`/products?category=${item.category}`}>
                <Badge className="cursor-pointer hover:bg-secondary-foreground/70 px-4 py-1 rounded-full">{item.category}</Badge>
              </Link>
              {item.tags &&
                item.tags.map((tag: string) => (
                  <Link key={tag} href={`/products?category=${tag}`}>
                    <Badge className="cursor-pointer hover:bg-secondary-foreground/70 px-4 py-1 rounded-full">{tag}</Badge>
                  </Link>
                ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3 text-base ps-3">
            <span className="">{item.rating} 評価</span>
            <span className="after:content-['|']"></span>
            <span className="">{item.users} ユーザー </span>
            <span className="after:content-['|']"></span>
            <span className="">バージョン : {item.version}</span>
            <span className="after:content-['|']"></span>
            <span className="">作成者 : {item.provider || "yhotta240"}</span>
          </div>
          <div className="text-base text-muted-foreground ps-3">{item.description}</div>
          <Button asChild variant="outline" className="w-fit bg-violet-500 text-white hover:bg-violet-800 hover:text-white dark:bg-violet-500 dark:hover:bg-violet-800">
            <Link href={item.store_url} target="_blank">
              今すぐダウンロード
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
