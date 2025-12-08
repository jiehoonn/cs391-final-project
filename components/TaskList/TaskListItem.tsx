// components/TaskList/TaskListItem.tsx: Individual list card => Jocelyn Mao

import React, { useState } from "react";
import { Trash2, Pencil, File} from "lucide-react";
import {TaskList} from "@/types/database";

interface TaskListItemProps {
    list: TaskList;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: (id: string) => void;
    onEdit: () => void;
}

// Displays single task list in sidebar
export default function TaskListItem({list, isSelected, onSelect, onDelete, onEdit}: TaskListItemProps) {
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
            <div className={`p-1 rounded bg-stone-200 font-semibold ${
                isSelected 
                    ? "" 
                    : ""
            }`}>
                <p className="text-sm mb-2">Delete {list.name}?</p>
                <div className="flex gap-2">
                    <button
                        onClick={confirmDelete}
                        className="flex-1 px-2 py-1 hover:text-red-700 bg-stone-300 rounded text-xs cursor-pointer"
                    >
                        Delete
                    </button>
                    <button
                        onClick={cancelDelete}
                        className="flex-1 px-2 py-1 hover:text-blue-700 bg-stone-300 rounded text-xs cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onSelect}
            className={`p-1 rounded hover:bg-stone-200 w-full text-sm font-semibold mb-1 flex items-center gap-2 cursor-pointer ${
                isSelected
                    ? "bg-stone-200" // selected
                    : "bg-stone-100 text-stone-500" // not selected
            }`}
        >
            <File size={14} />
            <span className="flex-1 px-1 text-sm truncate">
                {list.name}
            </span>

            {/* Edit button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }}
                className="p-1 rounded hover:bg-stone-300 curser-pointer"
            >
                <Pencil size={14}/>
            </button>

            {/* Delete button */}
            <button
                onClick={handleDelete}
                className="p-1 rounded hover:bg-stone-300 curser-pointer"
            >
                <Trash2 size={14}/>
            </button>
        </div>
    );
}