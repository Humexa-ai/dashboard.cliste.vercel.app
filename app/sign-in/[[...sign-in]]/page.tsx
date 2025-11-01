"use client";

import { ClerkProvider, SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} signInUrl="/sign-in" afterSignInUrl="/dashboard">
      <div className="min-h-screen grid place-items-center p-6 bg-[#0a0a0a]">
        <SignIn
          appearance={{
            elements: {
              card: "bg-black/40 backdrop-blur border border-white/10",
              formButtonPrimary: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white",
              footerAction: "hidden",
              footerActionLink: "hidden",
            },
          }}
        />
      </div>
    </ClerkProvider>
  );
}

