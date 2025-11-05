"use client";
import React, { useState, useEffect } from "react";
import { LayoutDashboard, MessagesSquare, Phone, Calendar, CalendarCheck, Package, CreditCard, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NixtioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (!session) {
        router.replace("/sign-in");
      } else {
        setHasSession(true);
      }
      setIsReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  if (!isReady || !hasSession) {
    return null;
  }

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Chats", href: "/dashboard/chats", icon: MessagesSquare },
    { label: "Voice Calls", href: "/dashboard/calls", icon: Phone },
    { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { label: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
    { label: "Catalog", href: "/dashboard/catalog", icon: Package },
    { label: "Billing", href: "/api/billing/portal", icon: CreditCard },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8">
      <div className="rounded-2xl bg-neutral-900 flex flex-col md:flex-row h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-neutral-900 rounded-tl-2xl rounded-bl-2xl flex flex-col flex-shrink-0">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-800">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="text-white font-semibold text-lg">ClisteOS</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setActivePath(item.href)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all",
                    isActive
                      ? "bg-white text-neutral-900"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Button */}
          <div className="p-4 border-t border-neutral-800">
            <button className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition-colors">
              Get in touch
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-neutral-900 rounded-tr-2xl rounded-br-2xl overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}

