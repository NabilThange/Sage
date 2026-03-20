'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface SubjectCardProps {
  name: string
  chapterCount: number
  proficiency: number
  lastStudied?: string
  weakTopicCount?: number
}

// Deterministic color assignment based on subject name
function getSubjectGradient(name: string): string {
  const gradients = [
    'from-violet-600/20 to-indigo-600/10',
    'from-emerald-600/20 to-teal-600/10',
    'from-amber-600/20 to-orange-600/10',
    'from-rose-600/20 to-pink-600/10',
    'from-sky-600/20 to-cyan-600/10',
    'from-fuchsia-600/20 to-purple-600/10',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradients[Math.abs(hash) % gradients.length]
}

function getSubjectIcon(name: string): string {
  const icons: Record<string, string> = {
    'Data Structures': '🌳',
    'Operating Systems': '⚙️',
    'DBMS': '🗄️',
    'IOT': '📡',
    'Computer Networks': '🌐',
    'Discrete Mathematics': '🔢',
    'Physics': '⚛️',
    'Chemistry': '🧪',
    'Mathematics': '📐',
  }
  return icons[name] || '📚'
}

export function SubjectCard({
  name,
  chapterCount,
  proficiency,
  lastStudied,
  weakTopicCount = 0,
}: SubjectCardProps) {
  const gradient = getSubjectGradient(name)
  const icon = getSubjectIcon(name)
  const slug = encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))

  return (
    <Link href={`/mentor/${slug}`}>
      <div
        className={cn(
          'group relative overflow-hidden rounded-xl border border-border/60 bg-card',
          'hover:border-primary/40 hover:shadow-md',
          'transition-all duration-200 cursor-pointer',
        )}
      >
        {/* Cover / Header area */}
        <div
          className={cn(
            'relative h-28 bg-gradient-to-br',
            gradient,
            'flex items-center justify-center',
          )}
        >
          {/* Large emoji icon */}
          <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </span>

          {/* Chapter count badge */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-background/80 backdrop-blur-sm text-foreground border border-border/40">
            <BookOpen className="h-2.5 w-2.5" />
            {chapterCount} chapters
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                {proficiency}% proficiency
              </p>
              {weakTopicCount > 0 && (
                <p className="text-xs text-[#F5A524]">
                  {weakTopicCount} weak topic{weakTopicCount !== 1 ? 's' : ''}
                </p>
              )}
              <div className="flex items-center gap-1 text-xs text-primary mt-2">
                <span>Open</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Subject name */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground truncate pr-2">
              {name}
            </h3>
            <span className="text-xs font-mono text-muted-foreground shrink-0">
              {proficiency}%
            </span>
          </div>

          {/* Proficiency bar */}
          <div className="h-1.5 w-full bg-secondary/60 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                proficiency >= 70
                  ? 'bg-[#17C964]'
                  : proficiency >= 40
                    ? 'bg-primary'
                    : 'bg-[#F5A524]',
              )}
              style={{ width: `${proficiency}%` }}
            />
          </div>

          {/* Last studied */}
          {lastStudied && (
            <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              Last studied: {lastStudied}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
