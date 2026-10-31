import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Fetch all tools for the public list along with the owner's name.
 */
export const getPublicTools = query({
  args: {},
  handler: async (ctx) => {
    const tools = await ctx.db.query("tools").collect();

    // Map each tool and fetch the corresponding owner name from the users table
    const toolsWithOwners = await Promise.all(
      tools.map(async (tool) => {
        // Find user profile by userId
        const user = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", tool.userId))
          .first();

        return {
          id: tool._id,
          userId: tool.userId,
          ownerName: user ? user.name : "Neighbor", // Fallback name if user not found
          name: tool.name,
          category: tool.category,
          condition: tool.condition,
          description: tool.description,
          isAvailable: tool.isAvailable,
        };
      }),
    );

    return toolsWithOwners;
  },
});

/**
 * Authenticated Query: Fetch all tools with complete details for signed-in users.
 */
export const getAllToolsWithDetails = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tools").collect();
  },
});

/**
 * Authenticated Mutation: Allow users to list a new tool for lending.
 * Uses v.string() for userId to safely match Clerk authentication user IDs.
 */
export const createTool = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    category: v.string(),
    condition: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const newToolId = await ctx.db.insert("tools", {
      userId: args.userId,
      name: args.name,
      category: args.category,
      condition: args.condition,
      description: args.description,
      isAvailable: true, // Default status is available when first listed
    });
    return newToolId;
  },
});

/**
 * Authenticated Mutation: Update an existing tool's details.
 * Security rule: Verifies that the user attempting the update is the owner.
 */
export const updateTool = mutation({
  args: {
    id: v.id("tools"),
    userId: v.string(),
    name: v.string(),
    category: v.string(),
    condition: v.string(),
    description: v.string(),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, userId, ...updateData } = args;

    // Fetch the tool to check ownership
    const tool = await ctx.db.get(id);
    if (!tool) {
      throw new Error("Tool not found");
    }

    if (tool.userId !== userId) {
      throw new Error("Unauthorized: You can only edit your own tools");
    }

    await ctx.db.patch(id, updateData);
    return id;
  },
});

/**
 * Authenticated Mutation: Delete a tool from the inventory.
 * Security rule: Verifies that the user attempting the deletion is the owner.
 */
export const deleteTool = mutation({
  args: {
    id: v.id("tools"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const tool = await ctx.db.get(args.id);
    if (!tool) {
      throw new Error("Tool not found");
    }

    if (tool.userId !== args.userId) {
      throw new Error("Unauthorized: You can only delete your own tools");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
