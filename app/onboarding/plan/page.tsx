"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, PricingTable, useOrganization } from "@clerk/nextjs";
import { useEffect as useClientEffect } from "react";

export default function PlanSelectionPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { organization } = useOrganization();

  // If signed in but no organization selected, send user to org profile first
  useClientEffect(() => {
    if (organization === null) {
      window.location.href = "/org/profile";
    }
  }, [organization]);

  // reuse subtle particles background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    type P = { x: number; y: number; v: number; o: number };
    let ps: P[] = [];
    let raf = 0;
    const make = (): P => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, v: Math.random() * 0.25 + 0.05, o: Math.random() * 0.35 + 0.15 });
    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) ps.push(make());
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250,250,250,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };
    const onResize = () => {
      setSize();
      init();
    };
    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Using Clerk hosted checkout via PricingTable; no explicit handler needed

  return (
        <section className="fixed inset-0 bg-zinc-950 text-zinc-50">
          <style>{`
            .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
            .hline,.vline{position:absolute;background:#27272a;will-change:transform,opacity}
            .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
            .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
            .hline:nth-child(1){top:18%;animation-delay:.12s}
            .hline:nth-child(2){top:50%;animation-delay:.22s}
            .hline:nth-child(3){top:82%;animation-delay:.32s}
            .vline:nth-child(4){left:22%;animation-delay:.42s}
            .vline:nth-child(5){left:50%;animation-delay:.54s}
            .vline:nth-child(6){left:78%;animation-delay:.66s}
            .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(250,250,250,.24),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
            .hline:nth-child(1)::after{animation-delay:.12s}
            .hline:nth-child(2)::after{animation-delay:.22s}
            .hline:nth-child(3)::after{animation-delay:.32s}
            .vline:nth-child(4)::after{animation-delay:.42s}
            .vline:nth-child(5)::after{animation-delay:.54s}
            .vline:nth-child(6)::after{animation-delay:.66s}
            @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
            @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
            @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}
            .card-animate{opacity:0;transform:translateY(20px);animation:fadeUp .8s cubic-bezier(.22,.61,.36,1) .4s forwards}
            @keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
          `}</style>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />

          {/* Accent lines */}
          <div className="accent-lines">
            <div className="hline" />
            <div className="hline" />
            <div className="hline" />
            <div className="vline" />
            <div className="vline" />
            <div className="vline" />
          </div>

          {/* Particles */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none" />

          {/* Card */}
          <div className="h-full w-full grid place-items-center px-4">
            <div className="relative w-full max-w-3xl">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-6 card-animate">
                <img src="/cliste-logo.png" alt="Cliste" className="h-20 w-auto" />
              </div>

              <div className="card-animate w-full border border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 rounded-xl p-6">
                <div className="mb-6 text-center">
                  <h1 className="text-2xl font-semibold">Choose your plan</h1>
                  <p className="text-zinc-400">Select a plan to continue to your dashboard</p>
                </div>
                <SignedOut>
                  <div className="text-center">
                    <Link href="/sign-in?redirect_url=/org/profile" className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200">
                      Sign in to choose a plan
                    </Link>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="max-w-4xl mx-auto">
                    <PricingTable for="organization" redirectUrl="/dashboard" />
                  </div>
                  <div className="mt-6 text-center text-xs text-zinc-500">Plans are managed in Clerk Billing. After subscribing you will be redirected to your dashboard.</div>
                </SignedIn>
              </div>
            </div>
          </div>
        </section>
  );
}


