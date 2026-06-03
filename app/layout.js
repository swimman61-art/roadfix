import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import { LanguageProvider } from "./components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://roadfix.vercel.app"),
  title: {
    default: "RoadFix — فني سيارات متنقل في القاهرة | إصلاح في مكانك",
    template: "%s | RoadFix",
  },
  description:
    "خدمة إصلاح سيارات متنقلة في القاهرة. فني متخصص يجي لموقعك في 15 دقيقة. بطارية، كاوتش، بنزين، كهرباء، ميكانيكا. متاح 24/7.",
  keywords: [
    "إصلاح سيارات القاهرة",
    "فني سيارات متنقل",
    "مساعدة على الطريق",
    "بطارية سيارة القاهرة",
    "كاوتش واقف القاهرة",
    "ميكانيكي متنقل",
    "RoadFix",
    "سطحة سيارات",
    "عطل سيارة",
    "صيانة سيارات القاهرة",
  ],
  authors: [{ name: "RoadFix" }],
  creator: "RoadFix",

  // 🆕 PWA configuration
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RoadFix",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://roadfix.vercel.app",
    siteName: "RoadFix",
    title: "RoadFix — فني سيارات متنقل في القاهرة",
    description:
      "فني متخصص يجي لموقعك في 15 دقيقة. بطارية، كاوتش، بنزين، كهرباء، ميكانيكا. متاح 24/7 في القاهرة.",
    images: [
      {
        url: "/images/night-service.jpg",
        width: 1200,
        height: 630,
        alt: "RoadFix - خدمة إصلاح سيارات متنقلة 24/7",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoadFix — فني سيارات متنقل في القاهرة",
    description: "فني متخصص يجي لموقعك في 15 دقيقة. متاح 24/7.",
    images: ["/images/night-service.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// 🆕 viewport configuration (لو فيه shake على الموبايل)
export const viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white flex flex-col">
        <LanguageProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}