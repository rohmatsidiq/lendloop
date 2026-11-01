"use client";

import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiCalendar,
  FiTool,
  FiHome,
  FiGrid,
  FiMenu,
  FiX,
  FiRotateCcw,
} from "react-icons/fi";
import { FaHistory } from "react-icons/fa";

/**
 * Borrowing History Page
 * Displays a comprehensive log of tools borrowed by the user and tools lent to others,
 * complete with tab separation, optional time-range filtering, and modern UI styling.
 */
export default function HistoryPage() {
  const { user } = useUser();

  // Time filter state variables (initialized as empty strings for no default filtering)
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Pass time filter arguments to the Convex query
  const requests = useQuery(
    api.requests.getUserRequests,
    user
      ? {
          userId: user.id,
          startDateFilter: startDateFilter || undefined,
          endDateFilter: endDateFilter || undefined,
        }
      : "skip",
  );

  const [activeTab, setActiveTab] = useState<"borrowed" | "lent">("borrowed");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  if (requests === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 flex justify-center items-center">
        <div className="animate-pulse flex space-x-3 items-center text-slate-400 font-medium text-sm">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" />
          <span>Loading your borrowing history...</span>
        </div>
      </div>
    );
  }

  // Filter requests based on user role
  const borrowedItems = requests.filter(
    (req: any) => req.borrowerId === user.id,
  );
  const lentItems = requests.filter((req: any) => req.ownerId === user.id);

  const currentList = activeTab === "borrowed" ? borrowedItems : lentItems;

  const handleResetFilters = () => {
    setStartDateFilter("");
    setEndDateFilter("");
  };

  return (
    <main className="bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white tracking-wide">
              <FaHistory className="text-xs" />
              <span>Activity Log</span>
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Borrowing & Lending History
            </h1>
            <p className="text-xs lg:text-sm text-indigo-100 max-w-xl">
              Track all tools you have borrowed from your neighbors and items
              you have shared across the community.
            </p>
          </div>
        </div>

        {/* Time Filter & Tabs Control Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Tabs Control */}
          <div className="flex space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab("borrowed")}
              className={`flex-1 lg:flex-none cursor-pointer py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "borrowed"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Items You Borrowed ({borrowedItems.length})
            </button>
            <button
              onClick={() => setActiveTab("lent")}
              className={`flex-1 lg:flex-none cursor-pointer py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "lent"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Items You Lent ({lentItems.length})
            </button>
          </div>
        </div>

        {/* History List */}
        {currentList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-xs max-w-xl mx-auto p-10 space-y-3">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-inner">
              <FaHistory />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No history found in this category
            </h3>
            <p className="text-xs text-slate-500">
              {activeTab === "borrowed"
                ? "You haven't requested or borrowed any tools yet."
                : "None of your listed tools have been borrowed yet."}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            {currentList.map((req: any) => (
              <div
                key={req._id}
                className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        req.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "Returned"
                            ? "bg-blue-100 text-blue-800"
                            : req.status === "Rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      <FiClock className="text-[10px]" />
                      <span>{req.status}</span>
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {activeTab === "borrowed"
                        ? "• Borrowed Item"
                        : "• Lent Item"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-sm font-bold text-slate-900">
                    <FiUser className="text-indigo-600 text-xs" />
                    <span>
                      {activeTab === "borrowed"
                        ? `Owner: ${req.ownerName || "Neighbor"}`
                        : `Borrower: ${req.borrowerName || "Neighbor"}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <FiCalendar className="text-slate-400" />
                    <span>Period:</span>
                    <span className="font-semibold text-slate-700">
                      {req.startDate}
                    </span>
                    <span>to</span>
                    <span className="font-semibold text-slate-700">
                      {req.endDate}
                    </span>
                  </div>
                </div>

                <div>
                  {req.status === "Returned" ? (
                    <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 bg-slate-200/60 px-3.5 py-2 rounded-xl">
                      <FiCheckCircle className="text-xs text-emerald-600" />
                      <span>Completed</span>
                    </span>
                  ) : req.status === "Approved" ? (
                    <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl">
                      <FiCheckCircle className="text-xs" />
                      <span>Active Borrowing</span>
                    </span>
                  ) : req.status === "Pending" ? (
                    <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700 bg-amber-50 px-3.5 py-2 rounded-xl">
                      <FiClock className="text-xs" />
                      <span>Waiting Approval</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl">
                      <FiXCircle className="text-xs" />
                      <span>Cancelled / Rejected</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
