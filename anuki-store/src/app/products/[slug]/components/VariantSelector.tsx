"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function VariantSelector({
  variants,
  selectedVariantId,
  setSelectedVariantId,
  baseColor,
  baseProduct,
}: {
  variants: any[];
  selectedVariantId: string | null;
  setSelectedVariantId: (id: string | null) => void;
  baseColor?: string | null;
  baseProduct?: any;
}) {
  const allVariants = useMemo(() => {
    const base = baseProduct ? {
      id: 'base',
      color: baseProduct.color,
      size: baseProduct.size,
      style: baseProduct.style,
      material: baseProduct.material,
      imageUrls: baseProduct.images?.length > 0 ? baseProduct.images.map((img: any) => img.url) : [],
    } : null;

    return base && (base.color || base.size || base.style) ? [base, ...variants] : variants;
  }, [variants, baseProduct]);

  if (!allVariants || allVariants.length === 0) return null;

  // Group variants by type for luxury presentation
  const colors = useMemo(() => Array.from(new Set(allVariants.filter(v => v.color).map(v => v.color))), [allVariants]);
  const sizes = useMemo(() => Array.from(new Set(allVariants.filter(v => v.size).map(v => v.size))), [allVariants]);
  const styles = useMemo(() => Array.from(new Set(allVariants.filter(v => v.style).map(v => v.style))), [allVariants]);

  const currentVariant = allVariants.find(v => v.id === (selectedVariantId || 'base')) || allVariants[0];

  const handleSelect = (key: string, val: string) => {
    // Find a variant that matches the new selection but keeps other existing selections if possible
    const target = allVariants.find(v => v[key] === val) || allVariants[0];
    if (target) setSelectedVariantId(target.id === 'base' ? null : target.id);
  };

  // Color Mapping for UI Swatches
  const colorMap: Record<string, string> = {
    'Yellow': '#FDE047',
    'Pink': '#F9A8D4',
    'Blue': '#93C5FD',
    'Green': '#86EFAC',
    'Red': '#FCA5A5',
    'Black': '#1F2937',
    'White': '#F9FAFB'
  };

  return (
    <div className="space-y-6 mb-6">
      {colors.length > 0 && (
        <div className="border-t border-neutral-100 pt-5 mt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold text-neutral-900">
              Color Palette: <span className="text-[#8c3a44]">{colors.length > 0 ? currentVariant?.color : baseColor}</span>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-sm">
              In Stock
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((c: any) => {
              const isSelected = currentVariant?.color === c;
              const variantForColor = allVariants.find(v => v.color === c);
              const thumbUrl = variantForColor?.imageUrls?.[0];

              return (
                <button
                  key={c}
                  onClick={() => handleSelect('color', c)}
                  className="relative flex flex-col items-center gap-1.5 transition-all group w-[52px]"
                  title={c}
                >
                  <div className={`p-0.5 rounded-[14px] border-2 transition-all ${isSelected ? 'border-rose-400' : 'border-transparent group-hover:border-neutral-200'}`}>
                    {thumbUrl ? (
                      <span className="block w-11 h-11 rounded-xl border border-black/5 shrink-0 bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${thumbUrl})` }}></span>
                    ) : (
                      <span className="block w-11 h-11 rounded-xl border border-black/5 shrink-0 shadow-sm" style={{ backgroundColor: colorMap[c] || c }}></span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight text-center leading-tight ${isSelected ? 'text-[#8c3a44]' : 'text-neutral-500 group-hover:text-neutral-700'}`}>{c}</span>
                  
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow-sm z-10">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#8c3a44" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-start gap-1.5 mt-3 text-neutral-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8c3a44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <p className="text-[10px] italic leading-tight">Each stitch is crocheted by hand, slight variations celebrate genuine craftsmanship.</p>
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-neutral-900">Size</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((s) => {
              const isSelected = currentVariant?.size === s;
              return (
                <button
                  key={s}
                  onClick={() => handleSelect('size', s)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all ${
                    isSelected 
                      ? 'border-rose-500 bg-rose-50 text-rose-600' 
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {styles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-neutral-900">Style</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {styles.map((st) => {
              const isSelected = currentVariant?.style === st;
              return (
                <button
                  key={st}
                  onClick={() => handleSelect('style', st)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    isSelected 
                      ? 'border-neutral-900 bg-neutral-900 text-white' 
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
