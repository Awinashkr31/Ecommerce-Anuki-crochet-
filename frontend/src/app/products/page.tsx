"use client";
import useSWR from 'swr';
import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, Loader2, ChevronRight } from "lucide-react";
import Link from 'next/link';

import { apiGet } from "../../lib/api";
import { ProductCard, Product } from "../../components/ProductCard";
import FilterSidebar from "./components/FilterSidebar";
import MobileFilterDrawer from "./components/MobileFilterDrawer";
import EmptyState from "./components/EmptyState";
import SortDropdown from "./components/SortDropdown";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category");
  const initialIsMadeToOrder = searchParams?.get("isMadeToOrder") === "true";

  const fetcher = (url: string) => apiGet<Product[]>(url);
  const { data: rawProducts = [], isLoading: loading } = useSWR('/products', fetcher, { revalidateOnFocus: true });
  
  const products = useMemo(() => rawProducts.filter(p => p.status === 'PUBLISHED'), [rawProducts]);

  // Filters State
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || "all");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [sort, setSort] = useState("relevance");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [customizableOnly, setCustomizableOnly] = useState(initialIsMadeToOrder);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Dynamic filter lists based on available products
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category?.name?.toLowerCase()).filter(Boolean))), [products]) as string[];
  const colors = useMemo(() => Array.from(new Set(products.flatMap(p => p.variants?.map(v => v.color?.toLowerCase())).filter(Boolean))), [products]) as string[];
  const sizes = useMemo(() => Array.from(new Set(products.flatMap(p => p.variants?.map(v => v.size?.toLowerCase())).filter(Boolean))), [products]) as string[];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (customizableOnly) result = result.filter(p => p.isMadeToOrder);
    if (inStockOnly) result = result.filter(p => p.isMadeToOrder || p.variants?.some(v => v.stock > 0));
    if (categoryFilter !== "all") result = result.filter(p => p.category?.name?.toLowerCase() === categoryFilter.toLowerCase());
    if (colorFilter !== "all") result = result.filter(p => p.variants?.some(v => v.color?.toLowerCase() === colorFilter));
    if (sizeFilter !== "all") result = result.filter(p => p.variants?.some(v => v.size?.toLowerCase() === sizeFilter));
    
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.category?.name?.toLowerCase().includes(s));
    }

    if (sort === "price-low") result.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
    else if (sort === "price-high") result.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
    else if (sort === "bestselling") result.sort((a, b) => (a.bestseller === b.bestseller ? 0 : a.bestseller ? -1 : 1));
    else if (sort === "newest") result.sort((a, b) => (b.id > a.id ? 1 : -1)); // Mocking newest with ID string compare

    return result;
  }, [products, customizableOnly, inStockOnly, categoryFilter, colorFilter, sizeFilter, search, sort]);

  const handleResetFilters = () => {
    setCategoryFilter("all");
    setColorFilter("all");
    setSizeFilter("all");
    setInStockOnly(false);
    setCustomizableOnly(false);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-neutral-50 border-b border-neutral-100 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-4 tracking-tight">Shop Collection</h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Discover beautifully handcrafted crochet creations made with love, perfect for gifting or bringing warmth to your home.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Sticky Utility Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sticky top-[72px] bg-white/90 backdrop-blur-md z-40 py-4 border-b border-neutral-100">
          
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-bold shadow-sm"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <span className="text-sm font-semibold text-neutral-500 whitespace-nowrap">
              {filteredProducts.length} Product{filteredProducts.length !== 1 && 's'}
            </span>
            <SortDropdown sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar 
              categories={categories}
              colors={colors}
              sizes={sizes}
              categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
              colorFilter={colorFilter} setColorFilter={setColorFilter}
              sizeFilter={sizeFilter} setSizeFilter={setSizeFilter}
              inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
              customizableOnly={customizableOnly} setCustomizableOnly={setCustomizableOnly}
            />
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                <Loader2 size={32} className="animate-spin text-rose-500" />
                <p className="text-neutral-500 font-medium">Loading collection...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={handleResetFilters} />
            )}
          </div>
        </div>

      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer 
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        categories={categories}
        colors={colors}
        sizes={sizes}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        colorFilter={colorFilter} setColorFilter={setColorFilter}
        sizeFilter={sizeFilter} setSizeFilter={setSizeFilter}
        inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
        customizableOnly={customizableOnly} setCustomizableOnly={setCustomizableOnly}
        resultCount={filteredProducts.length}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
