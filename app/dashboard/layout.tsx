"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TaskList } from "@/types/database";
//import { fetchTaskLists } from "@/lib/api";

// Type for props
interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
/*
    useEffect(() => {
        const getTaskLists = async () => {
            try {
                const lists = await fetchTaskLists();
                setTaskLists(lists);
            } catch (err) {
                console.error(err);
                setError("Failed to load task lists");
            } finally {
                setLoading(false);
            }
        };
        getTaskLists();
    }, []);
*/
    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-6">Task Lists</h1>
                <button
                    onClick={() => console.log("Open CreateTaskListModal")}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 p-2 rounded"
                >
                    + New List
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col bg-gray-100">
                {/* Top nav / filters */}
                <header className="bg-white shadow p-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Dashboard</h2>
                    <div className="flex space-x-2">
                        <select className="p-2 border rounded">
                            <option value="all">All Tasks</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In progress</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="p-2 border rounded"
                        />
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}