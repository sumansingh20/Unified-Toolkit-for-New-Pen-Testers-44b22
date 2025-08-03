import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import OTP from "@/lib/models/OTP"
import { isOTPExpired } from "@/lib/utils/otp"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { userId, emailOTP, phoneOTP, newPassword } = await req.json()

    // Find OTP document
    const otpDoc = await OTP.findOne({
      userId,
      purpose: "forgot-password",
    })

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

    // Update password
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    user.password = newPassword
    await user.save()

    // Delete OTP
    await OTP.deleteOne({ _id: otpDoc._id })

    return NextResponse.json({
      message: "Password reset successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
