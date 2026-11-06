import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dictionaries } from "../dictionaries";
import "../globals.css";

/* 한국어 루트 레이아웃 ( / ). 영어는 app/(en)/layout.tsx ( /en ) */
export const metadata: Metadata = {
  title: dictionaries.ko.meta.title,
  description: dictionaries.ko.meta.description,
  alternates: { languages: { ko: "/", en: "/en" } },
  // 링크 공유 미리보기(OG 이미지): 동백숲 피크닉 장면 1200×630
  metadataBase: new URL("https://dongbaek-beryl.vercel.app"),
  openGraph: {
    type: "website",
    url: "/",
    siteName: "bLOOM Your Way",
    locale: "ko_KR",
    title: dictionaries.ko.meta.title,
    description: dictionaries.ko.meta.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: dictionaries.ko.picnic.alt }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export default function KoreanLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
