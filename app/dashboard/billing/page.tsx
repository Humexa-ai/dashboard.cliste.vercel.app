"use client";

import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { CreditCard, Calendar, CheckCircle, AlertCircle, TrendingUp, Download, ExternalLink, Loader2 } from "lucide-react";
import Pricing from "@/components/Pricing";
import { Button } from "@/components/ui/button";

type SubscriptionTier = "free" | "starter" | "pro" | "enterprise";

type BillingData = {
  hasSubscription: boolean;
  tier: SubscriptionTier;
  subscription?: {
    id: string;
    status: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
    cancelAt: number | null;
    trialEnd: number | null;
  };
  product?: {
    id: string;
    name: string;
    description: string;
  };
  price?: {
    id: string;
    amount: number;
    currency: string;
    interval: string;
    intervalCount: number;
  };
  paymentMethod?: {
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  };
  invoices?: Array<{
    id: string;
    number: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
    periodStart: number;
    periodEnd: number;
    pdfUrl: string;
    hostedUrl: string;
  }>;
};


export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      console.log("Fetching billing data from /api/billing/summary");
      const response = await fetch("/api/billing/summary");
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || `API returned ${response.status}`;
        console.error("API error:", errorMsg, errorData);
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      console.log("Billing data received:", data);
      console.log("cancelAtPeriodEnd:", data?.subscription?.cancelAtPeriodEnd);
      console.log("Full subscription:", data?.subscription);
      setBillingData(data);
    } catch (e: any) {
      console.error("Error fetching billing data:", e);
      setError(e.message || "Failed to fetch billing data");
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setCheckoutLoading("portal");
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      console.error("Error opening billing portal:", e);
      alert("Failed to open billing portal");
      setCheckoutLoading(null);
    }
  };

  const handleUpgrade = async (priceId: string, tier: string) => {
    if (!priceId) {
      alert("Price ID not configured for this tier. Please contact support.");
      return;
    }

    try {
      setCheckoutLoading(tier);
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      console.error("Error creating checkout:", e);
      alert("Failed to start checkout");
      setCheckoutLoading(null);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-neutral-800/80 bg-neutral-950/60">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-sm text-neutral-400">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-neutral-800/80 bg-neutral-950/60">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-400" />
          <p className="mt-3 text-sm font-medium text-neutral-300">Failed to load billing data</p>
          <p className="mt-1 text-xs text-neutral-500">{error}</p>
          <Button onClick={fetchBillingData} className="mt-4 cursor-pointer" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const currentTier = billingData?.tier || "free";
  const isCanceling = billingData?.subscription?.cancelAtPeriodEnd || billingData?.subscription?.cancelAt;
  
  // Use cancelAt if canceling, otherwise use currentPeriodEnd
  const nextBillingDate = isCanceling && billingData?.subscription?.cancelAt
    ? formatDate(billingData.subscription.cancelAt)
    : billingData?.subscription?.currentPeriodEnd
      ? formatDate(billingData.subscription.currentPeriodEnd)
      : null;
      
  const planName = billingData?.product?.name || "Free Plan";
  const planAmount = billingData?.price?.amount
    ? formatAmount(billingData.price.amount, billingData.price.currency)
    : "€0";
  const planInterval = billingData?.price?.interval || "month";
  
  console.log("Is Canceling:", isCanceling);
  console.log("Cancel At timestamp:", billingData?.subscription?.cancelAt);
  console.log("Next Billing Date:", nextBillingDate);
  console.log("Should show end date:", isCanceling && nextBillingDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/60"
    >
      {/* Header */}
      <header className="shrink-0 border-b border-neutral-800/70 px-5 py-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Billing & Subscription</h1>
          <p className="mt-0.5 text-xs text-neutral-400">Manage your subscription and billing information</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="space-y-6">
          {/* Current Subscription Overview */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-white">Current Subscription</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Plan Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                      <span className="text-sm font-medium text-neutral-400">Plan</span>
                    </div>
                    <h3 className="mt-2 text-2xl font-bold text-white">{planName}</h3>
                    <p className="mt-1 text-sm text-neutral-400">
                      {planAmount} per {planInterval}
                    </p>
                    {isCanceling && nextBillingDate && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-1.5">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-medium text-amber-400">
                          Ends {nextBillingDate}
                        </span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      billingData?.subscription?.cancelAtPeriodEnd || billingData?.subscription?.cancelAt
                        ? "bg-amber-500/10 text-amber-400"
                        : billingData?.subscription?.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : billingData?.subscription?.status === "trialing"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-neutral-500/10 text-neutral-400"
                    }`}
                  >
                    {billingData?.subscription?.cancelAtPeriodEnd || billingData?.subscription?.cancelAt
                      ? "Canceling"
                      : billingData?.subscription?.status === "active"
                        ? "Active"
                        : billingData?.subscription?.status === "trialing"
                          ? "Trial"
                          : "Inactive"}
                  </span>
                </div>
                {!isCanceling && nextBillingDate && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-neutral-800/40 p-3">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                    <span className="text-xs text-neutral-300">
                      Next billing date: {nextBillingDate}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Payment Method Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-purple-400" />
                      <span className="text-sm font-medium text-neutral-400">Payment Method</span>
                    </div>
                    {billingData?.paymentMethod ? (
                      <>
                        <h3 className="mt-2 text-xl font-semibold text-white">
                          {billingData.paymentMethod.brand.toUpperCase()} •••• {billingData.paymentMethod.last4}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-400">
                          Expires {billingData.paymentMethod.expMonth}/{billingData.paymentMethod.expYear}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-neutral-400">No payment method on file</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleManageBilling}
                  disabled={checkoutLoading === "portal"}
                  className="mt-4 w-full cursor-pointer justify-start rounded-lg bg-neutral-800/40 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  {checkoutLoading === "portal" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Manage Billing
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Available Plans */}
          <section className="border-t border-neutral-800/40 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Change Plan</h2>
            <p className="mb-5 text-sm text-neutral-400">Upgrade or downgrade your subscription</p>
            <Pricing 
              currentTier={currentTier} 
              onPlanSelect={handleUpgrade}
              checkoutLoading={checkoutLoading}
            />
          </section>

          {/* Invoice History */}
          {billingData?.invoices && billingData.invoices.length > 0 && (
            <section className="border-t border-neutral-800/40 pt-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Invoice History</h2>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-900/40"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-neutral-800/60 bg-neutral-900/60">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                          Invoice
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                          Period
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {billingData.invoices.map((invoice, index) => (
                        <motion.tr
                          key={invoice.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="transition hover:bg-neutral-800/20"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-white">
                            {invoice.number || invoice.id.substring(0, 12)}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-300">
                            {formatDate(invoice.created)}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-300">
                            {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-white">
                            {formatAmount(invoice.amount, invoice.currency)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                invoice.status === "paid"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : invoice.status === "open"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-rose-500/10 text-rose-400"
                              }`}
                            >
                              {invoice.status === "paid" ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {invoice.pdfUrl && (
                              <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="cursor-pointer text-neutral-400 hover:text-white"
                                >
                                  <Download className="mr-1.5 h-3.5 w-3.5" />
                                  Download
                                </Button>
                              </a>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </section>
          )}

          {/* Danger Zone */}
          {billingData?.hasSubscription && (
            <section className="border-t border-neutral-800/40 pt-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Danger Zone</h2>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Cancel Subscription</h3>
                    <p className="mt-1 text-xs text-neutral-400">
                      Manage your subscription cancellation through the billing portal.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer shrink-0"
                    onClick={handleManageBilling}
                  >
                    Manage
                  </Button>
                </div>
              </motion.div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
}
