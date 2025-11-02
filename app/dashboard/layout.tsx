import React from "react";
import KokonutLayout from "@/components/kokonutui/layout";
 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protected by middleware; render layout directly
  return <KokonutLayout>{children}</KokonutLayout>;
}



