"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSignUp, useOrganizationList } from "@clerk/nextjs";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive: setActiveSession } = useSignUp();
  const { createOrganization, setActive: setActiveOrganization, isLoaded: orgListLoaded } = useOrganizationList();
  const search = useSearchParams();
  const redirectUrl = search.get("redirect_url") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  // particles backdrop (same as sign-in)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setLoading(true);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status === "complete") {
        await setActiveSession({ session: res.createdSessionId });
        // Give the browser a moment to persist session cookies before calling API
        await new Promise((r) => setTimeout(r, 200));
        // Create organization via server to avoid client hydration timing issues
        if (orgName.trim().length > 0) {
          try {
            const response = await fetch("/api/org/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              cache: "no-store",
              body: JSON.stringify({ name: orgName.trim() }),
            });
            if (response.ok) {
              const data = await response.json();
              // Try to set active org if available; non-blocking
              try {
                let attempts = 0;
                while ((!setActiveOrganization) && attempts < 20) {
                  attempts++;
                  await new Promise((r) => setTimeout(r, 100));
                }
                if (setActiveOrganization && data?.id) {
                  await setActiveOrganization({ organization: data.id });
                }
              } catch {}
            } else {
              const errJson = await response.json().catch(() => ({}));
              console.error("Create org failed:", errJson);
            }
          } catch (orgErr: any) {
            console.error("Organization creation (server) failed", orgErr);
          }
        }
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="relative w-full max-w-sm">
          {/* Logo outside the card, centered above */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-6 card-animate">
            <img src="/cliste-logo.png" alt="Cliste" className="h-20 w-auto" />
          </div>

          {!pendingVerification ? (
            <form onSubmit={handleSignUp} className="card-animate w-full border border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 rounded-xl p-6">
              <div className="space-y-1 mb-5 text-center">
                <h1 className="text-2xl font-semibold">Create your account</h1>
                <p className="text-zinc-400">Sign up to get started</p>
              </div>

              <div className="grid gap-5">
                <div className="grid gap-2">
                  <label htmlFor="org" className="text-zinc-300">Organization name</label>
                  <input id="org" type="text" required value={orgName} onChange={(e)=>setOrgName(e.target.value)} placeholder="Your company / team" className="w-full h-10 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-700" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-zinc-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input id="email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 w-full h-10 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="password" className="text-zinc-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input id="password" type={showPassword?"text":"password"} required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 w-full h-10 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700" />
                    <button type="button" aria-label={showPassword?"Hide password":"Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200" onClick={()=>setShowPassword(v=>!v)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <div className="rounded-md border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-3 py-2">{error}</div>}

                <button type="submit" disabled={loading || !isLoaded} className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50">{loading?"Creating account...":"Create account"}</button>

                <p className="text-center text-sm text-zinc-400">
                  Already have an account? <a href="/sign-in" className="underline text-zinc-200">Sign in</a>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="card-animate w-full border border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 rounded-xl p-6">
              <div className="space-y-1 mb-5 text-center">
                <h1 className="text-2xl font-semibold">Verify your email</h1>
                <p className="text-zinc-400">Enter the 6-digit code sent to {email}</p>
              </div>

              <div className="grid gap-5">
                <div className="grid gap-2">
                  <label htmlFor="code" className="text-zinc-300">Verification code</label>
                  <input id="code" inputMode="numeric" pattern="[0-9]*" maxLength={6} required value={code} onChange={(e)=>setCode(e.target.value)} placeholder="123456" className="w-full h-10 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-700 tracking-widest text-center" />
                </div>

                {error && <div className="rounded-md border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-3 py-2">{error}</div>}

                <button type="submit" disabled={loading || !isLoaded} className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50">{loading?"Verifying...":"Continue"}</button>

                <button type="button" onClick={()=>setPendingVerification(false)} className="text-center text-sm text-zinc-400 hover:text-zinc-200">Go back</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}


