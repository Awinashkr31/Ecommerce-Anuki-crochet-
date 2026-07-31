"use client";

import Link from 'next/link';
import { Mail, MapPin, ShieldCheck } from 'lucide-react';
import useSWR from 'swr';
import { apiGet } from '../lib/api';

export function Footer() {
  const { data: categories = [] } = useSWR('/categories', (url: string) => apiGet<any[]>(url));
  const activeCategories = categories.filter((c: any) => c.isActive && !c.parentId);

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      {/* Trust Badge Strip */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs md:text-sm text-neutral-600 font-medium">
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" /> SSL Secured
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
            100% Handmade in India
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            Secure Razorpay Checkout
          </span>
        </div>
      </div>

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
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/anuki_crochet/?utm_source=ig_web_button_share_sheet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-rose-500 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a 
                href="https://pinterest.com/anukicrochet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                aria-label="Pinterest"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a 
                href="https://facebook.com/anukicrochet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
              <li><Link href="/about" className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">About Us</Link></li>
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
