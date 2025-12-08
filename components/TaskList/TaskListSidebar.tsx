// components/TaskList/TaskListSidebar.tsx: Sidebar displaying all task lists => Jocelyn Mao

"use client";

import React, {useEffect, useState} from "react";
import { List, Plus } from "lucide-react";
import {TaskList} from "@/types/database";
import TaskListItem from "./TaskListItem";
import CreateTaskListModal from "./CreateTaskListModal";
import EditTaskListModal from "@/components/TaskList/EditTaskListModal";

async function fetchTaskLists(): Promise<TaskList[]> {
    const res = await fetch("/api/task-lists");
    if (!res.ok) throw new Error ("Failed to fetch task lists");
    const data = await res.json();
    return data.taskLists;
}

interface TaskListSidebarProps {
    selectedTaskListId: string | null;
    onSelectTaskList: (id: string | null) => void;
}

export default function TaskListSidebar({ selectedTaskListId, onSelectTaskList }: TaskListSidebarProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editingList, setEditingList] = useState<TaskList | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const loadLists = async () => {
            try {
                const lists = await fetchTaskLists();
                setTaskLists(lists);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch task lists");
            } finally {
                setLoading(false);
            }
        };
        loadLists();
    }, [])

    const handleDeleteList = async (id: string) => {
        try {
            const res = await fetch(`/api/task-lists/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete task list");
            }

            // Remove from local state
            setTaskLists((prev) => prev.filter((list) => list._id?.toString() !== id));

            // If the deleted list was selected, switch to "All Tasks"
            if (selectedTaskListId === id) {
                onSelectTaskList(null);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to delete task list");
        }
    };

    return (
        <div className="w-60 bg-stone-100 shadow-inner text-stone-900 flex flex-col p-4">
            <h1 className="text-sm font-bold mb-4">Assignment Tracker</h1>

            {/* View All Tasks button */}
            <button
                onClick={() => onSelectTaskList(null)}
                className={`p-1 rounded hover:bg-stone-200 w-full text-left text-sm font-semibold mb-1 flex items-center gap-2 cursor-pointer ${
                    selectedTaskListId === null 
                        ? "bg-stone-200" // selected
                        : "bg-stone-100 text-stone-500" // not selected
                }`}
            >
                <List size={14} />
                <span>All Tasks</span>
            </button>

            {/* Button to open modal to create new task list */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="p-1 rounded hover:bg-stone-200 w-full text-left text-sm text-stone-500 font-semibold mb-1 flex items-center gap-2 cursor-pointer"
            >
                <Plus size={14} />
                <span>New List</span>
            </button>

            {/* Displays any error messages */}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            <h2 className="text-xs font-bold mt-4 text-stone-400 mb-2">Task Lists</h2>

            {/* Renders each task list as a clickable item */}
            <div className="flex flex-col w-full">
                {Array.isArray(taskLists) &&
                taskLists.map((list, index) =>
                    <TaskListItem
                        key={list._id ? list._id.toString() : `temp-${index}`}
                        list={list}
                        isSelected={list._id?.toString() === selectedTaskListId}
                        onSelect={() => onSelectTaskList(list._id?.toString() || null)}
                        onDelete={handleDeleteList}
                        onEdit={() => {
                            setEditingList(list);
                            setIsEditModalOpen(true);
                        }}
                    />
                )}
            </div>

            {/* Modal for creating a new task list */}
            {isModalOpen && (
                <CreateTaskListModal
                    onClose={() => setIsModalOpen(false)} // close modal
                    onCreate={(newList) => {
                        // add new list to state
                        console.log("TaskListSidebar - adding new list to state:", newList);
                        setTaskLists((prev) => {
                            const updated = [...prev, newList];
                            console.log("TaskListSidebar - updated lists:", updated);
                            return updated;
                        });
                        setIsModalOpen(false); // close modal after creating
                    }}
                />
            )}

            {isEditModalOpen && editingList &&(
                <EditTaskListModal
                    taskList={editingList}
                    onClose={() => setIsEditModalOpen(false)} // close modal
                    onEdit={(editedList) => {
                        // add new list to state
                        setTaskLists((prev) =>
                            prev.map((l) => (l._id ===editedList._id ? editedList : l))
                        );
                        setIsEditModalOpen(false); // close modal after creating
                    }}
                />
            )}
        </div>
    );
}
