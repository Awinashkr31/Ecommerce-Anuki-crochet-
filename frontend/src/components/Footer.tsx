"use client";

import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import useSWR from 'swr';
import { apiGet } from '../lib/api';

export function Footer() {
  const { data: categories = [] } = useSWR('/categories', (url: string) => apiGet<any[]>(url));
  const activeCategories = categories.filter((c: any) => c.isActive && !c.parentId);

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & About */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="mb-6 inline-block">
              <img src="/logo.png" alt="Anuki Logo" className="h-12 md:h-16 w-auto object-contain" />
            </Link>
            <p className="text-neutral-600 leading-relaxed mb-8 max-w-sm">
              Beautiful, bespoke handmade items carefully crafted to bring warmth, elegance, and joy to your everyday life.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/anuki_crochet/?utm_source=ig_web_button_share_sheet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-rose-500 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-6">
            <h3 className="font-bold text-neutral-900 text-lg mb-6">Explore</h3>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">All Products</Link></li>
              {activeCategories.slice(0, 4).map((category: any) => (
                <li key={category.id}>
                  <Link href={`/products?category=${category.slug}`} className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/blog" className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">Journal</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="font-bold text-neutral-900 text-lg mb-6">Customer Care</h3>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">Contact Us</Link></li>
              <li><Link href="/policies/shipping-policy" className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">Shipping Policy</Link></li>
              <li><Link href="/policies/returns-and-exchanges" className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/policies/payment-policy" className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">Payment & Security</Link></li>
              <li><Link href="/faq" className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">FAQs</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500 font-medium">
            © {new Date().getFullYear()} Anuki Crochet. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="/policies/privacy-policy" className="hover:text-neutral-900 transition-colors">Privacy Policy</Link>
            <Link href="/policies/terms-of-service" className="hover:text-neutral-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
