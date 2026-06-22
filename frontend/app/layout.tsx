import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
  .trim()
  .replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PointMe — Describe any problem, find the right help nearby",
    template: "%s · PointMe",
  },
  description:
    "Describe any problem in plain language and PointMe matches you to the right real-world professional nearby — then call, message, or get directions instantly.",
  openGraph: {
    title: "PointMe",
    description: "Describe any problem, find the right help nearby.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
