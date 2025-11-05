"use client";
import React from "react";
import { Search, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Overview() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-neutral-400" />
          </button>
          <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
            <User className="h-4 w-4 text-neutral-400" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-900">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Bookings"
            value="1,247"
            subtitle="This month"
            bgColor="bg-blue-500/20"
            borderColor="border-blue-500/30"
            textColor="text-white"
          />
          <StatCard
            title="Messages"
            value="3,842"
            subtitle="Unread: 12"
            bgColor="bg-purple-500/20"
            borderColor="border-purple-500/30"
            textColor="text-white"
          />
          <StatCard
            title="Revenue"
            value="€45,283"
            subtitle="+12.5% from last month"
            bgColor="bg-green-500/20"
            borderColor="border-green-500/30"
            textColor="text-green-400"
          />
        </div>

        {/* Activity Chart */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Weekly Activity</h2>
            <span className="text-sm text-neutral-400">Last 7 days</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 65, 55, 75, 60, 80, 70].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg hover:opacity-80 transition-opacity"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { name: "New booking received", time: "2 min ago", type: "booking" },
                { name: "Message from Sarah", time: "15 min ago", type: "message" },
                { name: "Payment received", time: "1 hour ago", type: "payment" },
                { name: "Calendar updated", time: "2 hours ago", type: "calendar" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{activity.name}</p>
                    <p className="text-xs text-neutral-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-neutral-900 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors">
                <p className="text-sm font-medium text-white">New Booking</p>
              </button>
              <button className="p-4 bg-neutral-900 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors">
                <p className="text-sm font-medium text-white">Send Message</p>
              </button>
              <button className="p-4 bg-neutral-900 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors">
                <p className="text-sm font-medium text-white">View Calendar</p>
              </button>
              <button className="p-4 bg-neutral-900 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors">
                <p className="text-sm font-medium text-white">Manage Catalog</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  bgColor,
  borderColor,
  textColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}) {
  return (
    <div className={cn("rounded-xl p-6 border", bgColor, borderColor)}>
      <p className="text-sm text-neutral-400 mb-2">{title}</p>
      <p className={cn("text-2xl font-bold mb-1", textColor)}>{value}</p>
      <p className="text-xs text-neutral-500">{subtitle}</p>
    </div>
  );
}

