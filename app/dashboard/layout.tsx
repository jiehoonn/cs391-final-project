// app/dashboard/layout.tsx: Styled dashboard layout => Jocelyn Mao
// Defines full layout of dashboard, including:
// - Left sidebar for task lists
// - Top header for filters/search
// - Main content for pages
"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import TaskListSidebar from "@/components/TaskList/TaskListSidebar";
import { DashboardProvider, useDashboard } from "./DashboardContext";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { selectedTaskListId, setSelectedTaskListId } = useDashboard();

  return (
    <div className="flex h-screen">
      <TaskListSidebar
        selectedTaskListId={selectedTaskListId}
        onSelectTaskList={setSelectedTaskListId}
      />

      <div className="flex-1 flex flex-col bg-gray-100">
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center space-x-2">
            {/* Task filter dropdown menu */}
            {/* <select className="p-2 border rounded">
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In progress</option>
            </select> */}
            {/*Search bar*/}
            {/* <input
              type="text"
              placeholder="Search tasks..."
              className="p-2 border rounded"
            /> */}
            {/* Sign out button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}