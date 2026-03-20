'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface TapCardProps {
  label: string
  icon?: React.ReactNode
  description?: string
  isSelected: boolean
  onClick: () => void
  variant?: 'default' | 'glow'
  disabled?: boolean
  className?: string
}

export function TapCard({
  label,
  icon,
  description,
  isSelected,
  onClick,
  variant = 'default',
  disabled = false,
  className,
}: TapCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center',
        'transition-all duration-200 ease-out',
        'hover:scale-[1.02] active:scale-[0.97]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100',
        'cursor-pointer select-none',
        // Default state
        !isSelected && [
          'bg-card border-border/60',
          'hover:border-primary/30 hover:bg-card/80',
        ],
        // Selected state
        isSelected && variant === 'default' && [
          'border-primary bg-primary/5',
          'glow-primary',
        ],
        isSelected && variant === 'glow' && [
          'border-primary bg-primary/10',
          'glow-primary',
        ],
        className,
      )}
    >
      {/* Check mark badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary animate-step-in">
          <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
        </div>
      )}

      {/* Icon */}
      {icon && (
        <div
          className={cn(
            'text-2xl transition-colors duration-150',
            isSelected ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {icon}
        </div>
      )}

      {/* Label */}
      <span
        className={cn(
          'font-medium text-sm transition-colors duration-150',
          isSelected ? 'text-foreground' : 'text-foreground/80',
        )}
      >
        {label}
      </span>

      {/* Description */}
      {description && (
        <span className="text-xs text-muted-foreground leading-tight">
          {description}
        </span>
      )}
    </button>
  )
}
