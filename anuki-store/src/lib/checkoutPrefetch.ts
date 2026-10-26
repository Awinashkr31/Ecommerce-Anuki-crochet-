import { useAddressStore } from '@/store/addressStore';
import { apiGet } from '@/lib/api';

let isPrefetching = false;

export async function prefetchCheckoutData() {
  if (isPrefetching || typeof window === 'undefined') return;
  isPrefetching = true;

  try {
    const promises: Promise<any>[] = [];

    // 1. Prefetch public store settings (shipping rules, COD charges)
    promises.push(
      apiGet<Record<string, string>>('/settings/public').catch(() => null)
    );

    // 2. Prefetch user addresses if user has a session cached
    const cachedProfile = sessionStorage.getItem('auth_profile_cache');
    if (cachedProfile) {
      promises.push(useAddressStore.getState().fetchAddressesOnce().catch(() => null));
    }

    await Promise.all(promises);
  } catch (err) {
    // Non-blocking prefetch failure
    console.debug('[Prefetch] Checkout data prefetch error:', err);
  } finally {
    isPrefetching = false;
  }
}
