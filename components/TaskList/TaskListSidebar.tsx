// components/TaskList/TaskListSidebar.tsx: Sidebar displaying all task lists => Jocelyn Mao

"use client";

import React, {useEffect, useState} from "react";
import {TaskList} from "@/types/database";
import TaskListItem from "./TaskListItem";
import CreateTaskListModal from "./CreateTaskListModal";

/* Helper function to fetch task lists from API
Enable once backend is ready
async function fetchTaskLists(): Promise<TaskList[]> {
    const res = await fetch("/api/task-lists");
    if (!res.ok) throw new Error ("Failed to fetch task lists");
    return res.json();
}
 */

export default function TaskListSidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* Fetch lists from backend
    Enable once backend is ready
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
    */

    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-6">Task Lists</h1>

            {/* Button to open modal to create new task list */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 p-2 rounded"
            >
                + New List
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
                    />
                )}
            </div>

            {/* Modal for creating a new task list */}
            {isModalOpen && (
                <CreateTaskListModal
                    onClose={() => setIsModalOpen(false)} // close modal
                    onCreate={(newList) => {
                        // add new list to state
                        setTaskLists((prev) => [...prev, newList]);
                        setIsModalOpen(false); // close modal after creating
                    }}
                />
            )}
        </div>
    );
}
