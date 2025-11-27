// users.ts: User Document Actions with MongoDB Collection => Jiehoon Lee

import { ObjectId } from "mongodb";
import getCollection, { USERS_COLLECTION } from "@/db";
import { User, CreateUserInput } from "@/types/database";

// Find a User by Google ID
export async function findUserByGoogleId(googleId: string): Promise<User | null> {
    const collection = await getCollection(USERS_COLLECTION);
    return await collection.findOne({ googleId }) as User | null;
}

// Find a User by Email
export async function findUserByEmail(email: string): Promise<User | null> {
    const collection = await getCollection(USERS_COLLECTION);
    return await collection.findOne({ email }) as User | null;
}

// Find a User by their MongoDB _id
export async function findUserById(userId: ObjectId): Promise<User | null> {
    const collection = await getCollection(USERS_COLLECTION);
    return await collection.findOne({ _id: userId }) as User | null;
}

// Create a New User
export async function createUser(input: CreateUserInput): Promise<User> {
    const collection = await getCollection(USERS_COLLECTION);
    const now = new Date();
    const user: Omit<User, '_id'> = {
        ...input,
        createdAt: now,
        updatedAt: now,
    };

    const result = await collection.insertOne(user);
    
    return {
        ...user,
        _id: result.insertedId,
    };
}

// Update User Information
export async function updateUser(
    userId: ObjectId,
    updates: Partial<Omit<User, '_id' | 'googleId' | 'createdAt'>>
): Promise<User | null> {
    const collection = await getCollection(USERS_COLLECTION);

    const result = await collection.findOneAndUpdate(
        { _id: userId },
        {
            $set: {
                ...updates,
                updatedAt: new Date(),
            }
        },
        { returnDocument: 'after' }
    );

    return result as User | null
}

// Find or Create a User (Useful for OAuth Flows)
export async function findOrCreateUser(input: CreateUserInput): Promise<User> {
    const existingUser = await findUserByGoogleId(input.googleId);

    if (existingUser) {
        return existingUser;
    }

    return await createUser(input);
}