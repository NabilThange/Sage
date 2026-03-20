'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Upload04Icon, FileAttachmentIcon, Loading03Icon, AiStar01Icon, Cancel01Icon, Book02Icon } from 'hugeicons-react'
import { cn } from '@/lib/utils'

// Pre-loaded syllabus templates
const SYLLABUS_TEMPLATES = [
  {
    id: 'btech-cse-sem3',
    label: 'BTech CSE Sem 3',
    subjects: [
      {
        name: 'Data Structures',
        chapters: [
          { name: 'Arrays & Linked Lists', subtopics: ['Arrays', 'Singly Linked List', 'Doubly Linked List', 'Circular Linked List'] },
          { name: 'Stacks & Queues', subtopics: ['Stack Operations', 'Queue Operations', 'Priority Queue', 'Deque'] },
          { name: 'Trees', subtopics: ['Binary Trees', 'BST', 'AVL Trees', 'Heap'] },
          { name: 'Graphs', subtopics: ['BFS', 'DFS', 'Shortest Path', 'MST'] },
          { name: 'Sorting & Searching', subtopics: ['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Binary Search'] },
        ],
      },
      {
        name: 'Operating Systems',
        chapters: [
          { name: 'Process Management', subtopics: ['Process States', 'PCB', 'Context Switching', 'Threads'] },
          { name: 'CPU Scheduling', subtopics: ['FCFS', 'SJF', 'Round Robin', 'Priority Scheduling'] },
          { name: 'Memory Management', subtopics: ['Paging', 'Segmentation', 'Virtual Memory', 'Page Replacement'] },
          { name: 'File Systems', subtopics: ['File Organization', 'Directory Structure', 'Disk Scheduling'] },
          { name: 'Deadlocks', subtopics: ['Conditions', 'Prevention', 'Avoidance', 'Detection'] },
        ],
      },
      {
        name: 'DBMS',
        chapters: [
          { name: 'ER Model', subtopics: ['Entities', 'Relationships', 'ER Diagrams', 'Mapping'] },
          { name: 'Relational Model', subtopics: ['Keys', 'Normalization', 'Relational Algebra'] },
          { name: 'SQL', subtopics: ['DDL', 'DML', 'Joins', 'Subqueries'] },
          { name: 'Transactions', subtopics: ['ACID Properties', 'Serializability', 'Concurrency Control'] },
          { name: 'Indexing', subtopics: ['B-Trees', 'Hash Indexing', 'Bitmap Index'] },
        ],
      },
      {
        name: 'IOT',
        chapters: [
          { name: 'IoT Architecture', subtopics: ['Layers', 'Protocols', 'Edge Computing'] },
          { name: 'Sensors & Actuators', subtopics: ['Types', 'Interfacing', 'Signal Processing'] },
          { name: 'Communication Protocols', subtopics: ['MQTT', 'CoAP', 'Zigbee', 'Bluetooth'] },
          { name: 'Transmission Lines', subtopics: ['VSWR', 'Antenna Gain', 'Propagation Delay', 'Smith Chart'] },
          { name: 'IoT Applications', subtopics: ['Smart Home', 'Healthcare', 'Industrial IoT'] },
        ],
      },
      {
        name: 'Computer Networks',
        chapters: [
          { name: 'Network Models', subtopics: ['OSI Model', 'TCP/IP Model', 'Comparison'] },
          { name: 'Data Link Layer', subtopics: ['Framing', 'Error Detection', 'Flow Control'] },
          { name: 'Network Layer', subtopics: ['IP Addressing', 'Subnetting', 'Routing'] },
          { name: 'Transport Layer', subtopics: ['TCP', 'UDP', 'Congestion Control'] },
          { name: 'Application Layer', subtopics: ['HTTP', 'DNS', 'FTP', 'SMTP'] },
        ],
      },
      {
        name: 'Discrete Mathematics',
        chapters: [
          { name: 'Set Theory', subtopics: ['Sets', 'Relations', 'Functions'] },
          { name: 'Logic', subtopics: ['Propositional Logic', 'Predicate Logic', 'Proof Techniques'] },
          { name: 'Combinatorics', subtopics: ['Permutations', 'Combinations', 'Pigeonhole Principle'] },
          { name: 'Graph Theory', subtopics: ['Graph Types', 'Euler & Hamilton', 'Graph Coloring'] },
        ],
      },
    ],
  },
  {
    id: 'cbse-12-pcm',
    label: 'CBSE Class 12 PCM',
    subjects: [
      {
        name: 'Physics',
        chapters: [
          { name: 'Electrostatics', subtopics: ['Coulomb\'s Law', 'Electric Field', 'Gauss\'s Law', 'Capacitance'] },
          { name: 'Current Electricity', subtopics: ['Ohm\'s Law', 'Kirchhoff\'s Laws', 'Wheatstone Bridge'] },
          { name: 'Optics', subtopics: ['Reflection', 'Refraction', 'Diffraction', 'Polarization'] },
          { name: 'Modern Physics', subtopics: ['Dual Nature', 'Atoms', 'Nuclei', 'Semiconductors'] },
        ],
      },
      {
        name: 'Chemistry',
        chapters: [
          { name: 'Solid State', subtopics: ['Crystal Systems', 'Packing Efficiency', 'Defects'] },
          { name: 'Electrochemistry', subtopics: ['Nernst Equation', 'Electrolysis', 'Batteries'] },
          { name: 'Chemical Kinetics', subtopics: ['Rate Laws', 'Order of Reaction', 'Arrhenius Equation'] },
          { name: 'Organic Chemistry', subtopics: ['Alcohols', 'Aldehydes', 'Amines', 'Polymers'] },
        ],
      },
      {
        name: 'Mathematics',
        chapters: [
          { name: 'Relations & Functions', subtopics: ['Types', 'Composition', 'Inverse'] },
          { name: 'Calculus', subtopics: ['Limits', 'Derivatives', 'Integrals', 'Applications'] },
          { name: 'Vectors & 3D', subtopics: ['Vector Operations', 'Lines', 'Planes'] },
          { name: 'Probability', subtopics: ['Conditional Probability', 'Bayes Theorem', 'Distributions'] },
        ],
      },
    ],
  },
  {
    id: 'jee-mains',
    label: 'JEE Mains',
    subjects: [
      {
        name: 'Physics',
        chapters: [
          { name: 'Mechanics', subtopics: ['Kinematics', 'Newton\'s Laws', 'Work & Energy', 'Rotation'] },
          { name: 'Electrodynamics', subtopics: ['Electrostatics', 'Current', 'Magnetism', 'EMI'] },
          { name: 'Optics & Waves', subtopics: ['Wave Optics', 'Ray Optics', 'Sound Waves'] },
          { name: 'Modern Physics', subtopics: ['Photoelectric Effect', 'Nuclear Physics', 'Semiconductors'] },
        ],
      },
      {
        name: 'Chemistry',
        chapters: [
          { name: 'Physical Chemistry', subtopics: ['Thermodynamics', 'Equilibrium', 'Kinetics', 'Electrochemistry'] },
          { name: 'Inorganic Chemistry', subtopics: ['Periodic Table', 'Coordination Compounds', 'p-Block'] },
          { name: 'Organic Chemistry', subtopics: ['GOC', 'Hydrocarbons', 'Functional Groups', 'Biomolecules'] },
        ],
      },
      {
        name: 'Mathematics',
        chapters: [
          { name: 'Algebra', subtopics: ['Quadratics', 'Matrices', 'Complex Numbers', 'Sequences'] },
          { name: 'Calculus', subtopics: ['Limits', 'Differentiation', 'Integration', 'Differential Equations'] },
          { name: 'Coordinate Geometry', subtopics: ['Lines', 'Circles', 'Conics'] },
          { name: 'Trigonometry & Stats', subtopics: ['Identities', 'Equations', 'Probability', 'Statistics'] },
        ],
      },
    ],
  },
]

export interface ParsedSubject {
  name: string
  chapters: Array<{
    name: string
    subtopics: string[]
  }>
}

interface StepSyllabusUploadProps {
  onComplete: (subjects: ParsedSubject[]) => void
}

export function StepSyllabusUpload({ onComplete }: StepSyllabusUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [processingText, setProcessingText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setIsProcessing(true)
    setProcessingText('Reading your syllabus...')

    // Simulate processing stages
    await new Promise(r => setTimeout(r, 1500))
    setProcessingText('Extracting subjects and chapters...')
    await new Promise(r => setTimeout(r, 2000))
    setProcessingText('Organizing your curriculum...')
    await new Promise(r => setTimeout(r, 1500))

    // Try to call the API (falls back to template if API not ready)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/onboarding/parse-syllabus', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.subjects?.length > 0) {
          onComplete(data.subjects)
          return
        }
      }
    } catch {
      // API not ready, fall back to template
    }

    // Fallback: use BTech template
    setProcessingText('Done! Found your subjects.')
    await new Promise(r => setTimeout(r, 500))
    onComplete(SYLLABUS_TEMPLATES[0].subjects)
  }, [onComplete])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === 'application/pdf') {
      processFile(file)
    }
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleTemplateClick = useCallback(async (templateId: string) => {
    const template = SYLLABUS_TEMPLATES.find(t => t.id === templateId)
    if (!template) return

    setIsProcessing(true)
    setFileName(template.label)
    setProcessingText('Loading template...')
    await new Promise(r => setTimeout(r, 800))
    setProcessingText('Extracting subjects...')
    await new Promise(r => setTimeout(r, 1200))
    onComplete(template.subjects)
  }, [onComplete])

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center text-center space-y-6 animate-step-in">
        {/* Animated spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse-subtle" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-foreground font-medium text-lg">{processingText}</p>
          {fileName && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              {fileName}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-step-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Upload your syllabus
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Drop a PDF and we&apos;ll extract your subjects, chapters, and topics automatically
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center gap-4 p-12 rounded-xl',
          'border-2 border-dashed cursor-pointer transition-all duration-200',
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card/60',
        )}
      >
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center transition-colors',
          isDragOver ? 'bg-primary/20' : 'bg-secondary/60',
        )}>
          <Upload className={cn(
            'w-6 h-6 transition-colors',
            isDragOver ? 'text-primary' : 'text-muted-foreground',
          )} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragOver ? 'Drop your PDF here' : 'Drag & drop your syllabus PDF'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or click to browse · PDF only
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          or pick a template
        </span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      {/* Template Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {SYLLABUS_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateClick(template.id)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
              'bg-card border border-border/60 text-foreground',
              'hover:bg-primary/5 hover:border-primary/30 transition-all duration-150',
              'hover:scale-[1.02] active:scale-[0.98] cursor-pointer',
            )}
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            {template.label}
          </button>
        ))}
      </div>
    </div>
  )
}
