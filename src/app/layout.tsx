import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const siteName = "فروشگاه من";
const defaultDescription = "فروشگاه آنلاین با بهترین محصولات و قیمت‌ها. تضمین اصالت، ارسال سریع به سراسر کشور.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myshop.ir";

export const metadata: Metadata = {
  title: {
    default: `${siteName} | فروشگاه آنلاین`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName,
    title: `${siteName} | فروشگاه آنلاین`,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | فروشگاه آنلاین`,
    description: defaultDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
