"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight01Icon, Tick02Icon, AiNetworkIcon, Zap01Icon, Building03Icon } from "hugeicons-react";

const plans = [
  {
    name: "Free",
    icon: Brain,
    description: "For students getting started",
    price: { monthly: 0, annual: 0 },
    features: [
      "Unlimited subjects",
      "AI Planner with memory",
      "5 adaptive tests/month",
      "Basic Hindsight memory",
      "Community support",
    ],
    cta: "Start free",
    ctaHref: "/login",
    popular: false,
  },
  {
    name: "Pro",
    icon: Zap,
    description: "For serious exam prep",
    price: { monthly: 9, annual: 7 },
    features: [
      "Everything in Free",
      "Unlimited adaptive tests",
      "Full Hindsight memory (4 types)",
      "PDF syllabus upload",
      "AI Mentor per subject",
      "Priority AI response",
      "Deep memory insights",
    ],
    cta: "Start trial",
    ctaHref: "/login",
    popular: true,
  },
  {
    name: "Institution",
    icon: Building,
    description: "For colleges and coaching centres",
    price: { monthly: null, annual: null },
    features: [
      "Everything in Pro",
      "Multi-student tracking",
      "Teacher dashboard",
      "Custom syllabus upload",
      "Bulk onboarding",
      "SLA support",
      "Custom integrations",
      "Analytics export",
    ],
    cta: "Contact us",
    ctaHref: "#",
    popular: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-32 lg:py-40 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6">
            Pricing
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-6">
            Simple pricing.
            <br />
            <span className="text-stroke">No surprises.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Start free and unlock more as your exam season heats up. Every plan includes Hindsight memory.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center gap-4 mb-16">
          <span
            className={`text-sm transition-colors ${
              !isAnnual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 bg-foreground/10 rounded-full p-1 transition-colors hover:bg-foreground/20"
            aria-label="Toggle billing period"
          >
            <div
              className={`w-5 h-5 bg-primary rounded-full transition-transform duration-300 ${
                isAnnual ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm transition-colors ${
              isAnnual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-mono rounded-full">
              Save 22%
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative p-8 lg:p-12 bg-background ${
                  plan.popular ? "md:-my-4 md:py-12 lg:py-16 border-2 border-primary" : ""
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-8 px-3 py-1 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest rounded-full">
                    Most Popular
                  </span>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Icon className={`h-4 w-4 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="font-display text-3xl text-foreground mt-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8 pb-8 border-b border-foreground/10">
                  {plan.price.monthly !== null ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-5xl lg:text-6xl text-foreground">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  ) : (
                    <span className="font-display text-4xl text-foreground">Custom</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-primary" : "text-foreground"}`} />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={plan.ctaHref}>
                  <button
                    className={`w-full py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all group rounded-lg ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-foreground/20 text-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          All plans include Hindsight memory, adaptive scheduling, and subject-aware AI.{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Compare all features
          </a>
        </p>
      </div>
    </section>
  );
}
