"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system" | "cyberpunk" | "matrix" | "hacker" | "neon" | "terminal"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light" | "cyberpunk" | "matrix" | "hacker" | "neon" | "terminal"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<
    "dark" | "light" | "cyberpunk" | "matrix" | "hacker" | "neon" | "terminal"
  >("dark")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme
    if (
      savedTheme &&
      ["dark", "light", "system", "cyberpunk", "matrix", "hacker", "neon", "terminal"].includes(savedTheme)
    ) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark", "cyberpunk", "matrix", "hacker", "neon", "terminal")

    let effectiveTheme: "dark" | "light" | "cyberpunk" | "matrix" | "hacker" | "neon" | "terminal"

    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    } else {
      effectiveTheme = theme as any
    }

    root.classList.add(effectiveTheme)
    setResolvedTheme(effectiveTheme)

    // Save to localStorage
    localStorage.setItem("theme", theme)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = () => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark", "cyberpunk", "matrix", "hacker", "neon", "terminal")
        const newTheme = mediaQuery.matches ? "dark" : "light"
        root.classList.add(newTheme)
        setResolvedTheme(newTheme)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
