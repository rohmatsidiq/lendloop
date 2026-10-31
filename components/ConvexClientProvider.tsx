"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Initialize Convex Client using environment variable URL
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * UserSync Component
 * Automatically synchronizes Clerk user profile data into the Convex database
 * upon initial registration or subsequent logins.
 */
function UserSync() {
  const { user, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    // Synchronize user data only when Clerk has loaded and user is authenticated
    if (isLoaded && user) {
      upsertUser({
        userId: user.id,
        name: user.fullName || user.firstName || "Neighbor",
        email: user.primaryEmailAddress?.emailAddress || "",
      }).catch((error) => {
        console.error("Failed to synchronize user data to Convex:", error);
      });
    }
  }, [isLoaded, user, upsertUser]);

  return null; // Runs silently in the background
}

/**
 * ConvexClientProvider Component
 * Manages Convex connection, passes Clerk authentication token via ConvexProviderWithClerk,
 * and embeds background user data synchronization.
 */
export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <UserSync />
      {children}
    </ConvexProviderWithClerk>
  );
}
