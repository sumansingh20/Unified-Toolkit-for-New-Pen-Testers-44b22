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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TerminalOutput } from "@/components/TerminalOutput"
import { ArrowLeft, Eye, Activity, Search, Globe } from "lucide-react"
import Link from "next/link"

interface ScanResult {
  output: string
  error?: string
  executionTime: number
  status: "success" | "error" | "timeout"
}

export default function OSINTPage() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [formData, setFormData] = useState({
    domain: "",
    tool: "theharvester",
  })
  const { apiCall, loading } = useApi()
  const { isAuthenticated } = useAuth()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await apiCall("/api/tools/advanced/osint", {
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
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Eye className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">OSINT Toolkit</h1>
                <p className="text-xs text-muted-foreground">Open Source Intelligence</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm">
              <Activity className="h-3 w-3" />
              <span>Intermediate</span>
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
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Eye className="h-5 w-5 text-indigo-500" />
              </div>
              OSINT Information Gathering
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Gather open source intelligence using TheHarvester for email/subdomain enumeration and Shodan for device
              discovery. Perfect for reconnaissance phase of penetration testing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="domain" className="text-sm font-medium">
                    Target Domain
                  </Label>
                  <Input
                    id="domain"
                    name="domain"
                    type="text"
                    value={formData.domain}
                    onChange={handleChange}
                    placeholder="e.g., example.com"
                    required
                    className="glass focus-ring transition-all duration-200"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="tool" className="text-sm font-medium">
                    OSINT Tool
                  </Label>
                  <Select
                    value={formData.tool}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, tool: value }))}
                  >
                    <SelectTrigger className="glass focus-ring">
                      <SelectValue placeholder="Select OSINT tool" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="theharvester">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          TheHarvester
                        </div>
                      </SelectItem>
                      <SelectItem value="shodan">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Shodan Search
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Search className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary mb-1">TheHarvester</h4>
                      <p className="text-sm text-muted-foreground">
                        Gathers emails, subdomains, hosts, employee names, open ports and banners from different public
                        sources.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <h4 className="font-medium text-success mb-1">Shodan</h4>
                      <p className="text-sm text-muted-foreground">
                        Search engine for Internet-connected devices. Finds servers, webcams, printers, routers, and
                        more.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.domain.trim()}
                className="w-full glow-hover group transition-all duration-200"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Gathering Intelligence...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Start OSINT Gathering
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
          title="OSINT Results"
          executionTime={result?.executionTime}
          status={result?.status}
        />
      </div>
    </div>
  )
}
