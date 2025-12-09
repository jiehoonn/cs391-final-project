"use client";

/**
 * Component: TaskDashboardSection
 * Author: Tung Pham
 *
 * Responsibility:
 * Display a full dashboard section for task management, including
 * the task list selector, task grid, filters, and actions.
 * Serves as the primary container for task-related UI.
 *
 * Additional Notes:
 * - Handles which task list is currently active.
 * - Coordinates layout between filters, grid, and modals.
 */


import styled from "styled-components";
import { useTasks } from "@/lib/hooks/useTasks";
import TaskCard from "./TaskCard";
import type { Task } from "@/types/database";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Message = styled.p<{ $error?: boolean }>`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: ${({ $error }) => ($error ? "#b91c1c" : "#6b7280")};
`;

export default function TaskDashboardSection() {
  const { tasks, loading, error, updateTask, deleteTask } = useTasks();

  if (loading) {
    return <Message>Loading assignments…</Message>;
  }

  if (error) {
    return <Message $error>Failed to load assignments.</Message>;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Message>
        No assignments yet. Start by creating a task list!
      </Message>
    );
  }

  return (
    <Wrapper>
      {tasks.map((task: Task) => {
        const id = task._id ? task._id.toString() : task.title;

        return (
          <TaskCard
            key={id}
            task={task}
            // Toggle completion using your hook
            onToggleComplete={(taskId) =>
              updateTask(taskId, { completed: !task.completed })
            }
            // Optional delete support
            onDelete={(taskId) => deleteTask(taskId)}
          />
        );
      })}
    </Wrapper>
  );
}

