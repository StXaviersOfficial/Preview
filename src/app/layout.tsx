import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond, Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { CustomCursor, ScrollProgressRing } from "@/components/site/animations";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/site/language-provider";
import { analyticsScript, gaId } from "@/lib/site/analytics";

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

const notoSansDev = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerifDev = Noto_Serif_Devanagari({
  variable: "--font-noto-serif-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://xavierpreview.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "St. Xavier's Jr./Sr. School, Muzaffarpur | Where Discipline Meets Opportunity",
    template: "%s | St. Xavier's Muzaffarpur",
  },
  description:
    "St. Xavier's Jr./Sr. School, Goshala Road, Muzaffarpur — a premier CBSE co-educational institution since 1976. Day school, Nursery to Class 12, smart classes, holistic development.",
  keywords: [
    "St. Xavier's Muzaffarpur",
    "CBSE school Muzaffarpur",
    "best school in Muzaffarpur",
    "St. Xavier's Jr. Sr. School",
    "Goshala Road school",
    "admission Muzaffarpur",
    "CBSE affiliated school Bihar",
    "Nursery to Class 12 Muzaffarpur",
  ],
  authors: [{ name: "St. Xavier's Jr./Sr. School" }],
  creator: "St. Xavier's Jr./Sr. School",
  publisher: "St. Xavier's Jr./Sr. School",
  icons: {
    icon: "/school/logo.png",
    apple: "/school/logo.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "St. Xavier's Jr./Sr. School, Muzaffarpur",
    description: "Where Discipline Meets Opportunity — CBSE Co-Ed School since 1976. Day school, Nursery to Class 12, smart classes, holistic development.",
    siteName: "St. Xavier's Jr./Sr. School",
    type: "website",
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/school/home.jpg",
        width: 1200,
        height: 630,
        alt: "St. Xavier's Jr./Sr. School, Muzaffarpur — campus view",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "St. Xavier's Jr./Sr. School, Muzaffarpur",
    description: "Where Discipline Meets Opportunity — CBSE Co-Ed School since 1976",
    images: ["/school/home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "education",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf6ec" },
    { media: "(prefers-color-scheme: dark)", color: "#4a1c26" },
  ],
};

// JSON-LD structured data — School schema for Google rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "School",
  name: "St. Xavier's Jr./Sr. School",
  description: "A premier CBSE co-educational institution since 1976, located on Goshala Road, Muzaffarpur, Bihar. Day school offering Nursery to Class 12 education with smart classes, modern labs, swimming pool, sports academy, and holistic development.",
  url: SITE_URL,
  logo: `${SITE_URL}/school/logo.png`,
  image: `${SITE_URL}/school/home.jpg`,
  telephone: "+91-9835061341",
  email: "helpdesk@stxaviers.org",
  foundingDate: "1976",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Goshala Road, Ramna",
    addressLocality: "Muzaffarpur",
    addressRegion: "Bihar",
    postalCode: "842002",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "26.1209",
    longitude: "85.3646",
  },
  affiliation: {
    "@type": "EducationalOrganization",
    name: "Central Board of Secondary Education (CBSE)",
    url: "https://www.cbse.gov.in",
  },
  sameAs: [
    "https://www.instagram.com/stxavierjrsrschool/",
    "https://www.facebook.com/StXaviersSchoolMuzaffarpur",
  ],
  areaServed: "Muzaffarpur, Bihar",
  gradeRange: "Nursery to Class 12",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {analyticsScript && (
          <>
            <script async src={analyticsScript} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}', { send_page_view: true });`,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} ${notoSansDev.variable} ${notoSerifDev.variable} antialiased bg-background text-foreground font-sans`}
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
