'use client'

import React from 'react'
import { AppShell } from '@/components/app/app-shell'
import { SubjectCard } from '@/components/mentor/subject-card'
import { useAuth } from '@/providers/auth-provider'
import { GraduationCap } from 'lucide-react'

export default function MentorPage() {
  const { profile } = useAuth()
  const subjects = profile?.subjects ?? []

  // Calculate proficiency and metadata per subject
  const subjectData = subjects.map((subject) => {
    // Get baseline proficiency from stored profile
    const totalTopics = subject.chapters.reduce(
      (sum, ch) => sum + (ch.subtopics.length > 0 ? ch.subtopics.length : 1),
      0
    )
    const knownCount = subject.knownTopics?.length ?? 0
    const baselineProficiency = totalTopics > 0 ? Math.round((knownCount / totalTopics) * 100) : 0

    // Calculate weak areas (chapters where < 30% known)
    const weakAreas = subject.chapters.filter((ch) => {
      const chapterTopics = ch.subtopics.length > 0 ? ch.subtopics : [ch.name]
      const knownInChapter = chapterTopics.filter((st) => {
        const id = ch.subtopics.length > 0 ? `${ch.name}::${st}` : ch.name
        return (subject.knownTopics ?? []).includes(id)
      }).length
      return knownInChapter / chapterTopics.length < 0.3
    })

    return {
      name: subject.name,
      chapterCount: subject.chapters.length,
      proficiency: baselineProficiency,
      weakTopicCount: weakAreas.length,
      lastStudied: undefined as string | undefined, // Will be populated from Hindsight later
    }
  })

  return (
    <AppShell requireOnboarding>
      <div className="flex-1 p-6 lg:p-8 animate-step-in">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Mentor
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose a subject to start studying with your AI tutor
              </p>
            </div>
          </div>
        </div>

        {/* Subject grid */}
        {subjectData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subjectData.map((subject, index) => (
              <div
                key={subject.name}
                className="animate-card-stagger"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <SubjectCard
                  name={subject.name}
                  chapterCount={subject.chapterCount}
                  proficiency={subject.proficiency}
                  lastStudied={subject.lastStudied}
                  weakTopicCount={subject.weakTopicCount}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/60 mb-4">
              <GraduationCap className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              No subjects yet
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Complete the onboarding flow to add your subjects and start studying with your AI tutor.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
