// app/api/task-lists/reorder/route.ts => Jiehoon Lee

// API Route: Reorder Task Lists
// Purpose: Update the order of multiple task lists at once (for drag-and-drop functionality)
// Authentication: Required - ensures user can only reorder their own task lists
// Method: POST
// Body: { taskListOrders: Array<{ taskListId: string, order: number }> }

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { reorderTaskLists, findUserByEmail } from "@/lib/db";

// POST /api/task-lists/reorder
// Reorders multiple task lists by updating their order values
// Body: { taskListOrders: [{ taskListId: string, order: number }, ...] }
// Returns: Success message
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await findUserByEmail(session.user.email);
    if (!user || !user._id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { taskListOrders } = body;

    // Validate taskListOrders array
    if (!Array.isArray(taskListOrders) || taskListOrders.length === 0) {
      return NextResponse.json(
        { error: "taskListOrders must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate each task list order object
    const validatedOrders = taskListOrders.map(({ taskListId, order }) => {
      if (!taskListId || !ObjectId.isValid(taskListId)) {
        throw new Error("Invalid taskListId in taskListOrders");
      }
      if (typeof order !== "number" || order < 0) {
        throw new Error("Invalid order value in taskListOrders");
      }
      return {
        taskListId: new ObjectId(taskListId),
        order,
      };
    });

    // Reorder the task lists
    await reorderTaskLists(user._id, validatedOrders);

    return NextResponse.json(
      { success: true, message: "Task lists reordered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reordering task lists:", error);

    // Check if error is from validation
    if (error instanceof Error && error.message.includes("Invalid")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to reorder task lists" },
      { status: 500 }
    );
  }
}
