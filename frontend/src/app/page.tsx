"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ProductCard, Product } from "@/components/ProductCard";
import { apiGet } from "@/lib/api";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Fetch products and categories in parallel
    Promise.all([
      apiGet<Product[]>("/products"),
      apiGet<any[]>("/categories")
    ])
      .then(([productsData, categoriesData]) => {
        const published = (productsData || []).filter((p) => p.published);
        setFeaturedProducts(published.slice(0, 4));
        setCategories(categoriesData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch homepage data", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-rose-200">
      <main>
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image (Using a placeholder, replace with real crochet hero) */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=2000" 
              alt="Crochet background"
              fill
              priority
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center px-6 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-neutral-900">
                Handmade with <span className="text-rose-600">Love.</span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                Premium crochet bouquets, amigurumi plushies, and bespoke gifts crafted to order.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/products" className="w-full sm:w-auto bg-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-rose-700 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2">
                  Shop the Collection <ArrowRight size={20} />
                </Link>
                <Link href="/products?isMadeToOrder=true" className="w-full sm:w-auto bg-white text-neutral-900 border border-neutral-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center justify-center">
                  Custom Orders
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="py-24 bg-neutral-50 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
              <p className="text-neutral-500 max-w-xl mx-auto">Explore our wide range of handcrafted items, made for every occasion.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((cat) => (
                <Link href={`/products?category=${cat.slug}`} key={cat.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-200">
                  <Image src={cat.bannerUrl || "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=500&fit=crop"} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products (Latest Additions) */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Additions</h2>
                <p className="text-neutral-500">Fresh off the hook and ready for a new home.</p>
              </motion.div>
              <Link href="/products" className="hidden sm:flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse flex flex-col gap-3">
                    <div className="bg-neutral-200 aspect-[4/5] rounded-2xl w-full"></div>
                    <div className="bg-neutral-200 h-4 w-1/3 rounded"></div>
                    <div className="bg-neutral-200 h-5 w-3/4 rounded"></div>
                    <div className="bg-neutral-200 h-6 w-1/4 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            <div className="mt-12 text-center sm:hidden">
              <Link href="/products" className="inline-flex items-center gap-2 text-neutral-900 border border-neutral-200 px-6 py-3 rounded-full font-semibold hover:bg-neutral-50 transition-colors">
                View All Products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-24 bg-rose-50/50 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Bestsellers</h2>
                <p className="text-neutral-500">The crowd favorites. Handcrafted perfection loved by everyone.</p>
              </div>
              <Link href="/products?sort=bestselling" className="hidden sm:flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse flex flex-col gap-3">
                    <div className="bg-neutral-200 aspect-[4/5] rounded-2xl w-full"></div>
                    <div className="bg-neutral-200 h-4 w-1/3 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.slice().reverse().map((product, index) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Trust Indicators / Value Props */}
        <section className="py-24 bg-neutral-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🧶</span>
                </div>
                <h3 className="text-xl font-bold mb-3">100% Handmade</h3>
                <p className="text-neutral-400">Every single stitch is crafted by hand with premium, non-toxic yarn.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Bespoke Customization</h3>
                <p className="text-neutral-400">Want a different color? Adding a name? We build exactly what you envision.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Ready to Gift</h3>
                <p className="text-neutral-400">Premium unboxing experience with personalized gift notes included.</p>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Personalized Gifts Section */}
        <section className="py-24 bg-rose-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-3xl md:text-5xl font-black mb-6 text-neutral-900">Make it <span className="text-rose-600">Yours.</span></h2>
                  <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                    Looking for a specific color palette? Want to add a name tag or a special accessory to a plushie? 
                    Our bespoke service lets you co-create the perfect handmade gift.
                  </p>
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 font-medium"><span className="text-rose-600">✓</span> Choose custom yarn colors</li>
                    <li className="flex items-center gap-3 font-medium"><span className="text-rose-600">✓</span> Add embroidered names or initials</li>
                    <li className="flex items-center gap-3 font-medium"><span className="text-rose-600">✓</span> Build-your-own bouquet combinations</li>
                  </ul>
                  <Link href="/products?isMadeToOrder=true" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-colors shadow-lg">
                    Start a Custom Order <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800" 
                  alt="Custom crochet process"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Limited Edition */}
        <section className="py-24 bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Limited Edition Drop</h2>
            <p className="text-neutral-500 mb-10 max-w-xl mx-auto">Exclusive seasonal designs available only while supplies last.</p>
            <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-left gap-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="z-10">
                <span className="bg-rose-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-4 inline-block">Dropping Now</span>
                <h3 className="text-3xl font-bold mb-4">The Autumn Harvest Collection</h3>
                <p className="text-neutral-400 mb-6 max-w-md">Cozy pumpkins, maple leaf coasters, and warm-toned amigurumi perfect for the season.</p>
                <div className="flex gap-4 items-center">
                  <div className="text-center bg-white/10 rounded-lg p-3 min-w-[70px]">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-neutral-400">Hours</div>
                  </div>
                  <div className="text-xl font-bold">:</div>
                  <div className="text-center bg-white/10 rounded-lg p-3 min-w-[70px]">
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs text-neutral-400">Mins</div>
                  </div>
                </div>
              </div>
              <div className="z-10 w-full md:w-auto">
                <Link href="/products?collection=autumn" className="block w-full text-center bg-white text-neutral-900 px-8 py-4 rounded-full font-bold hover:bg-neutral-100 transition-colors">
                  Shop the Drop
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Loved by Crafters & Gifters</h2>
              <p className="text-neutral-500">Don't just take our word for it.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100">
                  <div className="flex text-amber-400 mb-4">
                    {"★★★★★"}
                  </div>
                  <p className="text-neutral-700 italic mb-6">"Absolutely stunning work! The custom bouquet I ordered for my mom's birthday arrived in perfect condition and she cried when she saw it."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">
                      S
                    </div>
                    <div>
                      <div className="font-bold text-sm">Sarah M.</div>
                      <div className="text-xs text-neutral-500">Verified Buyer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Feed */}
        <section className="py-24 bg-neutral-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Follow Our Journey</h2>
            <p className="text-neutral-400">Join our community on Instagram <a href="#" className="text-rose-400 hover:text-rose-300">@HandmadeCrochet</a></p>
          </div>
          
          {/* A simple horizontal scrolling masonry-style grid simulation */}
          <div className="flex flex-nowrap gap-4 px-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
            {[
              "https://images.unsplash.com/photo-1628189872195-2fc49008bc09?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1590483864506-6962325c3dc5?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1626021673894-386086f68cce?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1601058223628-98eefc8939c8?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1598282928509-000c4068593a?w=400&h=400&fit=crop",
            ].map((img, i) => (
              <div key={i} className="snap-center min-w-[280px] sm:min-w-[320px] aspect-square relative rounded-2xl overflow-hidden group">
                <Image src={img} alt="Instagram post" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    View on Instagram
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter & FAQ */}
        <section className="py-24 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm border border-neutral-100 mb-16">
              <h2 className="text-2xl font-bold mb-3">Join our community</h2>
              <p className="text-neutral-500 mb-8 max-w-md mx-auto">Get early access to limited drops, exclusive discounts, and behind-the-scenes looks.</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" className="flex-1 border border-neutral-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500" required />
                <button type="submit" className="bg-neutral-900 text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "How long do custom orders take?", a: "Most custom pieces take 5-7 business days to create before shipping. We'll provide a specific estimate at checkout based on current queue volume." },
                  { q: "Can I wash the amigurumi plushies?", a: "Yes! We recommend gentle spot cleaning or hand washing in cold water with mild detergent. Do not tumble dry." },
                  { q: "Do you ship internationally?", a: "Currently, we ship all across India. We are working on adding international shipping soon!" }
                ].map((faq, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 cursor-pointer hover:border-neutral-200 transition-colors">
                    <h3 className="font-bold text-neutral-900 mb-2">{faq.q}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-neutral-50 py-12 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-neutral-500">
          <p>© 2026 Crochet Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
