import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ScanLog from "@/lib/models/ScanLog"
import { withAuth } from "@/lib/middleware/auth"
import { runTheHarvester, runShodan } from "@/lib/utils/advanced-tools"

async function osintHandler(req: NextRequest) {
  try {
    await connectDB()

    const { domain, tool } = await req.json()
    const user = (req as any).user

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    let result
    let toolName = "theharvester"

    switch (tool) {
      case "shodan":
        result = await runShodan(domain)
        toolName = "shodan"
        break
      case "theharvester":
      default:
        result = await runTheHarvester(domain)
        break
    }

    const scanLog = new ScanLog({
      userId: user.userId,
      toolName,
      input: domain,
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
    console.error("OSINT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(osintHandler)
