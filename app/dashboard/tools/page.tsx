"use client";

import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ToolCard from "@/components/dashboard/ToolCard";
import AddToolModal from "@/components/dashboard/AddToolModal";
import Link from "next/link";
import {
  FiArrowLeft,
  FiPlus,
  FiTool,
  FiEdit2,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiTag,
  FiLayers,
  FiFileText,
  FiCheck,
} from "react-icons/fi";

interface ToolData {
  _id: Id<"tools">;
  userId: string;
  name: string;
  category: string;
  condition: string;
  description: string;
  isAvailable: boolean;
}

/**
 * Manage Tools Page
 * Dedicated page for users to manage their personal tool inventory with a vibrant,
 * modern UI powered by React Icons and Tailwind CSS.
 */
export default function ManageToolsPage() {
  const { user } = useUser();
  const tools = useQuery(api.tools.getAllToolsWithDetails);
  const updateTool = useMutation(api.tools.updateTool);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolData | null>(null);

  // Form states for editing
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Power Tools");
  const [condition, setCondition] = useState("Good");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenEdit = (tool: ToolData) => {
    setEditingTool(tool);
    setName(tool.name);
    setCategory(tool.category);
    setCondition(tool.condition);
    setDescription(tool.description);
    setIsAvailable(tool.isAvailable);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool || !user) return;

    try {
      setIsSubmitting(true);
      await updateTool({
        id: editingTool._id,
        userId: user.id,
        name,
        category,
        condition,
        description,
        isAvailable,
      });
      setEditingTool(null);
    } catch (error) {
      console.error("Failed to update tool:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter tools belonging only to the logged-in user
  const myTools = tools?.filter((tool) => user && tool.userId === user.id);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      {/* Top Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-8 flex justify-between items-center sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="group flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 px-3.5 py-2 rounded-xl border border-slate-100"
          >
            <FiArrowLeft className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <FiTool className="text-sm" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Inventory Management
            </span>
          </div>
        </div>
        <UserButton />
      </nav>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white tracking-wide">
              <FiPackage className="text-xs" />
              <span>Personal Workspace</span>
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Your Listed Tools Inventory
            </h1>
            <p className="text-xs lg:text-sm text-indigo-100 max-w-xl">
              Easily manage, update condition status, or add new neighborhood
              tools to lend and build community trust.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="z-10 px-5 py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl text-xs font-bold shadow-lg shadow-black/5 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
          >
            <FiPlus className="text-base" />
            <span>List a New Tool</span>
          </button>
        </div>

        {/* Inventory Grid / States */}
        {myTools === undefined ? (
          <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-slate-100 shadow-xs">
            <div className="animate-pulse flex space-x-3 items-center text-slate-400 font-medium text-sm">
              <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" />
              <span>Loading your inventory items...</span>
            </div>
          </div>
        ) : myTools.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-xs max-w-xl mx-auto p-10 space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              <FiTool />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                No tools listed yet
              </h3>
              <p className="text-xs text-slate-500">
                You haven't listed any items for sharing. Start lending to your
                neighbors today!
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100"
            >
              <FiPlus />
              <span>Add Your First Tool</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTools.map((tool) => (
              <ToolCard
                key={tool._id}
                id={tool._id}
                toolUserId={tool.userId}
                name={tool.name}
                category={tool.category}
                condition={tool.condition}
                description={tool.description}
                isAvailable={tool.isAvailable}
                onEdit={() => handleOpenEdit(tool)}
                onBorrow={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Tool Modal */}
      <AddToolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Tool Modal (Modern & Vibrant) */}
      {editingTool && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FiEdit2 />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Edit Tool Details
                </h2>
              </div>
              <button
                onClick={() => setEditingTool(null)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-lg font-bold transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
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
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                  <FiLayers className="text-indigo-600" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="Power Tools">Power Tools</option>
                  <option value="Garden">Garden</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                  <FiTool className="text-indigo-600" />
                  <span>Condition</span>
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                  <FiFileText className="text-indigo-600" />
                  <span>Description</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="isAvailable"
                  className="text-xs font-semibold text-slate-700 cursor-pointer select-none flex items-center space-x-1.5"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  <span>Available for borrowing</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-100 transition-all disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <FiCheck className="text-sm" />
                  <span>{isSubmitting ? "Saving..." : "Update Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
