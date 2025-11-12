import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  try {
    console.log("[Billing API] Request received");
    
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log("[Billing API] Stripe not configured, returning free tier");
      return NextResponse.json({
        hasSubscription: false,
        tier: "free",
      });
    }
    
    console.log("[Billing API] Stripe is configured");

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let customerId = (user.user_metadata as any)?.stripe_customer_id as string | undefined;
    
    // Check if customer ID is a test ID (starts with cus_ but in test mode)
    // If we're in live mode and have a test customer, clear it
    if (customerId && stripe) {
      try {
        // Try to retrieve the customer to verify it exists in current mode
        await stripe.customers.retrieve(customerId);
      } catch (e: any) {
        // Customer doesn't exist in current mode (test vs live mismatch)
        console.log("[Billing API] Clearing invalid customer ID:", customerId);
        customerId = undefined;
        await supabase.auth.updateUser({ data: { stripe_customer_id: null } });
      }
    }
    
    if (!customerId && stripe) {
      // Try to find by email
      const existing = user.email ? await stripe.customers.list({ email: user.email, limit: 1 }) : { data: [] };
      if (existing.data[0]) {
        customerId = existing.data[0].id;
        await supabase.auth.updateUser({ data: { stripe_customer_id: customerId } });
      }
    }

    if (!customerId) {
      return NextResponse.json({
        hasSubscription: false,
        tier: "free",
      });
    }

    if (!stripe) {
      return NextResponse.json({
        hasSubscription: false,
        tier: "free",
      });
    }

    // Fetch subscription data
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    let subscription = subscriptions.data[0];
    
    // Retrieve full subscription details to get cancel_at_period_end
    if (subscription) {
      subscription = await stripe.subscriptions.retrieve(subscription.id);
      console.log("[Billing API] Subscription ID:", subscription.id);
      console.log("[Billing API] Status:", subscription.status);
      console.log("[Billing API] cancel_at_period_end:", subscription.cancel_at_period_end);
      console.log("[Billing API] cancel_at:", subscription.cancel_at);
      console.log("[Billing API] Full subscription object:", JSON.stringify({
        id: subscription.id,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        cancel_at: subscription.cancel_at,
        current_period_end: subscription.current_period_end,
      }, null, 2));
    }

    // Fetch payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
      limit: 1,
    });

    const defaultPaymentMethod = paymentMethods.data[0];

    // Fetch invoices (last 10)
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 10,
    });

    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        tier: "free",
        paymentMethod: defaultPaymentMethod ? {
          last4: defaultPaymentMethod.card?.last4,
          brand: defaultPaymentMethod.card?.brand,
          expMonth: defaultPaymentMethod.card?.exp_month,
          expYear: defaultPaymentMethod.card?.exp_year,
        } : null,
        invoices: invoices.data.map((inv) => ({
          id: inv.id,
          number: inv.number,
          amount: inv.amount_paid,
          currency: inv.currency,
          status: inv.status,
          created: inv.created,
          periodStart: inv.period_start,
          periodEnd: inv.period_end,
          pdfUrl: inv.invoice_pdf,
          hostedUrl: inv.hosted_invoice_url,
        })),
      });
    }

    const price = subscription.items.data[0]?.price;
    const productId = typeof price?.product === 'string' ? price.product : price?.product?.id;
    
    // Fetch product details separately
    let product = null;
    if (productId) {
      try {
        product = await stripe.products.retrieve(productId);
      } catch (e) {
        console.error("[Billing API] Failed to fetch product:", e);
      }
    }

    return NextResponse.json({
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        cancelAt: subscription.cancel_at,
        trialEnd: subscription.trial_end,
      },
      product: product ? {
        id: product.id,
        name: product.name,
        description: product.description,
      } : null,
      price: {
        id: price?.id,
        amount: price?.unit_amount,
        currency: price?.currency,
        interval: price?.recurring?.interval,
        intervalCount: price?.recurring?.interval_count,
      },
      tier: determineTier(product?.name, price?.unit_amount),
      paymentMethod: defaultPaymentMethod ? {
        last4: defaultPaymentMethod.card?.last4,
        brand: defaultPaymentMethod.card?.brand,
        expMonth: defaultPaymentMethod.card?.exp_month,
        expYear: defaultPaymentMethod.card?.exp_year,
      } : null,
      invoices: invoices.data.map((inv) => ({
        id: inv.id,
        number: inv.number,
        amount: inv.amount_paid,
        currency: inv.currency,
        status: inv.status,
        created: inv.created,
        periodStart: inv.period_start,
        periodEnd: inv.period_end,
        pdfUrl: inv.invoice_pdf,
        hostedUrl: inv.hosted_invoice_url,
      })),
    });
  } catch (e: any) {
    console.error("[Billing API] Error:", e);
    return NextResponse.json({ error: e?.message || "Failed to fetch billing data" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

function determineTier(productName?: string, amount?: number | null): string {
  if (!productName && !amount) return "free";
  
  const name = productName?.toLowerCase() || "";
  
  if (name.includes("enterprise")) return "enterprise";
  if (name.includes("pro")) return "pro";
  if (name.includes("starter")) return "starter";
  
  // Fallback to price-based determination (in cents)
  if (amount) {
    if (amount >= 29900) return "enterprise"; // €299+
    if (amount >= 9900) return "pro"; // €99+
    if (amount > 0) return "starter";
  }
  
  return "free";
}

