import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || new URL(req.url).origin;
  const { priceId: bodyPriceId, lookupKey, mode = "subscription" } = await req.json().catch(() => ({}));

  let priceId = bodyPriceId || process.env.STRIPE_DEFAULT_PRICE_ID || undefined;

  if (!priceId && lookupKey) {
    const prices = await stripe.prices.list({ lookup_keys: [lookupKey], expand: ["data.product"], active: true, limit: 1 });
    priceId = prices.data[0]?.id;
  }
  if (!priceId) return NextResponse.json({ error: "Missing priceId (or lookupKey not found)" }, { status: 400 });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value },
        set() {},
        remove() {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let customerId = (user.user_metadata as any)?.stripe_customer_id as string | undefined;
  if (!customerId) {
    const existing = user.email ? await stripe.customers.list({ email: user.email, limit: 1 }) : { data: [] as any[] };
    if (existing.data[0]) {
      customerId = existing.data[0].id;
    } else {
      const name = [user.user_metadata?.firstName, user.user_metadata?.lastName].filter(Boolean).join(" ");
      const company = user.user_metadata?.companyName as string | undefined;
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: name || undefined,
        metadata: company ? { company } : undefined,
      });
      customerId = customer.id;
    }
    await supabase.auth.updateUser({ data: { stripe_customer_id: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    mode,
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/dashboard?checkout=canceled`,
  });
  return NextResponse.json({ url: session.url });
}


