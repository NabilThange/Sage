'use client'

import React, { useState } from 'react'
import { ArrowLeft01Icon, ArrowRight01Icon, CircleIcon } from 'hugeicons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface CalendarEvent {
  date: string // YYYY-MM-DD
  type: 'exam' | 'session' | 'scheduled'
  label: string
}

interface CalendarPanelProps {
  events: CalendarEvent[]
  className?: string
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const typeColor: Record<CalendarEvent['type'], string> = {
  exam: 'bg-destructive',
  session: 'bg-green-400',
  scheduled: 'bg-primary',
}

export function CalendarPanel({ events, className }: CalendarPanelProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const eventMap = new Map<string, CalendarEvent[]>()
  events.forEach(ev => {
    const list = eventMap.get(ev.date) ?? []
    list.push(ev)
    eventMap.set(ev.date, list)
  })

  const selectedEvents = selectedDate ? (eventMap.get(selectedDate) ?? []) : []

  const toDateStr = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${viewYear}-${m}-${d}`
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-semibold text-foreground">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day name row */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[11px] text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Empty cells for first week */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = toDateStr(day)
          const dayEvents = eventMap.get(dateStr) ?? []
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const hasExam = dayEvents.some(e => e.type === 'exam')

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={cn(
                'relative flex flex-col items-center justify-start rounded-lg py-1 text-xs transition-colors',
                isToday
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : isSelected
                  ? 'bg-secondary text-foreground font-medium'
                  : 'hover:bg-secondary/60 text-foreground'
              )}
            >
              <span>{day}</span>
              {/* Event dots */}
              {dayEvents.length > 0 && !isToday && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((ev, idx) => (
                    <span
                      key={idx}
                      className={cn('h-1 w-1 rounded-full', typeColor[ev.type])}
                    />
                  ))}
                </div>
              )}
              {/* Exam indicator on today */}
              {isToday && hasExam && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected date events */}
      {selectedDate && selectedEvents.length > 0 && (
        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mb-2">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          {selectedEvents.map((ev, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CircleDot className={cn('h-3 w-3 shrink-0', {
                'text-destructive': ev.type === 'exam',
                'text-green-400': ev.type === 'session',
                'text-primary': ev.type === 'scheduled',
              })} />
              <span className="text-xs text-foreground">{ev.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-3 mt-3 pt-2 border-t border-border">
        {[
          { type: 'exam', label: 'Exam', color: 'bg-destructive' },
          { type: 'session', label: 'Done', color: 'bg-green-400' },
          { type: 'scheduled', label: 'Planned', color: 'bg-primary' },
        ].map(item => (
          <div key={item.type} className="flex items-center gap-1">
            <span className={cn('h-1.5 w-1.5 rounded-full', item.color)} />
            <span className="text-[11px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
