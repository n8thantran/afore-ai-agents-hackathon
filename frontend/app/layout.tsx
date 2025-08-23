import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const uberMove = localFont({
  src: [
    { path: "../public/fonts/uber-move/UberMoveMedium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/uber-move/UberMoveBold.otf", weight: "700", style: "normal" }
  ],
  variable: "--font-uber-move",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpsPilot - Zero Configuration Deployment",
  description: "Deploy your projects with zero configuration using OpsPilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${uberMove.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
