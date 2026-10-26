"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Search } from "lucide-react";
import { expandProductsByColor } from '../../utils/productUtils';
import { trackViewItemList } from "@/lib/gtm";

import { ProductCard, Product } from "../../components/ProductCard";
import FilterSidebar from "./components/FilterSidebar";
import MobileFilterDrawer from "./components/MobileFilterDrawer";
import SortDropdown from "./components/SortDropdown";

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category");
  const initialIsMadeToOrder = searchParams?.get("isMadeToOrder") === "true";
  const targetProductParam = searchParams?.get("product");

  const products = useMemo(() => expandProductsByColor(initialProducts), [initialProducts]);

  // Target product prioritized ordering
  const targetProduct = useMemo(() => {
    if (!targetProductParam) return null;
    const clean = targetProductParam.toLowerCase().trim();
    return products.find(p => 
      p.slug?.toLowerCase() === clean || 
      p.id?.toLowerCase() === clean || 
      p.originalId?.toLowerCase() === clean
    ) || null;
  }, [products, targetProductParam]);

  // Filters State
  const urlQuery = searchParams?.get("q") ?? searchParams?.get("search") ?? searchParams?.get("query") ?? "";
  const [search, setSearch] = useState(urlQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || "all");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [sort, setSort] = useState("relevance");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [customizableOnly, setCustomizableOnly] = useState(initialIsMadeToOrder);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Synchronize URL query changes into search state (for back/forward navigation and header searches)
  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  // Dynamic filter lists based on available products
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category?.name?.toLowerCase()).filter(Boolean))), [products]) as string[];
  const colors = useMemo(() => Array.from(new Set(products.flatMap(p => p.variants?.map(v => v.color?.toLowerCase())).filter(Boolean))), [products]) as string[];
  const sizes = useMemo(() => Array.from(new Set(products.flatMap(p => p.variants?.map(v => v.size?.toLowerCase())).filter(Boolean))), [products]) as string[];

  // GA4 view_item_list event
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      const listName = categoryFilter !== "all" ? categoryFilter : "All Products";
      trackViewItemList(
        listName,
        initialProducts.map((p) => ({
          id: p.id,
          slug: p.slug,
          sku: p.sku,
          name: p.name,
          price: Number(p.salePrice || p.basePrice || 0),
          category: p.category?.name || "All Products",
        }))
      );
    }
  }, []);

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
      const term = search.trim().toLowerCase();
      result = result.filter(p => {
        const name = p.name?.toLowerCase() || '';
        const category = p.category?.name?.toLowerCase() || '';
        const tags = (p.tags || '')?.toLowerCase();
        const keywords = (p.seoKeywords || '')?.toLowerCase();
        
        if (name.includes(term) || category.includes(term) || tags.includes(term) || keywords.includes(term)) {
          return true;
        }

        const tokens = term.split(/\s+/).filter(Boolean);
        if (tokens.length > 1) {
          const combined = `${name} ${category} ${tags} ${keywords}`;
          return tokens.every(token => combined.includes(token));
        }

        return false;
      });
    }

    if (sort === "price-low") result.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
    else if (sort === "price-high") result.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
    else if (sort === "bestselling") result.sort((a, b) => (a.bestseller === b.bestseller ? 0 : a.bestseller ? -1 : 1));
    else if (sort === "newest") result.sort((a, b) => (b.id > a.id ? 1 : -1)); // Mocking newest with ID string compare
    else if (sort === "relevance" && targetProduct) {
      const isTarget = (p: Product) => (
        p.id === targetProduct.id || 
        p.slug === targetProduct.slug || 
        (p.originalId && targetProduct.originalId && p.originalId === targetProduct.originalId)
      );
      const targetCategorySlug = targetProduct.category?.slug?.toLowerCase();
      const targetCategoryName = targetProduct.category?.name?.toLowerCase();
      const isSameCategory = (p: Product) => {
        if (!targetCategorySlug && !targetCategoryName) return false;
        return (
          (targetCategorySlug && p.category?.slug?.toLowerCase() === targetCategorySlug) ||
          (targetCategoryName && p.category?.name?.toLowerCase() === targetCategoryName)
        );
      };

      const targetList = result.filter(isTarget);
      const sameCategoryList = result.filter(p => !isTarget(p) && isSameCategory(p));
      const otherCategoriesList = result.filter(p => !isTarget(p) && !isSameCategory(p));

      result = [...targetList, ...sameCategoryList, ...otherCategoriesList];
    }

    return result;
  }, [products, customizableOnly, inStockOnly, categoryFilter, colorFilter, sizeFilter, search, sort, targetProduct]);

  const isTargetPrioritized = Boolean(
    targetProduct && 
    categoryFilter === "all" && 
    !search.trim() && 
    sort === "relevance"
  );

  const sameCategoryCount = useMemo(() => {
    if (!isTargetPrioritized || !targetProduct) return 0;
    const isTarget = (p: Product) => (
      p.id === targetProduct.id || 
      p.slug === targetProduct.slug || 
      (p.originalId && targetProduct.originalId && p.originalId === targetProduct.originalId)
    );
    const targetCategorySlug = targetProduct.category?.slug?.toLowerCase();
    const targetCategoryName = targetProduct.category?.name?.toLowerCase();
    const isSameCategory = (p: Product) => {
      if (!targetCategorySlug && !targetCategoryName) return false;
      return (
        (targetCategorySlug && p.category?.slug?.toLowerCase() === targetCategorySlug) ||
        (targetCategoryName && p.category?.name?.toLowerCase() === targetCategoryName)
      );
    };
    return filteredProducts.filter(p => isTarget(p) || isSameCategory(p)).length;
  }, [isTargetPrioritized, targetProduct, filteredProducts]);

  const handleClearSearch = () => {
    setSearch("");
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("q");
    params.delete("search");
    params.delete("query");
    const newQs = params.toString();
    router.push(`/products${newQs ? `?${newQs}` : ""}`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("searchCleared"));
    }
  };

  const handleResetFilters = () => {
    setCategoryFilter("all");
    setColorFilter("all");
    setSizeFilter("all");
    setInStockOnly(false);
    setCustomizableOnly(false);
    setSearch("");
    router.push("/products");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("searchCleared"));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* H1 always in DOM for accessibility; visually hidden on mobile */}
      <h1 className="sr-only md:not-sr-only md:text-3xl md:text-4xl md:font-black md:text-neutral-900 md:mb-2 md:tracking-tight md:text-center">Shop Collection</h1>
      {/* Header Banner - visual only on desktop */}
      <div className="hidden md:block bg-neutral-50 border-b border-neutral-100 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-neutral-500 text-sm max-w-2xl mx-auto">
            Discover beautifully handcrafted crochet creations made with love, perfect for gifting or bringing warmth to your home.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 md:py-4">
        
        {/* Utility Bar - always visible */}
        <div className="sticky top-0 z-[35] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#8c3a44] text-white rounded-full text-sm font-bold cursor-pointer"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-neutral-500 font-medium">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 && 's'}
                  {search.trim() && (
                    <span className="text-neutral-400 font-normal ml-1">
                      for &ldquo;<span className="text-neutral-800 font-semibold">{search.trim()}</span>&rdquo;
                    </span>
                  )}
                </span>
                {search.trim() && (
                  <button 
                    onClick={handleClearSearch}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
            <SortDropdown sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
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
            {isTargetPrioritized && targetProduct && (
              <div className="mb-4 p-3.5 sm:p-4 bg-gradient-to-r from-rose-50/95 via-pink-50/70 to-rose-50/95 border border-rose-200/90 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-neutral-800 font-semibold truncate">
                      Showing <span className="text-rose-900 font-bold">{targetProduct.category?.name || "Selected Category"}</span> first
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      Starting with <span className="font-semibold text-neutral-900">{targetProduct.name}</span>, followed by all other collections below
                    </p>
                  </div>
                </div>
                <Link 
                  href="/products"
                  className="shrink-0 text-xs font-bold text-rose-800 bg-white hover:bg-rose-100/60 px-3.5 py-1.5 rounded-full border border-rose-200 transition-colors shadow-2xs"
                >
                  Show All
                </Link>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 mt-2">
                  {filteredProducts.map((product, index) => (
                    <React.Fragment key={product.id}>
                      {sameCategoryCount > 0 && index === sameCategoryCount && (
                        <div className="col-span-2 sm:col-span-3 xl:col-span-4 pt-6 pb-2 border-t border-neutral-200 mt-2 mb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                                More Collections
                              </span>
                              <h3 className="text-base sm:text-lg font-serif font-bold text-neutral-900">
                                Explore Other Handcrafted Categories
                              </h3>
                            </div>
                            <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                              100% Handcrafted
                            </span>
                          </div>
                        </div>
                      )}
                      <ProductCard product={product} />
                    </React.Fragment>
                  ))}
                </div>
                
                {filteredProducts.length < 8 && !search.trim() && (
                  <div className="mt-6 pt-4 md:mt-8 md:pt-6 border-t border-neutral-100">
                    <h3 className="text-lg font-serif font-medium text-neutral-900 mb-4">More to Love</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
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
            ) : search.trim() ? (
              <div className="w-full py-16 px-4 text-center bg-neutral-50/60 rounded-3xl border border-neutral-100 my-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white shadow-xs flex items-center justify-center text-neutral-400 border border-neutral-100">
                  <Search size={28} className="text-neutral-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                  No products found for &ldquo;{search.trim()}&rdquo;
                </h3>
                <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
                  We couldn&apos;t find any items matching your search. Try checking your spelling or searching with different keywords.
                </p>
                <button
                  onClick={handleClearSearch}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7A1D2E] hover:bg-[#601624] text-white font-semibold text-sm rounded-full transition-colors shadow-sm cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="w-full">
                <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <h3 className="font-bold text-orange-800 text-lg mb-1">No Exact Matches</h3>
                    <p className="text-orange-700 text-sm">We couldn&apos;t find products matching your selected filters.</p>
                  </div>
                  <button 
                    onClick={handleResetFilters}
                    className="border border-neutral-200 text-neutral-900 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-neutral-50 transition-colors whitespace-nowrap shadow-sm bg-white cursor-pointer"
                  >
                    Clear All Filters
                  </button>
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
