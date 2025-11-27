// MongoDB Cluster Connection + Collection Declaration => Jiehoon Lee

import { MongoClient, Db, Collection } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error('MONGO_URI environment variable is not set');
}

const DB_NAME = "cs391-final-project";

// Collection Names
export const USERS_COLLECTION = "users";
export const TASKS_COLLECTION = "tasks";
export const TASK_LISTS_COLLECTION = "task-lists";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client.db(DB_NAME);
}

export default async function getCollection(
    collectionName: string
): Promise<Collection> {
    if (!db) {
        db = await connect();
    }
    
    return db.collection(collectionName);
}