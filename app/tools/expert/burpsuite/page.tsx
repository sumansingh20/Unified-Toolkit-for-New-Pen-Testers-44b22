"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useApi } from "@/hooks/useApi"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ToolForm } from "@/components/ToolForm"
import { TerminalOutput } from "@/components/TerminalOutput"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Activity } from "lucide-react"
import Link from "next/link"

interface ScanResult {
  output: string
  error?: string
  executionTime: number
  status: "success" | "error" | "timeout"
}

export default function BurpSuitePage() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const { apiCall, loading } = useApi()
  const { isAuthenticated } = useAuth()

  const handleScan = async (url: string) => {
    try {
      const response = await apiCall("/api/tools/expert/burpsuite", {
        method: "POST",
        body: { url },
      })

      if (response && response.success) {
        setResult(response.result)
      }
    } catch (error) {
      // Error handled by useApi hook
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 glass backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="glass hover:glow-hover bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Shield className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Burp Suite Professional</h1>
                <p className="text-xs text-muted-foreground">Web Application Security</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm">
              <Activity className="h-3 w-3" />
              <span>Expert</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl p-4">
        {/* Tool Form */}
        <div className="animate-slide-up">
          <ToolForm
            title="Burp Suite Professional Scanner"
            description="Industry-leading web application security testing platform. Performs comprehensive automated scanning to identify security vulnerabilities including SQL injection, XSS, and more."
            inputLabel="Target URL"
            inputPlaceholder="e.g., https://example.com"
            onSubmit={handleScan}
            isLoading={loading}
            inputType="url"
          />
        </div>

        {/* Terminal Output */}
        <TerminalOutput
          output={result?.output || ""}
          isLoading={loading}
          title="Burp Suite Scan Results"
          executionTime={result?.executionTime}
          status={result?.status}
        />
      </div>
    </div>
  )
}
