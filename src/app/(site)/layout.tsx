import * as React from "react";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CursorGlow } from "@/components/site/CursorGlow";
import { CookieBanner } from "@/components/site/CookieBanner";
import { BackToTop } from "@/components/site/BackToTop";
import { MobileCTA } from "@/components/site/MobileCTA";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`magnence-site ${syne.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <CursorGlow />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieBanner />
      <BackToTop />
      <MobileCTA />
    </div>
  );
}
