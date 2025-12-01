// app/api/task-lists/route.ts => Jiehoon Lee

// API Route: Task Lists
// Purpose: Handle GET (fetch all task lists) and POST (create new task list)
// Authentication: Required - uses NextAuth session

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTaskListsByUserId, createTaskList } from "@/lib/db";
import { findUserByEmail } from "@/lib/db";

// GET /api/task-lists
// Fetches all task lists for the authenticated user
// Returns: Array of task lists sorted by order
export async function GET() {
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

    // Fetch all task lists for this user
    const taskLists = await getTaskListsByUserId(user._id);

    return NextResponse.json({ taskLists }, { status: 200 });
  } catch (error) {
    console.error("Error fetching task lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch task lists" },
      { status: 500 }
    );
  }
}

// POST /api/task-lists
// Creates a new task list for the authenticated user
// Body: { name: string, description?: string, color?: string, order?: number }
// Returns: The newly created task list
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
    const { name, description, color, order } = body;

    // Validate required fields
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    // Create the task list
    const taskList = await createTaskList({
      userId: user._id,
      name,
      description,
      color,
      order,
    });

    return NextResponse.json({ taskList }, { status: 201 });
  } catch (error) {
    console.error("Error creating task list:", error);
    return NextResponse.json(
      { error: "Failed to create task list" },
      { status: 500 }
    );
  }
}
