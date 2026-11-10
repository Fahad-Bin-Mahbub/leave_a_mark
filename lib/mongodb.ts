import { MongoClient, type Collection } from "mongodb";
import type { FeedbackDoc } from "./types";

// Cache the client across hot reloads (dev) and warm serverless invocations (prod).
const globalForMongo = globalThis as unknown as { _mongoClientPromise?: Promise<MongoClient> };

function connect(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local (or Vercel env vars).");
  }
  const promise = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    family: 4,
  })
    .connect()
    .catch((err: unknown) => {
      globalForMongo._mongoClientPromise = undefined; // allow retry on next request
      throw err;
    });
  globalForMongo._mongoClientPromise = promise;
  return promise;
}

export async function getCollection(): Promise<Collection<FeedbackDoc>> {
  const client = await (globalForMongo._mongoClientPromise ?? connect());
  return client.db(process.env.MONGODB_DB || "handprints").collection<FeedbackDoc>("feedback");
}

