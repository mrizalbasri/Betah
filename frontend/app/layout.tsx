import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingAiChat } from "@/components/chat/FloatingAiChat";
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
  title: "Betah — Employee Attrition Advisor",
  description: "Dashboard prediksi risiko attrition karyawan untuk HR Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} flex min-h-screen font-sans antialiased bg-[#F8FAFC] text-[#0F172A]`}
      >
        <Providers>
          <div className="flex w-full min-h-screen">
            <Sidebar />
            <main className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC]">{children}</main>
            <FloatingAiChat />
          </div>
        </Providers>
      </body>
    </html>
  );
}
