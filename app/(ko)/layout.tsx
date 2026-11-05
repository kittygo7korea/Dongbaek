import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dictionaries } from "../dictionaries";
import "../globals.css";

/* 한국어 루트 레이아웃 ( / ). 영어는 app/(en)/layout.tsx ( /en ) */
export const metadata: Metadata = {
  title: dictionaries.ko.meta.title,
  description: dictionaries.ko.meta.description,
  alternates: { languages: { ko: "/", en: "/en" } },
};

export default function KoreanLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
