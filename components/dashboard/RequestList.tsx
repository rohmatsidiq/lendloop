"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import ConfirmModal from "@/components/common/ConfirmModal";

interface RequestListProps {
  requestsData?: any[]; // Optional prop to accept filtered active requests from parent
}

/**
 * RequestList Component
 * Displays incoming and outgoing active borrow requests (Pending & Approved)
 * with custom modal confirmation for approving, rejecting, and returning items.
 */
export default function RequestList({ requestsData }: RequestListProps) {
  const { user } = useUser();
  const updateStatus = useMutation(api.requests.updateRequestStatus);
  const [loadingRequestId, setLoadingRequestId] =
    useState<Id<"requests"> | null>(null);

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

  if (!user) return null;

  if (requestsData === undefined) {
    return (
      <div className="flex justify-center items-center py-12 bg-white rounded-2xl border border-slate-100 shadow-xs">
        <div className="animate-pulse flex space-x-2 items-center text-slate-400 font-medium text-sm">
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" />
          <span>Loading requests...</span>
        </div>
      </div>
    );
  }

  // Ensure we strictly filter out non-active requests (Rejected & Returned) if not already filtered
  const activeRequests = requestsData.filter(
    (req) => req.status === "Pending" || req.status === "Approved",
  );

  if (activeRequests.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center shadow-xs">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
          📋
        </div>
        <h3 className="text-sm font-semibold text-slate-900">
          No active requests
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          When you request tools or neighbors borrow your items, active ones
          will appear here.
        </p>
      </div>
    );
  }

  const handleStatusChange = (requestId: Id<"requests">, newStatus: string) => {
    let title = "Update Request";
    let message = "Are you sure you want to update this request status?";
    let confirmText = "Confirm";
    let confirmColor: "indigo" | "emerald" | "rose" = "indigo";

    if (newStatus === "Approved") {
      title = "Approve Request";
      message = "Are you sure you want to approve this borrow request?";
      confirmText = "Approve";
      confirmColor = "emerald";
    } else if (newStatus === "Rejected") {
      title = "Reject / Cancel Request";
      message = "Are you sure you want to reject or cancel this request?";
      confirmText = "Yes, Cancel";
      confirmColor = "rose";
    } else if (newStatus === "Returned") {
      title = "Mark as Returned";
      message = "Are you sure you want to mark this item as returned?";
      confirmText = "Mark Returned";
      confirmColor = "indigo";
    }

    setModalConfig({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmColor,
      onConfirm: async () => {
        try {
          setLoadingRequestId(requestId);
          await updateStatus({ requestId, status: newStatus });
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Failed to update request status:", error);
          alert("Failed to update status. Please try again.");
        } finally {
          setLoadingRequestId(null);
        }
      },
    });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      <div className="space-y-4">
        {activeRequests.map((req: any) => {
          const isOwner = req.ownerId === user.id;
          const isLoading = loadingRequestId === req._id;

          return (
            <div
              key={req._id}
              className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${
                      req.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {req.status}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {isOwner ? "• Incoming Request" : "• Your Borrow Request"}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900">
                  {isOwner
                    ? `Borrower: ${req.borrowerName || "Neighbor"}`
                    : `Tool Owner: ${req.ownerName || "Neighbor"}`}
                </p>

                <p className="text-xs text-slate-500">
                  Period:{" "}
                  <span className="font-semibold text-slate-700">
                    {req.startDate}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {req.endDate}
                  </span>
                </p>
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                {/* Actions for Owner when request is Pending */}
                {isOwner && req.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(req._id, "Approved")}
                      disabled={isLoading}
                      className="px-4 py-2 cursor-pointer bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50"
                    >
                      {isLoading ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleStatusChange(req._id, "Rejected")}
                      disabled={isLoading}
                      className="px-4 py-2 cursor-pointer bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 shadow-sm transition-all disabled:opacity-50"
                    >
                      {isLoading ? "Processing..." : "Reject"}
                    </button>
                  </>
                )}

                {/* Action for Borrower to Cancel their own Pending request */}
                {!isOwner && req.status === "Pending" && (
                  <button
                    onClick={() => handleStatusChange(req._id, "Rejected")}
                    disabled={isLoading}
                    className="px-4 py-2 cursor-pointer bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Cancel Request"}
                  </button>
                )}

                {/* Action to Mark as Returned when request is Approved */}
                {req.status === "Approved" && (
                  <button
                    onClick={() => handleStatusChange(req._id, "Returned")}
                    disabled={isLoading}
                    className="px-4 py-2 cursor-pointer bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Mark as Returned"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
