"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  FiTool,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiLayers,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

interface ToolCardProps {
  id: Id<"tools">;
  toolUserId: string;
  name: string;
  category: string;
  condition: string;
  description: string;
  isAvailable: boolean;
  onEdit: () => void;
  onBorrow: () => void;
}

/**
 * ToolCard Component
 * Displays individual tool details with a modern enterprise-grade UI,
 * interactive status badges, custom delete modal confirmation, and role-based actions.
 */
export default function ToolCard({
  id,
  toolUserId,
  name,
  category,
  condition,
  description,
  isAvailable,
  onEdit,
  onBorrow,
}: ToolCardProps) {
  const { user } = useUser();
  const removeTool = useMutation(api.tools.deleteTool);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isOwner = user && user.id === toolUserId;

  /**
   * Handles tool deletion with database mutation.
   */
  const handleDeleteConfirm = async () => {
    if (!user) return;
    try {
      setIsDeleting(true);
      await removeTool({ id, userId: user.id });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete tool:", error);
      alert("Failed to delete tool. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Tool"
        message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        confirmColor="rose"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />

      {/* Modern Card Container */}
      <div className="group relative bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        {/* Decorative subtle background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-indigo-50/0 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header & Category Badge */}
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-inner">
                <FiTool className="text-base" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {name}
              </h3>
            </div>
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 tracking-wide">
              <FiLayers className="text-[10px]" />
              <span>{category}</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {description || "No description provided for this item."}
          </p>

          {/* Condition Info */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 pt-1">
            <FiShield className="text-indigo-500" />
            <span>Condition:</span>
            <span className="font-semibold text-slate-700">{condition}</span>
          </div>
        </div>

        {/* Footer: Status & Actions */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          {/* Availability Status Indicator */}
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-semibold text-slate-600">
              {isAvailable ? "Ready to Borrow" : "In Use"}
            </span>
          </div>

          {/* Action Buttons */}
          {isOwner ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                <FiEdit3 className="text-xs" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                <FiTrash2 className="text-xs" />
                <span>Delete</span>
              </button>
            </div>
          ) : (
            isAvailable && (
              <button
                onClick={onBorrow}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
              >
                <span>Request Borrow</span>
                <FiArrowRight className="text-xs" />
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
}
