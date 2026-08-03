import { Product } from "@/components/ProductCard";

export function expandProductsByColor(products: Product[]): Product[] {
  const expanded: Product[] = [];
  
  products.forEach(product => {
    const colorVariants = (product.variants || []).filter(v => v.color);
    // Find unique colors
    const uniqueColors = Array.from(new Set(colorVariants.map(v => v.color)));
    
    if (uniqueColors.length > 0) {
      // Create a cloned product for each color
      uniqueColors.forEach(color => {
        // Find the variant corresponding to this color to use its image if possible
        const variant = colorVariants.find(v => v.color === color);
        
        let images = product.images;
        if (variant && variant.imageUrls && variant.imageUrls.length > 0) {
          images = variant.imageUrls.map((url: string) => ({ url, altText: `${product.name} - ${color}` }));
        }

        expanded.push({
          ...product,
          id: `${product.id}-${color}`, // Unique ID for React key
          originalId: product.id,
          images,
          // We override the variants array to include all variants of this specific color.
          // This ensures ProductCard correctly calculates stock and shows this single color dot.
          variants: colorVariants.filter(v => v.color === color)
        });
      });
    } else {
      // No color variants, push as is
      expanded.push(product);
    }
  });

  return expanded;
}
