import twilio from "twilio"

// Make Twilio optional in development
const isDevelopment = process.env.NODE_ENV === "development"
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

let client: any = null

if (!isDevelopment && accountSid && authToken && accountSid.startsWith('AC')) {
  client = twilio(accountSid, authToken)
} else if (!isDevelopment) {
  console.warn("Twilio not properly configured")
}

export async function sendOTPSMS(phone: string, otp: string, purpose: string) {
  if (isDevelopment) {
    console.log(`[DEV] SMS would be sent to ${phone}: Your Unified Toolkit for New Pen-Testers OTP for ${purpose} is: ${otp}. This code expires in 10 minutes.`)
    return
  }

  if (!client) {
    throw new Error("SMS service not configured")
  }

  const message = `Your Unified Toolkit for New Pen-Testers OTP for ${purpose} is: ${otp}. This code expires in 10 minutes.`

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  })
}
