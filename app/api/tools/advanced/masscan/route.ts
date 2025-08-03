import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ScanLog from "@/lib/models/ScanLog"
import { withAuth } from "@/lib/middleware/auth"
import { runMasscanScan } from "@/lib/utils/advanced-tools"

async function masscanHandler(req: NextRequest) {
  try {
    await connectDB()

    const { target, ports } = await req.json()
    const user = (req as any).user

    if (!target) {
      return NextResponse.json({ error: "Target is required" }, { status: 400 })
    }

    const result = await runMasscanScan(target, ports)

    const scanLog = new ScanLog({
      userId: user.userId,
      toolName: "masscan",
      input: `${target} ${ports ? `ports: ${ports}` : ""}`,
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
    console.error("Masscan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(masscanHandler)
