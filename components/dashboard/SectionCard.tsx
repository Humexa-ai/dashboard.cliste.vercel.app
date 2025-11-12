"use client";

import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

export default function SectionCard({ title, subtitle, action, children }: Props) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          {subtitle ? <p className="text-xs text-white/60">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}













