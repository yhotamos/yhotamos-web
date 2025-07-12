"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, use } from "react";
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

export default function Header({ initialTheme }: { initialTheme: string }) {
  const [theme, setTheme] = useState<string>(initialTheme);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    console.log("theme", theme);
    useSetTheme(theme);
  }, [theme]);

  return (
    <header className="bg-background z-50 sticky top-0 flex items-center justify-between w-full border-b shadow-sm border-gray-200 dark:border-gray-700 p-2">
      <a href="/">
        <Image
          className={theme === "dark" ? "dark:invert" : ""}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={24}
          priority
        />
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
        {/* <div className="relative z-0 inline-grid grid-cols-3 gap-0.5 rounded-full bg-gray-950/5 p-0.75 text-gray-950 dark:bg-white/10 dark:text-white">
          <span
            className="rounded-full p-1 *:size-6 data-checked:bg-white data-checked:ring data-checked:inset-ring data-checked:ring-gray-950/10 data-checked:inset-ring-white/10 sm:p-0 dark:data-checked:bg-gray-700 dark:data-checked:text-white dark:data-checked:ring-transparent"
            aria-label="System theme"
            id="system-theme"
            role="radio"
            aria-checked="false"
          >
            <FontAwesomeIcon icon={faDesktop} />
          </span>
          <span
            className="rounded-full p-1 *:size-6 data-checked:bg-white data-checked:ring data-checked:inset-ring data-checked:ring-gray-950/10 data-checked:inset-ring-white/10 sm:p-0 dark:data-checked:bg-gray-700 dark:data-checked:text-white dark:data-checked:ring-transparent"
            aria-label="Light theme"
            id="light-theme"
            role="radio"
            aria-checked="true"
            data-checked
          >
            <FontAwesomeIcon icon={faSun} />
          </span>
          <span
            className="rounded-full p-1 *:size-6 data-checked:bg-white data-checked:ring data-checked:inset-ring data-checked:ring-gray-950/10 data-checked:inset-ring-white/10 sm:p-0 dark:data-checked:bg-gray-700 dark:data-checked:text-white dark:data-checked:ring-transparent"
            aria-label="Dark theme"
            id="dark-theme"
            role="radio"
            aria-checked="false"
          >
            <FontAwesomeIcon icon={faMoon} />
          </span>
        </div> */}
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
