"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faDesktop,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useSetTheme } from "./theme";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { navigationItems as navItems } from "@/components/config/navigation";
import { iconMap } from "@/components/config/iconMap";
import { nicoMoji } from "@/app/fonts";

export default function Header({ initialTheme }: { initialTheme: string }) {
  const [theme, setTheme] = useState<string>(initialTheme);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    // console.log("theme", theme);
    useSetTheme(theme);
  }, [theme]);

  return (
    <header className="p-2 md:px-10 bg-background z-50 sticky top-0 flex items-center justify-between w-full border-b shadow-sm border-gray-200 dark:border-gray-700">
      <a href="/" className={`text-3xl font-bold ${nicoMoji.className}`}>
        YHOTAMOS
      </a>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <DesktopMenu pathname={pathname} />
        </div>
        <button
          id="switch-theme"
          className="switch-theme px-3 py-1 "
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="テーマ切り替え"
        >
          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
        </button>
        <div className="block md:hidden">
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function DesktopMenu({ pathname }: { pathname: string }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item: any) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink
              className={`flex flex-row items-center gap-1 ${
                pathname === item.href ? "underline bg-accent" : ""
              }`}
              title={item.ja + " - " + item.description}
              href={item.href}
            >
              <FontAwesomeIcon icon={iconMap[item.icon]} />
              {item.name}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const currentItem = navItems.find((item) => pathname === item.href);
  return (
    <div className="flex items-center gap-4">
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline">
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-full">
          <DrawerHeader>
            <DrawerTitle>{currentItem?.name}</DrawerTitle>
            <DrawerDescription>{currentItem?.description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-2 px-4">
            {navItems.map((item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block ${
                  pathname === item.href ? "underline bg-accent" : ""
                } flex items-center gap-2 py-1`}
                title={item.description}
              >
                <FontAwesomeIcon icon={iconMap[item.icon]} />
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
