// lib/dbConnect.ts
import mongoose, { Mongoose } from 'mongoose';

// Extend the global namespace so we can cache the connection between module reloads.
// Use the Mongoose instance type (not `typeof mongoose`) to avoid recursive typing.
declare global {
  // allow this to be undefined (safer for fresh runtime)
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

const DEFAULT_URI = 'mongodb://localhost:27017/clinic-management';
const MONGODB_URI = process.env.MONGODB_URI ?? DEFAULT_URI;

const options: mongoose.ConnectOptions = {
  autoIndex: true,
};

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Use a different global name (_mongooseCache) to avoid clashing with the imported `mongoose`.
let cached = global._mongooseCache;

if (!cached) {
  global._mongooseCache = { conn: null, promise: null };
  cached = global._mongooseCache;
}

async function dbConnect(): Promise<Mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  try {
    if (!cached!.promise) {
      // mongoose.connect returns Promise<Mongoose>
      cached!.promise = mongoose.connect(MONGODB_URI, options) as Promise<Mongoose>;
    }
    cached!.conn = await cached!.promise;
    console.log('MongoDB connected successfully');
    return cached!.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default dbConnect;
