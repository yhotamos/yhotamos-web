"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars } from "@fortawesome/free-solid-svg-icons";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { navigationItems as navItems } from "@/components/config/navigation";
import { iconMap } from "@/components/config/iconMap";
import { nicoMoji } from "@/app/fonts";
import { NavigationItem } from "../types/navigationItem";

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="py-2 bg-background z-50 sticky top-0 flex items-center justify-between w-full border-b shadow-sm border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-5 w-full flex items-center justify-between">
        <Link href="/" className={`text-2xl font-bold ${nicoMoji.className}`}>
          YHOTAMOS
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <DesktopMenu pathname={pathname} />
          </div>
          <Button variant="ghost" size="icon" id="switch-theme" className="switch-theme cursor-pointer rounded-full" onClick={toggleTheme} aria-label="テーマ切り替え">
            <span className="block dark:hidden">
              <FontAwesomeIcon icon={faSun} />
            </span>
            <span className="hidden dark:block">
              <FontAwesomeIcon icon={faMoon} />
            </span>
          </Button>
          <div className="block md:hidden">
            <MobileMenu pathname={pathname} />
          </div>
        </div>
      </div>
    </header>
  );
}

function DesktopMenu({ pathname }: { pathname: string }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item: NavigationItem) => (
          <NavigationMenuItem key={item.name}>
            <Link className={`flex flex-row items-center gap-1 rounded-sm p-2 text-sm hover:bg-accent hover:text-accent-foreground transition-all ${pathname === item.href ? "underline bg-accent" : ""}`} title={item.ja + " - " + item.description} href={item.href}>
              <FontAwesomeIcon icon={iconMap[item.icon ?? "defaultIcon"]} />
              {item.name}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const currentItem = navItems.find((item: NavigationItem) => pathname === item.href);
  return (
    <div className="flex items-center gap-4">
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline">
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-full z-100">
          <DrawerHeader>
            <DrawerTitle>{currentItem?.name}</DrawerTitle>
            <DrawerDescription>{currentItem?.description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-2 px-4">
            {navItems.map((item: NavigationItem) => (
              <Link key={item.href} href={item.href} className={`block ${pathname === item.href ? "underline bg-accent" : ""} flex items-center gap-2 py-1`} title={item.description}>
                <FontAwesomeIcon icon={iconMap[item.icon ?? "defaultIcon"]} />
                {item.name} - {item.ja}
              </Link>
            ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
