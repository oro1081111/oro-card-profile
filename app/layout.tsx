import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "周允成 / 奧羅｜AI Product PM × Board Game Designer",
  description:
    "AI 產品 PM、生成式 AI 工程背景、應用數學研究所、創意奧羅桌遊設計工作室。",
  openGraph: {
    title: "周允成 / 奧羅｜AI Product PM × Board Game Designer",
    description:
      "手機專屬互動式個人卡牌介紹頁，呈現 AI、產品、數學與桌遊設計交集。"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
