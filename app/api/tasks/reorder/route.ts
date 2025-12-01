// app/api/tasks/reorder/route.ts => Jiehoon Lee

// API Route: Reorder Tasks
// Purpose: Update the order of multiple tasks at once (for drag-and-drop functionality)
// Authentication: Required - ensures user can only reorder their own tasks
// Method: POST
// Body: { taskOrders: Array<{ taskId: string, order: number }> }

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { reorderTasks, findUserByEmail } from "@/lib/db";

// POST /api/tasks/reorder
// Reorders multiple tasks by updating their order values
// Body: { taskOrders: [{ taskId: string, order: number }, ...] }
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
    const { taskOrders } = body;

    // Validate taskOrders array
    if (!Array.isArray(taskOrders) || taskOrders.length === 0) {
      return NextResponse.json(
        { error: "taskOrders must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate each task order object
    const validatedOrders = taskOrders.map(({ taskId, order }) => {
      if (!taskId || !ObjectId.isValid(taskId)) {
        throw new Error("Invalid taskId in taskOrders");
      }
      if (typeof order !== "number" || order < 0) {
        throw new Error("Invalid order value in taskOrders");
      }
      return {
        taskId: new ObjectId(taskId),
        order,
      };
    });

    // Reorder the tasks
    await reorderTasks(user._id, validatedOrders);

    return NextResponse.json(
      { success: true, message: "Tasks reordered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reordering tasks:", error);

    // Check if error is from validation
    if (error instanceof Error && error.message.includes("Invalid")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to reorder tasks" },
      { status: 500 }
    );
  }
}
