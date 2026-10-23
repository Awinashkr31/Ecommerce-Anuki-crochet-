/**
 * Utility for triggering on-demand revalidation on Next.js storefront pages
 */
export async function triggerRevalidation(options: {
  paths?: string[];
  tags?: string[];
  type?: 'page' | 'layout';
}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.anukicrochet.in';
    const secret = process.env.REVALIDATION_SECRET || 'anuki_secret_revalidate_token';

    const res = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        paths: options.paths || [],
        tags: options.tags || [],
        type: options.type
      }),
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) {
      console.warn(`[Revalidate] HTTP ${res.status} response from ${baseUrl}/api/revalidate`);
    } else {
      const data = await res.json().catch(() => ({}));
      console.log('[Revalidate] Success:', data);
    }
  } catch (err) {
    console.warn('[Revalidate] Failed to trigger storefront revalidation:', err);
  }
}
