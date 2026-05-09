import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import TopArrowIcon from "@/components/layout/topArrowIcon";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { geistSans, geistMono, notosansjp } from "./fonts";
import { ThemeProvider } from "next-themes";

import { GoogleAnalytics } from "@/components/layout/googleAnalytics";
import { GoogleAdsense } from "@/components/layout/googleAdsense";

export const metadata: Metadata = {
  title: {
    default: "YHOTAMOS",
    template: "%s | YHOTAMOS",
  },
  description: "YHOTAMOS - My Personal Blog and Portfolio and Open Source Projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`bg-secondary dark:bg-background md:text-lg ${notosansjp.variable} ${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GoogleAnalytics />
          <GoogleAdsense />
          <Header />
          {children}
          <TopArrowIcon />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
