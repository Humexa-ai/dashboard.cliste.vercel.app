"use client";

import { ClerkProvider, SignIn } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const Beams = dynamic(() => import("@/components/Beams"), { ssr: false });

export default function Page() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} signInUrl="/sign-in" afterSignInUrl="/dashboard">
      <div className="relative min-h-screen overflow-hidden">
        {/* Three.js animated background */}
        <div className="absolute inset-0">
          <Beams beamWidth={2} beamHeight={15} beamNumber={12} lightColor="#ffffff" speed={2} noiseIntensity={1.75} scale={0.2} rotation={0} />
        </div>

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
                card: "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl",
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

