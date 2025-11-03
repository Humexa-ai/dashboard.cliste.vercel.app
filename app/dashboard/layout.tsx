"use client";
import React from "react";
import KokonutLayout from "@/components/kokonutui/layout";
 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <KokonutLayout>{children}</KokonutLayout>;
}



