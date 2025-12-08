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
    <div className="flex h-screen bg-white">
      <TaskListSidebar
        selectedTaskListId={selectedTaskListId}
        onSelectTaskList={setSelectedTaskListId}
      />

      <div className="flex-1 flex flex-col">
        <header className="p-4 flex justify-end">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm flex items-center gap-2 p-1 font-semibold text-stone-500 rounded hover:bg-stone-200 cursor-pointer"
              title="Sign out"
            >
              <LogOut size={14} />
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