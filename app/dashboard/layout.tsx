// app/dashboard/layout.tsx: Styled dashboard layout => Jocelyn Mao
// Defines full layout of dashboard, including:
// - Left sidebar for task lists
// - Top header for filters/search
// - Main content for pages
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TaskList } from "@/types/database";
//import { fetchTaskLists } from "@/lib/api"; // Enable once backend is implemented

export default function DashboardLayout(
{
     children,
 }: Readonly<{
    children: React.ReactNode;
}>) {
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
/*
// Enable once API is implemented
// Fetches task lists from backend API
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
    const exampleLists = [
        { _id: "1", name: "Personal" },
        { _id: "2", name: "School" },
        { _id: "3", name: "Work" },
    ];

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-6">Task Lists</h1>
                {/*
                Opens modal and allows user to create new task lists
                Update once backend is ready
                */}
                <button
                    onClick={() => console.log("Open CreateTaskListModal")}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 p-2 rounded"
                >
                    + New List
                </button>

                {/*
                Render dynamic lists
                Update once backend is ready
                */}
                <div className="mt-4 flex flex-col space-y-2">
                    {exampleLists.map(list => (
                        <Link
                            key={list._id}
                            href={`/dashboard/${list._id}`}
                            className="p-2 rounded hover:bg-gray-700 block"
                        >
                            {list.name}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-gray-100">
                <header className="bg-white shadow p-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Dashboard</h2>
                    <div className="flex space-x-2">
                        {/* Task filter dropdown menu */}
                        <select className="p-2 border rounded">
                            <option value="all">All Tasks</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In progress</option>
                        </select>
                        {/* Search bar */}
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="p-2 border rounded"
                        />
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}