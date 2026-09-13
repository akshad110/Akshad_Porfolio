import { mongoose } from "@/lib/db/mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type MongoCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongo = globalThis as typeof globalThis & {
  mongooseCache?: MongoCache;
};

const cache: MongoCache = globalForMongo.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalForMongo.mongooseCache = cache;

export function hasMongoUri() {
  return Boolean(MONGODB_URI);
}

export async function connectDb() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export async function tryConnectDb() {
  if (!MONGODB_URI) return null;
  try {
    return await connectDb();
  } catch {
    return null;
  }
}
