"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Shield, Zap, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export function DashboardStats({ userId }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalScans: 0,
    successfulScans: 0,
    failedScans: 0,
    avgExecutionTime: 0,
    recentActivity: [],
    securityScore: 85,
    threatsDetected: 12,
    vulnerabilitiesFound: 8,
  })

  useEffect(() => {
    // Simulate loading stats (in real app, fetch from API)
    const mockStats = {
      totalScans: 47,
      successfulScans: 42,
      failedScans: 5,
      avgExecutionTime: 2340,
      recentActivity: [
        { tool: "Nmap", target: "192.168.1.1", status: "success", time: "2 min ago" },
        { tool: "Nikto", target: "example.com", status: "success", time: "5 min ago" },
        { tool: "Sublist3r", target: "test.com", status: "error", time: "10 min ago" },
      ],
      securityScore: 85,
      threatsDetected: 12,
      vulnerabilitiesFound: 8,
    }

    setTimeout(() => setStats(mockStats), 1000)
  }, [userId])

  const successRate = stats.totalScans > 0 ? (stats.successfulScans / stats.totalScans) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Scans */}
      <Card className="glass-card hover:glow-hover transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalScans}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            +12% from last week
          </p>
          <Progress value={75} className="mt-2" />
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card className="glass-card hover:glow-hover transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{successRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.successfulScans} successful, {stats.failedScans} failed
          </p>
          <Progress value={successRate} className="mt-2" />
        </CardContent>
      </Card>

      {/* Security Score */}
      <Card className="glass-card hover:glow-hover transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Score</CardTitle>
          <Shield className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{stats.securityScore}/100</div>
          <p className="text-xs text-muted-foreground">Based on scan results</p>
          <Progress value={stats.securityScore} className="mt-2" />
        </CardContent>
      </Card>

      {/* Avg Execution Time */}
      <Card className="glass-card hover:glow-hover transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(stats.avgExecutionTime / 1000).toFixed(1)}s</div>
          <p className="text-xs text-muted-foreground">Average execution time</p>
          <div className="mt-2 flex items-center gap-1">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-xs text-primary">Optimized</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
