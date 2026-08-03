"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { expandProductsByColor } from '../../utils/productUtils';

import { ProductCard, Product } from "../../components/ProductCard";
import FilterSidebar from "./components/FilterSidebar";
import MobileFilterDrawer from "./components/MobileFilterDrawer";
import SortDropdown from "./components/SortDropdown";

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category");
  const initialIsMadeToOrder = searchParams?.get("isMadeToOrder") === "true";

  const products = useMemo(() => expandProductsByColor(initialProducts), [initialProducts]);

  // Filters State
  const initialSearch = searchParams?.get("search") || searchParams?.get("query") || "";
  const [search, setSearch] = useState(initialSearch);
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
    if (inStockOnly) {
      result = result.filter(p => 
        p.isMadeToOrder || 
        (p.variants && p.variants.length > 0 
          ? p.variants.some(v => v.stock > 0) 
          : p.stockStatus !== 'OUT_OF_STOCK'
        )
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter(p => 
        p.category?.slug === categoryFilter || 
        p.category?.name?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
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
      <div className="hidden md:block bg-neutral-50 border-b border-neutral-100 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-4 tracking-tight">Shop Collection</h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Discover beautifully handcrafted crochet creations made with love, perfect for gifting or bringing warmth to your home.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 md:py-8">
        
        {/* Utility Bar - always visible */}
        <div className="sticky top-0 z-[35] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-bold"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
              <span className="text-sm text-neutral-500 font-medium">
                {filteredProducts.length} Product{filteredProducts.length !== 1 && 's'}
              </span>
            </div>
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
            {filteredProducts.length > 0 ? (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {filteredProducts.length < 8 && (
                  <div className="mt-8 pt-6 md:mt-16 md:pt-10 border-t border-neutral-100">
                    <h3 className="text-xl font-serif font-medium text-neutral-900 mb-6">More to Love</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                      {initialProducts
                        .filter(p => !filteredProducts.some(fp => fp.id === p.id))
                        .slice(0, 12 - filteredProducts.length)
                        .map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full">
                <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <h3 className="font-bold text-orange-800 text-lg mb-1">No Exact Matches</h3>
                    <p className="text-orange-700 text-sm">We couldn&apos;t find exactly what you&apos;re looking for, but you might love these!</p>
                  </div>
                  <button 
                    onClick={handleResetFilters}
                    className="bg-white text-orange-800 font-bold px-5 py-2.5 rounded-xl text-sm border border-orange-200 hover:bg-orange-100 transition-colors whitespace-nowrap shadow-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
                
                <h3 className="text-xl font-serif font-medium text-neutral-900 mb-6">Recommended For You</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                  {initialProducts.slice(0, 12).map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
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
