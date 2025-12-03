// lib/hooks/useTaskLists.ts
// Lina

import useSWR from "swr";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

const fetcher = (url: string) => apiGet(url);

export function useTaskLists() {
    const { data, error, isLoading, mutate } = useSWR("/api/task-lists", fetcher);

    async function addList(list: any) {
        const newList = await apiPost("/api/task-lists", list);
        mutate([...data, newList], false);
    }

    async function updateList(id: string, updates: any) {
        const updated = await apiPut(`/api/task-lists/${id}`, updates);
        mutate(
            data.map((l: any) => (l.id === id ? updated : l)),
            false
        );
    }

    async function deleteList(id: string) {
        await apiDelete(`/api/task-lists/${id}`);
        mutate(data.filter((l: any) => l.id !== id), false);
    }

    return {
        lists: data,
        loading: isLoading,
        error,
        addList,
        updateList,
        deleteList
    };
}
