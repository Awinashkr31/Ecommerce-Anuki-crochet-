"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck, Heart, Share2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { apiGet } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [customizationText, setCustomizationText] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    apiGet<any>(`/products/slug/${params.slug}`)
      .then(data => {
        if (data && data.published) {
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0].id);
          }
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-24 flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-rose-600 hover:underline">Return to shop</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [{ url: "https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=800", altText: "Placeholder" }];
  const currentVariant = product.variants?.find((v: any) => v.id === selectedVariant);
  const price = currentVariant ? currentVariant.price : (product.salePrice || product.basePrice);

  const { addItem } = useCartStore();
  
  const handleAddToCart = () => {
    const item = {
      id: `${product.id}-${selectedVariant || 'default'}-${customizationText}`,
      productId: product.id,
      variantId: selectedVariant || product.id, // Fallback if no variant
      name: product.name,
      price: price,
      quantity: quantity,
      image: images[0]?.url,
      customization: customizationText + (giftWrap ? ` (Gift Wrap: ${giftMessage})` : "")
    };
    
    addItem(item);
    // You could also add a toast notification here
    alert("Added to cart!");
  };

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      // Mocking pincode check
      setDeliveryEstimate(`Delivery by ${new Date(Date.now() + (product.processingDays + 4) * 86400000).toLocaleDateString()}`);
    } else {
      setDeliveryEstimate("Invalid Pincode");
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-rose-200">
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": product.name,
              "image": images.map((i: any) => i.url),
              "description": product.shortDesc || "Handcrafted crochet item.",
              "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": price,
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Handmade Crochet"
                }
              }
            })
          }}
        />
      )}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors font-medium">
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="flex md:flex-col gap-4 overflow-x-auto snap-x snap-mandatory md:overflow-visible no-scrollbar pb-4 md:pb-0 md:w-24 flex-shrink-0">
              {images.map((img: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`snap-center relative w-20 md:w-full aspect-[4/5] rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-rose-500 ring-4 ring-rose-100' : 'border-transparent hover:opacity-80'}`}
                >
                  <Image 
                    src={img.url} 
                    alt={img.altText || ""} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 96px"
                  />
                </button>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeImage}
              className={`flex-1 aspect-[4/5] bg-neutral-100 rounded-3xl overflow-hidden relative cursor-zoom-in ${isZoomed ? 'cursor-zoom-out' : ''}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {product.isMadeToOrder && (
                <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-sm shadow-sm">
                  Made to Order
                </div>
              )}
              <Image 
                src={images[activeImage]?.url} 
                alt={images[activeImage]?.altText || product.name} 
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover transition-transform duration-500 origin-center ${isZoomed ? 'scale-150' : 'scale-100'}`}
              />
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-sm text-rose-600 font-bold tracking-wider uppercase mb-2">
              {product.category?.name || "Handmade"}
            </div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{product.name}</h1>
              <div className="flex gap-2 shrink-0 pt-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-rose-100 text-neutral-500 hover:text-rose-600 transition-colors">
                  <Heart size={20} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold">₹{price}</span>
              {product.salePrice && !currentVariant && (
                <span className="text-xl text-neutral-400 line-through">₹{product.basePrice}</span>
              )}
            </div>

            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              {product.shortDesc || "Beautifully handcrafted with premium yarn. Perfect for gifting or keeping."}
            </p>

            <hr className="border-neutral-100 mb-8" />

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Select Option</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`px-6 py-3 rounded-xl font-medium border-2 transition-all ${
                        selectedVariant === v.id 
                          ? 'border-neutral-900 bg-neutral-900 text-white' 
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {v.color || v.size || v.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization & Gift Wrap */}
            <div className="mb-8 space-y-4">
              {product.customizationOptions && product.customizationOptions.length > 0 && (
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    Personalize Your Gift
                  </h3>
                  <p className="text-sm text-neutral-500 mb-4">Add a custom name, short message, or special request.</p>
                  <textarea 
                    value={customizationText}
                    onChange={(e) => setCustomizationText(e.target.value)}
                    placeholder="e.g., Please add 'Happy Birthday Sarah' on the tag"
                    className="w-full bg-white border border-neutral-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[100px]"
                  ></textarea>
                </div>
              )}
              
              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500" />
                  <div>
                    <span className="font-bold block text-sm">Add Gift Wrapping (+₹100)</span>
                    <span className="text-xs text-neutral-500">Premium box and ribbon</span>
                  </div>
                </label>
                {giftWrap && (
                  <textarea 
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Gift message (optional)"
                    className="w-full bg-white border border-neutral-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[80px]"
                  ></textarea>
                )}
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center justify-between border-2 border-neutral-200 rounded-2xl px-2 h-14 sm:w-32 flex-shrink-0 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors rounded-xl hover:bg-neutral-50"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors rounded-xl hover:bg-neutral-50"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-rose-600 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-3 hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300"
              >
                <ShoppingBag size={20} />
                Add to Cart — ₹{price * quantity}
              </button>
            </div>

            {/* Delivery Estimates */}
            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-100 flex flex-col gap-4">
              <div className="flex gap-4">
                <Truck className="flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Handmade to Order</h4>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    Please allow <strong className="font-black">{product.processingDays} days to craft</strong> this item before it ships. 
                    Standard transit takes 3-5 business days.
                  </p>
                </div>
              </div>
              
              <div className="mt-2 pt-4 border-t border-emerald-200/50">
                <h4 className="font-bold mb-2 text-sm">Check Delivery Estimate</h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit Pincode" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <button onClick={handlePincodeCheck} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors">Check</button>
                </div>
                {deliveryEstimate && (
                  <p className={`mt-2 text-sm font-bold ${deliveryEstimate === "Invalid Pincode" ? "text-rose-600" : "text-emerald-700"}`}>
                    {deliveryEstimate}
                  </p>
                )}
              </div>
            </div>

            {/* Full Description Accordion (Mocked as simple text for now) */}
            {product.fullDesc && (
              <div className="mt-12 pt-12 border-t border-neutral-100 mb-24 md:mb-0">
                <h2 className="text-xl font-bold mb-4">Product Details</h2>
                <div className="prose prose-neutral">
                  <p>{product.fullDesc}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Frequently Bought Together / Related Products */}
        <div className="mt-24 pt-12 border-t border-neutral-100">
          <h2 className="text-2xl font-bold mb-8">You might also like</h2>
          <div className="flex overflow-x-auto snap-x hide-scrollbar gap-6 pb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="snap-center min-w-[280px] sm:min-w-[320px] aspect-[4/5] relative rounded-2xl overflow-hidden bg-neutral-100 group flex-shrink-0 cursor-pointer">
                <Image src="https://images.unsplash.com/photo-1598282928509-000c4068593a?auto=format&fit=crop&q=80&w=400" alt="Related" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <span className="text-white font-bold text-lg">Crochet Keychain</span>
                  <span className="text-rose-200 font-medium">₹250</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-24 pt-12 border-t border-neutral-100 mb-24 md:mb-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <span className="font-bold">5.0</span>
              <span className="text-neutral-500 text-sm">(12 reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-neutral-50 rounded-3xl p-6 border border-neutral-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-bold text-sm">Ananya K.</div>
                    <div className="text-xs text-neutral-500">Verified Buyer • 2 weeks ago</div>
                  </div>
                </div>
                <div className="flex text-amber-400 mb-3">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                  "Absolutely love it! The quality is amazing, and the custom colors turned out exactly as I requested. Highly recommended for gifting."
                </p>
                {/* Review Photo Simulation */}
                <div className="flex gap-2">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer hover:opacity-80">
                    <Image src="https://images.unsplash.com/photo-1590483864506-6962325c3dc5?auto=format&fit=crop&q=80&w=200" alt="Review photo" fill className="object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Sticky Add to Cart */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-neutral-200 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-rose-600 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-3 hover:bg-rose-700 transition-all shadow-lg"
        >
          <ShoppingBag size={20} />
          Add to Cart — ₹{price * quantity}
        </button>
      </div>
    </div>
  );
}
