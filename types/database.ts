// types/database.ts: Database Document and Input Types => Jiehoon Lee

import { ObjectId } from "mongodb";

// Priority Levels for Tasks
export enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}

// User Document Structure
export interface User {
    _id?: ObjectId;
    googleId: string;
    email: string;
    name: string;
    picture?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Task Document Structure
export interface Task {
  _id?: ObjectId;
  taskListId: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  notes?: string;
  color?: string;
  completed: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Task List Document Structure
export interface TaskList {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  description?: string;
  color?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Input types for creating documents
export interface CreateUserInput {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

export interface CreateTaskListInput {
  userId: ObjectId;
  name: string;
  description?: string;
  color?: string;
  order?: number;
}

export interface CreateTaskInput {
  taskListId: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  notes?: string;
  color?: string;
  order?: number;
}

// Update types for modifying documents
export interface UpdateTaskListInput {
  name?: string;
  description?: string;
  color?: string;
  order?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  notes?: string;
  color?: string;
  completed?: boolean;
  order?: number;
}
