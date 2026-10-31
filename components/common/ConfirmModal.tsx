"use client";

import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "indigo" | "emerald" | "rose";
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

/**
 * ConfirmModal Component
 * A reusable, modern confirmation modal replacing browser's default window.confirm().
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "indigo",
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colorClasses = {
    indigo: "bg-indigo-600 hover:bg-indigo-700 text-white",
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white",
    rose: "bg-rose-600 hover:bg-rose-700 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-slate-100 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{message}</p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50 ${colorClasses[confirmColor]}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
