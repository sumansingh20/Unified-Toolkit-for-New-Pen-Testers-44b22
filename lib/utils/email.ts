import nodemailer from "nodemailer"

const isDevelopment = process.env.NODE_ENV === "development"
const emailHost = process.env.EMAIL_HOST
const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASS

let transporter: any = null

if (!isDevelopment && emailHost && emailUser && emailPass) {
  transporter = nodemailer.createTransport({
    host: emailHost,
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  })
} else if (!isDevelopment) {
  console.warn("Email service not properly configured")
}

export async function sendOTPEmail(email: string, otp: string, purpose: string) {
  if (isDevelopment) {
    console.log(`[DEV] Email would be sent to ${email}: Your OTP for ${purpose} is: ${otp}`)
    return
  }

  if (!transporter) {
    throw new Error("Email service not configured")
  }

  const subject = `Your OTP for ${purpose}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Unified Toolkit for New Pen-Testers - OTP Verification</h2>
      <p>Your OTP for ${purpose} is:</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #666;">© 2025 Unified Toolkit for New Pen-Testers - Developed by Suman</p>
    </div>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  })
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
      </div>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html,
  })
}
