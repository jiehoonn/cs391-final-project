// app/dashboard/layout.tsx: Styled dashboard layout => Jocelyn Mao
// Defines full layout of dashboard, including:
// - Left sidebar for task lists
// - Top header for filters/search
// - Main content for pages
"use client";

import React from "react";
import TaskListSidebar from "@/components/TaskList/TaskListSidebar"

export default function DashboardLayout(
{
     children,
 }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen">
            <TaskListSidebar />

            <div className="flex-1 flex flex-col bg-gray-100">
                <header className="bg-white shadow p-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Dashboard</h2>
                    <div className="flex space-x-2">
                        {/* Task filter dropdown menu */}
                        <select className="p-2 border rounded">
                            <option value="all">All Tasks</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In progress</option>
                        </select>
                        {/*Search bar*/}
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="p-2 border rounded"
                        />
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}