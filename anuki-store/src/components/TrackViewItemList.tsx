"use client";

import { useEffect, useRef } from 'react';
import { trackViewItemList } from '@/lib/gtm';

interface TrackViewItemListProps {
  listName: string;
  products: Array<{
    id: string;
    name: string;
    salePrice?: number | null;
    basePrice?: number;
    price?: number;
    category?: { name: string } | string;
  }>;
}

export default function TrackViewItemList({ listName, products }: TrackViewItemListProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (products && products.length > 0) {
      firedRef.current = true;
      trackViewItemList(
        listName,
        products.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.salePrice || p.basePrice || p.price || 0),
          category: typeof p.category === 'object' && p.category?.name ? p.category.name : (typeof p.category === 'string' ? p.category : listName),
        }))
      );
    }
  }, [listName, products]);

  return null;
}
