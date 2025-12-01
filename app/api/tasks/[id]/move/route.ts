// app/api/tasks/[id]/move/route.ts => Jiehoon Lee

// API Route: Move Task to Different List
// Purpose: Move a task from one task list to another
// Authentication: Required - ensures user can only move their own tasks
// Method: POST
// Body: { newTaskListId: string (ObjectId), newOrder?: number }

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { moveTaskToList, findUserByEmail } from "@/lib/db";

// POST /api/tasks/[id]/move
// Moves a task to a different task list
// Body: { newTaskListId: string, newOrder?: number }
// Returns: Updated task with new taskListId and order
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate ObjectId format for task ID
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { newTaskListId, newOrder } = body;

    // Validate newTaskListId
    if (!newTaskListId || !ObjectId.isValid(newTaskListId)) {
      return NextResponse.json(
        { error: "Valid newTaskListId is required" },
        { status: 400 }
      );
    }

    // Move the task to the new list
    const updatedTask = await moveTaskToList(
      new ObjectId(params.id),
      user._id,
      new ObjectId(newTaskListId),
      newOrder
    );

    // Check if task was found and moved
    if (!updatedTask) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error moving task:", error);
    return NextResponse.json(
      { error: "Failed to move task" },
      { status: 500 }
    );
  }
}
