import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { StoreHeader } from "@/components/StoreHeader";
import { BottomNav } from "@/components/BottomNav";
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
  metadataBase: new URL('https://anukicrochet.in'),
  title: {
    template: '%s | Anuki Crochet',
    default: 'Handmade Crochet Gifts & Custom Bouquets | Anuki Crochet',
  },
  description: "Discover beautiful, bespoke handcrafted crochet flower bouquets, custom plushies, and unique handmade gifts for every occasion. Shop at Anuki Crochet in India.",
  openGraph: {
    title: 'Handmade Crochet Gifts & Custom Bouquets | Anuki Crochet',
    description: 'Discover beautiful, bespoke handcrafted crochet flower bouquets, custom plushies, and unique handmade gifts for every occasion.',
    url: 'https://anukicrochet.in',
    siteName: 'Anuki Crochet',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Handmade Crochet Gifts & Custom Bouquets | Anuki Crochet',
    description: 'Discover beautiful, bespoke handcrafted crochet flower bouquets and unique handmade gifts.',
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
            <BottomNav />
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
