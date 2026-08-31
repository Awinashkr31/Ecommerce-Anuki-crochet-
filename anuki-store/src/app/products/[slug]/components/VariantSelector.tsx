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
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-neutral-900">Color:</span>
            <span className="text-sm font-medium text-neutral-600">{colors.length > 0 ? currentVariant?.color : baseColor}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((c: any) => {
              const isSelected = currentVariant?.color === c;
              const variantForColor = allVariants.find(v => v.color === c);
              const imgUrl = variantForColor?.imageUrls?.[0] || variantForColor?.imageUrl || (variantForColor?.id === 'base' && baseProduct?.images?.[0]?.url);
              return (
                <button
                  key={c}
                  onClick={() => handleSelect('color', c)}
                  className={`relative p-1 pb-1.5 rounded-lg flex flex-col items-center gap-1 transition-all w-[60px] ${isSelected ? 'ring-2 ring-rose-500 ring-offset-2 bg-rose-50' : 'ring-1 ring-neutral-200 hover:ring-neutral-400 bg-white'}`}
                  title={c}
                >
                  <span 
                    className="w-[50px] h-[56px] rounded-md border border-black/10 overflow-hidden block shrink-0" 
                    style={{ backgroundColor: colorMap[c] || c }}
                  >
                    {imgUrl && <img src={imgUrl} alt={c} className="w-full h-full object-cover" />}
                  </span>
                  <span className={`text-[10px] font-bold w-full text-center truncate px-0.5 leading-none ${isSelected ? 'text-rose-600' : 'text-neutral-700'}`}>{c}</span>
                </button>
              );
            })}
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
