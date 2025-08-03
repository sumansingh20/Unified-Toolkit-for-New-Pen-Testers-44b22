import { spawn } from "child_process"

export interface ToolResult {
  output: string
  error?: string
  executionTime: number
  status: "success" | "error" | "timeout"
}

export async function executeCommand(command: string, args: string[], timeout = 30000): Promise<ToolResult> {
  const startTime = Date.now()

  return new Promise((resolve) => {
    const process = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
      timeout,
    })

    let stdout = ""
    let stderr = ""

    process.stdout?.on("data", (data) => {
      stdout += data.toString()
    })

    process.stderr?.on("data", (data) => {
      stderr += data.toString()
    })

    process.on("close", (code) => {
      const executionTime = Date.now() - startTime

      if (code === 0) {
        resolve({
          output: stdout,
          executionTime,
          status: "success",
        })
      } else {
        resolve({
          output: stdout,
          error: stderr,
          executionTime,
          status: "error",
        })
      }
    })

    process.on("error", (error) => {
      const executionTime = Date.now() - startTime
      resolve({
        output: "",
        error: error.message,
        executionTime,
        status: "error",
      })
    })

    setTimeout(() => {
      process.kill("SIGTERM")
      const executionTime = Date.now() - startTime
      resolve({
        output: stdout,
        error: "Command timed out",
        executionTime,
        status: "timeout",
      })
    }, timeout)
  })
}

export async function runNmapScan(target: string): Promise<ToolResult> {
  // Sanitize input
  const sanitizedTarget = target.replace(/[;&|`$()]/g, "")

  return executeCommand("nmap", ["-F", sanitizedTarget])
}

export async function runSubdomainEnum(domain: string): Promise<ToolResult> {
  const sanitizedDomain = domain.replace(/[;&|`$()]/g, "")

  // Try sublist3r first, fallback to assetfinder
  try {
    return await executeCommand("sublist3r", ["-d", sanitizedDomain])
  } catch {
    return executeCommand("assetfinder", [sanitizedDomain])
  }
}

export async function runVulnScan(target: string): Promise<ToolResult> {
  const sanitizedTarget = target.replace(/[;&|`$()]/g, "")

  // Try nikto first, fallback to nuclei
  try {
    return await executeCommand("nikto", ["-h", sanitizedTarget])
  } catch {
    return executeCommand("nuclei", ["-target", sanitizedTarget])
  }
}

export async function runWhoisLookup(target: string): Promise<ToolResult> {
  const sanitizedTarget = target.replace(/[;&|`$()]/g, "")

  return executeCommand("whois", [sanitizedTarget])
}

export async function runDNSLookup(domain: string): Promise<ToolResult> {
  const sanitizedDomain = domain.replace(/[;&|`$()]/g, "")

  return executeCommand("dig", [sanitizedDomain, "ANY"])
}

export async function runHTTPHeaders(url: string): Promise<ToolResult> {
  const sanitizedUrl = url.replace(/[;&|`$()]/g, "")

  return executeCommand("curl", ["-I", sanitizedUrl])
}
