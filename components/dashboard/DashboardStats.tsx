"use client";

import React from "react";

interface DashboardStatsProps {
  totalMyTools: number;
  currentlyBorrowing: number;
  currentlyLentOut: number;
}

/**
 * DashboardStats Component
 * Displays high-impact executive metric cards with modern typography and styling.
 */
export default function DashboardStats({
  totalMyTools,
  currentlyBorrowing,
  currentlyLentOut,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Card 1: Total Tools Owned */}
      <div className="group bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Your Tools
          </span>
          <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
            📦
          </span>
        </div>
        <div className="mt-6 flex items-baseline justify-between">
          <span className="text-4xl font-black text-slate-900 tracking-tight">
            {totalMyTools}
          </span>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
            Inventory
          </span>
        </div>
      </div>

      {/* Card 2: Items You Are Currently Borrowing */}
      <div className="group bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Currently Borrowing
          </span>
          <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            🤝
          </span>
        </div>
        <div className="mt-6 flex items-baseline justify-between">
          <span className="text-4xl font-black text-slate-900 tracking-tight">
            {currentlyBorrowing}
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Active Loans
          </span>
        </div>
      </div>

      {/* Card 3: Items Others Are Borrowing From You */}
      <div className="group bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Lent Out to Others
          </span>
          <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
            🚀
          </span>
        </div>
        <div className="mt-6 flex items-baseline justify-between">
          <span className="text-4xl font-black text-slate-900 tracking-tight">
            {currentlyLentOut}
          </span>
          <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-3 py-1 rounded-full">
            In Circulation
          </span>
        </div>
      </div>
    </div>
  );
}
