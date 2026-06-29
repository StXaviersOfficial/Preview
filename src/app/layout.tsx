import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CustomCursor, ScrollProgressRing } from "@/components/site/animations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} antialiased bg-background text-foreground font-sans`}
      >
        <CustomCursor />
        <ScrollProgressRing />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
