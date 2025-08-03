import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import OTP from "@/lib/models/OTP"
import { generateOTP, formatPhoneNumber } from "@/lib/utils/otp"
import { sendOTPEmail } from "@/lib/utils/email"
import { sendOTPSMS } from "@/lib/utils/sms"
import { rateLimit } from "@/lib/middleware/rate-limit"

async function registerHandler(req: NextRequest) {
  try {
    const db = await connectDB()

    const { username, email, phone, password, recaptchaToken } = await req.json()

    // Validate reCAPTCHA
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: "POST" },
    )
    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success) {
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 })
    }

    // Development mode - mock registration
    if (!db) {
      console.log(`[DEV] Mock registration for: ${email}`)
      
      // Generate mock OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      console.log(`[DEV] OTP for ${email}: ${otp}`)
      
      // Store mock user data temporarily (in memory for development)
      const mockUserId = `mock-user-${Date.now()}`
      
      return NextResponse.json({
        message: "Registration successful! Check console for OTP (development mode)",
        userId: mockUserId,
        email,
        otp: otp // Include OTP in response for development
      })
    }

    // Check if user already exists (only when database is connected)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create user
    const user = new User({
      username,
      email,
      phone: formatPhoneNumber(phone),
      password,
    })

    await user.save()

    // Generate OTPs
    const emailOTP = generateOTP()
    const phoneOTP = generateOTP()

    // Save OTP
    const otpDoc = new OTP({
      userId: user._id,
      email,
      phone: user.phone,
      emailOTP,
      phoneOTP,
      purpose: "registration",
    })

    await otpDoc.save()

    // Send OTPs
    await Promise.all([sendOTPEmail(email, emailOTP, "registration"), sendOTPSMS(user.phone, phoneOTP, "registration")])

    return NextResponse.json({
      message: "Registration successful. Please verify your OTP.",
      userId: user._id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = rateLimit()(registerHandler)
