import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Upserts a user record into the Convex database.
 * Automatically assigns the default role as "user" upon initial registration.
 */
export const upsertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
  },
  handler: async (ctx, args) => {
    // Check if the user already exists in the database
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      // Update existing user record while keeping their current role if not explicitly updated
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        role: args.role ?? existingUser.role,
      });
    } else {
      // Insert new user with "user" as the strict default role
      await ctx.db.insert("users", {
        userId: args.userId,
        name: args.name,
        email: args.email,
        role: args.role || "user", // Default role is set to "user"
        isTrustedLender: false,
      });
    }
  },
});
