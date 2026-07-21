import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ScrollProvider } from "@/lib/scroll";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://esha-sharma-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Esha Sharma — Master Wordsmith & Brand Voice Architect",
    template: "%s · Esha Sharma",
  },
  description:
    "Esha Sharma is a content writer and copywriter in Melbourne & Kathmandu. Brand voice, conversion copy and long-form narrative that sounds like a person, not a template.",
  keywords: [
    "copywriter",
    "content writer",
    "brand voice",
    "Melbourne copywriter",
    "Kathmandu writer",
    "conversion copy",
  ],
  authors: [{ name: "Esha Sharma" }],
  openGraph: {
    title: "Esha Sharma — Master Wordsmith & Brand Voice Architect",
    description:
      "Brand voice, conversion copy and long-form narrative that sounds like a person, not a template.",
    url: SITE_URL,
    siteName: "Esha Sharma",
    type: "website",
        images: [
          {
            url: "/og.svg",
            width: 1200,
            height: 630,
            alt: "Esha Sharma — Wordsmith",
          },
        ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Esha Sharma — Master Wordsmith",
    description:
      "Brand voice, conversion copy and long-form narrative that sounds human.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} grain`}
    >
      <body>
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
