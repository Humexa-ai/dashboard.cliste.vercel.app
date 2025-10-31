"use client";

import React from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/sidebar";
import { Home, BarChart3, Settings, Users, FileText, Bell, LogOut } from "lucide-react";
import { UserButton } from '@clerk/nextjs';

const links = [
  {
    label: "Home",
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
    label: "Notifications",
    href: "/notifications",
    icon: <Bell className="w-5 h-5" />,
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
                Cliste Dashboard
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 px-2">
                Welcome back
              </p>
            </div>
            <div className="flex flex-col gap-2 px-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
            <div className="mt-auto p-2">
              <div className="flex items-center gap-2">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </SidebarBody>
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Cliste Dashboard
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              Your beautiful dashboard with an animated sidebar is ready!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Card {item}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    This is a sample card component in your dashboard.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </Sidebar>
  );
}
