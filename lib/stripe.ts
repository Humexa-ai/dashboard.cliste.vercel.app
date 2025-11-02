import Stripe from "stripe";

declare global {
  // eslint-disable-next-line no-var
  var __stripeClient__: Stripe | undefined;
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // eslint-disable-next-line no-console
    console.warn("STRIPE_SECRET_KEY is not set. Billing routes will fail until configured.");
    return null;
  }
  if (!globalThis.__stripeClient__) {
    globalThis.__stripeClient__ = new Stripe(key, {
      apiVersion: "2025-10-29.clover",
    });
  }
  return globalThis.__stripeClient__!;
}


