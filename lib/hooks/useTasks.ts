// lib/hooks/useTask.ts
// Lina

import useSWR from "swr";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

const fetcher = (url: string) => apiGet(url);

export function useTasks(listId?: string) {
    const url = `/api/tasks${listId ? `?listId=${listId}` : ""}`;
    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    async function addTask(task: any) {
        const newTask = await apiPost("/api/tasks", task);
        mutate([...data, newTask], false);
    }

    async function updateTask(id: string, updates: any) {
        const updated = await apiPut(`/api/tasks/${id}`, updates);
        mutate(
            data.map((t: any) => (t.id === id ? updated : t)),
            false
        );
    }

    async function deleteTask(id: string) {
        await apiDelete(`/api/tasks/${id}`);
        mutate(data.filter((t: any) => t.id !== id), false);
    }

    return {
        tasks: data,
        loading: isLoading,
        error,
        addTask,
        updateTask,
        deleteTask
    };
}
