"use client";

/**
 * Component: TaskGrid
 * Author: Tung Pham
 *
 * Responsibility:
 * Fetch and display tasks in a responsive grid layout with filtering options.
 * Manages task creation, editing, deletion, and completion toggling.
 * If no task list exists when creating the first task, it automatically
 * creates a default list and assigns the task to it.
 *
 * Additional Notes:
 * - Integrates CreateTaskModal and EditTaskModal.
 * - Delegates all data mutations to the useTasks() hook.
 * - UI-focused; contains no direct API calls except for list creation.
 */


import { useState } from "react";
import styled from "styled-components";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskFilters, { TaskFilter } from "./TaskFilters";
import CreateTaskModal, { CreateTaskFormValues } from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import { useTasks } from "@/lib/hooks/useTasks";
import { apiPost } from "@/lib/api";
import type { Task, TaskList } from "@/types/database";

const Panel = styled.section`
  margin-top: 1rem;
  border-radius: 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;

  box-shadow: 0 0 28px rgba(0, 0, 0, 0.12);

  padding: 0.75rem;
`;



const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  // background: #f8fafc; /* light slate gray */
  // // border-radius: 1rem;

  /* soft inner shadow for a “lifted” effect */
  box-shadow:
    inset 0 1px 1px rgba(0,0,0,0.03),
    inset 0 -1px 1px rgba(0,0,0,0.02);

  padding: 1.25rem;
`;


const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CountText = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const NewTaskButton = styled.button`
  border-radius: 0.45rem;
  border: none;
  padding: 0.4rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: #22c55e;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(22, 163, 74, 0.4);
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background-color: #16a34a;
  }
`;

const EmptyState = styled.div`
  border-radius: 0.5rem;
  border: 1px dashed #d1d5db;
  padding: 2rem;
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
`;

const Grid = styled.div`
  display: grid;
  gap: 0.75rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Message = styled.div<{ $error?: boolean }>`
  padding: 1rem;
  font-size: 0.9rem;
  color: ${({ $error }) => ($error ? "#b91c1c" : "#6b7280")};
`;

type TaskGridProps = {
  // Optional: if parent passes a list id, use that; otherwise we'll auto-create one.
  taskListId?: string | null;
};

export default function TaskGrid({ taskListId }: TaskGridProps) {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Use the taskListId directly - undefined means "all tasks"
  const effectiveTaskListId = taskListId || undefined;

  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks(effectiveTaskListId);

  // client-side filter for all/upcoming/overdue
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;

    const due = task.dueDate ? new Date(task.dueDate) : null;
    if (!due) return false;

    const now = new Date();

    if (filter === "upcoming") return due >= now;
    // overdue
    return !task.completed && due < now;
  });

  const handleCreateTask = async (values: CreateTaskFormValues) => {
    // Use the currently selected task list ID
    // If no list is selected (viewing "All Tasks"), create a default list first
    let listId = effectiveTaskListId;

    if (!listId) {
      // No task list selected - create a default one
      const response = await apiPost<{ taskList: TaskList }>("/api/task-lists", {
        name: "My Assignments",
      });

      const created = response.taskList;

      if (!created || !created._id) {
        throw new Error("Failed to create default task list");
      }

      listId = created._id.toString();
    }

    // Build payload INCLUDING taskListId
    const payload: any = {
      title: values.title,
      taskListId: listId,
    };

    if (values.description) {
      payload.description = values.description;
    }
    if (values.dueDate) {
      // Create date at local midnight, not UTC midnight
      // values.dueDate is "YYYY-MM-DD" format from input[type="date"]
      const [year, month, day] = values.dueDate.split("-").map(Number);
      const localDate = new Date(year, month - 1, day); // month is 0-indexed
      payload.dueDate = localDate.toISOString();
    }
    if (values.priority) {
      payload.priority = values.priority;
    }

    await addTask(payload);
  };

  // ---------- rendering ----------

  if (loading) {
    return <Message>Loading tasks…</Message>;
  }

  if (error) {
    return (
      <Message $error>
        Failed to load tasks: {String((error as any).message ?? error)}
      </Message>
    );
  }

  return (
    <Panel>
      <Wrapper>
        <TopBar>
          <TaskFilters value={filter} onChange={setFilter} />

          <RightSide>
            <CountText>
              {filteredTasks.length} task{filteredTasks.length !== 1 && "s"}
            </CountText>
            <NewTaskButton type="button" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} />
              <span>New Task</span>
            </NewTaskButton>
          </RightSide>
        </TopBar>

        {filteredTasks.length === 0 ? (
          <EmptyState>
            No tasks for this view yet. Try creating a new task.
          </EmptyState>
        ) : (
          <Grid>
            {filteredTasks.map((task: Task, index: number) => {
              const id = task._id ? task._id.toString() : `task-${index}`;
              return (
                <TaskCard
                  key={id}
                  task={task}
                  onToggleComplete={(taskId) =>
                    updateTask(taskId, { completed: !task.completed })
                  }
                  onEdit={(taskToEdit) => setEditingTask(taskToEdit)}
                  onDelete={(taskId) => deleteTask(taskId)}
                />
              );
            })}
          </Grid>
        )}

        <CreateTaskModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateTask}
        />

        {/* Edit existing task */}
        {editingTask && (
          <EditTaskModal
            isOpen={true}
            task={editingTask}
            onClose={() => setEditingTask(null)}
            // If your EditTaskModal needs a callback to persist changes:
            onUpdate={async (taskId, values) => {
              // forward to useTasks hook
              await updateTask(taskId, values);
            }}
          />
        )}
      </Wrapper>
    </Panel>
  );
}

