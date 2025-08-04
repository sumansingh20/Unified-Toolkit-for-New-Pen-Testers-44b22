import mongoose from "mongoose"

// Handle missing MONGODB_URI during build time
const MONGODB_URI = process.env.MONGODB_URI

// For development and build time, make MongoDB connection optional
const isDevelopment = process.env.NODE_ENV === "development"
const isNetlifyBuild = process.env.NETLIFY === "true"
const isBuildTime = process.env.NODE_ENV === "production" && !process.env.VERCEL && !MONGODB_URI

if (!MONGODB_URI) {
  if (isDevelopment || isNetlifyBuild || isBuildTime) {
    console.warn("⚠️  MONGODB_URI not found - MongoDB features will be disabled during build")
  } else {
    // Only throw in runtime production environment
    console.error("Please define the MONGODB_URI environment variable in your deployment environment")
  }
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
  // Handle missing MONGODB_URI during build time or development
  if (!MONGODB_URI) {
    if (isDevelopment || isNetlifyBuild || isBuildTime) {
      console.log("MongoDB not configured - using mock connection for build/development")
      return null
    }
    throw new Error("MONGODB_URI environment variable is required for production runtime")
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
