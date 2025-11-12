import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || new URL(req.url).origin;

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
    
    // Verify customer exists in current mode (test vs live)
    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch (e: any) {
        console.log("[Portal] Clearing invalid customer ID:", customerId);
        customerId = undefined;
        await supabase.auth.updateUser({ data: { stripe_customer_id: null } });
      }
    }
    
    if (!customerId) {
      // Try to re-use an existing Stripe customer by email to avoid duplicates
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

    if (!customerId) {
      return NextResponse.json({ error: "Failed to create or retrieve customer" }, { status: 500 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
      configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID || undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("Portal error:", e);
    return NextResponse.json({ error: e?.message || "Portal error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || new URL(req.url).origin;

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
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    let customerId = (user.user_metadata as any)?.stripe_customer_id as string | undefined;
    if (!customerId) {
      const name = [user.user_metadata?.firstName, user.user_metadata?.lastName].filter(Boolean).join(" ");
      const company = user.user_metadata?.companyName as string | undefined;
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: name || undefined,
        metadata: company ? { company } : undefined,
      });
      customerId = customer.id;
      await supabase.auth.updateUser({ data: { stripe_customer_id: customerId } });
    }

    if (!customerId) {
      return NextResponse.redirect(new URL("/dashboard?billing_error=1", req.url));
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
      configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID || undefined,
    });
    return NextResponse.redirect(session.url);
  } catch (e) {
    console.error("Portal GET error:", e);
    return NextResponse.redirect(new URL("/dashboard?billing_error=1", req.url));
  }
}


