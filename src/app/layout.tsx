import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme } from "@/components/layout/theme";
import "@fortawesome/fontawesome-svg-core/styles.css";
import TopArrowIcon from "@/components/layout/topArrowIcon";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="jp" className={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  min-h-screen antialiased font-(family-name:--font-geist-sans)`}
      >
        <Header initialTheme={theme} />
        {children}
        <TopArrowIcon />
        <Footer />
      </body>
    </html>
  );
}
