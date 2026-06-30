import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CustomCursor, ScrollProgressRing } from "@/components/site/animations";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/site/language-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "St. Xavier's Jr./Sr. School, Muzaffarpur | Where Discipline Meets Opportunity",
  description:
    "St. Xavier's Jr./Sr. School, Goshala Road, Muzaffarpur — a premier CBSE co-educational institution since 1976. Day scholar + boarding, Nursery to Class 12, smart classes, holistic development.",
  keywords: [
    "St. Xavier's Muzaffarpur",
    "CBSE school Muzaffarpur",
    "best school in Muzaffarpur",
    "boarding school Bihar",
    "St. Xavier's Jr. Sr. School",
    "Goshala Road school",
    "admission Muzaffarpur",
  ],
  authors: [{ name: "St. Xavier's Jr./Sr. School" }],
  icons: {
    icon: "/school/logo.png",
  },
  openGraph: {
    title: "St. Xavier's Jr./Sr. School, Muzaffarpur",
    description: "Where Discipline Meets Opportunity — CBSE Co-Ed School since 1976",
    siteName: "St. Xavier's Jr./Sr. School",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var k='xavier-theme';var t=localStorage.getItem(k)||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var c=document.documentElement.classList;c.add(d?'dark':'light');c.remove(d?'light':'dark');document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();` }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider defaultTheme="system" storageKey="xavier-theme">
          <LanguageProvider defaultLang="en">
            <CustomCursor />
            <ScrollProgressRing />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
