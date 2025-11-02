import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";

async function getCustomerId(userId: string, orgId?: string | null) {
  const clerk = await clerkClient();
  if (orgId) {
    const org = await clerk.organizations.getOrganization({ organizationId: orgId });
    const existing = (org.privateMetadata as Record<string, unknown> | undefined)?.stripeCustomerId as string | undefined;
    if (existing) return existing;
  } else {
    const user = await clerk.users.getUser(userId);
    const existing = (user.privateMetadata as Record<string, unknown> | undefined)?.stripeCustomerId as string | undefined;
    if (existing) return existing;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.STRIPE_SECRET_KEY)
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const origin = req.headers.get("origin") || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`;

  const customerId = await getCustomerId(userId, orgId);
  if (!customerId) return NextResponse.json({ error: "No Stripe customer." }, { status: 400 });

  try {
    const stripe = getStripe();
    if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Portal failed" }, { status: 500 });
  }
}


