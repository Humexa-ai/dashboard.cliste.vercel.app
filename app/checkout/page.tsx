"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SignedIn, SignedOut, RedirectToSignIn, ClerkLoaded } from "@clerk/nextjs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CheckoutProvider, useCheckout, PaymentElementProvider, PaymentElement, usePaymentElement } from "@clerk/nextjs/experimental";
import * as React from "react";

export default function CheckoutPage() {
  const search = useSearchParams();
  const planId = search.get("planId") || "";
  const router = useRouter();

  if (!planId) {
    // If plan not provided, go back to plan selection
    if (typeof window !== "undefined") router.replace("/onboarding/plan");
  }

  return (
    <ClerkLoaded>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <CheckoutProvider for="organization" planId={planId} planPeriod="month">
          <CheckoutShell />
        </CheckoutProvider>
      </SignedIn>
    </ClerkLoaded>
  );
}

function CheckoutShell() {
  const { checkout } = useCheckout();
  const { status } = checkout;

  if (status === "needs_initialization") {
    return <InitializeCheckout />;
  }

  return (
    <main className="min-h-screen grid place-items-center bg-[#0a0a0a] text-white p-6">
      <div className="w-full max-w-xl rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6">
        <h1 className="text-xl font-semibold mb-3">Complete purchase</h1>
        <PaymentElementProvider checkout={checkout}>
          <PaymentSection />
        </PaymentElementProvider>
      </div>
    </main>
  );
}

function InitializeCheckout() {
  const { checkout } = useCheckout();
  const { start, status, fetchStatus } = checkout;
  return (
    <main className="min-h-screen grid place-items-center bg-[#0a0a0a] text-white p-6">
      <div className="w-full max-w-xl rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center">
        <h2 className="text-lg font-medium mb-4">Preparing checkout…</h2>
        <button onClick={start} disabled={fetchStatus === "fetching"} className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-60">
          {fetchStatus === "fetching" ? "Initializing…" : "Start checkout"}
        </button>
      </div>
    </main>
  );
}

function PaymentSection() {
  const { checkout } = useCheckout();
  const { isConfirming, confirm, finalize, error } = checkout;
  const { isFormReady, submit } = usePaymentElement();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!isFormReady || isProcessing) return;
    setIsProcessing(true);
    try {
      const { data } = await submit();
      await confirm(data);
      await finalize({ navigate: () => router.push("/dashboard") });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement fallback={<div>Loading payment element…</div>} />
      {error && <div className="text-red-400 text-sm">{error.message}</div>}
      <button type="submit" disabled={!isFormReady || isProcessing || isConfirming} className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-60">
        {isProcessing || isConfirming ? "Processing…" : "Pay and subscribe"}
      </button>
    </form>
  );
}


