import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Betah | Employee Attrition & Retention AI Advisor",
  description: "Platform AI Preskriptif untuk Memprediksi & Mencegah Attrition Karyawan",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/logo.ico", type: "image/x-icon" },
      { url: "/logo.webp", type: "image/webp" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} min-h-screen font-sans antialiased bg-[#F8FAFC] text-[#0F172A]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
