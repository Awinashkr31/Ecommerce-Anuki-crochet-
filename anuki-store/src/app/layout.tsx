import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { StoreHeader } from "@/components/StoreHeader";
import { BottomNav } from "@/components/BottomNav";
import { SWRProvider } from "@/components/SWRProvider";
import { WebVitals } from "@/components/WebVitals";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { prisma } from '@/lib/prisma';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global configuration that is needed on every page
  const [categories, settingsEntries] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, parentId: true, isActive: true },
    }),
    prisma.storeSettings.findMany({
      where: {
        key: {
          in: [
            'min_order_value', 'free_delivery_threshold', 'delivery_charge', 'cod_extra_charge', 'cod_payment_status',
            'instagram_handle', 'instagram_reel_1', 'instagram_reel_2', 'instagram_reel_3', 'instagram_reel_4'
          ]
        }
      }
    })
  ]);

  const settingsMap = settingsEntries.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const fallback = {
    '/categories': categories,
    '/settings/public': settingsMap
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://wzhxuzxfoayjzrhufyxw.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://wzhxuzxfoayjzrhufyxw.supabase.co" />
        <link rel="preconnect" href="https://sdk.cashfree.com" />
        <link rel="dns-prefetch" href="https://sdk.cashfree.com" />
        <link rel="preconnect" href="https://api.cashfree.com" />
        <link rel="dns-prefetch" href="https://api.cashfree.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f43f5e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
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
        <WebVitals />
        <AnalyticsProvider>
          <SWRProvider fallback={fallback}>
            <AuthProvider>
              <StoreHeader />
              <main className="flex-grow pb-16 md:pb-0">
                {children}
              </main>
              <BottomNav />
            </AuthProvider>
          </SWRProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
