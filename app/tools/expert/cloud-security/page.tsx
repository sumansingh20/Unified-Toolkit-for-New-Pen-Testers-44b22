"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useApi } from "@/hooks/useApi"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TerminalOutput } from "@/components/TerminalOutput"
import { ArrowLeft, Cloud, Activity, Shield } from "lucide-react"
import Link from "next/link"

interface ScanResult {
  output: string
  error?: string
  executionTime: number
  status: "success" | "error" | "timeout"
}

const cloudProviders = [
  { value: "aws", label: "Amazon Web Services (AWS)", icon: "☁️" },
  { value: "azure", label: "Microsoft Azure", icon: "🔷" },
  { value: "gcp", label: "Google Cloud Platform", icon: "🌐" },
  { value: "alibaba", label: "Alibaba Cloud", icon: "🟠" },
]

export default function CloudSecurityPage() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [provider, setProvider] = useState("")
  const { apiCall, loading } = useApi()
  const { isAuthenticated } = useAuth()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await apiCall("/api/tools/expert/cloud-security", {
        method: "POST",
        body: { provider },
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
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Cloud className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Cloud Security Audit</h1>
                <p className="text-xs text-muted-foreground">Scout Suite Framework</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm">
              <Activity className="h-3 w-3" />
              <span>Expert</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl p-4">
        {/* Tool Form */}
        <Card className="glass-card animate-fade-in mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Cloud className="h-5 w-5 text-blue-500" />
              </div>
              Cloud Security Assessment
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Comprehensive cloud security auditing using Scout Suite. Identifies misconfigurations, security gaps, and
              compliance issues across major cloud providers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="provider" className="text-sm font-medium">
                  Cloud Provider
                </Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="glass focus-ring">
                    <SelectValue placeholder="Select cloud provider" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    {cloudProviders.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <div className="flex items-center gap-2">
                          <span>{p.icon}</span>
                          <span>{p.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-500 mb-1">Cloud Security Audit</h4>
                    <p className="text-sm text-muted-foreground">
                      This tool performs a comprehensive security assessment of your cloud infrastructure, checking for
                      misconfigurations, compliance violations, and security best practices.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !provider}
                className="w-full glow-hover group transition-all duration-200"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Auditing Cloud Security...
                  </>
                ) : (
                  <>
                    <Cloud className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Start Security Audit
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Terminal Output */}
        <TerminalOutput
          output={result?.output || ""}
          isLoading={loading}
          title="Cloud Security Audit"
          executionTime={result?.executionTime}
          status={result?.status}
        />
      </div>
    </div>
  )
}
