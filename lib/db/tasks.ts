// lib/db/tasks.ts: Task Document Actions with MongoDB Collection => Jiehoon Lee

import { ObjectId } from "mongodb";
import getCollection, { TASKS_COLLECTION } from "@/db";
import {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    Priority,
} from "@/types/database";

// Get all tasks for a specific task list
export async function getTasksByTaskListId(
    taskListId: ObjectId
): Promise<Task[]> {
    const collection = await getCollection(TASKS_COLLECTION);

    return (await collection
        .find({ taskListId })
        .sort({ order: 1, createdAt: 1 })
        .toArray()) as Task[];
}


// Get all tasks for a user
export async function getTasksByUserId(userId: ObjectId): Promise<Task[]> {
    const collection = await getCollection(TASKS_COLLECTION);
    return (await collection
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray()) as Task[];
}


// Get a single task by its ID
export async function getTaskById(taskId: ObjectId): Promise<Task | null> {
    const collection = await getCollection(TASKS_COLLECTION);
    return (await collection.findOne({ _id: taskId })) as Task | null;
}

// Create a new task
export async function createTask(input: CreateTaskInput): Promise<Task> {
    const collection = await getCollection(TASKS_COLLECTION);

    // If order not provided, get the highest order and add 1

    let order = input.order;

    if (order === undefined) {
        const lastTask = await collection
            .find({ taskListId: input.taskListId })
            .sort({ order: -1 })
            .limit(1)
            .toArray();
    order =
        lastTask.length > 0 && lastTask[0].order !== undefined
            ? lastTask[0].order + 1
            : 0;
    }

    const now = new Date();

    const task: Omit<Task, "_id"> = {
        taskListId: input.taskListId,
        userId: input.userId,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        priority: input.priority || Priority.MEDIUM,
        notes: input.notes,
        color: input.color,
        completed: false,
        order: order!,
        createdAt: now,
        updatedAt: now,
    };

    const result = await collection.insertOne(task);

    return {
        ...task,
        _id: result.insertedId,
    };
}

// Update an existing task
export async function updateTask(
    taskId: ObjectId,
    userId: ObjectId,
    updates: UpdateTaskInput
): Promise<Task | null> {
    const collection = await getCollection(TASKS_COLLECTION);
    const result = await collection.findOneAndUpdate(
        { _id: taskId, userId },
        {
            $set: {
                ...updates,

                updatedAt: new Date(),
            },
        },
        { returnDocument: "after" }
    );

    return result as Task | null;
}

// Delete a task
export async function deleteTask(
    taskId: ObjectId,
    userId: ObjectId
): Promise<boolean> {
    const collection = await getCollection(TASKS_COLLECTION);

    const result = await collection.deleteOne({
        _id: taskId,

        userId,
    });

    return result.deletedCount > 0;
}

// Delete all tasks in a task list
export async function deleteTasksByTaskListId(
    taskListId: ObjectId,
    userId: ObjectId
): Promise<number> {
    const collection = await getCollection(TASKS_COLLECTION);
    const result = await collection.deleteMany({
        taskListId,
        userId,
    });

    return result.deletedCount;
}

// Move a task to a different task list
export async function moveTaskToList(
    taskId: ObjectId,
    userId: ObjectId,
    newTaskListId: ObjectId,
    newOrder?: number
): Promise<Task | null> {
    const collection = await getCollection(TASKS_COLLECTION);

    // If order not provided, add to end of new list

    let order = newOrder;

    if (order === undefined) {
        const lastTask = await collection
        .find({ taskListId: newTaskListId })
        .sort({ order: -1 })
        .limit(1)
        .toArray();

        order =
            lastTask.length > 0 && lastTask[0].order !== undefined
                ? lastTask[0].order + 1
                : 0;
    }

    const result = await collection.findOneAndUpdate(
        { _id: taskId, userId },
        {
            $set: {
                taskListId: newTaskListId,
                order,
                updatedAt: new Date(),
            },
        },
        { returnDocument: "after" }
    );

    return result as Task | null;
}

// Reorder tasks within a task list
export async function reorderTasks(
    userId: ObjectId,
    taskOrders: { taskId: ObjectId; order: number }[]
): Promise<void> {
    const collection = await getCollection(TASKS_COLLECTION);

    const bulkOps = taskOrders.map(({ taskId, order }) => ({
        updateOne: {
            filter: { _id: taskId, userId },

            update: {
                $set: {
                    order,
                    updatedAt: new Date(),
                },
            },
        },
    }));

    if (bulkOps.length > 0) {
        await collection.bulkWrite(bulkOps);
    }
}

// Toggle task completion status
export async function toggleTaskCompletion(
    taskId: ObjectId,
    userId: ObjectId
): Promise<Task | null> {
    const collection = await getCollection(TASKS_COLLECTION);
    const task = await collection.findOne({ _id: taskId, userId });

    if (!task) return null;

    const result = await collection.findOneAndUpdate(
        { _id: taskId, userId },
        {
            $set: {
                completed: !task.completed,
                updatedAt: new Date(),
            },
        },
        { returnDocument: "after" }
    );

    return result as Task | null;
}

// Get tasks by priority
export async function getTasksByPriority(
    userId: ObjectId,
    priority: Priority
): Promise<Task[]> {
    const collection = await getCollection(TASKS_COLLECTION);
    return (await collection
        .find({ userId, priority })
        .sort({ dueDate: 1 })
        .toArray()) as Task[];
}

// Get upcoming tasks
export async function getUpcomingTasks(
    userId: ObjectId,
    days: number = 7
): Promise<Task[]> {
    const collection = await getCollection(TASKS_COLLECTION);
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return (await collection
        .find({
            userId,
            completed: false,
            dueDate: {
                $gte: now,
                $lte: futureDate,
            },
        })
        .sort({ dueDate: 1 })
        .toArray()) as Task[];
}

// Get overdue tasks
export async function getOverdueTasks(userId: ObjectId): Promise<Task[]> {
    const collection = await getCollection(TASKS_COLLECTION);
    const now = new Date();

    return (await collection
        .find({
            userId,
            completed: false,
            dueDate: {
                $lt: now,
            },
        })
        .sort({ dueDate: 1 })
        .toArray()) as Task[];
}
