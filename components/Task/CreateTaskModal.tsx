"use client";

/**
 * Component: CreateTaskModal
 * Author: Tung Pham
 *
 * Responsibility:
 * Display a modal dialog that allows users to create a new task.
 * Handles form input for title, description, priority, and due date,
 * and passes validated task data to the parent component via onCreate().
 *
 * Additional Notes:
 * - This component does not write to the database directly.
 * - All state updates and API calls are handled by the parent.
 */


"use client";

import { useState, FormEvent } from "react";
import styled from "styled-components";
import { Priority } from "@/types/database";

// these values are passed to the onCreate callback when the form is submitted
export type CreateTaskFormValues = {
  title: string;
  description?: string;
  dueDate?: string; // yyyy-mm-dd from <input type="date">
  priority: Priority;
  taskListId: string;
};

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (values: CreateTaskFormValues) => Promise<void> | void;
  taskListId?: string;
};

// --- style components ---

// fullscreen overlay with semi-transparent background
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

// modal container
const Modal = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.35);
`;

// modal title heading
const Title = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
`;

// form container with vertical layout
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

// individual form field container
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

// form field label
const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  margin-top: 0.15rem;
  width: 100%;
  border-radius: 0.45rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #111827;
  padding: 0.45rem 0.6rem;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb33;
  }
`;

// text area for description
const TextArea = styled.textarea`
  margin-top: 0.15rem;
  width: 100%;
  border-radius: 0.45rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #111827;
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

// dropdown for priority
const Select = styled.select`
  margin-top: 0.15rem;
  width: 100%;
  border-radius: 0.45rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #111827;
  padding: 0.45rem 0.6rem;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb33;
  }
`;

// footer container for action buttons
const Footer = styled.div`
  margin-top: 0.75rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

// cancel button
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

// primary submit button
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

// error message box
const ErrorBox = styled.div`
  background-color: #fef2f2;
  color: #b91c1c;
  border-radius: 0.5rem;
  padding: 0.45rem 0.7rem;
  font-size: 0.8rem;
`;

/**
 * CreateTaskModal Component
 * 
 * Displays a modal form for creating a new task with title, description,
 * due date, and priority fields. Handles form submission, validation,
 * error display, and loading states.
 */
export default function CreateTaskModal({
  isOpen,
  onClose,
  onCreate,
  taskListId,
}: CreateTaskModalProps) {
  // local state for form values
  const [values, setValues] = useState<CreateTaskFormValues>({
    title: "",
    description: "",
    dueDate: "",
    priority: Priority.MEDIUM,
    taskListId: "",
  });

  // track submission state to show loading indicator
  const [submitting, setSubmitting] = useState(false);

  // track validation/submission errors
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;
  
  /**
   * Handles form submission
   * - Validates that title is not empty
   * - Calls onCreate callback with form values + taskListId
   * - Resets form and closes modal on success
   * - Displays error message on failure
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // call parent's onCreate callback with complete form data
      await onCreate({
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        dueDate: values.dueDate || undefined,
        priority: values.priority,
        taskListId: taskListId || "",
      });

      // reset + close
      setValues({
        title: "",
        description: "",
        dueDate: "",
        priority: Priority.MEDIUM,
        taskListId: "",
      });

      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Title>Create New Task</Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Title</Label>
            <Input
              value={values.title}
              onChange={(e) =>
                setValues((v) => ({ ...v, title: e.target.value }))
              }
              required
            />
          </Field>
          <Field>
            <Label>Description (optional)</Label>
            <TextArea
              value={values.description}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
            />
          </Field>
          <Field>
            <Label>Due Date (optional)</Label>
            <Input
              type="date"
              value={values.dueDate}
              onChange={(e) =>
                setValues((v) => ({ ...v, dueDate: e.target.value }))
              }
            />
          </Field>
          <Field>
            <Label>Priority</Label>
            <Select
              value={values.priority}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  priority: e.target.value as Priority,
                }))
              }
            >
              <option value={Priority.LOW}>Low</option>
              <option value={Priority.MEDIUM}>Medium</option>
              <option value={Priority.HIGH}>High</option>
              <option value={Priority.URGENT}>Urgent</option>
            </Select>
          </Field>

          {error && (
            <p style={{ color: "#fca5a5", fontSize: "0.8rem", margin: 0 }}>
              {error}
            </p>
          )}

          <Footer>
            <SecondaryButton type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Task"}
            </PrimaryButton>
          </Footer>
        </Form>
      </Modal>
    </Overlay>
  );
}

