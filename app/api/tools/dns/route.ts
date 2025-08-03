import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ScanLog from "@/lib/models/ScanLog"
import { withAuth } from "@/lib/middleware/auth"
import { runDNSLookup } from "@/lib/utils/security-tools"

async function dnsHandler(req: NextRequest) {
  try {
    await connectDB()

    const { domain } = await req.json()
    const user = (req as any).user

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    const result = await runDNSLookup(domain)

    // Log the scan
    const scanLog = new ScanLog({
      userId: user.userId,
      toolName: "dig",
      input: domain,
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
    console.error("DNS lookup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(dnsHandler)
