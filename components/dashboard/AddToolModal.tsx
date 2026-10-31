"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import {
  FiPlusCircle,
  FiX,
  FiTag,
  FiLayers,
  FiTool,
  FiFileText,
  FiCheck,
} from "react-icons/fi";

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AddToolModal Component
 * A modern, enterprise-grade modal form that allows users to list a new tool in the inventory.
 */
export default function AddToolModal({ isOpen, onClose }: AddToolModalProps) {
  const { user } = useUser();
  const createTool = useMutation(api.tools.createTool);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Power Tools");
  const [condition, setCondition] = useState("Good");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      await createTool({
        userId: user.id,
        name,
        category,
        condition,
        description,
      });
      // Reset form and close modal
      setName("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Failed to add tool:", error);
      alert("Failed to add tool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 space-y-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
              <FiPlusCircle className="text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                List a New Tool
              </h2>
              <p className="text-xs text-slate-500">
                Share your equipment with your neighbors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-lg font-bold transition-colors"
          >
            <FiX />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tool Name */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
              <FiTag className="text-indigo-600" />
              <span>Tool Name</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-xs"
              placeholder="e.g., Electric Drill, Lawn Mower"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
              <FiLayers className="text-indigo-600" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-xs cursor-pointer"
            >
              <option value="Power Tools">Power Tools</option>
              <option value="Garden">Garden</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Condition */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
              <FiTool className="text-indigo-600" />
              <span>Condition</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-xs cursor-pointer"
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
              <FiFileText className="text-indigo-600" />
              <span>Description & Pickup Notes</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-xs resize-none"
              placeholder="Briefly describe the tool and any pickup instructions..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-100 transition-all disabled:opacity-50 flex items-center space-x-1.5"
            >
              <FiCheck className="text-sm" />
              <span>{isSubmitting ? "Saving..." : "Save Tool"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
