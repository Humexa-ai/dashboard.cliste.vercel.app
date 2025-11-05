"use client";

import React, { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Phone, Share2, Globe, Mail, TrendingUp, TrendingDown, Calendar, MessagesSquare, Clock } from "lucide-react";

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<string>("Today");
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
      }
      setLoading(false);
    };
    fetchUser();
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

  return (
    <div className="w-full space-y-6">
      {/* Greeting Section */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Hi, Welcome back {userName || "there"} 👋
        </h1>
        
        {/* Line under greeting */}
        <div className="border-b border-neutral-800"></div>
      </div>

      {/* Filter for Total Voice Agent Interactions */}
      <div className="flex gap-2 mb-4">
        {["Today", "Last 7 Days", "Last 4 Weeks"].map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeFilter === filter
                ? "bg-neutral-800 text-white border border-neutral-700"
                : "bg-neutral-900/40 text-neutral-400 hover:text-white border border-neutral-800/50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="relative p-6 rounded-xl border border-neutral-800/50 bg-neutral-900/40 backdrop-blur-md hover:bg-neutral-900/50 transition-all duration-300"
            >
                {/* Glass morphism effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">{metric.title}</p>
                      <p className="text-3xl font-bold text-white">{metric.value}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50">
                      <Icon className="h-5 w-5 text-neutral-300" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${
                        metric.changeType === "increase" 
                          ? "bg-green-500/10 border border-green-500/20" 
                          : "bg-red-500/10 border border-red-500/20"
                      }`}>
                        {metric.changeType === "increase" ? (
                          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        )}
                        <span className={`text-sm font-semibold ${
                          metric.changeType === "increase" ? "text-green-500" : "text-red-500"
                        }`}>
                          {metric.change}%
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500">{metric.period}</span>
                    </div>
                  </div>
                </div>
              </div>
          );
        })}
      </div>

      {/* Today's Bookings and Today's Interactions Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Bookings Section */}
        <div className="relative p-6 rounded-xl border border-neutral-800/50 bg-neutral-900/40 backdrop-blur-md">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neutral-800/50">
                  <Calendar className="h-5 w-5 text-neutral-300" />
                </div>
                <h2 className="text-lg font-semibold text-white">Today's Bookings</h2>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { time: "10:00 AM", date: "Tomorrow", client: "Sarah Johnson", type: "Haircut & Style", status: "Booked", initials: "SJ" },
                { time: "2:30 PM", date: "Nov 7", client: "Emma Wilson", type: "Color Consultation", status: "Booked", initials: "EW" },
                { time: "4:00 PM", date: "Nov 8", client: "Mike Davis", type: "Haircut", status: "Booked", initials: "MD" },
                { time: "5:30 PM", date: "Next Week", client: "Lisa Anderson", type: "Highlights", status: "Booked", initials: "LA" },
              ].map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/30 border border-neutral-700/30 hover:bg-neutral-800/40 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col items-center justify-center min-w-[55px]">
                      <Clock className="h-3 w-3 text-neutral-400 mb-0.5" />
                      <span className="text-[10px] font-medium text-neutral-300 leading-tight">{booking.time}</span>
                      <span className="text-[9px] text-neutral-500 leading-tight">{booking.date}</span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-neutral-700/50 border border-neutral-600/50 flex items-center justify-center">
                      <span className="text-xs font-medium text-neutral-300">{booking.initials}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-0.5">{booking.client}</p>
                      <p className="text-xs text-neutral-400">{booking.type}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-medium bg-neutral-800/50 text-neutral-300 border border-neutral-700/50">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Chats/Calls Section */}
        <div className="relative p-6 rounded-xl border border-neutral-800/50 bg-neutral-900/40 backdrop-blur-md">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neutral-800/50">
                  <MessagesSquare className="h-5 w-5 text-neutral-300" />
                </div>
                <h2 className="text-lg font-semibold text-white">Today's Interactions</h2>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { type: "Voice Call", client: "Emma Wilson", duration: "12 min", detail: "Haircut", status: "Booked", time: "2 hours ago", initials: "EW" },
                { type: "Chat", client: "Robert Brown", duration: "8 min", detail: "Color", status: "Booked", time: "3 hours ago", initials: "RB" },
                { type: "Voice Call", client: "Lisa Anderson", duration: "15 min", detail: "Treatment", status: "Inquiry", time: "5 hours ago", initials: "LA" },
                { type: "Chat", client: "Michael Chen", duration: "10 min", detail: "Blowout", status: "Booked", time: "6 hours ago", initials: "MC" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/30 border border-neutral-700/30 hover:bg-neutral-800/40 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                      {activity.type === "Voice Call" ? (
                        <Phone className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <MessagesSquare className="h-4 w-4 text-neutral-400" />
                      )}
                    </div>
                    <div className="h-9 w-9 rounded-full bg-neutral-700/50 border border-neutral-600/50 flex items-center justify-center">
                      <span className="text-xs font-medium text-neutral-300">{activity.initials}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-0.5">{activity.client}</p>
                      <p className="text-xs text-neutral-400">{activity.type} • {activity.duration} • {activity.time}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-medium bg-neutral-800/50 text-neutral-300 border border-neutral-700/50">
                    {activity.detail} - {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





