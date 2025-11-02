"use client";

import { OrganizationProfile } from "@clerk/nextjs";

export default function OrgProfilePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-4xl mx-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: "w-full",
            },
          }}
        />
      </div>
    </main>
  );
}


