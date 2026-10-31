import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database schema definition for LendLoop based on Fluence take-home requirements.
 */
export default defineSchema({
  /**
   * Users table storing synchronized profile details and RBAC roles from Clerk.
   */
  users: defineTable({
    userId: v.string(), // Clerk user ID
    name: v.string(), // User full name
    email: v.string(), // User primary email address
    role: v.union(v.literal("admin"), v.literal("user")), // Strict role definition per requirements
    isTrustedLender: v.optional(v.boolean()), // Specific admin capability flag
  }).index("by_userId", ["userId"]),

  /**
   * Tools table for neighborhood items available for lending.
   */
  tools: defineTable({
    userId: v.string(), // Owner's Clerk user ID
    name: v.string(), // Tool name
    category: v.string(), // Category classification (power tools, garden, kitchen, camping, etc.)
    condition: v.string(), // Physical condition
    description: v.string(), // Detailed description
    isAvailable: v.boolean(), // Availability status flag
  }),

  /**
   * Requests table tracking tool borrowing transactions between users.
   */
  requests: defineTable({
    toolId: v.id("tools"), // Reference to the requested tool
    borrowerId: v.string(), // Clerk ID of the borrower
    ownerId: v.string(), // Clerk ID of the tool owner
    startDate: v.string(), // Borrowing start date
    endDate: v.string(), // Borrowing end date
    status: v.string(), // Request status (Pending, Approved, Rejected, Returned)
  }),
});
