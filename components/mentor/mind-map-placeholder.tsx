'use client'

import React from 'react'
import { Network } from 'lucide-react'

export function MindMapPlaceholder() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Mind Map</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground font-medium">
          Coming Soon
        </span>
      </div>
      <div className="rounded-xl border border-dashed border-border/40 bg-card/20 p-6 flex flex-col items-center justify-center gap-2 min-h-[80px]">
        <Network className="h-6 w-6 text-muted-foreground/40" />
        <p className="text-[10px] text-muted-foreground/60 text-center">
          Visual concept map — coming in a future update
        </p>
      </div>
    </div>
  )
}
