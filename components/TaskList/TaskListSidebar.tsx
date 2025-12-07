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
        <div className="w-72 bg-gray-800 text-white flex flex-col p-4">
            <h1 className="text-lg font-bold mb-4">Task Lists</h1>

            {/* View All Tasks button */}
            <button
                onClick={() => onSelectTaskList(null)}
                className={`p-2 rounded hover:bg-gray-700 w-full text-left mb-2 flex items-center gap-2 ${
                    selectedTaskListId === null ? "bg-gray-700" : ""
                }`}
            >
                <List size={18} />
                <span>All Tasks</span>
            </button>

            {/* Button to open modal to create new task list */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 p-2 rounded flex items-center justify-center gap-2"
            >
                <Plus size={18} />
                <span>New List</span>
            </button>

            {/* Displays any error messages */}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            {/* Renders each task list as a clickable item */}
            <div className="mt-4 flex flex-col space-y-2">
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
