"use client";

import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RequestList from "@/components/dashboard/RequestList";
import PublicToolList from "@/components/public/PublicToolList";

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

  // Filter requests to show ONLY active ones (Pending & Approved) on the dashboard
  const activeRequests =
    requests?.filter(
      (req) => req.status === "Pending" || req.status === "Approved",
    ) || [];

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
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
            <Link
              href="/dashboard/history"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View Full History &rarr;
            </Link>
          </div>
          {/* Pass only active requests or let RequestList handle active filtering */}
          <RequestList requestsData={activeRequests} />
        </div>

        <div className="">
          <div className="mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Available Neighborhood Tools
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Browse items shared by people around your neighborhood.
            </p>
          </div>
          <PublicToolList />
        </div>
      </div>
    </main>
  );
}
