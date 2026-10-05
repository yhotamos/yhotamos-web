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

const IconRenderer = ({ icon, className = "", title }: { icon: { type: string; value: string }; className?: string; title?: string }) => {
  if (icon.type === "fontAwesome") {
    return <FontAwesomeIcon icon={iconMap[icon.value]} className={className} title={title} />;
  }

  return <Image src={icon.value} alt={title ?? ""} width={20} height={20} unoptimized className={className} />;
};
