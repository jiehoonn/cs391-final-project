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
            const newList: TaskList = await res.json();
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
            className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50"
        >
            <div className="bg-gray-800 text-white p-6 rounded shadow w-96">
                <h2 className="text-blue-xl font-bold mb-4 text-blue-400">Create New Task List</h2>

                {/* Form for creating new task list */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="List Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}