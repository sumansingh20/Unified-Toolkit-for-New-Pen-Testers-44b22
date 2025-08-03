import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ScanLog from "@/lib/models/ScanLog"
import { withAuth } from "@/lib/middleware/auth"
import { runDirBuster } from "@/lib/utils/advanced-tools"

async function dirBusterHandler(req: NextRequest) {
  try {
    await connectDB()

    const { url } = await req.json()
    const user = (req as any).user

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const result = await runDirBuster(url)

    const scanLog = new ScanLog({
      userId: user.userId,
      toolName: "gobuster",
      input: url,
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
    console.error("DirBuster error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(dirBusterHandler)
