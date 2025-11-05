"use client";
import React, { useState, useEffect } from "react";
import { LayoutDashboard, User, FileText, MessageSquare, Sparkles, Mic, BookOpen, CreditCard, Megaphone, Menu, Settings, Globe, ChevronDown, X, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PanzeLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("/dashboard");
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [isReady, setIsReady] = useState(false);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);
    }
  }, []);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Personal", href: "#", icon: User },
    { label: "Use Cases Templates", href: "#", icon: FileText },
    { label: "Chat Templates", href: "#", icon: MessageSquare },
    { label: "AI Features", href: "#", icon: Sparkles },
    { label: "AI Voices", href: "#", icon: Mic },
    { label: "Blogs", href: "#", icon: BookOpen },
    { label: "Subscriptions", href: "/api/billing/portal", icon: CreditCard },
    { label: "Marketing", href: "#", icon: Megaphone },
    { label: "Menus", href: "#", icon: Menu },
    { label: "Website Setup", href: "#", icon: Settings },
    { label: "Media Manager", href: "#", icon: FileText },
    { label: "Support Tickets", href: "#", icon: MessageSquare },
    { label: "Tools", href: "#", icon: Settings },
  ];

  if (!isReady || !hasSession) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-600 text-white shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-purple-600 text-white transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-purple-500">
            <h1 className="text-xl font-semibold text-white">panze studio</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePath === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setActivePath(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group",
                      isActive
                        ? "bg-purple-700 text-white"
                        : "text-purple-100 hover:bg-purple-500/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-purple-500">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/sign-in";
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-purple-100 hover:bg-purple-500/50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-white hover:bg-purple-500/50"
        >
          <X className="h-5 w-5" />
        </button>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white rounded-tl-2xl lg:rounded-none">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

