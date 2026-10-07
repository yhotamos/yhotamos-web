import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/components/config/iconMap";
import { Button } from "@/components/ui/button";
import contact from "@/data/contact.json";
import Image from "next/image";
import Link from "next/link";

export function SnsLinks({ className }: { className?: string }) {
  const items = contact.items.filter((item) => item.icon !== null);
  return (
    <div className={className}>
      {items.map((item, index) => (
        <Button key={index} className="rounded-full border-none w-9 h-9 p-2" variant="ghost" size="icon" asChild>
          <Link href={item.path} className="" target="_blank" rel="noopener">
            {item.icon && <IconRenderer icon={item.icon} className="!w-full !h-full" title={item.title} />}
          </Link>
        </Button>
      ))}
    </div>
  );
}

export function SnsPanel() {
  const items = contact.items.filter((item) => item.icon !== null);

  return (
    <aside className="hidden min-w-0 flex-col lg:flex" aria-labelledby="home-sns-title">
      <h2 id="home-sns-title" className="mb-3 text-xl font-bold">SNS・リンク</h2>
      <ul className="grid auto-rows-fr flex-1 divide-y rounded-lg border bg-card">
        {items.map((item) => (
          <li key={item.path}>
            <Link href={item.path} target="_blank" rel="noopener noreferrer" className="flex h-full min-h-13 items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2">
              {item.icon && <IconRenderer icon={item.icon} className="size-5 shrink-0" />}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

const IconRenderer = ({ icon, className = "", title }: { icon: { type: string; value: string }; className?: string; title?: string }) => {
  if (icon.type === "fontAwesome") {
    return <FontAwesomeIcon icon={iconMap[icon.value]} className={className} title={title} />;
  }

  return <Image src={icon.value} alt={title ?? ""} width={20} height={20} unoptimized className={className} />;
};
