import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/common/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LendLoop - Peer-to-Peer Tool Sharing",
  description: "Share and borrow tools with your neighbors effortlessly.",
};

/**
 * RootLayout Component
 * Wraps the entire application with Clerk, Convex providers, and global Navbar.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Global Navbar placed here will render across all pages */}
      <Navbar />
      {children}
    </div>
  );
}
