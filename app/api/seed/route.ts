import { NextResponse } from "next/server"
import { seedDemoData } from "@/lib/utils/demo-account"

export async function POST() {
  try {
    await seedDemoData()
    return NextResponse.json({ message: "Demo data seeded successfully" })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed demo data" }, { status: 500 })
  }
}
