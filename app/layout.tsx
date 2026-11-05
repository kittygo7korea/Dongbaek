import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "동백마을 × A2O Lite | bLOOM Your Way",
  description: "꽃님이와 블룸이를 따라 동백마을을 산책하고, 동백숲에서 피어난 콜라보 굿즈를 만나보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="ko"><body>{children}</body></html>;
}
