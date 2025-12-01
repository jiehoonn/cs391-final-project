// app/api/tasks/upcoming/route.ts => Jiehoon Lee

// API Route: Upcoming Tasks
// Purpose: Get tasks that are due within a specified number of days (default: 7 days)
// Authentication: Required - fetches upcoming tasks for authenticated user
// Query Params: ?days=N (optional, default: 7)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUpcomingTasks, findUserByEmail } from "@/lib/db";

// GET /api/tasks/upcoming
// Fetches incomplete tasks due within the next N days
// Query params: ?days=7 (optional, defaults to 7)
// Returns: Array of upcoming tasks sorted by due date
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

    // Get days parameter from query string (default to 7)
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 7;

    // Validate days parameter
    if (isNaN(days) || days < 0) {
      return NextResponse.json(
        { error: "Days must be a positive number" },
        { status: 400 }
      );
    }

    // Fetch upcoming tasks
    const tasks = await getUpcomingTasks(user._id, days);

    return NextResponse.json({ tasks, days }, { status: 200 });
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming tasks" },
      { status: 500 }
    );
  }
}
