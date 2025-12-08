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
            className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center"
        >
            <div className="w-80 bg-stone-100 text-stone-500 text-sm font-semibold p-4 rounded">
                <h2 className="mb-2 text-stone-900">Edit Task List</h2>

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
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}