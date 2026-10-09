import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/getProducts";
import { getProductItems } from "@/lib/googleSheets";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductDetails } from "./_components/details";

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
  if (!item) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-5">
      <Breadcrumbs paths={[
        { name: "Products", href: "/products" },
        { name: item.name, href: `/products/${item.repo_name}` },
      ]} />
      <ProductDetails item={item} />
    </main>
  );
}
