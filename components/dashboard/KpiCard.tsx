"use client";

import React from "react";

type Props = {
  label: string;
  value: string;
  delta?: string;
  trend?: React.ReactNode;
};

export default function KpiCard({ label, value, delta, trend }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/[0.06] transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-white/60">{label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
        </div>
        {trend ? (
          <div className="hidden sm:block text-right text-xs text-white/60">{trend}</div>
        ) : null}
      </div>
      {delta ? (
        <div className="mt-2 text-xs text-white/60">{delta}</div>
      ) : null}
    </div>
  );
}


