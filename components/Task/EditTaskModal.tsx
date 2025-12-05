"use client";

/**
 * Component: EditTaskModal
 * Author: Tung Pham
 * Responsibility: Modal dialog to edit an existing task.
 */

import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import type { Task } from "@/types/database";


const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.35);
  padding: 1.25rem 1.5rem;
`;

const Heading = styled.h2`
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
`;

const ErrorBox = styled.div`
  margin-bottom: 0.5rem;
  background-color: #fef2f2;
  color: #b91c1c;
  border-radius: 0.5rem;
  padding: 0.45rem 0.7rem;
  font-size: 0.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  display: block;
`;

const Input = styled.input`
  margin-top: 0.15rem;
  width: 100%;
  border-radius: 0.45rem;
  border: 1px solid #d1d5db;
  padding: 0.45rem 0.6rem;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb33;
  }
`;

const TextArea = styled.textarea`
  margin-top: 0.15rem;
  width: 100%;
  border-radius: 0.45rem;
  border: 1px solid #d1d5db;
  padding: 0.45rem 0.6rem;
  font-size: 0.85rem;
  outline: none;
  resize: vertical;
  min-height: 70px;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb33;
  }
`;

const Select = styled.select`
  margin-top: 0.15rem;
  width: 100%;
  border-radius: 0.45rem;
  border: 1px solid #d1d5db;
  padding: 0.45rem 0.6rem;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb33;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Field = styled.div`
  flex: 1;
`;

const Footer = styled.div`
  margin-top: 0.75rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const SecondaryButton = styled.button`
  border-radius: 0.45rem;
  border: none;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  background-color: transparent;
  color: #4b5563;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  border-radius: 0.45rem;
  border: none;
  padding: 0.4rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: #2563eb;
  color: #ffffff;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#2563eb" : "#1d4ed8")};
  }
`;

/**
 * Form values for editing a task
 * Contains all editable fields from the Task type
 */
type EditTaskFormValues = {
  title: string;
  description: string;
  priority: Task["priority"];
  dueDate: string;
};

type EditTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (taskId: string, values: Partial<EditTaskFormValues>) => Promise<void> | void;
};

/**
 * EditTaskModal Component
 * 
 * Displays a modal form for editing an existing task's properties including
 * title, description, priority, and due date. Pre-populates the form with
 * the current task values and handles form submission with error handling.
 * 
 * The form automatically resets when:
 * - A different task is selected
 * - The modal is opened
 * - Submission is successful
 */
export default function EditTaskModal({
  isOpen,
  onClose,
  task,
  onUpdate,
}: EditTaskModalProps) {
  const [form, setForm] = useState<EditTaskFormValues>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Whenever we open the modal for a specific task, seed the form with its current values
  useEffect(() => {
    if (task && isOpen) {
      // Format dueDate for input[type="date"] which expects "YYYY-MM-DD"
      let formattedDueDate = "";
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        // Get local date components to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedDueDate = `${year}-${month}-${day}`;
      }

      setForm({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority,
        dueDate: formattedDueDate,
      });
      setIsSubmitting(false);
      setError(null);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;
  
  /**
   * Handles form submission
   * - Prevents default form behavior
   * - Calls onUpdate callback with taskId and form values
   * - Closes modal on success
   * - Displays error message on failure
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      // Delegate the actual PUT logic to parent
      await onUpdate(task.id, form);
      
      // close modal 
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update task");
    } finally {
      // reset
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <Heading>Edit Task</Heading>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Form onSubmit={handleSubmit}>
          <div>
            <Label>Title</Label>
            <Input
              required
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <Row>
            <Field>
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as Task["priority"],
                  }))
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </Field>

            <Field>
              <Label>Due date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </Field>
          </Row>

          <Footer>
            <SecondaryButton
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </PrimaryButton>
          </Footer>
        </Form>
      </ModalContainer>
    </Overlay>
  );
}

