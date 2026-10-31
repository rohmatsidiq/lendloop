"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * UserSync Component
 * Automatically synchronizes Clerk user data into the Convex database
 * upon initial registration or subsequent logins.
 */
export function UserSync() {
  const { user, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    // Run synchronization only when Clerk has loaded and a user is authenticated
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

  return null; // This component operates in the background
}
