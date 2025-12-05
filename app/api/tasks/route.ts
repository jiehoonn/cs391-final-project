// app/api/tasks/route.ts => Jiehoon Lee

// API Route: Tasks
// Purpose: Handle GET (fetch tasks) and POST (create new task)
// Query Params for GET: taskListId (optional) - filter tasks by task list
// Authentication: Required - uses NextAuth session

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import {
  getTasksByUserId,
  getTasksByTaskListId,
  createTask,
  findUserByEmail,
} from "@/lib/db";
import { Priority } from "@/types/database";

// GET /api/tasks
// Fetches tasks for the authenticated user
// Query params: ?taskListId=... (optional) - filter by specific task list
// Returns: Array of tasks
export async function GET(request: NextRequest) {
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

    // Check for taskListId query parameter
    const { searchParams } = new URL(request.url);
    const taskListId = searchParams.get("taskListId");

    let tasks;

    // If taskListId is provided, fetch tasks for that list
    if (taskListId) {
      if (!ObjectId.isValid(taskListId)) {
        return NextResponse.json(
          { error: "Invalid task list ID" },
          { status: 400 }
        );
      }
      tasks = await getTasksByTaskListId(new ObjectId(taskListId));
    } else {
      // Otherwise, fetch all tasks for the user
      tasks = await getTasksByUserId(user._id);
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks
// Creates a new task for the authenticated user
// Body: {
//   taskListId: string (ObjectId),
//   title: string (required),
//   description?: string,
//   dueDate?: Date,
//   priority?: "low" | "medium" | "high" | "urgent",
//   notes?: string,
//   color?: string,
//   order?: number
// }
// Returns: The newly created task
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

    console.log("🔍 API RECEIVED BODY:", JSON.stringify(body, null, 2));
    console.log("🔍 Body keys:", Object.keys(body));

    const {
      taskListId,
      title,
      description,
      dueDate,
      priority,
      notes,
      color,
      order,
    } = body;

    // Validate required fields
    if (!taskListId || !ObjectId.isValid(taskListId)) {
      return NextResponse.json(
        { error: "Valid taskListId is required" },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority && !Object.values(Priority).includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }

    // Create the task
    const task = await createTask({
      taskListId: new ObjectId(taskListId),
      userId: user._id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority as Priority,
      notes,
      color,
      order,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
