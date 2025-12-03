// components/TaskList/TaskListItem.tsx: Individual list card => Jocelyn Mao

import React from "react";
import Link from "next/link";
import {TaskList} from "@/types/database";

interface TaskListItemProps {
    list: TaskList;
}

// Displays single task list in sidebar
export default function TaskListItem({list}: TaskListItemProps){
    return (
        <Link
            href={`/dashboard/${list._id?.toString()}`}
            className="p-2 rounded hover:bg-gray-700 block"
        >
            {list.name}
        </Link>
    );
}