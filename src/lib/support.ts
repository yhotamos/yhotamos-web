import { notFound } from "next/navigation";
import { supportItems } from "@/components/config/supportItem";

export function checkSupportEnabled(href: string | undefined): void {
  if (!href) notFound();
  const item = supportItems.find((i) => i.href === href);
  if (!item || item.enabled === false) notFound();
}
