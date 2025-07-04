"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faDesktop } from "@fortawesome/free-solid-svg-icons";
import { useSetTheme } from "./theme";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const navItems: { name: string; href: string }[] = [
  { name: "Products", href: "/products" },
  { name: "Blog", href: "/blog" },
  { name: "Support", href: "/support" },
];

export default function Header({ initialTheme }: { initialTheme: string }) {
  const [theme, setTheme] = useState<string>(initialTheme);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") {
      console.log("theme", theme);
      useSetTheme(theme);
    }
  }, [theme]);

  return (
    <header className="row-start-1 flex items-center justify-between w-full border-b border-gray-200 dark:border-gray-700 p-4">
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
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink
                  asChild
                  className={
                    pathname === item.href ? " underline bg-accent" : ""
                  }
                >
                  <Link href={item.href}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <button
          id="switch-theme"
          className="switch-theme px-3 py-1 "
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="テーマ切り替え"
        >
          {theme === "light" ? (
            <FontAwesomeIcon icon={faMoon} />
          ) : (
            <FontAwesomeIcon icon={faSun} />
          )}
        </button>
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
