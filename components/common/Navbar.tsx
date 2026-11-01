"use client";

import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiTool, FiHome, FiGrid, FiMenu, FiX } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";

/**
 * Navbar Component
 * Reusable responsive top navigation bar for LendLoop application,
 * featuring desktop user name display next to the profile avatar.
 */
export default function Navbar() {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: FiHome },
    { href: "/dashboard/tools", label: "Manage Tools", icon: FiGrid },
    { href: "/dashboard/history", label: "History", icon: FaHistory },
  ];

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 md:px-8 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-8">
              <img src="/logo.png" alt="logo" className="w-full h-full" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              LendLoop
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 border-l border-slate-200 pl-6">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50/80 shadow-xs"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                  }`}
                >
                  <IconComponent className="text-sm" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile & Mobile Toggle */}
        <div className="flex items-center space-x-3">
          {/* User Full Name - Visible on Desktop Only */}
          {user && (
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">
                {user.fullName || user.firstName || "User"}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Neighbor
              </span>
            </div>
          )}

          <UserButton />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="text-xl" />
            ) : (
              <FiMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-lg py-4 px-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50/80"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <IconComponent
                  className={isActive ? "text-indigo-600" : "text-slate-500"}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
