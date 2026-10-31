"use client";

import React from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";

/**
 * Public Hero Section Component
 * High-impact introduction banner featuring dynamic modal authentication triggers.
 */
export default function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-indigo-50/50 via-white to-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mb-6">
          ✨ Neighborhood Sharing Economy
        </span>
        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Borrow what you need, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            share what you own.
          </span>
        </h1>
        <p className="mt-6 text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          LendLoop connects neighbors to share tools, equipment, and resources
          securely. Save money, reduce clutter, and build a stronger community.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200"
            >
              Open Dashboard &rarr;
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 cursor-pointer">
                Sign in to lend or borrow
              </button>
            </SignInButton>
          )}

          <a
            href="#explore"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200"
          >
            Explore Tools
          </a>
        </div>
      </div>
    </section>
  );
}
