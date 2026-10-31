"use client";

import React from "react";
import Link from "next/link";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

/**
 * Public Navbar Component
 * Displays branding and dynamic auth modal triggers based on user session.
 */
export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-100">
            L
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Lend<span className="text-indigo-600">Loop</span>
          </span>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-4">
          {!isLoaded ? (
            <div className="w-24 h-9 bg-gray-100 rounded-lg animate-pulse" />
          ) : isSignedIn ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-100 transition-all duration-200"
              >
                Go to Dashboard &rarr;
              </Link>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Menggunakan Clerk SignInButton dengan mode modal */}
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                  Sign In
                </button>
              </SignInButton>

              {/* Menggunakan Clerk SignUpButton dengan mode modal */}
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-100 transition-all duration-200">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
