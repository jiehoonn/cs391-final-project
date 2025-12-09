// components/TaskList/CreateTaskListModal.tsx: Form to post new lists => Jocelyn Mao

"use client";

import React, {useState} from "react";
import {TaskList} from "@/types/database";

interface CreateTaskListModalProps {
    onClose: () => void; // Function to close modal
    onCreate: (newList: TaskList) => void; // Signifies new list
}

export default function CreateTaskListModal ({
    onClose,
    onCreate,
}: CreateTaskListModalProps){
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Stops default page refresh
        setLoading(true);
        setError("");

        try {
            // Make POST request to backend API to create a new task list
            const res = await fetch("/api/task-lists", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name}), // Send the name from input
            });

            if (!res.ok) throw new Error("Failed to create task list");
            const data = await res.json();
            const newList: TaskList = data.taskList; // Extract taskList from response
            console.log("Created task list:", newList);
            onCreate(newList); // Adds new list to sidebar
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error creating task list");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-[1000]"
        >
            <div className="w-80 bg-stone-100 text-stone-500 text-sm font-semibold p-4 rounded relative z-[1010]">
                <h2 className="mb-2 text-stone-900">Create New Task List</h2>

                {/* Form for creating new task list */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="List Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 bg-stone-200 rounded mb-0"
                        required
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-2 py-1 hover:text-red-700 bg-stone-200 rounded text-xs cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-2 py-1 hover:text-blue-700 bg-stone-200 rounded text-xs cursor-pointer"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
