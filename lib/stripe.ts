import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // eslint-disable-next-line no-console
  console.warn("STRIPE_SECRET_KEY is not set. Billing routes will fail until configured.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // Use the latest API version supported by the installed Stripe SDK
  apiVersion: "2025-10-29.clover",
});


