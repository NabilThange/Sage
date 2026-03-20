'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Clock01Icon, Alert01Icon, TrendingUp01Icon, TrendingDown01Icon, Remove01Icon } from 'hugeicons-react'

interface HindsightStripProps {
  lastStudied?: string
  weakAreas?: string[]
  scoreTrend?: 'up' | 'down' | 'stable'
  score?: number
  className?: string
  variant?: 'inline' | 'sidebar'
}

export function HindsightStrip({
  lastStudied,
  weakAreas = [],
  scoreTrend,
  score,
  className,
  variant = 'inline',
}: HindsightStripProps) {
  const TrendIcon =
    scoreTrend === 'up'
      ? TrendingUp
      : scoreTrend === 'down'
        ? TrendingDown
        : Minus

  const trendColor =
    scoreTrend === 'up'
      ? 'text-[#17C964]'
      : scoreTrend === 'down'
        ? 'text-destructive'
        : 'text-muted-foreground'

  if (variant === 'sidebar') {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Last studied */}
        {lastStudied && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>Last: {lastStudied}</span>
          </div>
        )}

        {/* Weak areas */}
        {weakAreas.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-[#F5A524]" />
              Weak Areas
            </span>
            <div className="flex flex-wrap gap-1">
              {weakAreas.slice(0, 4).map((area) => (
                <span
                  key={area}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F5A524]/10 text-[#F5A524] border border-[#F5A524]/20"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Score */}
        {score !== undefined && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Score:</span>
            <span className="font-mono font-medium text-foreground">{score}%</span>
            {scoreTrend && (
              <TrendIcon className={cn('h-3.5 w-3.5', trendColor)} />
            )}
          </div>
        )}
      </div>
    )
  }

  // Inline variant — compact horizontal strip
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg bg-card/50 border border-border/40 px-3 py-2 text-xs',
        className,
      )}
    >
      {lastStudied && (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3 w-3" />
          Last: {lastStudied}
        </span>
      )}

      {weakAreas.length > 0 && (
        <>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <AlertTriangle className="h-3 w-3 text-[#F5A524]" />
            Weak: {weakAreas.slice(0, 2).join(', ')}
          </span>
        </>
      )}

      {score !== undefined && (
        <>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5 text-muted-foreground">
            Score: <span className="font-mono font-medium text-foreground">{score}%</span>
            {scoreTrend && (
              <TrendIcon className={cn('h-3 w-3', trendColor)} />
            )}
          </span>
        </>
      )}
    </div>
  )
}
