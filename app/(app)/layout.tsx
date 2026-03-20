import React from 'react'
import { AuthProvider } from '@/providers/auth-provider'
import { MemoryProvider } from '@/providers/memory-provider'
import { ThemeProvider } from '@/components/theme-provider'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <AuthProvider>
        {/* MemoryProvider nested inside AuthProvider so it can read userId */}
        <MemoryProvider>
          {children}
        </MemoryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
