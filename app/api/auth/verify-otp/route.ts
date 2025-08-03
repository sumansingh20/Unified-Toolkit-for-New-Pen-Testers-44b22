import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import OTP from "@/lib/models/OTP"
import { generateTokens } from "@/lib/utils/jwt"
import { isOTPExpired } from "@/lib/utils/otp"

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB()

    const { userId, emailOTP, phoneOTP, purpose } = await req.json()

    // Development mode - mock OTP verification
    if (!db) {
      console.log(`[DEV] Mock OTP verification for userId: ${userId}`)
      
      // Accept any 6-digit OTP in development
      if (emailOTP && emailOTP.length === 6) {
        const mockUser = {
          _id: userId || "mock-user-id",
          email: "user@unified.com", // Use a default or extract from userId
          firstName: "Test",
          lastName: "User",
          isVerified: true
        }

        // Generate proper mock JWT tokens
        const jwt = require('jsonwebtoken')
        const accessToken = jwt.sign(
          { userId: mockUser._id, email: mockUser.email },
          process.env.JWT_SECRET || 'mock-secret',
          { expiresIn: '1h' }
        )
        const refreshToken = jwt.sign(
          { userId: mockUser._id },
          process.env.JWT_SECRET || 'mock-secret',
          { expiresIn: '7d' }
        )

        return NextResponse.json({
          message: "OTP verified successfully",
          accessToken,
          refreshToken,
          user: mockUser,
        })
      } else {
        return NextResponse.json({ error: "Invalid OTP format. Use any 6-digit number in development." }, { status: 400 })
      }
    }

    // Find OTP document (only when database is connected)
    const otpDoc = await OTP.findOne({ userId, purpose })

    if (!otpDoc) {
      return NextResponse.json({ error: "OTP not found or expired" }, { status: 400 })
    }

    // Check if OTP is expired
    if (isOTPExpired(otpDoc.expiresAt)) {
      await OTP.deleteOne({ _id: otpDoc._id })
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    // Check attempts
    if (otpDoc.attempts >= otpDoc.maxAttempts) {
      await OTP.deleteOne({ _id: otpDoc._id })
      return NextResponse.json({ error: "Maximum attempts exceeded" }, { status: 400 })
    }

    // Verify OTPs
    if (otpDoc.emailOTP !== emailOTP || otpDoc.phoneOTP !== phoneOTP) {
      otpDoc.attempts += 1
      await otpDoc.save()

      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user verification status if needed
    if (purpose === "registration") {
      user.isVerified = true
      await user.save()
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Delete OTP
    await OTP.deleteOne({ _id: otpDoc._id })

    return NextResponse.json({
      message: "OTP verified successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
