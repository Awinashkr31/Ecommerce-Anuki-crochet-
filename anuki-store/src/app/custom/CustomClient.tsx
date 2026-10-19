"use client";

import React, { useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { Camera, Send, MessageCircle, Star, PenTool, Sparkles, Truck, Users, Heart, ArrowRight } from 'lucide-react';

// Custom icons based on the process steps
const processSteps = [
  { id: 1, icon: <MessageCircle size={20} className="text-[#991b1b]" />, title: 'Share Your Idea', desc: 'Tell us what you envision' },
  { id: 2, icon: <PenTool size={20} className="text-[#991b1b]" />, title: 'We Design', desc: 'We sketch and refine the concept' },
  { id: 3, icon: <Sparkles size={20} className="text-[#991b1b]" />, title: 'Handcrafted', desc: 'Expertly crafted by our team' },
  { id: 4, icon: <Truck size={20} className="text-[#991b1b]" />, title: 'Delivery', desc: 'Your unique piece, delivered' }
];

const portfolioItems = [
  {
    src: "/custom-portfolio/bouquet.webp",
    alt: "Custom crochet flower bouquet order hand-crafted in India",
    title: "Custom Crochet Flower Bouquet Order",
    tag: "Custom Bouquet"
  },
  {
    src: "/custom-portfolio/spiderman.webp",
    alt: "Custom crochet character plush including Spiderman and crochet Pikachu plush orders in India",
    title: "Custom Crochet Character & Anime Plushies",
    tag: "Character Amigurumi"
  },
  {
    src: "/custom-portfolio/wedding.webp",
    alt: "Bespoke bridal crochet bouquet custom order for Indian wedding",
    title: "Bespoke Bridal Crochet Bouquet",
    tag: "Bridal Keepsake"
  },
  {
    src: "/custom-portfolio/pet.webp",
    alt: "Personalized crochet pet amigurumi portrait custom crochet India",
    title: "Personalized Crochet Pet Amigurumi",
    tag: "Pet Portrait"
  }
];

const testimonials = [
  {
    rating: 5,
    text: "I requested a custom crochet flower bouquet for my sister's wedding. Sana's team took my color scheme and turned it into an absolute masterpiece!",
    name: "Sneha P."
  },
  {
    rating: 5,
    text: "The attention to detail is unbelievable. The personalized crochet plushie set was the perfect anniversary gift. My parents were in tears.",
    name: "Rahul M."
  },
  {
    rating: 5,
    text: "The process was so smooth. They communicated at every step, sent me design mockups, and the final piece was stunning. Pure art.",
    name: "Ananya T."
  }
];

export default function CustomClient() {
  const handleDirectWhatsApp = () => {
    const businessPhone = "918434897767";
    const text = encodeURIComponent("Hi! I would like to request a custom crochet design.");
    window.open(`https://wa.me/${businessPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[520px] md:min-h-[580px] flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <NextImage 
            src="/custom-portfolio/hero.webp" 
            alt="Custom Crochet Orders India Handcrafted" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/55"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 pt-8 pb-14 md:pt-14 md:pb-20">
          
          <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 inline-flex items-center gap-2 shadow-sm">
            <PenTool size={14} /> BESPOKE HANDMADE IN INDIA
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white font-medium mb-3 md:mb-4 leading-tight drop-shadow-md max-w-3xl">
            Custom Crochet Orders India
          </h1>
          
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed drop-shadow-sm">
            Looking for authentic <strong>custom crochet in India</strong>? We turn your unique imagination into handcrafted reality. From custom crochet flower bouquets and personalized amigurumi plushies (cuddly companions, characters & pets) to bespoke anniversary and wedding gifts, our artisans craft each piece with love.
          </p>

          <a 
            href="#form-section" 
            className="bg-white text-neutral-900 font-bold px-8 py-3.5 rounded-full hover:bg-neutral-100 transition-all shadow-xl hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            START YOUR CUSTOM ORDER <PenTool size={16} />
          </a>
        </div>
      </section>

      {/* Process Steps (Floating) */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 md:-mt-12 relative z-20 mb-8 md:mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pb-4">
          {processSteps.map((step) => (
            <div key={step.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-neutral-100 flex flex-col items-center text-center relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-full flex items-center justify-center mb-3 md:mb-4">
                {step.icon}
              </div>
              <div className="absolute top-4 left-4 md:top-10 md:left-10 w-5 h-5 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-[10px] font-bold text-neutral-500 shadow-sm">
                {step.id}
              </div>
              <h2 className="font-bold text-neutral-900 mb-1">{step.title}</h2>
              <p className="text-xs text-neutral-500 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12 pt-4 md:py-12 text-center">
        <p className="text-xs font-bold text-[#991b1b] uppercase tracking-widest mb-3">Our Portfolio</p>
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 mb-4">Custom Crochet Masterpieces</h2>
        <p className="text-neutral-500 max-w-lg mx-auto mb-10 text-sm md:text-base">
          A glimpse into personalized crochet gifts and custom orders we've hand-crafted for clients across India.
        </p>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {portfolioItems.map((item, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden shadow-sm aspect-square bg-neutral-100">
              <NextImage 
                src={item.src} 
                alt={item.alt} 
                title={item.title}
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
                sizes="(max-width: 768px) 50vw, 33vw" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 text-left">
                <div>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full mb-1 inline-block">
                    {item.tag}
                  </span>
                  <p className="text-xs md:text-sm font-semibold text-white drop-shadow-sm leading-tight">
                    {item.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="form-section" className="max-w-2xl mx-auto px-4 pb-8 pt-0 md:py-4">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-neutral-100 text-center">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={32} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-4">Request Your Custom Crochet Gift</h2>
          <p className="text-neutral-500 text-sm md:text-base mb-8 max-w-md mx-auto">
            Simply message us on WhatsApp with your personalized gift idea, color preferences, or reference images for your custom crochet flowers or plushie, and we'll handcraft it for you in India.
          </p>
          
          <button 
            type="button" 
            onClick={handleDirectWhatsApp}
            className="w-full sm:w-auto px-10 bg-[#0d7a6e] text-white font-bold py-4 rounded-xl hover:bg-[#0a6359] transition-transform hover:scale-105 shadow-md shadow-[#0d7a6e]/20 flex items-center justify-center gap-3 text-base tracking-wide mx-auto"
          >
            <MessageCircle size={20} /> CHAT ON WHATSAPP
          </button>
          
          <p className="text-xs text-neutral-500 font-medium mt-6">
            Average response time: &lt; 1 hour · Delivery available all over India
          </p>
        </div>
      </section>

      {/* Client Stories Section */}
      <section className="bg-neutral-50 py-12 mt-4">
        <div className="max-w-4xl mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900">Happy Customer Stories</h2>
        </div>

        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-[#fbbf24]">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="text-[#fbbf24]" />)}
                </div>
                <p className="text-neutral-600 text-sm md:text-base leading-relaxed italic mb-8">
                  "{t.text}"
                </p>
              </div>
              <p className="font-bold text-neutral-900 text-sm">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO & FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-rose max-w-none">
          <h2>How Custom Crochet Orders Work in India</h2>
          <p>
            Ordering a <strong>custom crochet</strong> gift in India with Anuki Crochet is straightforward and personalized. Whether you want a custom crochet bouquet for a wedding anniversary, a personalized amigurumi plushie of your pet or favorite character, or a special customized keepsake, our artisans bring every detail to life using premium yarn.
          </p>
          <ol>
            <li><strong>Design Consultation:</strong> Send us your custom crochet ideas, reference photos, color choices, and dimensions on WhatsApp.</li>
            <li><strong>Quote & Timeline:</strong> We review the requirements and provide an exact quote and crafting timeline (usually 7–14 business days).</li>
            <li><strong>Artisan Crafting:</strong> Our skilled needlework artisans meticulously handcraft your piece with high-grade, durable yarn.</li>
            <li><strong>Pan-India Delivery:</strong> We carefully box and express ship your custom order safely anywhere across India.</li>
          </ol>

          <h3>Frequently Asked Questions About Custom Crochet Orders</h3>
          <div className="space-y-4 not-prose mt-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-2">How long does a custom crochet order take in India?</h4>
              <p className="text-neutral-600 text-sm">Depending on the complexity, custom orders usually take 7 to 14 business days to craft and deliver safely anywhere in India.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-2">Can you recreate a specific character, pet, or plushie?</h4>
              <p className="text-neutral-600 text-sm">
                Yes! We take bespoke custom crochet orders for amigurumi characters, pets, favorite figures, and personalized stuffed toys crafted from your reference photos.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-2">Do you make custom bridal bouquets for weddings?</h4>
              <p className="text-neutral-600 text-sm">Absolutely. We design custom crochet flower bouquets matching your wedding lehenga and color theme that will last a lifetime as a precious keepsake.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-2">How much does custom crochet cost in India?</h4>
              <p className="text-neutral-600 text-sm">Our custom crochet items start from just ₹299 for mini accessories and keychains, with full bouquets and intricate amigurumi plushies typically ranging between ₹699 and ₹2,499.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 text-center">Explore Popular Handcrafted Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/categories/toys" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all group">
            <p className="font-bold text-neutral-900 group-hover:text-rose-600">Crochet Plushies</p>
            <p className="text-xs text-neutral-500">Cuddly amigurumi toys</p>
          </Link>
          <Link href="/custom-crochet-india" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all group">
            <p className="font-bold text-neutral-900 group-hover:text-rose-600">Custom Crochet India</p>
            <p className="text-xs text-neutral-500">Pan-India custom orders</p>
          </Link>
          <Link href="/custom-crochet-bouquet" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all group">
            <p className="font-bold text-neutral-900 group-hover:text-rose-600">Custom Bouquets</p>
            <p className="text-xs text-neutral-500">Forever flowers</p>
          </Link>
          <Link href="/gifts/birthday" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all group">
            <p className="font-bold text-neutral-900 group-hover:text-rose-600">Birthday Gifts</p>
            <p className="text-xs text-neutral-500">Special handmade gifts</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
