import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * getUserRequests
 * Mengambil semua permohonan peminjaman terkait user (sebagai owner atau borrower)
 * beserta opsi filter opsional berdasarkan rentang tanggal/waktu.
 */
export const getUserRequests = query({
  args: {
    userId: v.string(),
    startDateFilter: v.optional(v.string()), // Opsional: Filter tanggal mulai (YYYY-MM-DD)
    endDateFilter: v.optional(v.string()), // Opsional: Filter tanggal selesai (YYYY-MM-DD)
  },
  handler: async (ctx, args) => {
    // 1. Ambil semua requests di mana user terlibat sebagai owner atau borrower
    const requests = await ctx.db
      .query("requests")
      .filter((q) =>
        q.or(
          q.eq(q.field("ownerId"), args.userId),
          q.eq(q.field("borrowerId"), args.userId),
        ),
      )
      .collect();

    // 2. Map data untuk memperkaya nama borrower dan owner
    const requestsWithDetails = await Promise.all(
      requests.map(async (request) => {
        const borrower = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", request.borrowerId))
          .first();

        const owner = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", request.ownerId))
          .first();

        return {
          ...request,
          borrowerName: borrower ? borrower.name : "Neighbor",
          ownerName: owner ? owner.name : "Neighbor",
        };
      }),
    );

    // 3. Terapkan filter waktu di sisi query jika parameter waktu diberikan
    let filteredRequests = requestsWithDetails;
    if (args.startDateFilter) {
      filteredRequests = filteredRequests.filter(
        (req) => req.startDate >= args.startDateFilter!,
      );
    }
    if (args.endDateFilter) {
      filteredRequests = filteredRequests.filter(
        (req) => req.endDate <= args.endDateFilter!,
      );
    }

    return filteredRequests;
  },
});

/**
 * createRequest
 * Membuat permohonan pinjam baru dengan menyimpan nama peminjam yang dikirim dari frontend.
 */
export const createRequest = mutation({
  args: {
    toolId: v.id("tools"),
    borrowerId: v.string(),
    ownerId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const newRequestId = await ctx.db.insert("requests", {
      toolId: args.toolId,
      borrowerId: args.borrowerId,
      ownerId: args.ownerId,
      startDate: args.startDate,
      endDate: args.endDate,
      status: "Pending",
    });

    return newRequestId;
  },
});

/**
 * updateRequestStatus
 * Updates the borrow request status (e.g., Pending -> Approved / Rejected / Returned)
 * and automatically synchronizes the corresponding tool's availability status.
 */
export const updateRequestStatus = mutation({
  args: {
    requestId: v.id("requests"),
    status: v.string(), // e.g., "Approved", "Rejected", "Returned"
  },
  handler: async (ctx, args) => {
    // 1. Fetch the request record to get the associated toolId
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("Borrow request not found.");
    }

    // 2. Update the request status
    await ctx.db.patch(args.requestId, {
      status: args.status,
    });

    // 3. Synchronize tool availability based on the request status
    // If Approved, the tool is now in use (isAvailable = false)
    // If Rejected or Returned, the tool becomes available again (isAvailable = true)
    if (args.status === "Approved") {
      await ctx.db.patch(request.toolId, {
        isAvailable: false,
      });
    } else if (args.status === "Rejected" || args.status === "Returned") {
      await ctx.db.patch(request.toolId, {
        isAvailable: true,
      });
    }
  },
});
