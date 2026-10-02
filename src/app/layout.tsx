import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/providers/StoreProvider";
import AppShell from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "NexusFeed | Personalized Content Dashboard",
  description:
    "A modern, responsive personalized content dashboard with multi-source news, movies, social streams, drag-and-drop feed customization, and real-time preferences.",
  keywords: [
    "Personalized Dashboard",
    "News",
    "Movies",
    "Social Feed",
    "Next.js",
    "Redux Toolkit",
    "dnd-kit",
  ],
  authors: [{ name: "SDE Intern" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
