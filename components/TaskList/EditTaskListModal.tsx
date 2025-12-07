// components/TaskList/EditTaskListModal.tsx: Form to PUT updates => Jocelyn Mao

"use client";

import React, {useState} from "react";
import {TaskList} from "@/types/database";

interface EditTaskListModalProps {
    taskList: TaskList;
    onClose: () => void; // Function to close modal
    onEdit: (editedList: TaskList) => void;
}

export default function EditTaskListModal ({
    taskList,
    onClose,
    onEdit,
                                             }: EditTaskListModalProps){
    const [name, setName] = useState(taskList.name);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Stops default page refresh
        setLoading(true);
        setError("");

        try {
            // PUT to edit task list
            const res = await fetch(`/api/task-lists/${taskList._id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name}), // Send the name from input
            });

            if (!res.ok) throw new Error("Failed to edit task list");

            const data = await res.json();
            const editedList: TaskList = data.taskList;
            console.log("Edited task list:", editedList);
            onEdit(editedList);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error editing task list");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50"
        >
            <div className="bg-gray-800 text-white p-6 rounded shadow w-96">
                <h2 className="text-blue-xl font-bold mb-4 text-blue-400">Edit Task List</h2>

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
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}