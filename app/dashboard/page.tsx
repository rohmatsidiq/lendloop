"use client";

import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RequestList from "@/components/dashboard/RequestList";

/**
 * Dashboard Executive Summary Page
 * Serves as the clean parent container integrating modular enterprise-grade components.
 */
export default function DashboardPage() {
  const { user } = useUser();
  const tools = useQuery(api.tools.getAllToolsWithDetails);
  const requests = useQuery(
    api.requests.getUserRequests,
    user ? { userId: user.id } : "skip",
  );

  if (!user) return null;

  // Calculate metrics
  const myTools = tools?.filter((tool) => tool.userId === user.id) || [];
  const totalMyTools = myTools.length;

  const currentlyBorrowing =
    requests?.filter(
      (req) => req.borrowerId === user.id && req.status === "Approved",
    ).length || 0;

  const currentlyLentOut =
    requests?.filter(
      (req) => req.ownerId === user.id && req.status === "Approved",
    ).length || 0;

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-8 flex justify-between items-center shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-100">
            L
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Lend<span className="text-indigo-600">Loop</span>
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
            Dashboard
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            &larr; Back to Home
          </Link>
          <UserButton />
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <DashboardHeader firstName={user.firstName} />
        <DashboardStats
          totalMyTools={totalMyTools}
          currentlyBorrowing={currentlyBorrowing}
          currentlyLentOut={currentlyLentOut}
        />

        {/* Active Requests and Activity List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Active Requests & Borrow Status
            </h2>
            <span className="text-xs font-medium text-slate-400">
              Real-time synchronization
            </span>
          </div>
          <RequestList />
        </div>
      </div>
    </main>
  );
}
