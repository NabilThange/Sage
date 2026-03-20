'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { useMemory } from '@/providers/memory-provider'
import { ProtectedRoute } from '@/components/app/protected-route'

import { OnboardingShell } from '@/components/onboarding/onboarding-shell'
import { StepNameConfirm } from '@/components/onboarding/step-name-confirm'
import { StepEducationLevel } from '@/components/onboarding/step-education-level'
import { StepCurriculum } from '@/components/onboarding/step-curriculum'
import { StepSemester } from '@/components/onboarding/step-semester'
import { StepSyllabusUpload, type ParsedSubject } from '@/components/onboarding/step-syllabus-upload'
import { StepSubjectConfirm } from '@/components/onboarding/step-subject-confirm'
import { StepTopicsKnown } from '@/components/onboarding/step-topics-known'
import { StepProfileReveal } from '@/components/onboarding/step-profile-reveal'

const TOTAL_STEPS = 8

export default function OnboardingPage() {
  const router = useRouter()
  const { userName, updateProfile } = useAuth()
  const { retain } = useMemory()

  // Step state machine
  const [step, setStep] = useState(1)

  // Collected data
  const [educationLevel, setEducationLevel] = useState('')
  const [curriculum, setCurriculum] = useState('')
  const [semester, setSemester] = useState('')
  const [parsedSubjects, setParsedSubjects] = useState<ParsedSubject[]>([])
  const [confirmedSubjects, setConfirmedSubjects] = useState<ParsedSubject[]>([])
  const [knownTopics, setKnownTopics] = useState<Record<string, string[]>>({})

  // ---- Step handlers ----

  // Step 1: Name confirm → advance
  const handleNameNext = useCallback(() => {
    setStep(2)
  }, [])

  // Step 2: Education level → auto-advance
  const handleEducationSelect = useCallback((level: string) => {
    setEducationLevel(level)
    // Auto-advance after short animation delay
    setTimeout(() => setStep(3), 150)
  }, [])

  // Step 3: Curriculum → auto-advance
  const handleCurriculumSelect = useCallback((curr: string) => {
    setCurriculum(curr)
    setTimeout(() => setStep(4), 150)
  }, [])

  // Step 4: Semester → auto-advance
  const handleSemesterSelect = useCallback((sem: string) => {
    setSemester(sem)
    setTimeout(() => setStep(5), 150)
  }, [])

  // Step 5: Syllabus upload → parsed subjects → advance
  const handleSyllabusComplete = useCallback((subjects: ParsedSubject[]) => {
    setParsedSubjects(subjects)
    setStep(6)
  }, [])

  // Step 6: Subject confirmation → advance
  const handleSubjectsConfirm = useCallback((confirmed: ParsedSubject[]) => {
    setConfirmedSubjects(confirmed)
    setStep(7)
  }, [])

  // Step 7: Topics known → advance
  const handleTopicsComplete = useCallback((topics: Record<string, string[]>) => {
    setKnownTopics(topics)
    setStep(8)
  }, [])

  // Step 8: Profile reveal → retain() + navigate to /planner
  const handleFinish = useCallback(async (proficiency: Record<string, number>) => {
    // Build the complete profile
    const subjectsData = confirmedSubjects.map(s => ({
      name: s.name,
      chapters: s.chapters,
      knownTopics: knownTopics[s.name] ?? [],
    }))

    // Update auth profile with all onboarding data
    updateProfile({
      educationLevel,
      curriculum,
      semester,
      subjects: subjectsData,
      onboardingComplete: true,
    })

    // Fire retain() with complete onboarding profile
    const retainContent = [
      `Student onboarding completed for ${userName}.`,
      `Education level: ${educationLevel}.`,
      `Curriculum/Board: ${curriculum}.`,
      `Semester/Year: ${semester}.`,
      `Subjects: ${confirmedSubjects.map(s => s.name).join(', ')}.`,
      ...confirmedSubjects.map(s => {
        const known = knownTopics[s.name] ?? []
        const totalTopics = s.chapters.reduce(
          (sum, ch) => sum + (ch.subtopics.length > 0 ? ch.subtopics.length : 1),
          0
        )
        const pct = totalTopics > 0 ? Math.round((known.length / totalTopics) * 100) : 0
        return `${s.name}: ${pct}% baseline proficiency (${known.length}/${totalTopics} topics known). ` +
          (known.length > 0
            ? `Known topics: ${known.map(t => t.split('::').pop()).join(', ')}.`
            : 'Starting from scratch.')
      }),
      `Baseline proficiency scores: ${Object.entries(proficiency).map(([s, p]) => `${s}: ${p}%`).join(', ')}.`,
    ].join(' ')

    try {
      await retain('onboarding_complete', retainContent)
    } catch {
      // Memory write is best-effort; don't block navigation
      console.error('[Onboarding] retain() failed, continuing to planner')
    }

    router.push('/planner')
  }, [confirmedSubjects, knownTopics, educationLevel, curriculum, semester, userName, updateProfile, retain, router])

  // ---- Render current step ----

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepNameConfirm
            name={userName ?? 'Student'}
            onNext={handleNameNext}
          />
        )
      case 2:
        return (
          <StepEducationLevel
            value={educationLevel}
            onSelect={handleEducationSelect}
          />
        )
      case 3:
        return (
          <StepCurriculum
            educationLevel={educationLevel}
            value={curriculum}
            onSelect={handleCurriculumSelect}
          />
        )
      case 4:
        return (
          <StepSemester
            educationLevel={educationLevel}
            curriculum={curriculum}
            value={semester}
            onSelect={handleSemesterSelect}
          />
        )
      case 5:
        return (
          <StepSyllabusUpload
            onComplete={handleSyllabusComplete}
          />
        )
      case 6:
        return (
          <StepSubjectConfirm
            subjects={parsedSubjects}
            onConfirm={handleSubjectsConfirm}
          />
        )
      case 7:
        return (
          <StepTopicsKnown
            subjects={confirmedSubjects}
            onComplete={handleTopicsComplete}
          />
        )
      case 8:
        return (
          <StepProfileReveal
            name={userName ?? 'Student'}
            subjects={confirmedSubjects}
            knownTopics={knownTopics}
            onFinish={handleFinish}
          />
        )
      default:
        return null
    }
  }

  return (
    <ProtectedRoute>
      <OnboardingShell currentStep={step} totalSteps={TOTAL_STEPS}>
        {renderStep()}
      </OnboardingShell>
    </ProtectedRoute>
  )
}
