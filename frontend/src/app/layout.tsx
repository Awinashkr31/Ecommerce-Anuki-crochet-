import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { StoreHeader } from "@/components/StoreHeader";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Handmade Crochet',
    default: 'Handmade Crochet | Custom Bouquets & Gifts',
  },
  description: "Bespoke handcrafted crochet items. Discover beautiful crochet flower bouquets, custom plushies, and handmade gifts.",
  openGraph: {
    title: 'Handmade Crochet',
    description: 'Bespoke handcrafted crochet items.',
    url: 'https://handmadecrochet.com',
    siteName: 'Handmade Crochet',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextTopLoader 
          color="#f43f5e" 
          initialPosition={0.08} 
          crawlSpeed={200} 
          height={3} 
          crawl={true} 
          showSpinner={false} 
          easing="ease" 
          speed={200} 
          shadow="0 0 10px #f43f5e,0 0 5px #f43f5e" 
        />
        <Toaster position="top-center" richColors />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Handmade Crochet",
              "url": "https://handmadecrochet.com",
              "logo": "https://handmadecrochet.com/logo.png",
              "description": "Bespoke handcrafted crochet items, custom flower bouquets, and handmade gifts."
            })
          }}
        />
        <AnalyticsProvider>
          <AuthProvider>
            <StoreHeader />
            <main className="flex-grow pb-16 md:pb-0">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
