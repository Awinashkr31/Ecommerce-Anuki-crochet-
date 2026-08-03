"use client";

import React, { useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { Camera, Send, MessageCircle, Star, PenTool, Sparkles, Truck, Users } from 'lucide-react';

// Custom icons based on the screenshot
const processSteps = [
  { id: 1, icon: <MessageCircle size={20} className="text-[#991b1b]" />, title: 'Share Your Idea', desc: 'Tell us what you envision' },
  { id: 2, icon: <PenTool size={20} className="text-[#991b1b]" />, title: 'We Design', desc: 'We sketch and refine the concept' },
  { id: 3, icon: <Sparkles size={20} className="text-[#991b1b]" />, title: 'Handcrafted', desc: 'Expertly crafted by our team' },
  { id: 4, icon: <Truck size={20} className="text-[#991b1b]" />, title: 'Delivery', desc: 'Your unique piece, delivered' }
];

const portfolioImages = [
  "/custom-portfolio/bouquet.webp",
  "/custom-portfolio/spiderman.webp",
  "/custom-portfolio/wedding.webp",
  "/custom-portfolio/pet.webp"
];

const testimonials = [
  {
    rating: 5,
    text: "I requested a custom embroidered denim jacket for my sister's wedding. Sana's team took my rough sketch and turned it into an absolute masterpiece!",
    name: "Sneha P."
  },
  {
    rating: 5,
    text: "Unbelievable attention to detail. The custom hoop art with my parents' portrait was the perfect anniversary gift. They were in tears.",
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
      <section className="relative w-full h-[500px] md:h-[600px]">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <NextImage 
            src="/custom-portfolio/hero.webp" 
            alt="Custom Crochet Background" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 pt-12 pb-32">
          
          <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 flex items-center gap-2">
            <PenTool size={14} /> MADE JUST FOR YOU
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif text-white font-medium mb-4">
            Custom Design Request
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Let's bring your unique vision to life.
          </p>

          <a href="#form-section" className="bg-white text-neutral-900 font-bold px-8 py-3.5 rounded-full hover:bg-neutral-100 transition-colors shadow-lg flex items-center gap-2">
            START DESIGNING <PenTool size={16} />
          </a>
        </div>
      </section>

      {/* Process Steps (Floating) */}
      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-20 mb-8 md:mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pb-4">
          {processSteps.map((step) => (
            <div key={step.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-neutral-100 flex flex-col items-center text-center relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-full flex items-center justify-center mb-3 md:mb-4">
                {step.icon}
              </div>
              <div className="absolute top-4 left-4 md:top-10 md:left-10 w-5 h-5 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-[10px] font-bold text-neutral-500 shadow-sm">
                {step.id}
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">{step.title}</h3>
              <p className="text-xs text-neutral-500 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12 pt-4 md:py-12 text-center">
        <h4 className="text-xs font-bold text-[#991b1b] uppercase tracking-widest mb-3">Our Portfolio</h4>
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 mb-4">Custom Masterpieces</h2>
        <p className="text-neutral-500 max-w-lg mx-auto mb-10 text-sm md:text-base">
          A glimpse into unique items we've hand-crafted for clients.
        </p>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {portfolioImages.map((img, i) => (
            <div key={i} className="aspect-square relative rounded-3xl overflow-hidden shadow-sm">
              <NextImage src={img} alt={`Custom Portfolio ${i+1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 33vw" />
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
          <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-4">Tell Us Your Idea</h2>
          <p className="text-neutral-500 text-sm md:text-base mb-8 max-w-md mx-auto">
            Skip the forms! Simply message us on WhatsApp with your design idea, colors, or reference images, and we'll craft it for you.
          </p>
          
          <button 
            type="button" 
            onClick={handleDirectWhatsApp}
            className="w-full sm:w-auto px-10 bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#20bd5a] transition-transform hover:scale-105 shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-3 text-base tracking-wide mx-auto"
          >
            <MessageCircle size={20} /> CHAT ON WHATSAPP
          </button>
          
          <p className="text-xs text-neutral-400 font-medium mt-6">
            Average response time: &lt; 1 hour
          </p>
        </div>
      </section>

      {/* Client Stories Section */}
      <section className="bg-neutral-50 py-12 mt-4">
        <div className="max-w-4xl mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900">Client Stories</h2>
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

      {/* Floating Sticky WhatsApp Button */}
      <button
        onClick={handleDirectWhatsApp}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 flex items-center justify-center animate-bounce group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
        {/* Tooltip on hover */}
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
          Chat with us!
        </span>
      </button>

    </div>
  );
}
