"use client";

import { useEffect, useRef, useState } from "react";
import { AiNetworkIcon, Calendar03Icon, MortarboardIcon, Task01Icon, AiStar01Icon, Zap01Icon } from "hugeicons-react";

const features = [
  {
    number: "01",
    icon: Brain,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Hindsight Memory",
    description: "Recallio remembers every quiz, every struggle, every breakthrough. Four memory types — World, Experiences, Observations, Opinions — build a complete picture of your learning.",
    visual: "memory",
  },
  {
    number: "02",
    icon: Calendar,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-400/10",
    title: "AI-Powered Planner",
    description: "Tell it your exams. It builds your schedule. Every morning, a personalised briefing knows what you left off, what's coming, and what you're weakest at.",
    visual: "planner",
  },
  {
    number: "03",
    icon: GraduationCap,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-400/10",
    title: "Subject Mentor",
    description: "Upload your syllabus. The AI tutor focuses only on your topics, generates flashcards from your notes, and quizzes your exact weak spots.",
    visual: "mentor",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    iconColor: "text-green-400",
    iconBg: "bg-green-400/10",
    title: "Adaptive Tests",
    description: "MCQ tests that target specifically what you struggle with, not what you already know. Performance is tracked and fed back into memory after every session.",
    visual: "tests",
  },
];

function MemoryVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <circle cx="100" cy="80" r="14" fill="currentColor">
        <animate attributeName="r" values="14;16;14" dur="2s" repeatCount="indefinite" />
      </circle>
      {["World", "Exp", "Obs", "Op"].map((_, i) => {
        const angle = (i * 90) * (Math.PI / 180);
        const radius = 52;
        return (
          <g key={i}>
            <line
              x1="100" y1="80"
              x2={100 + Math.cos(angle) * radius}
              y2={80 + Math.sin(angle) * radius}
              stroke="currentColor" strokeWidth="1.5" opacity="0.3"
            >
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </line>
            <circle
              cx={100 + Math.cos(angle) * radius}
              cy={80 + Math.sin(angle) * radius}
              r="8" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <animate attributeName="r" values="8;10;8" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      <circle cx="100" cy="80" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
        <animate attributeName="r" values="20;70" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function PlannerVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <rect x="20" y="20" width="160" height="120" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="50" x2="180" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {[0,1,2,3,4,5,6].map(i => (
        <text key={i} x={28 + i * 22} y="42" fontSize="9" fill="currentColor" opacity="0.5" textAnchor="middle">{["M","T","W","T","F","S","S"][i]}</text>
      ))}
      {[
        {x: 28, y: 60, w: 40, c: "0.8"}, {x: 72, y: 60, w: 20, c: "0.4"},
        {x: 28, y: 80, w: 20, c: "0.4"}, {x: 116, y: 80, w: 60, c: "0.8"},
        {x: 50, y: 100, w: 40, c: "0.6"}, {x: 94, y: 100, w: 30, c: "0.4"},
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height="12" rx="3" fill="currentColor" opacity={b.c}>
          <animate attributeName="opacity" values={`${b.c};${Number(b.c)*0.5};${b.c}`} dur="3s" begin={`${i*0.3}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </svg>
  );
}

function MentorVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <rect x="30" y="20" width="140" height="90" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <rect x="40" y={35 + i * 15} width={60 + Math.random() * 40} height="8" rx="2" fill="currentColor" opacity="0.2">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2s" begin={`${i*0.2}s`} repeatCount="indefinite" />
            <animate attributeName="width" values={`${60};${80 + i*10};${60}`} dur="2s" begin={`${i*0.2}s`} repeatCount="indefinite" />
          </rect>
        </g>
      ))}
      <circle cx="100" cy="135" r="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <circle cx="100" cy="135" r="8" fill="currentColor" opacity="0.7">
        <animate attributeName="r" values="8;10;8" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function TestsVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="30" y={20 + i * 34} width="140" height="28" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <circle cx="48" cy={34 + i * 34} r="6" fill={i === 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            {i === 0 && <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite" />}
          </circle>
          <rect x="62" y={29 + i * 34} width={40 + i * 15} height="6" rx="2" fill="currentColor" opacity="0.3" />
          {i === 0 && (
            <text x="158" y={38 + i * 34} fontSize="10" fill="currentColor" opacity="0.6" textAnchor="middle">✓</text>
          )}
        </g>
      ))}
    </svg>
  );
}

function AnimatedVisual({ type }: { type: string }) {
  switch (type) {
    case "memory": return <MemoryVisual />;
    case "planner": return <PlannerVisual />;
    case "mentor": return <MentorVisual />;
    case "tests": return <TestsVisual />;
    default: return <MemoryVisual />;
  }
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = feature.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-20 border-b border-foreground/10">
        {/* Number + Icon */}
        <div className="shrink-0 flex items-center gap-3 lg:flex-col lg:items-start">
          <span className="font-mono text-sm text-muted-foreground">{feature.number}</span>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg}`}>
            <Icon className={`h-5 w-5 ${feature.iconColor}`} />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl lg:text-4xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">
              {feature.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
          
          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className={`w-48 h-40 ${feature.iconColor}`}>
              <AnimatedVisual type={feature.visual} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            What makes Recallio different
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Built around hindsight.
            <br />
            <span className="text-muted-foreground">Not just hints.</span>
          </h2>
        </div>

        {/* Features List */}
        <div>
          {features.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
