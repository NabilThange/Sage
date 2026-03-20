'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface UserProfile {
  userId: string
  name: string
  educationLevel?: string
  curriculum?: string
  semester?: string
  subjects?: Array<{
    name: string
    chapters: Array<{
      name: string
      subtopics: string[]
    }>
    knownTopics: string[]
  }>
  streakCount?: number
  xp?: number
  onboardingComplete?: boolean
}

interface AuthContextType {
  userId: string | null
  userName: string | null
  profile: UserProfile | null
  isAuthenticated: boolean
  login: (name: string, isDemo?: boolean) => string
  logout: () => void
  updateProfile: (updates: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'recallio_userId'
const PROFILE_KEY = 'recallio_profile'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem(STORAGE_KEY)
    const storedProfile = localStorage.getItem(PROFILE_KEY)
    
    if (storedUserId) {
      setUserId(storedUserId)
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile))
        } catch {
          // Invalid stored profile, ignore
        }
      }
    }
    setIsHydrated(true)
  }, [])

  const login = useCallback((name: string, isDemo = false): string => {
    const newUserId = isDemo
      ? `user_${name.toLowerCase()}_demo`
      : `user_${name.toLowerCase()}_${Date.now()}`
    
    const newProfile: UserProfile = {
      userId: newUserId,
      name,
    }

    localStorage.setItem(STORAGE_KEY, newUserId)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile))
    setUserId(newUserId)
    setProfile(newProfile)

    return newUserId
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(PROFILE_KEY)
    setUserId(null)
    setProfile(null)
  }, [])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Don't render children until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        userId,
        userName: profile?.name ?? null,
        profile,
        isAuthenticated: !!userId,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
