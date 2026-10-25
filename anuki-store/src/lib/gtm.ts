// Google Tag Manager & GA4 E-commerce DataLayer Helper
// Compliant with standard GA4 e-commerce schema, currency: INR

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

// In-memory set to guard against duplicate purchase pushes in the same JS session
const trackedPurchasesInMemory = new Set<string>();

/**
 * Low-level safe push to window.dataLayer.
 * Always resets ecommerce object to null first as per Google GA4 standard.
 */
export function pushEcommerce(event: string, ecommerceData: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    // 1. Clear previous ecommerce object to prevent parameter leakage
    window.dataLayer.push({ ecommerce: null });
    // 2. Push event with fresh ecommerce payload
    window.dataLayer.push({
      event,
      ecommerce: ecommerceData,
    });
  } catch (err) {
    // Fail silently so tracking code never degrades user experience
    console.warn('[GTM] Failed to push dataLayer event:', event, err);
  }
}

/**
 * 1. view_item — on product page load
 * item_id = product slug / SKU, item_name, price, currency: INR, value: price
 */
export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;
  category?: string | null;
  sku?: string | null;
  slug?: string | null;
}) {
  if (!product || (!product.id && !product.slug)) return;
  try {
    const itemPrice = Number(product.price) || 0;
    pushEcommerce('view_item', {
      currency: 'INR',
      value: itemPrice,
      items: [
        {
          item_id: product.slug || product.sku || product.id,
          item_name: product.name,
          item_category: product.category || 'Crochet Gifts',
          price: itemPrice,
          quantity: 1,
        },
      ],
    });
  } catch (err) {
    console.warn('[GTM] trackViewItem error:', err);
  }
}

/**
 * 2. view_item_list — on category and /products listing views
 */
export function trackViewItemList(
  listName: string,
  products: Array<{
    id: string;
    name: string;
    price: number;
    category?: string | null;
    slug?: string | null;
    sku?: string | null;
  }>
) {
  if (!products || products.length === 0) return;
  try {
    pushEcommerce('view_item_list', {
      item_list_name: listName || 'Product List',
      items: products.slice(0, 30).map((p, idx) => ({
        item_id: p.slug || p.sku || p.id,
        item_name: p.name,
        item_category: p.category || listName,
        price: Number(p.price) || 0,
        index: idx + 1,
      })),
    });
  } catch (err) {
    console.warn('[GTM] trackViewItemList error:', err);
  }
}

/**
 * 3. add_to_cart — on cart add
 */
export function trackAddToCart(item: {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string | null;
  slug?: string | null;
  sku?: string | null;
}) {
  if (!item || !item.name) return;
  try {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    pushEcommerce('add_to_cart', {
      currency: 'INR',
      value: price * qty,
      items: [
        {
          item_id: item.slug || item.sku || item.productId || item.id,
          item_name: item.name,
          item_category: item.category || 'Crochet Gifts',
          price,
          quantity: qty,
        },
      ],
    });
  } catch (err) {
    console.warn('[GTM] trackAddToCart error:', err);
  }
}

/**
 * 4. remove_from_cart — on cart remove
 */
export function trackRemoveFromCart(item: {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string | null;
  slug?: string | null;
  sku?: string | null;
}) {
  if (!item || !item.name) return;
  try {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    pushEcommerce('remove_from_cart', {
      currency: 'INR',
      value: price * qty,
      items: [
        {
          item_id: item.slug || item.sku || item.productId || item.id,
          item_name: item.name,
          item_category: item.category || 'Crochet Gifts',
          price,
          quantity: qty,
        },
      ],
    });
  } catch (err) {
    console.warn('[GTM] trackRemoveFromCart error:', err);
  }
}

/**
 * 5. view_cart — on cart page view
 */
export function trackViewCart(
  total: number,
  items: Array<{
    id: string;
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    category?: string | null;
    slug?: string | null;
    sku?: string | null;
  }>
) {
  if (!items || items.length === 0) return;
  try {
    pushEcommerce('view_cart', {
      currency: 'INR',
      value: Number(total) || 0,
      items: items.map((item, idx) => ({
        item_id: item.slug || item.sku || item.productId || item.id,
        item_name: item.name,
        item_category: item.category || 'Crochet Gifts',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        index: idx + 1,
      })),
    });
  } catch (err) {
    console.warn('[GTM] trackViewCart error:', err);
  }
}

/**
 * 6. begin_checkout — on checkout start
 */
export function trackBeginCheckout(
  total: number,
  items: Array<{
    id: string;
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    category?: string | null;
    slug?: string | null;
    sku?: string | null;
  }>
) {
  if (!items || items.length === 0) return;
  try {
    pushEcommerce('begin_checkout', {
      currency: 'INR',
      value: Number(total) || 0,
      items: items.map((item, idx) => ({
        item_id: item.slug || item.sku || item.productId || item.id,
        item_name: item.name,
        item_category: item.category || 'Crochet Gifts',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        index: idx + 1,
      })),
    });
  } catch (err) {
    console.warn('[GTM] trackBeginCheckout error:', err);
  }
}

/**
 * 7. purchase — on order-success / thank-you page ONLY
 * Guaranteed to fire EXACTLY ONCE per order ID using dual in-memory + localStorage deduplication.
 * Prevents re-firing on page refresh, polling cycles, or back-navigation.
 */
export function trackPurchase(order: {
  id: string;
  totalAmount: number;
  shippingCharge?: number;
  tax?: number;
  items: Array<{
    id?: string;
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    category?: string | null;
    slug?: string | null;
    sku?: string | null;
  }>;
}): boolean {
  if (typeof window === 'undefined') return false;
  if (!order || !order.id) return false;

  const orderIdStr = String(order.id);
  const STORAGE_KEY = 'anuki_ga4_purchases_tracked';

  try {
    // 1. Check in-memory guard
    if (trackedPurchasesInMemory.has(orderIdStr)) {
      return false;
    }

    // 2. Check localStorage guard (persists across page reloads & browser back navigation)
    let trackedIds: string[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        trackedIds = JSON.parse(stored);
      }
    } catch {
      trackedIds = [];
    }

    if (Array.isArray(trackedIds) && trackedIds.includes(orderIdStr)) {
      trackedPurchasesInMemory.add(orderIdStr);
      return false;
    }

    const value = Number(order.totalAmount) || 0;
    const shipping = Number(order.shippingCharge) || 0;
    const tax = Number(order.tax) || 0;

    pushEcommerce('purchase', {
      transaction_id: orderIdStr,
      value,
      shipping,
      tax,
      currency: 'INR',
      items: (order.items || []).map((item, idx) => ({
        item_id: item.slug || item.sku || item.productId || item.id || `item-${idx + 1}`,
        item_name: item.name,
        item_category: item.category || 'Crochet Gifts',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        index: idx + 1,
      })),
    });

    // Mark as tracked immediately in both guards
    trackedPurchasesInMemory.add(orderIdStr);
    trackedIds.push(orderIdStr);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedIds));
    } catch {
      // Storage quota or private browsing fallback
    }

    return true;
  } catch (err) {
    console.warn('[GTM] trackPurchase error:', err);
    return false;
  }
}

