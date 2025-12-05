// app/api/task-lists/[id]/route.ts => Jiehoon Lee

// API Route: Single Task List Operations
// Purpose: Handle GET (fetch one), PUT (update), DELETE (remove) for a specific task list
// Authentication: Required - ensures user can only access their own task lists

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import {
  getTaskListById,
  updateTaskList,
  deleteTaskList,
  findUserByEmail,
} from "@/lib/db";
import { deleteTasksByTaskListId } from "@/lib/db";
import { UpdateTaskListInput } from "@/types/database";

// GET /api/task-lists/[id]
// Fetches a single task list by ID
// Returns: Task list object if found and belongs to user
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
      return NextResponse.json({ error: "Invalid task list ID" }, { status: 400 });
    }

    // Fetch the task list
    const taskList = await getTaskListById(new ObjectId(id));

    // Check if task list exists
    if (!taskList) {
      return NextResponse.json({ error: "Task list not found" }, { status: 404 });
    }

    // Verify the task list belongs to the authenticated user
    if (taskList.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ taskList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching task list:", error);
    return NextResponse.json(
      { error: "Failed to fetch task list" },
      { status: 500 }
    );
  }
}

// PUT /api/task-lists/[id]
// Updates an existing task list
// Body: { name?: string, description?: string, color?: string, order?: number }
// Returns: Updated task list
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
      return NextResponse.json({ error: "Invalid task list ID" }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { name, description, color, order } = body;

    // Validate at least one field is being updated
    if (
      name === undefined &&
      description === undefined &&
      color === undefined &&
      order === undefined
    ) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Build updates object (only include defined fields)
    const updates: UpdateTaskListInput = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (color !== undefined) updates.color = color;
    if (order !== undefined) updates.order = order;

    // Update the task list
    const updatedTaskList = await updateTaskList(
      new ObjectId(id),
      user._id,
      updates
    );

    // Check if task list was found and updated
    if (!updatedTaskList) {
      return NextResponse.json(
        { error: "Task list not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ taskList: updatedTaskList }, { status: 200 });
  } catch (error) {
    console.error("Error updating task list:", error);
    return NextResponse.json(
      { error: "Failed to update task list" },
      { status: 500 }
    );
  }
}

// DELETE /api/task-lists/[id]
// Deletes a task list and all associated tasks
// Returns: Success message with count of deleted tasks
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
      return NextResponse.json({ error: "Invalid task list ID" }, { status: 400 });
    }

    const taskListId = new ObjectId(id);

    // Delete all tasks in this task list first
    const deletedTasksCount = await deleteTasksByTaskListId(
      taskListId,
      user._id
    );

    // Delete the task list itself
    const deleted = await deleteTaskList(taskListId, user._id);

    // Check if task list was found and deleted
    if (!deleted) {
      return NextResponse.json(
        { error: "Task list not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task list deleted successfully",
        deletedTasksCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task list:", error);
    return NextResponse.json(
      { error: "Failed to delete task list" },
      { status: 500 }
    );
  }
}
