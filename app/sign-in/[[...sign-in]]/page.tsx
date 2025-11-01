"use client";

import { ClerkProvider, SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} signInUrl="/sign-in" afterSignInUrl="/dashboard">
      <div className="relative min-h-screen overflow-hidden">
        {/* Background gradient and glow accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0118] via-[#0a0a0a] to-[#1f1147]" />
        <div className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[#7c3aed]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full bg-[#22d3ee]/20 blur-3xl" />

        {/* Content */}
        <div className="relative grid min-h-screen place-items-center p-6">
          <SignIn
            appearance={{
              variables: {
                colorBackground: 'transparent',
                colorText: '#ffffff',
                colorInputText: '#ffffff',
              },
              elements: {
                card: "bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl",
                headerTitle: "text-white",
                headerSubtitle: "text-white/70",
                formFieldLabel: "text-white",
                formFieldInput: "bg-white/10 border-white/10 placeholder-white/50 text-white",
                formButtonPrimary: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white",
                footerAction: "hidden",
                footerActionLink: "hidden",
              },
            }}
          />
        </div>
      </div>
    </ClerkProvider>
  );
}

