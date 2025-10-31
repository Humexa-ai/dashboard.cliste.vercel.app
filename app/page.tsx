"use client";

import React from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "User Management",
    href: "/users",
    icon: <UserCog className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: "Logout",
    href: "/logout",
    icon: <LogOut className="w-5 h-5" />,
  },
];

export default function SidebarDemo() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            ))}
            {[1, 2].map((item) => (
              <div
                key={item + 3}
                className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 md:col-span-2"
              >
                <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Sidebar>
  );
}

