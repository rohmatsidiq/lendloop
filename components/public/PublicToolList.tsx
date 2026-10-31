"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  FiSearch,
  FiFilter,
  FiTool,
  FiUser,
  FiArrowRight,
  FiX,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiAlertCircle,
} from "react-icons/fi";

const ITEMS_PER_PAGE = 6;

/**
 * PublicToolList Component
 * Displays available tools with modern search bar, dynamic category filters,
 * pagination, and interactive icon-based UI elements.
 */
export default function PublicToolList() {
  const { user, isSignedIn } = useUser();
  const tools = useQuery(api.tools.getPublicTools);

  const userRequests = useQuery(
    api.requests.getUserRequests,
    user ? { userId: user.id } : "skip",
  );
  const createRequest = useMutation(api.requests.createRequest);
  const updateStatus = useMutation(api.requests.updateRequestStatus);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingToolId, setLoadingToolId] = useState<string | null>(null);

  // Modal State Management
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmColor: "indigo" | "emerald" | "rose";
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmColor: "indigo",
    onConfirm: async () => {},
  });

  if (tools === undefined) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-pulse flex space-x-3 items-center text-slate-400 font-medium text-sm">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" />
          <span>Loading neighborhood inventory...</span>
        </div>
      </div>
    );
  }

  const categories = [
    "All",
    ...Array.from(new Set(tools.map((t) => t.category))),
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "available" && tool.isAvailable) ||
      (selectedStatus === "borrowed" && !tool.isAvailable);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTools = filteredTools.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleBorrowRequest = (tool: any) => {
    setModalConfig({
      isOpen: true,
      title: "Request Tool",
      message: `Are you sure you want to request to borrow "${tool.name}"?`,
      confirmText: "Request Tool",
      confirmColor: "indigo",
      onConfirm: async () => {
        if (!user) return;
        try {
          setLoadingToolId(tool.id);
          const startDate = new Date().toISOString().split("T")[0];
          const endDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

          await createRequest({
            toolId: tool.id,
            borrowerId: user.id,
            ownerId: tool.userId,
            startDate,
            endDate,
          });
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Failed to submit borrow request:", error);
          alert("Failed to submit borrow request. Please try again.");
        } finally {
          setLoadingToolId(null);
        }
      },
    });
  };

  const handleCancelRequest = (requestId: any, toolName: string) => {
    setModalConfig({
      isOpen: true,
      title: "Cancel Request",
      message: `Are you sure you want to cancel your request for "${toolName}"?`,
      confirmText: "Yes, Cancel",
      confirmColor: "rose",
      onConfirm: async () => {
        try {
          setLoadingToolId(requestId);
          await updateStatus({
            requestId,
            status: "Rejected",
          });
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Failed to cancel request:", error);
          alert("Failed to cancel request. Please try again.");
        } finally {
          setLoadingToolId(null);
        }
      },
    });
  };

  return (
    <div className="space-y-8">
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Search and Filter Controls Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input with Icon */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
            <FiSearch className="text-base" />
          </span>
          <input
            type="text"
            placeholder="Search tools by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none shadow-xs"
          />
        </div>

        {/* Filter Dropdowns with Icons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none shadow-xs cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none shadow-xs cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="available">Ready to Borrow</option>
              <option value="borrowed">In Use</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tool Cards Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-24 px-6 bg-white rounded-3xl border border-dashed border-slate-200 max-w-xl mx-auto shadow-sm space-y-3">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-inner">
            <FiSearch />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No matching tools found
          </h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or filter options to find what you
            are looking for.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTools.map((tool) => {
              const isOwner = isSignedIn && user?.id === tool.userId;

              const activeRequest = userRequests?.find(
                (req: any) =>
                  req.toolId === tool.id &&
                  req.borrowerId === user?.id &&
                  (req.status === "Pending" || req.status === "Approved"),
              );

              return (
                <div
                  key={tool.id}
                  className="group relative bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-inner">
                          <FiTool className="text-base" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {tool.name}
                        </h3>
                      </div>
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 tracking-wide">
                        <FiLayers className="text-[10px]" />
                        <span>{tool.category}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {tool.description || "No description provided."}
                    </p>

                    {isSignedIn && (
                      <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 pt-1">
                        <FiUser className="text-indigo-500" />
                        <span>Owner:</span>
                        <span className="font-semibold text-indigo-600">
                          {isOwner ? "You" : tool.ownerName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          tool.isAvailable
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-rose-500"
                        }`}
                      />
                      <span className="text-xs font-semibold text-slate-600">
                        {tool.isAvailable
                          ? "Ready to Borrow"
                          : "In Use / Borrowed"}
                      </span>
                    </div>

                    {!tool.isAvailable && !activeRequest ? (
                      <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl">
                        Already Borrowed
                      </span>
                    ) : !isSignedIn ? (
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl">
                        Login to borrow
                      </span>
                    ) : isOwner ? (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                        Your Tool
                      </span>
                    ) : activeRequest ? (
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl">
                          <FiClock className="text-xs" />
                          <span>{activeRequest.status}</span>
                        </span>
                        {activeRequest.status === "Pending" && (
                          <button
                            onClick={() =>
                              handleCancelRequest(activeRequest._id, tool.name)
                            }
                            disabled={loadingToolId === activeRequest._id}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBorrowRequest(tool)}
                        disabled={loadingToolId === tool.id}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>
                          {loadingToolId === tool.id
                            ? "Submitting..."
                            : "Request Borrow"}
                        </span>
                        <FiArrowRight className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-3 pt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-xs"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-slate-600 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-xs"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
