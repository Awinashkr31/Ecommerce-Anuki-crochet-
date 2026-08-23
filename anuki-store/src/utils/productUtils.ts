import { Product } from "@/components/ProductCard";

export function expandProductsByColor(products: Product[]): Product[] {
  const expanded: Product[] = [];
  
  products.forEach(product => {
    const colorVariants = (product.variants || []).filter(v => v.color);
    // Find unique colors
    const uniqueColors = Array.from(new Set(colorVariants.map(v => v.color)));
    
    if (uniqueColors.length > 0) {
      // First, add the main product images as a "default" card
      // This represents the original/default color shown in product.images
      const hasVariantWithDifferentImages = colorVariants.some(
        v => v.imageUrls && v.imageUrls.length > 0
      );
      
      if (hasVariantWithDifferentImages && product.images && product.images.length > 0) {
        // The main product images are a different color than the variants
        expanded.push({
          ...product,
          id: `${product.id}-default`,
          originalId: product.id,
          images: product.images,
          variants: [] // No specific variant for the default
        });
      }

      // Then create a card for each color variant that has its own images
      uniqueColors.forEach(color => {
        const variant = colorVariants.find(v => v.color === color);
        
        let images = product.images;
        if (variant && variant.imageUrls && variant.imageUrls.length > 0) {
          images = variant.imageUrls.map((url: string) => ({ url, altText: `${product.name} - ${color}` }));
        }

        expanded.push({
          ...product,
          id: `${product.id}-${color}`,
          originalId: product.id,
          name: `${product.name} - ${color}`,
          images,
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
