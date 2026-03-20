'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PillItem {
  id: string
  label: string
}

interface PillSelectProps {
  items: PillItem[]
  selected: string[]
  onToggle: (id: string) => void
  variant?: 'select' | 'nav'
  className?: string
}

export function PillSelect({
  items,
  selected,
  onToggle,
  variant = 'select',
  className,
}: PillSelectProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => {
        const isActive = selected.includes(item.id)
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={cn(
              'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium',
              'transition-all duration-150 ease-out',
              'hover:scale-[1.03] active:scale-[0.97]',
              'cursor-pointer select-none',
              variant === 'select' && [
                !isActive && 'bg-secondary/60 text-secondary-foreground border border-border/40 hover:bg-secondary/80',
                isActive && 'bg-primary text-primary-foreground border border-primary glow-primary',
              ],
              variant === 'nav' && [
                !isActive && 'bg-card text-muted-foreground border border-border/40 hover:text-foreground',
                isActive && 'bg-primary text-primary-foreground border border-primary',
              ],
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
