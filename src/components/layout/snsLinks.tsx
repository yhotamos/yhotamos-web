import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/components/config/iconMap";
import { Button } from "@/components/ui/button";
import contact from "@/data/contact.json";
import Link from "next/link";

export function SnsLinks({ className }: { className?: string }) {
  const items = contact.items.filter((item: any) => item.icon !== null);
  return (
    <div className={className}>
      {items.map((item: any, index: number) => (
        <Button
          key={index}
          className="rounded-full border w-12 h-12 p-2"
          variant="ghost"
          size="icon"
          asChild
        >
          <Link href={item.path} className="" target="_blank" rel="noopener">
            <IconRenderer icon={item.icon} className="!w-full !h-full" title={item.title} />
          </Link>
        </Button>
      ))}
    </div>
  );
}

const IconRenderer = ({
  icon,
  className = "",
  title,
}: {
  icon: { type: string; value: string };
  className?: string;
  title?: string;
}) => {
  if (icon.type === "fontAwesome") {
    return (
      <FontAwesomeIcon
        icon={iconMap[icon.value]}
        className={className}
        title={title}
      />
    );
  }

  return <img src={icon.value} alt={title} className={className} />;
};
