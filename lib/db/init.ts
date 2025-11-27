// lib/db/init.ts: Database Initialization and Connection Check => Jiehoon Lee

import getCollection, { USERS_COLLECTION, TASK_LISTS_COLLECTION, TASKS_COLLECTION } from '@/db';

// Initialize database indexes
export async function initializeDatabase(): Promise<void> {
    console.log('Initializing database indexes...');

 

    try {
        // Users collection indexes
        const usersCollection = await getCollection(USERS_COLLECTION);
        await usersCollection.createIndex({ googleId: 1 }, { unique: true });
        await usersCollection.createIndex({ email: 1 }, { unique: true });

        console.log('✓ Users collection indexes created');

        // Task Lists collection indexes
        const taskListsCollection = await getCollection(TASK_LISTS_COLLECTION);
        await taskListsCollection.createIndex({ userId: 1, order: 1 });
        await taskListsCollection.createIndex({ userId: 1, createdAt: -1 });

        console.log('✓ Task Lists collection indexes created');

        // Tasks collection indexes
        const tasksCollection = await getCollection(TASKS_COLLECTION);
        await tasksCollection.createIndex({ taskListId: 1, order: 1 });
        await tasksCollection.createIndex({ userId: 1 });
        await tasksCollection.createIndex({ userId: 1, completed: 1 });
        await tasksCollection.createIndex({ userId: 1, dueDate: 1 });
        await tasksCollection.createIndex({ userId: 1, priority: 1 });
        await tasksCollection.createIndex({ userId: 1, dueDate: 1, completed: 1 });

        console.log('✓ Tasks collection indexes created');
        console.log('Database initialization complete!');

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }

}

 

// Check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
    try {
        const collection = await getCollection(USERS_COLLECTION);
        await collection.findOne({});
        
        return true;

    } catch (error) {
        console.error('Database connection check failed:', error);

        return false;
    }
}