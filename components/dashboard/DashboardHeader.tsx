"use client";

import React from "react";
import Link from "next/link";

interface DashboardHeaderProps {
  firstName?: string | null;
}

/**
 * DashboardHeader Component
 * Displays an enterprise-grade greeting banner and quick action controls.
 */
export default function DashboardHeader({ firstName }: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          ✨ Executive Control Center
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Welcome back, {firstName || "Neighbor"}!
        </h1>
        <p className="text-sm text-slate-300 max-w-xl">
          Monitor your neighborhood tool circulation, active loans, and incoming
          requests in real-time.
        </p>
      </div>

      <Link
        href="/dashboard/tools"
        className="relative z-10 inline-flex items-center px-6 py-3 bg-white text-slate-900 rounded-2xl text-sm font-bold hover:bg-slate-100 shadow-lg shadow-black/25 transition-all duration-200 transform hover:-translate-y-0.5"
      >
        Manage Your Tools &rarr;
      </Link>
    </div>
  );
}
