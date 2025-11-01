"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

function DashboardContent() {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold">Cliste Dashboard</h1>
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-2 text-2xl font-semibold">Welcome</h2>
        <p className="text-white/70">
          {user?.emailAddresses?.[0]?.emailAddress ?? "You're signed in."}
        </p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-6">
            <p className="text-white/80">Your dashboard content goes here.</p>
          </div>
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
            <Link href="/sign-in" className="text-[#a78bfa] underline">
              Go to sign-in
            </Link>
          </div>
        </main>
      </SignedOut>
    </>
  );
}
