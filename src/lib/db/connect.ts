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

  if (cache.conn) {
    // Reuse hot connection — critical on Render cold starts after first hit.
    if (mongoose.connection.readyState === 1) return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        // Atlas + Render free tier needs more headroom than 3s.
        serverSelectionTimeoutMS: 12_000,
        connectTimeoutMS: 12_000,
        socketTimeoutMS: 45_000,
        maxPoolSize: 5,
      })
      .then((conn) => conn)
      .catch((error) => {
        cache.promise = null;
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export async function tryConnectDb() {
  if (!MONGODB_URI) return null;
  try {
    return await connectDb();
  } catch (error) {
    console.error("[mongo] connection failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
