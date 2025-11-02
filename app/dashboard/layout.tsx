"use client";
import React, { useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import KokonutLayout from "@/components/kokonutui/layout";
 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organization } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (organization === null) {
      router.replace("/org/profile");
    }
  }, [organization, router]);

  return <KokonutLayout>{children}</KokonutLayout>;
}



