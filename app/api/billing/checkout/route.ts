import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

function getPriceIdForPlan(plan: string | undefined): string | null {
  const map: Record<string, string | undefined> = {
    Starter: process.env.STRIPE_PRICE_STARTER,
    Growth: process.env.STRIPE_PRICE_GROWTH,
    Scale: process.env.STRIPE_PRICE_SCALE,
  };
  return plan ? map[plan] ?? null : null;
}

async function getOrCreateCustomer(userId: string, orgId?: string | null) {
  const clerk = await clerkClient();
  if (orgId) {
    const org = await clerk.organizations.getOrganization({ organizationId: orgId });
    const existing = (org.privateMetadata as Record<string, unknown> | undefined)?.stripeCustomerId as string | undefined;
    if (existing) return existing;

    const ownerUserId = (org as any).createdBy ?? userId;
    const owner = await clerk.users.getUser(ownerUserId);
    const email = owner.emailAddresses?.[0]?.emailAddress;
    const customer = await stripe.customers.create({
      name: org.name || undefined,
      email: email || undefined,
      metadata: { clerk_org_id: org.id, clerk_org_name: org.name || "" },
    });
    await clerk.organizations.updateOrganizationMetadata(org.id, {
      privateMetadata: { ...(org.privateMetadata as object), stripeCustomerId: customer.id },
    });
    return customer.id;
  }

  const user = await clerk.users.getUser(userId);
  const existing = (user.privateMetadata as Record<string, unknown> | undefined)?.stripeCustomerId as string | undefined;
  if (existing) return existing;

  const email = user.emailAddresses?.[0]?.emailAddress;
  const name = user.fullName || undefined;
  const customer = await stripe.customers.create({
    name,
    email: email || undefined,
    metadata: { clerk_user_id: userId },
  });
  await clerk.users.updateUser(userId, {
    privateMetadata: { ...(user.privateMetadata as object), stripeCustomerId: customer.id },
  });
  return customer.id;
}

export async function POST(req: NextRequest) {
  const { userId, orgId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.STRIPE_SECRET_KEY)
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const { plan } = await req.json().catch(() => ({ plan: undefined }));
  const priceId = getPriceIdForPlan(plan);
  if (!priceId)
    return NextResponse.json({ error: "Plan not configured" }, { status: 400 });

  const origin = req.headers.get("origin") || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`;

  try {
    const customerId = await getOrCreateCustomer(userId, orgId);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/onboarding/plan?checkout=cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: {
        metadata: { clerk_user_id: userId, clerk_org_id: orgId || "" },
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Checkout failed" }, { status: 500 });
  }
}


