// components/TaskList/TaskListItem.tsx: Individual list card => Jocelyn Mao

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import {TaskList} from "@/types/database";

interface TaskListItemProps {
    list: TaskList;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: (id: string) => void;
}

// Displays single task list in sidebar
export default function TaskListItem({list, isSelected, onSelect, onDelete}: TaskListItemProps){
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirm(true);
    };

    const confirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (list._id) {
            onDelete(list._id.toString());
        }
        setShowConfirm(false);
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirm(false);
    };

    if (showConfirm) {
        return (
            <div className={`p-2 rounded bg-red-600 ${isSelected ? "ring-2 ring-white" : ""}`}>
                <p className="text-sm mb-2">Delete "{list.name}"?</p>
                <div className="flex gap-2">
                    <button
                        onClick={confirmDelete}
                        className="flex-1 px-2 py-1 bg-red-800 hover:bg-red-900 rounded text-xs"
                    >
                        Delete
                    </button>
                    <button
                        onClick={cancelDelete}
                        className="flex-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center rounded ${isSelected ? "bg-gray-700" : ""}`}>
            <button
                onClick={onSelect}
                className="flex-1 p-2 hover:bg-gray-700 rounded text-left"
            >
                {list.name}
            </button>
            <button
                onClick={handleDelete}
                className="px-2 py-1 hover:bg-red-600 rounded text-sm"
                title="Delete task list"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}