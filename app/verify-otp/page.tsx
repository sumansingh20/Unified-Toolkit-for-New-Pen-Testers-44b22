"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"

export default function VerifyOTPPage() {
  const [formData, setFormData] = useState({
    emailOTP: "",
    phoneOTP: "",
  })
  const { apiCall, loading } = useApi()
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const userId = searchParams.get("userId")
  const purpose = searchParams.get("purpose")

  useEffect(() => {
    if (!userId || !purpose) {
      router.push("/login")
    }
  }, [userId, purpose, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await apiCall("/api/auth/verify-otp", {
        method: "POST",
        body: {
          userId,
          purpose,
          ...formData,
        },
        requiresAuth: false,
      })

      if (response) {
        toast({
          title: "Success",
          description: "OTP verified successfully!",
        })

        if (purpose === "login") {
          login(
            {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            },
            response.user,
          )
          router.push("/dashboard")
        } else if (purpose === "registration") {
          toast({
            title: "Account Verified",
            description: "Your account has been verified. Please log in.",
          })
          router.push("/login")
        }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <CardDescription>Enter the verification codes sent to your email and phone</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOTP">Email OTP</Label>
              <Input
                id="emailOTP"
                name="emailOTP"
                type="text"
                required
                value={formData.emailOTP}
                onChange={handleChange}
                placeholder="Enter OTP from email"
                maxLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneOTP">Phone OTP</Label>
              <Input
                id="phoneOTP"
                name="phoneOTP"
                type="text"
                required
                value={formData.phoneOTP}
                onChange={handleChange}
                placeholder="Enter OTP from SMS"
                maxLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
