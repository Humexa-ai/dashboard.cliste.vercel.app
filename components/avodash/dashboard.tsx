"use client";
import { Search } from "lucide-react";

export default function AvoburgerDashboard() {
  return (
    <div className="min-h-full">
      {/* Top actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search"
            className="h-10 w-full pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-gray-500">Today's stats</span>
          <button className="h-8 px-3 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">Export CSV</button>
        </div>
      </div>

      {/* Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top row small cards */}
        <div className="lg:col-span-4 h-20 rounded-xl border border-gray-200 bg-white" />
        <div className="lg:col-span-4 h-20 rounded-xl border border-gray-200 bg-white" />
        <div className="lg:col-span-4 h-20 rounded-xl border border-gray-200 bg-white" />

        {/* Middle row: large left + right placeholder */}
        <div className="lg:col-span-8 h-64 rounded-xl border border-gray-200 bg-white" />
        <div className="lg:col-span-4 h-64 rounded-xl border border-gray-200 bg-white" />

        {/* Bottom row: table + right stacked */}
        <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white p-4">
          <div className="h-6 w-24 rounded bg-gray-100 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-gray-50 border border-gray-100" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-44 rounded-xl border border-gray-200 bg-white" />
          <div className="h-32 rounded-xl border border-gray-200 bg-white" />
        </div>
      </div>
    </div>
  );
}










