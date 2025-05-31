"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem("proton-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("proton-users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userWithoutPassword = { id: foundUser.id, email: foundUser.email, name: foundUser.name }
      setUser(userWithoutPassword)
      localStorage.setItem("proton-user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get existing users
    const users = JSON.parse(localStorage.getItem("proton-users") || "[]")

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    }

    users.push(newUser)
    localStorage.setItem("proton-users", JSON.stringify(users))

    // Log them in
    const userWithoutPassword = { id: newUser.id, email: newUser.email, name: newUser.name }
    setUser(userWithoutPassword)
    localStorage.setItem("proton-user", JSON.stringify(userWithoutPassword))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("proton-user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
