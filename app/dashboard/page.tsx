"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskGrid from "@/components/Task/TaskGrid";
import { useDashboard } from "./DashboardContext";
import type { TaskList } from "@/types/database";

export default function DashboardPage() {
  const { selectedTaskListId } = useDashboard();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (!data || !data.user) {
          router.push("/");
          return;
        }

        setSession(data);
      } catch (error) {
        console.error("Failed to check auth:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  useEffect(() => {
    async function fetchTaskLists() {
      try {
        const res = await fetch("/api/task-lists");
        const data = await res.json();
        setTaskLists(data.taskLists || []);
      } catch (error) {
        console.error("Failed to fetch task lists:", error);
      }
    }

    if (session) {
      fetchTaskLists();
    }
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  // Find the selected task list name
  const selectedTaskList = taskLists.find(
    (list) => list._id?.toString() === selectedTaskListId
  );
  const taskListTitle = selectedTaskListId
    ? selectedTaskList?.name || "Task List"
    : "All Tasks";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Your assignment tracker dashboard
        </p>
      </div>

      {/* Task dashboard panel */}
      <section
        className="
          rounded-3xl
          border border-slate-200
          bg-gradient-to-b from-white to-slate-50
          shadow-[0_18px_40px_rgba(15,23,42,0.10),0_4px_10px_rgba(15,23,42,0.06)]
          p-6 sm:p-7
        "
      >
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {taskListTitle}
        </h2>

        <TaskGrid
          key={selectedTaskListId || "all-tasks"}
          taskListId={selectedTaskListId || null}
        />
      </section>
    </div>
  );
}

