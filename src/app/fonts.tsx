import {
  Geist,
  Geist_Mono,
  Noto_Sans_JP,
} from "next/font/google";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nicoMoji = localFont({
  src: "../../public/fonts/nicomoji-plus_v2-5.ttf",
  display: "swap",
  fallback: ["sans-serif"],
  variable: "--font-nicomoji",
});

const notosansjp = Noto_Sans_JP({
  variable: "--font-notosansjp",
  weight: "400",
  subsets: ["latin"],
});

export { geistSans, geistMono, nicoMoji, notosansjp };
