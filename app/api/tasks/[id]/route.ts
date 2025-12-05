// app/api/tasks/[id]/route.ts => Jiehoon Lee

// API Route: Single Task Operations
// Purpose: Handle GET (fetch one), PUT (update), DELETE (remove) for a specific task
// Authentication: Required - ensures user can only access their own tasks

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import {
  getTaskById,
  updateTask,
  deleteTask,
  findUserByEmail,
} from "@/lib/db";
import { Priority, UpdateTaskInput } from "@/types/database";

// GET /api/tasks/[id]
// Fetches a single task by ID
// Returns: Task object if found and belongs to user
export async function GET(
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

    // Fetch the task
    const task = await getTaskById(new ObjectId(id));

    // Check if task exists
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify the task belongs to the authenticated user
    if (task.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id]
// Updates an existing task
// Body: {
//   title?: string,
//   description?: string,
//   dueDate?: Date,
//   priority?: "low" | "medium" | "high" | "urgent",
//   notes?: string,
//   color?: string,
//   completed?: boolean,
//   order?: number
// }
// Returns: Updated task
export async function PUT(
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

    // Parse request body
    const body = await request.json();
    const {
      title,
      description,
      dueDate,
      priority,
      notes,
      color,
      completed,
      order,
    } = body;

    // Validate at least one field is being updated
    if (
      title === undefined &&
      description === undefined &&
      dueDate === undefined &&
      priority === undefined &&
      notes === undefined &&
      color === undefined &&
      completed === undefined &&
      order === undefined
    ) {
      return NextResponse.json(
        { error: "No fields to update" },
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

    // Build updates object (only include defined fields)
    const updates: UpdateTaskInput = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined)
      updates.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (priority !== undefined) updates.priority = priority;
    if (notes !== undefined) updates.notes = notes;
    if (color !== undefined) updates.color = color;
    if (completed !== undefined) updates.completed = completed;
    if (order !== undefined) updates.order = order;

    // Update the task
    const updatedTask = await updateTask(
      new ObjectId(id),
      user._id,
      updates
    );

    // Check if task was found and updated
    if (!updatedTask) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id]
// Deletes a task
// Returns: Success message
export async function DELETE(
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

    // Delete the task
    const deleted = await deleteTask(new ObjectId(id), user._id);

    // Check if task was found and deleted
    if (!deleted) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
