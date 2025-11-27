// lib/db/taskLists.ts: Task List Document Actions with MongoDB Collection => Jiehoon Lee

import { ObjectId } from 'mongodb';
import getCollection, { TASK_LISTS_COLLECTION } from '@/db';
import { TaskList, CreateTaskListInput, UpdateTaskListInput } from '@/types/database';

// Get all task lists for a user, ordered by 'order' field
export async function getTaskListsByUserId(userId: ObjectId): Promise<TaskList[]> {
    const collection = await getCollection(TASK_LISTS_COLLECTION);
    return await collection
        .find({ userId })
        .sort({ order: 1, createdAt: 1 })
        .toArray() as TaskList[];
}

// Get a single task list by its ID
export async function getTaskListById(taskListId: ObjectId): Promise<TaskList | null> {
    const collection = await getCollection(TASK_LISTS_COLLECTION);
    return await collection.findOne({ _id: taskListId }) as TaskList | null;
}

// Create a new task list
export async function createTaskList(input: CreateTaskListInput): Promise<TaskList> {
    const collection = await getCollection(TASK_LISTS_COLLECTION);
    // If order not provided, get the highest order and add 1
    let order = input.order;
    if (order === undefined) {
        const lastList = await collection
        .find({ userId: input.userId })
        .sort({ order: -1 })
        .limit(1)
        .toArray();
        order = lastList.length > 0 && lastList[0].order !== undefined ? lastList[0].order + 1 : 0;
    }

    const now = new Date();
    const taskList: Omit<TaskList, '_id'> = {
        userId: input.userId,
        name: input.name,
        description: input.description,
        color: input.color,
        order: order!,
        createdAt: now,
        updatedAt: now,
    };

    const result = await collection.insertOne(taskList);

    return {
        ...taskList,
        _id: result.insertedId,
    };

}

// Update an existing task list
export async function updateTaskList(
    taskListId: ObjectId,
    userId: ObjectId,
    updates: UpdateTaskListInput
): Promise<TaskList | null> {
    const collection = await getCollection(TASK_LISTS_COLLECTION);
    const result = await collection.findOneAndUpdate(
        { _id: taskListId, userId },
        {
            $set: {
                ...updates,
                updatedAt: new Date(),
            }
        },
        { returnDocument: 'after' }
    );
    return result as TaskList | null;
}

 // Delete a task list
export async function deleteTaskList(
    taskListId: ObjectId,
    userId: ObjectId
): Promise<boolean> {
    const collection = await getCollection(TASK_LISTS_COLLECTION);
    const result = await collection.deleteOne({
        _id: taskListId,
        userId,
    });
    return result.deletedCount > 0;
}

// Reorder task lists
export async function reorderTaskLists(
    userId: ObjectId,
    taskListOrders: { taskListId: ObjectId; order: number }[]
): Promise<void> {
    const collection = await getCollection(TASK_LISTS_COLLECTION);
    const bulkOps = taskListOrders.map(({ taskListId, order }) => ({
        updateOne: {
            filter: { _id: taskListId, userId },
            update: {
                $set: {
                order,
                updatedAt: new Date(),
                }
            }
        }
    }));

    if (bulkOps.length > 0) {
        await collection.bulkWrite(bulkOps);
    }
}