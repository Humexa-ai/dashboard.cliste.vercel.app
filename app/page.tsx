"use client";

import React from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/sidebar";
import { Home, BarChart3, Settings, Users, FileText, Bell, LogOut } from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Users",
    href: "/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Documents",
    href: "/documents",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function DashboardPage() {
  return (
    <Sidebar>
      <div className="flex h-screen w-full">
        <SidebarBody className="border-r border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col gap-2 h-full">
            <div className="flex flex-col gap-2 px-2 py-4">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 px-2">
                Aceternity
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 px-2">
                UI Components
              </p>
            </div>
            <div className="flex flex-col gap-2 px-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
        <main className="flex-1 overflow-auto p-8">
          {/* Empty main content - just showing the sidebar */}
        </main>
      </div>
    </Sidebar>
  );
}
