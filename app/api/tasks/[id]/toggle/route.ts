// app/api/tasks/[id]/toggle/route.ts => Jiehoon Lee

// API Route: Toggle Task Completion
// Purpose: Toggle a task's completed status (true <-> false)
// Authentication: Required - ensures user can only toggle their own tasks
// Method: POST

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { toggleTaskCompletion, findUserByEmail } from "@/lib/db";

// POST /api/tasks/[id]/toggle
// Toggles the completion status of a task
// Returns: Updated task with toggled completion status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Await params
    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // Toggle the task completion
    const updatedTask = await toggleTaskCompletion(
      new ObjectId(id),
      user._id
    );

    // Check if task was found and toggled
    if (!updatedTask) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error toggling task completion:", error);
    return NextResponse.json(
      { error: "Failed to toggle task completion" },
      { status: 500 }
    );
  }
}
