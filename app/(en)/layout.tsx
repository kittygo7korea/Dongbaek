import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dictionaries } from "../dictionaries";
import "../globals.css";

/* 영어 루트 레이아웃 ( /en ). 한국어는 app/(ko)/layout.tsx ( / ) */
export const metadata: Metadata = {
  title: dictionaries.en.meta.title,
  description: dictionaries.en.meta.description,
  alternates: { languages: { ko: "/", en: "/en" } },
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
