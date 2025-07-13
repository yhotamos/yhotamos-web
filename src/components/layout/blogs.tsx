import Link from "next/link";
import { getQiitaList } from "@/api";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import FormattedDate from "@/components/ui/formatted-date";

export async function Blogs({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className={`${className} w-full`}>
      <h2 className="font-bold text-xl mb-3">Blog</h2>
      <BlogList />
    </div>
  );
}

export async function BlogList() {
  const qittaBlogs = await getQiitaList();

  return (
    <div className="w-full">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {qittaBlogs.map((blog: any, index: number) => (
          <li key={index} className="">
            <Link
              href={blog.url}
              target="_blank"
              className="block py-3 hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/imgs/qiita_icon.png"
                  alt="icon"
                  width={16}
                  height={16}
                />
                <h3 className="text-lg font-semibold">{blog.title}</h3>
              </div>
              <time className="text-sm text-gray-600 dark:text-gray-400">
                <FormattedDate isoDate={blog.publishDate} />
              </time>
              {blog.tags.length > 1 &&
                blog.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
