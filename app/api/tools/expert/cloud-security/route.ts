import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ScanLog from "@/lib/models/ScanLog"
import { withAuth } from "@/lib/middleware/auth"
import { runScoutSuite } from "@/lib/utils/expert-tools"

async function cloudSecurityHandler(req: NextRequest) {
  try {
    await connectDB()

    const { provider } = await req.json()
    const user = (req as any).user

    if (!provider) {
      return NextResponse.json({ error: "Cloud provider is required" }, { status: 400 })
    }

    const result = await runScoutSuite(provider)

    const scanLog = new ScanLog({
      userId: user.userId,
      toolName: "scoutsuite",
      input: provider,
      output: result.output,
      status: result.status,
      executionTime: result.executionTime,
    })

    await scanLog.save()

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error("Cloud security error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(cloudSecurityHandler)
