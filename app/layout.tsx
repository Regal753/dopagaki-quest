import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "ドパクエ｜脳が逃げる前に、1個だけ倒せ。";
  const description = "やることを雑に投げるだけ。AIがクエストに分解し、XPと報酬で今日を進める日本向け人生RPG。";

  return {
    title,
    description,
    applicationName: "ドパクエ",
    icons: { icon: "/favicon.svg" },
    openGraph: { title, description, type: "website", locale: "ja_JP", url: origin, images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "DOPA QUEST — 脳が逃げる前に、1個だけ倒せ。" }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export const viewport: Viewport = {
  themeColor: "#0c0d12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
