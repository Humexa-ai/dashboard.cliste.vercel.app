"use client";

import * as React from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PlanTier = "Starter" | "Pro" | "Enterprise";

interface PricingCardProps {
  title: PlanTier;
  price: string;
  description?: string;
  features: { text: string; included: boolean }[];
  cta: string;
  featured?: boolean;
  priceId?: string;
  onSelect?: () => void;
  isCurrentPlan?: boolean;
  loading?: boolean;
}

interface PricingProps {
  currentTier?: string;
  onPlanSelect?: (priceId: string, tier: string) => void;
  checkoutLoading?: string | null;
}

export default function Pricing({ currentTier = "free", onPlanSelect, checkoutLoading }: PricingProps) {
  const pricingData: PricingCardProps[] = [
    {
      title: "Starter",
      price: "€300/mo",
      description: "AI Chatbots for automated customer conversations",
      features: [
        { text: "AI Chatbot integration", included: true },
        { text: "WhatsApp, SMS, Messenger support", included: true },
        { text: "Automated booking & FAQs", included: true },
        { text: "Email support", included: true },
        { text: "Basic analytics", included: true },
        { text: "Voice AI agent", included: false },
        { text: "Extended usage limits", included: false },
      ],
      cta: "Choose Starter",
      priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
      featured: false,
    },
    {
      title: "Pro",
      price: "€500/mo",
      description: "Chatbots + Voice AI for complete automation",
      features: [
        { text: "Everything in Starter", included: true },
        { text: "AI Voice Agent (phone calls)", included: true },
        { text: "Advanced sentiment analysis", included: true },
        { text: "Priority support (24/7)", included: true },
        { text: "Advanced analytics & insights", included: true },
        { text: "Custom branding", included: true },
        { text: "Extended usage limits", included: false },
      ],
      cta: "Choose Pro",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      featured: true,
    },
    {
      title: "Enterprise",
      price: "€750/mo",
      description: "Extended usage for high-volume businesses",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Extended usage limits", included: true },
        { text: "Unlimited conversations", included: true },
        { text: "Dedicated AI agent instances", included: true },
        { text: "Custom integrations", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "SLA guarantee", included: true },
      ],
      cta: "Choose Enterprise",
      priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
      featured: false,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 min-[900px]:grid-cols-3">
      {pricingData.map((plan) => {
        const isCurrentPlan = plan.title.toLowerCase() === currentTier.toLowerCase();
        const isLoading = checkoutLoading === plan.title;
        
        return (
          <PricingCard
            key={plan.title}
            plan={{
              ...plan,
              cta: isLoading ? "Processing..." : isCurrentPlan ? "Current Plan" : plan.cta,
              isCurrentPlan,
              loading: isLoading,
              onSelect: () => {
                if (!isCurrentPlan && onPlanSelect && plan.priceId) {
                  onPlanSelect(plan.priceId, plan.title);
                }
              },
            }}
          />
        );
      })}
    </div>
  );
}

function PricingCard({ plan }: { plan: PricingCardProps }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-5 text-left transition hover:border-neutral-700",
        plan.featured && "border-blue-500/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20",
        plan.isCurrentPlan && "border-emerald-500/50 shadow-lg shadow-emerald-500/10"
      )}
      aria-label={`${plan.title} plan`}
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2">
          <Badge 
            variant={plan.featured ? "default" : "secondary"}
            className={cn(
              plan.isCurrentPlan && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            )}
          >
            {plan.title}
          </Badge>
          {plan.featured && !plan.isCurrentPlan && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
              Most popular
            </span>
          )}
          {plan.isCurrentPlan && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
              Current
            </span>
          )}
        </div>
        <h4 className="mb-2 mt-4 text-3xl font-bold text-white">{plan.price}</h4>
        {plan.description && <p className="text-sm text-neutral-400">{plan.description}</p>}
      </div>

      <div className="my-4 border-t border-neutral-800/60" />

      <ul className="space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature.text} className="flex items-start text-sm text-neutral-300">
            <CircleCheck 
              className={cn(
                "mr-2 h-4 w-4 shrink-0 mt-0.5",
                feature.included ? "text-blue-400" : "text-neutral-600"
              )}
              aria-hidden 
            />
            <span className={cn(!feature.included && "text-neutral-500 line-through")}>{feature.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <Button
          size="sm"
          className="w-full cursor-pointer"
          variant={plan.featured ? "default" : "secondary"}
          onClick={plan.onSelect}
          disabled={plan.isCurrentPlan || plan.loading}
        >
          {plan.cta}
        </Button>
      </div>
    </div>
  );
}

