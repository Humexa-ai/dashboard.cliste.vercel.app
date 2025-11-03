"use client";

import { OrganizationProfile, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function OrgProfilePage() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <main className="min-h-screen bg-[#0a0a0a] text-white p-6 grid place-items-center">
          <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold">Organization Settings</h1>
              <Link
                href="/org/profile/organization-billing?tab=subscriptions"
                className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-zinc-200"
              >
                Open Billing (Subscriptions)
              </Link>
            </div>
            <OrganizationProfile
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent",
                  navbar: "bg-transparent",
                },
              }}
            />
          </div>
        </main>
      </SignedIn>
    </>
  );
}


