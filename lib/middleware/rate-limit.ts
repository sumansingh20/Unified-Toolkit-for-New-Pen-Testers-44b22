import { type NextRequest, NextResponse } from "next/server"

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests = 100,
) {
  return (handler: Function) => {
    return async (req: NextRequest) => {
      const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown"
      const now = Date.now()

      if (!store[ip]) {
        store[ip] = {
          count: 1,
          resetTime: now + windowMs,
        }
      } else if (now > store[ip].resetTime) {
        store[ip] = {
          count: 1,
          resetTime: now + windowMs,
        }
      } else {
        store[ip].count++
      }

      if (store[ip].count > maxRequests) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 })
      }

      return handler(req)
    }
  }
}
