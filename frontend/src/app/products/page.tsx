"use client";
import useSWR from 'swr';

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard, Product } from "@/components/ProductCard";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { apiGet } from "@/lib/api";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialIsMadeToOrder = searchParams.get("isMadeToOrder") === "true";

  const fetcher = (url: string) => apiGet<Product[]>(url);

  const { data: rawProducts = [], isLoading: loading } = useSWR('/products', fetcher, { revalidateOnFocus: true });
  const products = useMemo(() => rawProducts.filter(p => p.published), [rawProducts]);

  // Filters
  const [search, setSearch] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || "all");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [sort, setSort] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [customizableOnly, setCustomizableOnly] = useState(initialIsMadeToOrder);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category?.name) cats.add(p.category.name.toLowerCase());
    });
    return Array.from(cats);
  }, [products]);

  const colors = useMemo(() => {
    const c = new Set<string>();
    products.forEach(p => p.variants?.forEach((v: any) => v.color && c.add(v.color.toLowerCase())));
    return Array.from(c);
  }, [products]);

  const sizes = useMemo(() => {
    const s = new Set<string>();
    products.forEach(p => p.variants?.forEach((v: any) => v.size && s.add(v.size.toLowerCase())));
    return Array.from(s);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (customizableOnly) {
      result = result.filter(p => p.isMadeToOrder);
    }

    if (inStockOnly) {
      result = result.filter(p => p.isMadeToOrder || p.variants?.some(v => v.stock > 0));
    }

    result = result.filter(p => {
      const price = p.salePrice || p.basePrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (categoryFilter !== "all") {
      result = result.filter(p => p.category?.name?.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (colorFilter !== "all") {
      result = result.filter(p => p.variants?.some((v: any) => v.color?.toLowerCase() === colorFilter));
    }

    if (sizeFilter !== "all") {
      result = result.filter(p => p.variants?.some((v: any) => v.size?.toLowerCase() === sizeFilter));
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.category?.name?.toLowerCase().includes(s));
    }

    if (sort === "price-low") {
      result.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
    } else if (sort === "price-high") {
      result.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
    } else if (sort === "bestselling") {
      result.sort((a, b) => (a.bestseller === b.bestseller ? 0 : a.bestseller ? -1 : 1));
    } else if (sort === "relevance" && search.trim()) {
      const s = search.toLowerCase();
      result.sort((a, b) => {
        const aExact = a.name.toLowerCase() === s ? 1 : 0;
        const bExact = b.name.toLowerCase() === s ? 1 : 0;
        return bExact - aExact;
      });
    }

    return result;
  }, [products, categoryFilter, colorFilter, sizeFilter, search, sort, customizableOnly, inStockOnly, priceRange]);

  // Autocomplete Suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!search.trim()) return [];
    const s = search.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(s))
      .slice(0, 5);
  }, [search, products]);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Shop All</h1>
            <p className="text-neutral-500">Find the perfect handmade piece for you or a loved one.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow"
              />
              
              {/* Autocomplete Dropdown */}
              {showAutocomplete && search.trim() && autocompleteSuggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-neutral-100 shadow-xl rounded-xl overflow-hidden z-50">
                  {autocompleteSuggestions.map(suggestion => (
                    <div 
                      key={suggestion.id}
                      onClick={() => {
                        setSearch(suggestion.name);
                        setShowAutocomplete(false);
                      }}
                      className="px-4 py-3 hover:bg-neutral-50 cursor-pointer flex items-center gap-3 border-b border-neutral-50 last:border-0"
                    >
                      <Search size={14} className="text-neutral-400" />
                      <div>
                        <div className="text-sm font-medium">{suggestion.name}</div>
                        <div className="text-xs text-neutral-400">{suggestion.category?.name || "Product"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center p-2 bg-neutral-100 rounded-full"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* Filters Overlay for Mobile */}
          {showFilters && (
            <div 
              className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            ></div>
          )}

          {/* Sidebar Filters */}
          <aside className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl p-6 transform transition-transform duration-300 ease-in-out lg:static lg:block lg:w-64 lg:bg-transparent lg:p-0 lg:transform-none ${showFilters ? 'translate-y-0 max-h-[85vh] overflow-y-auto' : 'translate-y-full lg:translate-y-0'}`}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                ✕
              </button>
            </div>
            
            <div className="sticky top-28 space-y-8">
              <div>
                <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-neutral-500">Categories</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category"
                      checked={categoryFilter === "all"}
                      onChange={() => setCategoryFilter("all")}
                      className="text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium group-hover:text-rose-600 transition-colors">All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={categoryFilter === cat}
                        onChange={() => setCategoryFilter(cat)}
                        className="text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium group-hover:text-rose-600 transition-colors capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-neutral-500">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-full border border-neutral-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-500 outline-none" />
                  <span className="text-neutral-400">-</span>
                  <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full border border-neutral-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-500 outline-none" />
                </div>
              </div>

              {colors.length > 0 && (
                <div>
                  <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-neutral-500">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setColorFilter("all")}
                      className={`px-3 py-1 text-xs rounded-full border ${colorFilter === "all" ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"}`}
                    >
                      All
                    </button>
                    {colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setColorFilter(color)}
                        className={`px-3 py-1 text-xs rounded-full border capitalize ${colorFilter === color ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div>
                  <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-neutral-500">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSizeFilter("all")}
                      className={`px-3 py-1 text-xs rounded-full border ${sizeFilter === "all" ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"}`}
                    >
                      All
                    </button>
                    {sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSizeFilter(size)}
                        className={`px-3 py-1 text-xs rounded-full border uppercase ${sizeFilter === size ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-neutral-500">Availability</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="text-rose-600 focus:ring-rose-500 rounded"
                    />
                    <span className="text-sm font-medium group-hover:text-rose-600 transition-colors">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={customizableOnly}
                      onChange={(e) => setCustomizableOnly(e.target.checked)}
                      className="text-rose-600 focus:ring-rose-500 rounded"
                    />
                    <span className="text-sm font-medium group-hover:text-rose-600 transition-colors">Customizable Only</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-neutral-500">Sort By</h3>
                <div className="relative">
                  <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full appearance-none bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="bestselling">Bestselling</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>
              
              <div className="lg:hidden mt-8 pt-4 border-t border-neutral-100">
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-neutral-900 text-white py-3 rounded-xl font-bold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse flex flex-col gap-3">
                    <div className="bg-neutral-100 aspect-[4/5] rounded-2xl w-full"></div>
                    <div className="bg-neutral-100 h-4 w-1/3 rounded"></div>
                    <div className="bg-neutral-100 h-5 w-3/4 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-neutral-50 rounded-2xl">
                <h2 className="text-xl font-bold mb-2">No products found</h2>
                <p className="text-neutral-500">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {
                    setSearch(""); 
                    setCategoryFilter("all");
                    setInStockOnly(false);
                    setCustomizableOnly(false);
                    setPriceRange([0, 10000]);
                  }}
                  className="mt-6 text-rose-600 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
