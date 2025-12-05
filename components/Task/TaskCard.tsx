"use client";

/**
 * Component: TaskCard
 * Author: Tung Pham
 * Responsibility: Display a single task with checkbox, priority badge, and due date.
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
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  padding: 0.75rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  transition: box-shadow 0.15s ease, transform 0.1s ease;

  ${({ $completed }) =>
    $completed &&
    css`
      opacity: 0.6;
    `}

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
  }
`;

const CheckboxButton = styled.button<{ $checked: boolean }>`
  margin-top: 0.25rem;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid ${({ $checked }) => ($checked ? "#2563eb" : "#d1d5db")};
  background-color: ${({ $checked }) => ($checked ? "#2563eb" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;

  span {
    font-size: 0.75rem;
    color: #ffffff;
    font-weight: 700;
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
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  margin: 0.15rem 0 0;
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
  border-radius: 999px;
  border-width: 1px;
  border-style: solid;
  padding: 0.15rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;

  ${({ $priority }) => {
    switch ($priority) {
      case Priority.HIGH:
        return css`
          background-color: #fee2e2;
          color: #b91c1c;
          border-color: #fecaca;
        `;
      case Priority.MEDIUM:
        return css`
          background-color: #fef3c7;
          color: #92400e;
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
          background-color: #fef2ff;
          color: #86198f;
          border-color: #f5d0fe;
        `;
    }
  }}
`;

const FooterRow = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const StatusPill = styled.span`
  border-radius: 999px;
  background-color: #dcfce7;
  padding: 0.05rem 0.5rem;
  font-size: 0.7rem;
  color: #15803d;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0.2rem;
  font-size: 0.75rem;
  color: #2563eb;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 0.25rem;

  &:hover {
    background-color: rgba(37, 99, 235, 0.1);
  }
`;

// ===== component =====

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  // Normalize dueDate from server to a Date
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    !!dueDate && !task.completed && dueDate.getTime() < Date.now();

  // Convert ObjectId to string for keys & callbacks
  const id = task._id ? task._id.toString() : "";

  return (
    <CardContainer $completed={task.completed}>
      {/* Checkbox triggers parent callback to toggle completion */}
      <CheckboxButton
        type="button"
        $checked={task.completed}
        onClick={() => onToggleComplete?.(id)}
      >
        {task.completed && <Check size={14} strokeWidth={3} />}
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
              <span style={{ color: isOverdue ? "#b91c1c" : "#6b7280" }}>
                Due {format(dueDate, "MMM d, yyyy")}
                {isOverdue && " • Overdue"}
              </span>
            )}
            {task.completed && <StatusPill>Completed</StatusPill>}
          </FooterLeft>

          <FooterRight>
            {onEdit && (
              <LinkButton type="button" onClick={() => onEdit(task)}>
                <Pencil size={14} />
                <span>Edit</span>
              </LinkButton>
            )}
            {onDelete && (
              <LinkButton type="button" onClick={() => onDelete(id)} style={{ color: "#dc2626" }}>
                <Trash2 size={14} />
                <span>Delete</span>
              </LinkButton>
            )}
          </FooterRight>
        </FooterRow>
      </Content>
    </CardContainer>
  );
}

