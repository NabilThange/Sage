"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight01Icon, AiNetworkIcon, AiStar01Icon, Zap01Icon } from "hugeicons-react";
import { AnimatedSphere } from "./animated-sphere";

const words = ["remembers", "adapts", "grows", "learns"];

const MEMORY_TYPES = [
  { label: "World Knowledge", color: "text-primary", dot: "bg-primary" },
  { label: "Your Experiences", color: "text-violet-400", dot: "bg-violet-400" },
  { label: "Observations", color: "text-amber-400", dot: "bg-amber-400" },
  { label: "AI Opinions", color: "text-green-400", dot: "bg-green-400" },
];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [memoryIndex, setMemoryIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryIndex((prev) => (prev + 1) % MEMORY_TYPES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const currentMemory = MEMORY_TYPES[memoryIndex];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Animated sphere background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] opacity-30 pointer-events-none">
        <AnimatedSphere />
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-warning/5 blur-3xl" />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{ top: `${12.5 * (i + 1)}%`, left: 0, right: 0 }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{ left: `${8.33 * (i + 1)}%`, top: 0, bottom: 0 }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        {/* Eyebrow */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            The AI tutor that never forgets
          </span>
        </div>
        
        {/* Main headline */}
        <div className="mb-12">
          <h1 
            className={`text-[clamp(3rem,10vw,8rem)] font-display leading-[0.9] tracking-tight transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block">The tutor that</span>
            <span className="block">
              always{" "}
              <span className="relative inline-block">
                <span 
                  key={wordIndex}
                  className="inline-flex text-primary"
                >
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/10" />
              </span>
            </span>
          </h1>
        </div>
        
        {/* Description + CTAs */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
          <p 
            className={`text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Recallio uses AI with{" "}
            <span className="text-foreground font-medium">hindsight memory</span>{" "}to remember your learning journey, 
            plan your schedule, and get smarter every session.
          </p>
          
          {/* CTAs */}
          <div 
            className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link href="/login">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 text-base rounded-full group"
              >
                Start learning free
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
              >
                See how it works
              </Button>
            </Link>
          </div>
        </div>

        {/* Hindsight Memory badge */}
        <div 
          className={`mt-16 transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-4 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl px-5 py-3">
            <Brain className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm text-muted-foreground font-mono">
              Powered by Hindsight Memory —
            </span>
            <span className={`text-sm font-semibold transition-colors duration-500 ${currentMemory.color}`}>
              {currentMemory.label}
            </span>
            <span className={`flex h-2 w-2 relative`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentMemory.dot} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${currentMemory.dot}`} />
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats marquee */}
      <div 
        className={`absolute bottom-24 left-0 right-0 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-16 marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16">
              {[
                { value: "4", label: "memory types", desc: "HINDSIGHT" },
                { value: "2×", label: "faster recall", desc: "PROVEN" },
                { value: "∞", label: "subject coverage", desc: "ADAPTIVE" },
                { value: "100%", label: "personalised", desc: "AI-FIRST" },
              ].map((stat) => (
                <div key={`${stat.desc}-${i}`} className="flex items-baseline gap-4">
                  <span className="text-4xl lg:text-5xl font-display text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                    <span className="block font-mono text-xs mt-1 text-primary/70">{stat.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
