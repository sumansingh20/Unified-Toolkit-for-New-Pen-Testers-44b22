import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

// For development, make MongoDB connection optional to avoid delays
const isDevelopment = process.env.NODE_ENV === "development"

if (!MONGODB_URI && !isDevelopment) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env")
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var myMongoose: MongooseCache | undefined
}

let cached = global.myMongoose

if (!cached) {
  cached = global.myMongoose = { conn: null, promise: null }
}

async function connectDB() {
  // In development, return a mock connection if MongoDB is not available
  if (isDevelopment && !MONGODB_URI) {
    console.log("MongoDB not configured for development - using mock connection")
    return null
  }

  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    if (isDevelopment) {
      console.warn("MongoDB connection failed in development mode:", e)
      return null
    }
    throw e
  }

  return cached!.conn
}

export default connectDB
