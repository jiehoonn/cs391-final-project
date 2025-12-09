"use client";

/**
 * Component: TaskCard
 * Author: Tung Pham
 *
 * Responsibility:
 * Render a single task with its title, description, due date, priority,
 * and completion state. Provides UI for task-level actions including:
 * - Mark complete/incomplete
 * - Open edit modal
 * - Delete task
 *
 * Additional Notes:
 * - This component is purely presentational.
 * - All actions are delegated upward through callback props.
 */


import { format } from "date-fns";
import styled, { css } from "styled-components";
import { Check, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types/database";
import { Priority } from "@/types/database";

type TaskCardProps = {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
};

// ===== styled-components =====

const CardContainer = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  /* NEW: Makes card clearly visible against #f8fafc dashboard */
  background-color: ${({ $completed }) =>
    $completed ? "#e6e6eb" : "#eef1f5"};

  border: 1px solid #d7dce3;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);

  color: #111827;
  transition: 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
`;



const CheckboxButton = styled.button<{ $checked: boolean }>`
  margin-top: 0.35rem;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid ${({ $checked }) => ($checked ? "#1d4ed8" : "#d1d5db")};
  background-color: ${({ $checked }) => ($checked ? "#1d4ed8" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.12s ease, border-color 0.12s ease,
    transform 0.12s ease;

  &:hover {
    transform: scale(1.05);
    border-color: #1d4ed8;
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #4b5563;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriorityBadge = styled.span<{ $priority: Priority }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border-width: 1px;
  border-style: solid;
  padding: 0.15rem 0.7rem;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;

  ${({ $priority }) => {
    switch ($priority) {
      case Priority.HIGH:
        return css`
          background-color: #fee2e2;
          color: #7f1d1d;
          border-color: #fecaca;
        `;
      case Priority.MEDIUM:
        return css`
          background-color: #fef3c7;
          color: #78350f;
          border-color: #fde68a;
        `;
      case Priority.LOW:
        return css`
          background-color: #dcfce7;
          color: #166534;
          border-color: #bbf7d0;
        `;
      case Priority.URGENT:
      default:
        return css`
          background-color: #f5d0fe;
          color: #701a75;
          border-color: #f9a8d4;
        `;
    }
  }}
`;

const FooterRow = styled.div`
  margin-top: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const StatusPill = styled.span`
  border-radius: 999px;
  background-color: #22c55e;
  padding: 0.12rem 0.7rem;
  font-size: 0.7rem;
  color: #022c22;
  font-weight: 500;
`;

// const LinkButton = styled.button`
//   background: none;
//   border: none;
//   padding: 0.2rem 0.35rem;
//   font-size: 0.75rem;
//   color: #ef4444; /* default for Delete; Edit overrides via style prop */
//   cursor: pointer;
//   display: inline-flex;
//   align-items: center;
//   gap: 0.28rem;
//   border-radius: 0.3rem;
//   transition: background-color 0.12s ease, transform 0.12s ease;
//
//   &:hover {
//     background-color: rgba(248, 113, 113, 0.12);
//     transform: translateY(-1px);
//   }
// `;

const IconButton = styled.button<{ $variant?: "edit" | "delete" }>`
  background: none;
  border: none;
  padding: 0.35rem;
  border-radius: 0.4rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.12s ease, transform 0.12s ease;

  color: ${({ $variant }) =>
    $variant === "edit" ? "#2563eb" : "#dc2626"};

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === "edit"
        ? "rgba(37, 99, 235, 0.10)"
        : "rgba(220, 38, 38, 0.10)"};
    transform: translateY(-1px);
  }
`;



// ===== component =====

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    !!dueDate && !task.completed && dueDate.getTime() < Date.now();

  const id = task._id ? task._id.toString() : "";

  return (
    <CardContainer $completed={task.completed}>
      <CheckboxButton
        type="button"
        $checked={task.completed}
        onClick={() => onToggleComplete?.(id)}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && <Check size={14} strokeWidth={3} color="#ffffff" />}
      </CheckboxButton>

      <Content>
        <HeaderRow>
          <div>
            <Title>{task.title}</Title>
            {task.description && <Description>{task.description}</Description>}
          </div>

          <PriorityBadge $priority={task.priority}>
            {task.priority.toUpperCase()}
          </PriorityBadge>
        </HeaderRow>

        <FooterRow>
          <FooterLeft>
            {dueDate && (
              <span
                style={{
                  color: isOverdue ? "#b91c1c" : "#4b5563",
                }}
              >
                Due {format(dueDate, "MMM d, yyyy")}
                {isOverdue && " • Overdue"}
              </span>
            )}
            {task.completed && <StatusPill>Completed</StatusPill>}
          </FooterLeft>

          <FooterRight>
              {onEdit && (
                <IconButton
                  type="button"
                  $variant="edit"
                  onClick={() => onEdit(task)}
                  aria-label="Edit task"
                >
                  <Pencil size={16} strokeWidth={2} />
                </IconButton>
              )}

              {onDelete && (
                <IconButton
                  type="button"
                  $variant="delete"
                  onClick={() => onDelete(id)}
                  aria-label="Delete task"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </IconButton>
              )}
          </FooterRight>
        </FooterRow>
      </Content>
    </CardContainer>
  );
}

