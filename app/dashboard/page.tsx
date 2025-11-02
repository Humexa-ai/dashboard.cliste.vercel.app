"use client";

import { SignedIn, SignedOut, UserButton, useUser, useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import KpiCard from "@/components/dashboard/KpiCard";
import SectionCard from "@/components/dashboard/SectionCard";

function DashboardContent() {
  const { user } = useUser();
  const { organization } = useOrganization();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 sticky top-0 z-10 backdrop-blur bg-black/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <span className="hidden sm:inline text-xs text-white/60">Overview</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10">Today</button>
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Greeting */}
        <div className="mb-6 text-white/70 text-sm">
          {organization?.name ? (
            <>Signed in to {organization.name}</>
          ) : (
            <>Signed in as {user?.emailAddresses?.[0]?.emailAddress}</>
          )}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Bookings (today)" value="24" delta="+12% vs 7d" />
          <KpiCard label="Calls (today)" value="18" delta="-5% vs 7d" />
          <KpiCard label="Messages" value="342" delta="+8% vs 7d" />
          <KpiCard label="New leads" value="31" delta="+3% vs 7d" />
          <KpiCard label="Completed appts" value="12" delta="+2% vs 7d" />
          <KpiCard label="Staff activity" value="82%" delta="+4% vs 7d" />
        </div>

        {/* Charts + Activity */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SectionCard title="Messages by channel" subtitle="Today vs 7 days">
            <div className="h-40 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-white/50 text-sm">Chart placeholder</div>
          </SectionCard>
          <SectionCard title="Calls trend" subtitle="Last 7 days">
            <div className="h-40 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-white/50 text-sm">Chart placeholder</div>
          </SectionCard>
          <SectionCard title="Staff utilization" subtitle="Today">
            <div className="h-40 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-white/50 text-sm">Chart placeholder</div>
          </SectionCard>
        </div>

        {/* Agenda + Feed */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SectionCard title="Today’s agenda" subtitle="Upcoming bookings">
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"><span>09:30 • Cut & Style – Sarah</span><span className="text-white/60">John</span></li>
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"><span>11:00 • House Viewing – Cork</span><span className="text-white/60">Ava</span></li>
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"><span>14:00 • Test Drive – Golf GTI</span><span className="text-white/60">Liam</span></li>
            </ul>
          </SectionCard>
          <SectionCard title="Activity feed" subtitle="Latest updates">
            <ul className="space-y-2 text-sm text-white/80">
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">New booking confirmed • 2m ago</li>
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Payment received from ACME • 12m ago</li>
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">AI replied on WhatsApp • 22m ago</li>
            </ul>
          </SectionCard>
          <SectionCard title="Systems" subtitle="Connections status">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">WhatsApp • <span className="text-emerald-400">Connected</span></div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Messenger • <span className="text-emerald-400">Connected</span></div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Instagram • <span className="text-emerald-400">Connected</span></div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Stripe • <span className="text-amber-400">Action</span></div>
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <SignedIn>
        <DashboardContent />
      </SignedIn>
      <SignedOut>
        <main className="min-h-screen grid place-items-center p-8 bg-[#0a0a0a] text-white">
          <div className="text-center space-y-3">
            <p>You are signed out.</p>
            <Link href="/sign-in" className="text-[#a78bfa] underline">Go to sign-in</Link>
          </div>
        </main>
      </SignedOut>
    </>
  );
}
