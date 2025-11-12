"use client";

import React, { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Phone, Share2, Globe, Mail, TrendingUp, TrendingDown, Calendar, MessagesSquare, Clock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<string>("Today");
  const [lastSynced, setLastSynced] = useState<string>("Just now");
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Try to get firstName from user_metadata
        const firstName = session.user.user_metadata?.firstName as string;
        
        // If no firstName, try to extract from email
        if (!firstName && session.user.email) {
          const emailName = session.user.email.split("@")[0];
          // Capitalize first letter
          const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          setUserName(capitalizedName);
        } else if (firstName) {
          setUserName(firstName);
        } else {
          setUserName("");
        }

        // Get company name from metadata
        const company = session.user.user_metadata?.company_name || session.user.user_metadata?.organization_name;
        setCompanyName(company || "Cliste Limited");
      }
      setLoading(false);
    };
    fetchUser();

    // Track when the page loaded
    const loadTime = Date.now();
    
    // Update last synced timestamp every 30 seconds
    const syncInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - loadTime) / 1000);
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      
      if (elapsedSeconds < 60) {
        setLastSynced("Just now");
      } else if (elapsedMinutes === 1) {
        setLastSynced("1 minute ago");
      } else {
        setLastSynced(`${elapsedMinutes} minutes ago`);
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [supabase]);

  const metrics = [
    {
      title: "Total Voice Agent Interactions",
      value: "387",
      change: "+15.3",
      changeType: "increase" as const,
      period: "vs last week",
      icon: Phone,
    },
    {
      title: "Total Social Interactions",
      value: "214",
      change: "-8.2",
      changeType: "decrease" as const,
      period: "vs last week",
      icon: Share2,
    },
    {
      title: "Total Website Interactions",
      value: "2,134",
      change: "+18.9",
      changeType: "increase" as const,
      period: "vs last week",
      icon: Globe,
    },
    {
      title: "Total Email Interactions",
      value: "542",
      change: "+12.4",
      changeType: "increase" as const,
      period: "vs last week",
      icon: Mail,
    },
  ];

  const bookings = [
    { time: "10:00 AM", date: "Tomorrow", client: "Sarah Johnson", type: "Haircut & Style", status: "Booked", initials: "SJ" },
    { time: "2:30 PM", date: "Nov 7", client: "Emma Wilson", type: "Color Consultation", status: "Booked", initials: "EW" },
    { time: "4:00 PM", date: "Nov 8", client: "Mike Davis", type: "Haircut", status: "Booked", initials: "MD" },
    { time: "5:30 PM", date: "Next Week", client: "Lisa Anderson", type: "Highlights", status: "Booked", initials: "LA" },
  ];

  const inquiries = [
    { type: "Voice Call", client: "Emma Wilson", duration: "12 min", detail: "Haircut", status: "Booked", time: "2 hours ago", initials: "EW" },
    { type: "Chat", client: "Robert Brown", duration: "8 min", detail: "Color", status: "Booked", time: "3 hours ago", initials: "RB" },
    { type: "Voice Call", client: "Lisa Anderson", duration: "15 min", detail: "Treatment", status: "Inquiry", time: "5 hours ago", initials: "LA" },
    { type: "Chat", client: "Michael Chen", duration: "10 min", detail: "Blowout", status: "Booked", time: "6 hours ago", initials: "MC" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col gap-4 md:gap-7"
    >
      {/* Mobile-only message */}
      <div className="md:hidden rounded-lg border border-neutral-700/50 bg-neutral-800/30 px-4 py-3">
        <p className="text-xs text-neutral-300 text-center">
          💻 For full access to all features and pages, please log in on your computer. Mobile version is currently in development.
        </p>
      </div>
      
      <section className="grid gap-3 lg:grid-cols-[1.65fr,1fr]">
        <div className="rounded-2xl border border-neutral-800/70 bg-neutral-950/60 p-4 shadow-[0_16px_48px_-40px_rgba(0,0,0,0.65)] md:p-6 lg:p-7">
          <div className="flex flex-col gap-3">
            {/* Mobile logo */}
            <div className="md:hidden mb-2">
              <Image
                src="/cliste-logo.png"
                alt="Cliste"
                width={40}
                height={40}
                className="opacity-90"
              />
            </div>
            
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  Dashboard overview
                </p>
                <h1 className="text-xl font-semibold text-white md:text-2xl lg:text-3xl">
                  Hi, welcome back {userName || "there"} 👋
                </h1>
                <p className="text-xs text-neutral-400">
                  Track your AI agent performance and customer interactions across all channels.
                </p>
              </div>
              <div className="w-full lg:max-w-sm">
                <div className="inline-flex w-full items-center justify-between rounded-full border border-neutral-800/70 bg-neutral-900/60 p-1">
                  {["Today", "Last 7 Days", "Last 4 Weeks"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setTimeFilter(filter)}
                      className={`flex-1 rounded-full px-2 py-2 text-[11px] font-medium transition md:px-3 md:py-1.5 md:text-xs md:cursor-pointer ${
                        timeFilter === filter
                          ? "bg-neutral-800 text-white shadow-sm"
                          : "text-neutral-400 md:hover:text-white"
                      } md:hover:enabled:cursor-pointer cursor-default pointer-events-none md:pointer-events-auto`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                const trendBadgeClasses =
                  metric.changeType === "increase"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400";
                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl border border-neutral-800/70 bg-neutral-900/70 p-3 shadow-inner transition md:hover:border-neutral-700 md:p-4 cursor-pointer"
                  >
                    <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5 md:space-y-2">
                        <div className="space-y-0.5 md:space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500 md:text-xs">
                            {metric.title}
                          </p>
                          <p className="text-2xl font-semibold text-white md:text-3xl">{metric.value}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 md:gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium md:px-2 md:text-[11px] ${trendBadgeClasses}`}
                          >
                            {metric.changeType === "increase" ? (
                              <TrendingUp className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            ) : (
                              <TrendingDown className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            )}
                            {metric.change}%
                          </span>
                          <span className="text-[10px] md:text-xs">{metric.period}</span>
                        </div>
                      </div>
                      <div className="rounded-lg border border-neutral-800/70 bg-neutral-900/70 p-2 text-neutral-300 md:p-2.5">
                        <Icon className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-800/70 bg-neutral-950/60 shadow-[0_16px_48px_-40px_rgba(0,0,0,0.75)]">
          <div className="border-b border-neutral-800/50 bg-gradient-to-b from-neutral-900/40 to-transparent px-4 py-3 md:px-5 md:py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  Pipeline focus
                </p>
                <h2 className="text-base font-semibold text-white md:text-lg">Bookings & inquiries</h2>
                <p className="text-xs text-neutral-400">
                  Real-time view of upcoming appointments and active customer conversations.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 self-start">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-emerald-300">Live sync</span>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-neutral-800/30 lg:grid-cols-2">
            {/* Bookings */}
            <div className="bg-neutral-950/60 p-4 md:p-6 lg:p-7">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-white/10 p-2">
                    <Calendar className="h-4 w-4 text-white/60" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Next bookings</h3>
                </div>
                <button className="hidden md:block cursor-pointer text-xs font-medium text-neutral-400 transition hover:text-white">
                  View schedule →
                </button>
              </div>
              <div className="space-y-2">
                {bookings.map((booking, index) => (
                  <div key={index}>
                    {/* Mobile layout */}
                    <div className="group rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-3 py-3 md:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-white">{booking.time}</span>
                            <span className="text-xs text-neutral-400">{booking.date}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-white truncate">{booking.client}</span>
                            <span className="text-xs text-neutral-400 truncate">{booking.type}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="text-xs font-medium text-emerald-400">{booking.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Desktop layout */}
                    <div className="group hidden grid-cols-[80px_1fr_100px_80px] items-center gap-4 rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-4 py-4 transition hover:border-neutral-700/60 hover:bg-neutral-900/50 md:grid cursor-pointer">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{booking.time}</span>
                        <span className="text-xs text-neutral-400">{booking.date}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-white truncate">{booking.client}</span>
                        <span className="text-xs text-neutral-400 truncate">{booking.type}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">{booking.status}</span>
                      </div>
                      <div className="flex justify-end">
                        <button className="cursor-pointer rounded-md bg-neutral-800/60 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiries */}
            <div className="bg-neutral-950/60 p-4 md:p-6 lg:p-7">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-emerald-500/10 p-2">
                    <MessagesSquare className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Active inquiries</h3>
                </div>
                <button className="hidden md:block cursor-pointer text-xs font-medium text-neutral-400 transition hover:text-emerald-300">
                  Open inbox →
                </button>
              </div>
              <div className="space-y-2">
                {inquiries.map((inquiry, index) => (
                  <div key={index}>
                    {/* Mobile layout */}
                    <div className="group rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-3 py-3 md:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-white">{inquiry.type}</span>
                            <span className="text-xs text-neutral-400">{inquiry.time}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-white truncate">{inquiry.client}</span>
                            <span className="text-xs text-neutral-400 truncate">{inquiry.detail}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${inquiry.status === 'Booked' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                            <span className={`text-xs font-medium ${inquiry.status === 'Booked' ? 'text-emerald-400' : 'text-blue-400'}`}>{inquiry.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Desktop layout */}
                    <div className="group hidden grid-cols-[80px_1fr_100px_80px] items-center gap-4 rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-4 py-4 transition hover:border-neutral-700/60 hover:bg-neutral-900/50 md:grid cursor-pointer">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{inquiry.type}</span>
                        <span className="text-xs text-neutral-400">{inquiry.time}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-white truncate">{inquiry.client}</span>
                        <span className="text-xs text-neutral-400 truncate">{inquiry.detail}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${inquiry.status === 'Booked' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                        <span className={`text-xs font-medium ${inquiry.status === 'Booked' ? 'text-emerald-400' : 'text-blue-400'}`}>{inquiry.status}</span>
                      </div>
                      <div className="flex justify-end">
                        <button className="cursor-pointer rounded-md bg-neutral-800/60 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer integrated */}
          <div className="border-t border-neutral-800/50 bg-neutral-950/60 px-4 py-3 md:px-5 md:py-4">
            <div className="flex flex-col items-center justify-between gap-2 text-xs text-neutral-400 md:flex-row md:gap-3">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                <span className="font-medium text-neutral-300">v1.0.0</span>
                <span className="hidden md:inline">•</span>
                <span>Last synced: {lastSynced}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-neutral-300">All systems operational</span>
                </div>
                <span className="hidden md:inline">•</span>
                <span>Signed into <span className="font-medium text-neutral-300">{companyName}</span></span>
              </div>
              <div className="text-center md:text-left">
                <span>© 2025 Cliste. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}





