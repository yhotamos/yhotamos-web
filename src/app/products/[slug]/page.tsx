import Link from "next/link";
import { getProductBySlug } from "@/lib/getProducts";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/types/product";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import NotFoundPage from "@/components/layout/notFound";
import React from "react";
import TabController from "./_components/tabController";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug: any = await params;
  const item = await getProductBySlug(slug.slug);

  return {
    title: item?.title || "Products",
    description: "YHOTAMOS - My Products",
  };
}

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug: any = await params;
  const item = await getProductBySlug(slug.slug);
  const pathname: string = item ? item.title : "";
  const pathnames: BreadcrumbsProps["paths"] = [{ name: "Products", href: "/products" }, { name: pathname }];

  if (!item) {
    return <NotFoundPage className={`min-h-screen mt-20 text-center font-bold`} backTop={true} />;
  }

  return (
    <main>
      <div className="bg-background pt-5 ">
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
        <Image
          src={item.src}
          alt={item.title}
          className="object-cover rounded-sm border-solid w-full h-44 md:h-fit"
          title={item.title}
          width={300}
          height={300}
          priority
        ></Image>
        <div className="md:col-span-4 grid gap-1">
          <div className="font-bold text-xl">
            <Link href={item.url} className="hover:underline" target="_blank">
              {item.title}
            </Link>
            <div className="flex flex-wrap gap-x-2 mt-1">
              <Link href={`/products?tab=${item.type}&category=${item.category}`}>
                <Badge className="cursor-pointer hover:bg-secondary-foreground/70 px-4 py-1 rounded-full">{item.category}</Badge>
              </Link>
              {item.tags &&
                item.tags.map((tag: string) => (
                  <Link key={tag} href={`/products?tab=${item.type}&category=${tag}`}>
                    <Badge className="cursor-pointer hover:bg-secondary-foreground/70 px-4 py-1 rounded-full">{tag}</Badge>
                  </Link>
                ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3 text-base ps-3">
            <span className="">{item.rate} 評価</span>
            <span className="after:content-['|']"></span>
            <span className="">{item.users} ユーザー </span>
            <span className="after:content-['|']"></span>
            <span className="">バージョン : {item.version}</span>
            <span className="after:content-['|']"></span>
            <span className="">作成者 : {item.author || "yhotta240"}</span>
          </div>
          <div className="text-base text-muted-foreground ps-3">{item.description}</div>
          <Button
            asChild
            variant="outline"
            className="w-fit bg-violet-500 text-white hover:bg-violet-800 hover:text-white dark:bg-violet-500 dark:hover:bg-violet-800"
          >
            <Link href={item.url} target="_blank">
              今すぐダウンロード
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
