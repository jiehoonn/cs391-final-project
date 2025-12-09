// lib/hooks/useTaskLists.ts
// Lina

import useSWR from "swr";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

type TaskListsResponse = {
    taskLists: any[];
};

const fetcher = (url: string) => apiGet<TaskListsResponse>(url);

export function useTaskLists() {
    const { data, error, isLoading, mutate } = useSWR<TaskListsResponse>("/api/task-lists", fetcher);

    const lists = data?.taskLists || [];

    async function addList(list: any) {
        const response = await apiPost<{ taskList: any }>("/api/task-lists", list);
        mutate({ taskLists: [...lists, response.taskList] }, false);
    }

    async function updateList(id: string, updates: any) {
        const response = await apiPut<{ taskList: any }>(`/api/task-lists/${id}`, updates);
        mutate(
            { taskLists: lists.map((l: any) => (l._id?.toString() === id ? response.taskList : l)) },
            false
        );
    }

    async function deleteList(id: string) {
        await apiDelete(`/api/task-lists/${id}`);
        mutate({ taskLists: lists.filter((l: any) => l._id?.toString() !== id) }, false);
    }

    return {
        lists,
        loading: isLoading,
        error,
        addList,
        updateList,
        deleteList
    };
}
