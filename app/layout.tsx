import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://regal753.github.io/dopagaki-quest/";
const title = "ドパクエ｜脳が逃げる前に、1個だけ倒せ。";
const description =
  "やることを雑に投げるだけ。内容に応じてクエストへ分解し、XPと報酬で今日を進める日本向け人生RPG。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "ドパクエ",
  icons: { icon: "favicon.svg" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    images: [
      {
        url: "og.png",
        width: 1536,
        height: 1024,
        alt: "DOPA QUEST — 脳が逃げる前に、1個だけ倒せ。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["og.png"],
  },
};

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
