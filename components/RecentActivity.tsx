"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, CheckCircle, XCircle, AlertTriangle, Shield, Search, Globe, Terminal } from "lucide-react"

const mockActivity = [
  {
    id: 1,
    tool: "Nmap Port Scanner",
    target: "192.168.1.100",
    status: "success",
    time: "2 minutes ago",
    duration: "1.2s",
    icon: Shield,
    findings: 5,
  },
  {
    id: 2,
    tool: "Subdomain Enumeration",
    target: "example.com",
    status: "success",
    time: "5 minutes ago",
    duration: "8.7s",
    icon: Search,
    findings: 12,
  },
  {
    id: 3,
    tool: "Vulnerability Scanner",
    target: "https://test.com",
    status: "warning",
    time: "8 minutes ago",
    duration: "15.3s",
    icon: AlertTriangle,
    findings: 3,
  },
  {
    id: 4,
    tool: "WHOIS Lookup",
    target: "domain.org",
    status: "success",
    time: "12 minutes ago",
    duration: "0.8s",
    icon: Globe,
    findings: 1,
  },
  {
    id: 5,
    tool: "Directory Buster",
    target: "https://webapp.com",
    status: "error",
    time: "15 minutes ago",
    duration: "timeout",
    icon: Terminal,
    findings: 0,
  },
]

export function RecentActivity() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "error":
        return <XCircle className="h-4 w-4 text-error" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      warning: "secondary",
      error: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"} className="text-xs">
        {status}
      </Badge>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest security scans and assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockActivity.map((activity) => {
              const IconComponent = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg glass hover:glow-hover transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{activity.tool}</p>
                      {getStatusIcon(activity.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Target: <span className="font-mono">{activity.target}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity.status)}
                        {activity.findings > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {activity.findings} findings
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.time} • {activity.duration}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
