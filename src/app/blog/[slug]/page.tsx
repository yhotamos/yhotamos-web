import { Breadcrumbs, BreadcrumbsProps } from "@/components/layout/breadcrumbs";
import { getBlogBody } from "@/lib/getBlog";
import { BlogBody } from "./_components/body";
import NotFoundPage from "@/components/layout/notFound";
import { FormattedDate, DiffDate } from "@/components/ui/formatted-date";
import { Blog } from "@/components/types/blog";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug: any = await params;
  const blogId = decodeURIComponent(slug.slug);
  const blogBody = getBlogBody(blogId);

  return {
    title: blogBody?.data.title || "Blog",
    description: "YHOTAMOS - ブログ記事",
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug: any = await params;
  const blogId = decodeURIComponent(slug.slug);
  const blogBody = getBlogBody(blogId);
  // console.log("blogId", blogBody);
  if (!blogBody) {
    return <NotFoundPage className={`min-h-screen mt-20 text-center font-bold`} backTop={true} />;
  }

  const pathnames: BreadcrumbsProps["paths"] = [
    { name: "Blog", href: "/blog" },
    { name: blogBody.data.title, href: `/blog/${blogBody.data.title}` },
  ];

  return (
    <main className="max-w-7xl mx-auto p-5 ">
      <Breadcrumbs paths={pathnames} className="mb-5" />
      <BlogHeader data={blogBody.data as Blog} />
      <BlogBody blogId={blogId} body={blogBody} />
    </main>
  );
}

const BlogHeader: React.FC<{ data: Blog }> = ({ data }) => {
  return (
    <div className="w-full pt-8 pb-4 px-2 md:px-20">
      {data.thumbnail && <img src={data.thumbnail} className="w-full mb-5" />}
      <div id="title" className="text-3xl font-bold mb-5">
        {data.title}
      </div>
      <div className="text-sm text-secondary-foreground/70">
        投稿日
        <FormattedDate isoDate={data.date} />・<DiffDate isoDate={data.date} />
      </div>
      <div className="flex flex-wrap justify-start items-center gap-2 mt-5">
        {data.type === "dev" && <div className="text-sm text-secondary-foreground/70 pt-1">開発者向け ・</div>}
        {data.tags &&
          data.tags.map((tag: string) => (
            <Link href={`/blog?tab=${data.type}&tag=${tag}`} key={tag}>
              <span
                key={tag}
                className="cursor-pointer hover:bg-secondary-foreground/10 bg-white dark:bg-secondary text-xs text-secondary-foreground/80 px-4 py-1 rounded-full"
              >
                {tag}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
};
