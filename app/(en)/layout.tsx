import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dictionaries } from "../dictionaries";
import "../globals.css";

/* 영어 루트 레이아웃 ( /en ). 한국어는 app/(ko)/layout.tsx ( / ) */
export const metadata: Metadata = {
  title: dictionaries.en.meta.title,
  description: dictionaries.en.meta.description,
  alternates: { languages: { ko: "/", en: "/en" } },
  // Link-share preview (OG image): camellia forest picnic scene, 1200×630
  metadataBase: new URL("https://dongbaek-beryl.vercel.app"),
  openGraph: {
    type: "website",
    url: "/en",
    siteName: "bLOOM Your Way",
    locale: "en_US",
    title: dictionaries.en.meta.title,
    description: dictionaries.en.meta.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: dictionaries.en.picnic.alt }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
