// lib/hooks/useTask.ts
// Lina

import useSWR from "swr";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type { Task } from "@/types/database";

const fetcher = (url: string) => apiGet(url);

export function useTasks(listId?: string) {
  // FIX: Close the template string properly
  const url = `/api/tasks${listId ? `?taskListId=${listId}` : ""}`;
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  const tasks: Task[] = data?.tasks || [];

  async function addTask(task: any) {
    console.log("🔍 useTasks.addTask - received:", JSON.stringify(task, null, 2));
    const result = await apiPost("/api/tasks", task);
    console.log("🔍 useTasks.addTask - API returned:", result);
    const newTask = result.task || result;
    mutate({ tasks: [...tasks, newTask] }, false);
  }

  async function updateTask(id: string, updates: any) {
    const result = await apiPut(`/api/tasks/${id}`, updates);
    const updated = result.task || result;
    mutate(
      { tasks: tasks.map((t) => (t._id && t._id.toString() === id ? updated : t)) },
      false
    );
  }

  async function deleteTask(id: string) {
    await apiDelete(`/api/tasks/${id}`);
    mutate(
      { tasks: tasks.filter((t) => !(t._id && t._id.toString() === id)) },
      false
    );
  }

  return {
    tasks,
    loading: isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
  };
}

