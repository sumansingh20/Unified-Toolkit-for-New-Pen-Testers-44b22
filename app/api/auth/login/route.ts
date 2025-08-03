import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import OTP from "@/lib/models/OTP"
import { generateOTP } from "@/lib/utils/otp"
import { sendOTPEmail } from "@/lib/utils/email"
import { sendOTPSMS } from "@/lib/utils/sms"
import { rateLimit } from "@/lib/middleware/rate-limit"

async function loginHandler(req: NextRequest) {
  try {
    const db = await connectDB()

    const { email, password, recaptchaToken } = await req.json()

    // Validate reCAPTCHA
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: "POST" },
    )
    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success) {
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 })
    }

    // Development mode - mock authentication
    if (!db) {
      console.log(`[DEV] Mock login attempt for: ${email}`)
      
      // Accept any valid email/password combination in development
      if (email && password && email.includes('@') && password.length >= 3) {
        const mockUser = {
          _id: "mock-user-id",
          email: email,
          firstName: email.split('@')[0],
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
          message: "Login successful",
          accessToken,
          refreshToken,
          user: mockUser,
        })
      } else {
        return NextResponse.json({ 
          error: "Invalid credentials. Use any valid email and password (3+ chars) in development mode." 
        }, { status: 401 })
      }
    }

    // Find user (only when database is connected)
    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: "Please verify your account first" }, { status: 401 })
    }

    // Generate OTPs for 2FA
    const emailOTP = generateOTP()
    const phoneOTP = generateOTP()

    // Delete existing OTPs
    await OTP.deleteMany({ userId: user._id, purpose: "login" })

    // Save new OTP
    const otpDoc = new OTP({
      userId: user._id,
      email: user.email,
      phone: user.phone,
      emailOTP,
      phoneOTP,
      purpose: "login",
    })

    await otpDoc.save()

    // Send OTPs
    await Promise.all([sendOTPEmail(user.email, emailOTP, "login"), sendOTPSMS(user.phone, phoneOTP, "login")])

    return NextResponse.json({
      message: "OTP sent to your email and phone",
      userId: user._id,
      requiresOTP: true,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = rateLimit()(loginHandler)
