import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ScanLog from "@/lib/models/ScanLog"
import { withAuth } from "@/lib/middleware/auth"
import { runWhoisLookup } from "@/lib/utils/security-tools"

async function whoisHandler(req: NextRequest) {
  try {
    await connectDB()

    const { target } = await req.json()
    const user = (req as any).user

    if (!target) {
      return NextResponse.json({ error: "Target is required" }, { status: 400 })
    }

    const result = await runWhoisLookup(target)

    // Log the scan
    const scanLog = new ScanLog({
      userId: user.userId,
      toolName: "whois",
      input: target,
      output: result.output,
      status: result.status,
      executionTime: result.executionTime,
    })

    await scanLog.save()

    return NextResponse.json({
      success: true,
      result: {
        output: result.output,
        error: result.error,
        executionTime: result.executionTime,
        status: result.status,
      },
    })
  } catch (error) {
    console.error("WHOIS lookup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(whoisHandler)
