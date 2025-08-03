import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ScanLog from "@/lib/models/ScanLog"
import { withAuth } from "@/lib/middleware/auth"
import { runNmapScan } from "@/lib/utils/security-tools"

async function nmapHandler(req: NextRequest) {
  try {
    await connectDB()

    const { target } = await req.json()
    const user = (req as any).user

    if (!target) {
      return NextResponse.json({ error: "Target is required" }, { status: 400 })
    }

    // Validate target format (basic IP/domain validation)
    const targetRegex = /^[a-zA-Z0-9.-]+$/
    if (!targetRegex.test(target)) {
      return NextResponse.json({ error: "Invalid target format" }, { status: 400 })
    }

    const result = await runNmapScan(target)

    // Log the scan
    const scanLog = new ScanLog({
      userId: user.userId,
      toolName: "nmap",
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
    console.error("Nmap scan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(nmapHandler)
