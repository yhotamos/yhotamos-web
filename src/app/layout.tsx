import type { Metadata } from "next";
import "./globals.css";
import { Theme } from "@/components/layout/theme";
import "@fortawesome/fontawesome-svg-core/styles.css";
import TopArrowIcon from "@/components/layout/topArrowIcon";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { geistSans, geistMono, notosansjp } from "./fonts";

import { GoogleAnalytics } from "@/components/layout/googleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "YHOTAMOS",
    template: "%s | YHOTAMOS",
  },
  description:
    "YHOTAMOS - My Personal Blog and Portfolio and Open Source Projects",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await Theme();
  return (
    <html lang="ja" className={theme}>
      <body
        className={`bg-secondary dark:bg-background md:text-lg ${notosansjp.variable} ${geistSans.variable} ${geistMono.variable}  min-h-screen antialiased font-(family-name:--font-nicomoji)`}
      >
        <GoogleAnalytics />
        <Header initialTheme={theme} />
        {children}
        <TopArrowIcon />
        <Footer />
      </body>
    </html>
  );
}

