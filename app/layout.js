import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RoadFix",
  description: "Roadside assistance and car service request system",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white flex flex-col">
        <SiteHeader />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-white/10 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-black mb-3">
                  <span className="text-white">Road</span>
                  <span className="text-red-500">Fix</span>
                </h3>
                <p className="text-gray-400 leading-7 text-sm">
                  نظام متكامل لطلب خدمات الأعطال والمساعدة على الطريق،
                  مع تتبع واضح للطلبات ولوحة تحكم للإدارة.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-white">روابط سريعة</h4>
                <div className="flex flex-col gap-2 text-sm">
                  <Link href="/" className="text-gray-400 hover:text-white transition">
                    الرئيسية
                  </Link>
                  <Link
                    href="/request"
                    className="text-gray-400 hover:text-white transition"
                  >
                    اطلب خدمة
                  </Link>
                  <Link
                    href="/track"
                    className="text-gray-400 hover:text-white transition"
                  >
                    تتبع الطلب
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-white transition"
                  >
                    دخول الأدمن
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-white">الخدمات</h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  {[
                    "بطارية",
                    "كاوتش",
                    "بنزين",
                    "كهرباء",
                    "ميكانيكا",
                    "صيانة دورية",
                    "عطل",
                  ].map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
              © 2026 RoadFix. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}