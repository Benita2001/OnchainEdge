import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CursorGlow } from "@/components/CursorGlow";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnchainEdge — Holder Intelligence",
  description: "Real signals from holder behavior on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#0d0d0d] text-[#f0f0f0] antialiased`}>
        <CursorGlow />
        <div className="min-h-screen border-t-2 border-[#f5c000]">
          {children}
        </div>
      </body>
    </html>
  );
}
