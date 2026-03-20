'use client'

import React, { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

interface TimeWarningOverlayProps {
  secondsLeft: number
}

export function TimeWarningOverlay({ secondsLeft }: TimeWarningOverlayProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    return () => setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-destructive/20 backdrop-blur-sm animate-step-in pointer-events-none">
      <div className="bg-card border-2 border-destructive rounded-xl p-8 shadow-2xl text-center animate-pulse-subtle pointer-events-auto">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Time is almost up!
        </h2>
        <p className="text-muted-foreground">
          Submitting in <span className="text-destructive font-mono font-bold text-xl">{secondsLeft}</span> seconds.
        </p>
      </div>
    </div>
  )
}
