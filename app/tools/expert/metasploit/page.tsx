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
import { ArrowLeft, Zap, AlertTriangle, Target } from "lucide-react"
import Link from "next/link"

interface ScanResult {
  output: string
  error?: string
  executionTime: number
  status: "success" | "error" | "timeout"
}

const exploits = [
  { value: "windows/smb/ms17_010_eternalblue", label: "EternalBlue (MS17-010)" },
  { value: "windows/http/iis_webdav_scstoragepathfromurl", label: "IIS WebDAV" },
  { value: "linux/http/apache_mod_cgi_bash_env_exec", label: "Apache CGI Bash" },
  { value: "windows/browser/ms14_064_ole_code_execution", label: "Internet Explorer OLE" },
  { value: "multi/handler", label: "Generic Handler" },
]

export default function MetasploitPage() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [formData, setFormData] = useState({
    target: "",
    exploit: "",
  })
  const { apiCall, loading } = useApi()
  const { isAuthenticated } = useAuth()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await apiCall("/api/tools/expert/metasploit", {
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
              <div className="p-2 rounded-lg bg-red-500/10">
                <Zap className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Metasploit Framework</h1>
                <p className="text-xs text-muted-foreground">Exploitation Framework</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm">
              <AlertTriangle className="h-3 w-3" />
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
              <div className="p-2 rounded-lg bg-red-500/10">
                <Zap className="h-5 w-5 text-red-500" />
              </div>
              Metasploit Exploitation Framework
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              The world's most used penetration testing framework. Metasploit helps security professionals find,
              exploit, and validate vulnerabilities. This is a simulation for educational purposes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="target" className="text-sm font-medium">
                    Target System
                  </Label>
                  <Input
                    id="target"
                    name="target"
                    type="text"
                    value={formData.target}
                    onChange={handleChange}
                    placeholder="e.g., 192.168.1.100"
                    required
                    className="glass focus-ring transition-all duration-200"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="exploit" className="text-sm font-medium">
                    Exploit Module
                  </Label>
                  <Select
                    value={formData.exploit}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, exploit: value }))}
                  >
                    <SelectTrigger className="glass focus-ring">
                      <SelectValue placeholder="Select exploit module" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {exploits.map((exploit) => (
                        <SelectItem key={exploit.value} value={exploit.value}>
                          {exploit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-500 mb-1">EXPERT TOOL WARNING</h4>
                    <p className="text-sm text-muted-foreground">
                      Metasploit is an advanced exploitation framework. Only use on systems you own or have explicit
                      written permission to test. Unauthorized use is illegal and unethical.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.target.trim() || !formData.exploit}
                className="w-full glow-hover group transition-all duration-200"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Launching Exploit...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Launch Metasploit
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
          title="Metasploit Console"
          executionTime={result?.executionTime}
          status={result?.status}
        />
      </div>
    </div>
  )
}
