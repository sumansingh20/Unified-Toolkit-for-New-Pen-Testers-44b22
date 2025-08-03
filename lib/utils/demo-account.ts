import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function createDemoAccount() {
  try {
    await connectDB()

    // Check if demo account already exists
    const existingDemo = await User.findOne({ email: "user@unified.com" })

    if (existingDemo) {
      console.log("Demo account already exists")
      return existingDemo
    }

    // Create demo account
    const demoUser = new User({
      username: "demo_user",
      email: "user@unified.com",
      phone: "+1234567890",
      password: "user123", // Will be hashed by the pre-save hook
      role: "user",
      isVerified: true, // Pre-verified for demo
      twoFactorEnabled: false, // Disabled for easy demo access
    })

    await demoUser.save()
    console.log("Demo account created successfully")
    return demoUser
  } catch (error) {
    console.error("Error creating demo account:", error)
    throw error
  }
}

// Function to seed demo data on startup
export async function seedDemoData() {
  try {
    await createDemoAccount()
  } catch (error) {
    console.error("Failed to seed demo data:", error)
  }
}
