"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useApi } from "@/hooks/useApi"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TerminalOutput } from "@/components/TerminalOutput"
import { ArrowLeft, Target, Activity, Zap } from "lucide-react"
import Link from "next/link"

interface ScanResult {
  output: string
  error?: string
  executionTime: number
  status: "success" | "error" | "timeout"
}

export default function MasscanPage() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [formData, setFormData] = useState({
    target: "",
    ports: "1-1000",
  })
  const { apiCall, loading } = useApi()
  const { isAuthenticated } = useAuth()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await apiCall("/api/tools/advanced/masscan", {
        method: "POST",
        body: formData,
      })

      if (response && response.success) {
        setResult(response.result)
      }
    } catch (error) {
      // Error handled by useApi hook
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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
                <Target className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Masscan</h1>
                <p className="text-xs text-muted-foreground">High-Speed Port Scanner</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning text-sm">
              <Zap className="h-3 w-3" />
              <span>Advanced</span>
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
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Target className="h-5 w-5 text-orange-500" />
              </div>
              Masscan High-Speed Scanner
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Masscan is a high-speed port scanner capable of scanning large networks quickly. It can scan the entire
              Internet in under 6 minutes, transmitting 10 million packets per second.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="target" className="text-sm font-medium">
                    Target Network/IP
                  </Label>
                  <Input
                    id="target"
                    name="target"
                    type="text"
                    value={formData.target}
                    onChange={handleChange}
                    placeholder="e.g., 192.168.1.0/24 or 10.0.0.1"
                    required
                    className="glass focus-ring transition-all duration-200"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="ports" className="text-sm font-medium">
                    Port Range
                  </Label>
                  <Input
                    id="ports"
                    name="ports"
                    type="text"
                    value={formData.ports}
                    onChange={handleChange}
                    placeholder="e.g., 1-1000, 80,443,22"
                    className="glass focus-ring transition-all duration-200"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-warning mb-1">Advanced Tool Warning</h4>
                    <p className="text-sm text-muted-foreground">
                      Masscan is a powerful tool that can generate significant network traffic. Only use on networks you
                      own or have explicit permission to test.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.target.trim()}
                className="w-full glow-hover group transition-all duration-200"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Running High-Speed Scan...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Start Masscan
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
          title="Masscan"
          executionTime={result?.executionTime}
          status={result?.status}
        />
      </div>
    </div>
  )
}
