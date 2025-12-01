// app/api/tasks/overdue/route.ts => Jiehoon Lee

// API Route: Overdue Tasks
// Purpose: Get all incomplete tasks that are past their due date
// Authentication: Required - fetches overdue tasks for authenticated user

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOverdueTasks, findUserByEmail } from "@/lib/db";

// GET /api/tasks/overdue
// Fetches all incomplete tasks that have a due date in the past
// Returns: Array of overdue tasks sorted by due date (oldest first)
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

    // Fetch overdue tasks
    const tasks = await getOverdueTasks(user._id);

    return NextResponse.json({ tasks, count: tasks.length }, { status: 200 });
  } catch (error) {
    console.error("Error fetching overdue tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch overdue tasks" },
      { status: 500 }
    );
  }
}
