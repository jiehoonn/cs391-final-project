"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskGrid from "@/components/Task/TaskGrid";
import { useDashboard } from "./DashboardContext";

export default function DashboardPage() {
  const { selectedTaskListId } = useDashboard();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Your assignment tracker dashboard
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedTaskListId ? "Task List" : "All Tasks"}
        </h2>
        <TaskGrid
          key={selectedTaskListId || "all-tasks"}
          taskListId={selectedTaskListId || null}
        />
      </div>
    </div>
  );
}
