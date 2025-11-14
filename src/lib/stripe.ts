import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

const API_BASE = (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL) as string || '';

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
    if (key) {
      // Debug log: using env publishable key
      // eslint-disable-next-line no-console
      console.log('[stripe] Using publishable key from VITE_STRIPE_PUBLISHABLE_KEY');
      stripePromise = loadStripe(key);
    } else {
      // Try to load the publishable key from the backend at runtime
      // eslint-disable-next-line no-console
      console.log(`[stripe] No env key, fetching from ${API_BASE}/api/config/stripe-pk`);
      stripePromise = fetch(`${API_BASE}/api/config/stripe-pk`).then(async res => {
        if (!res.ok) {
          // eslint-disable-next-line no-console
          console.warn('[stripe] backend responded with', res.status);
          return null;
        }
        const payload = await res.json().catch(() => null);
        // eslint-disable-next-line no-console
        console.log('[stripe] backend payload:', payload);
        const pk = payload && (payload.publishableKey || payload.publishable_key);
        if (!pk || typeof pk !== 'string') return null;
        // eslint-disable-next-line no-console
        console.log('[stripe] loaded publishable key from backend');
        return loadStripe(pk as string);
      }).then(p => p ?? null).catch(err => {
        // eslint-disable-next-line no-console
        console.error('[stripe] error loading publishable key from backend', err);
        return null;
      });
    }
  }
  return stripePromise;
}
