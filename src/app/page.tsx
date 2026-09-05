'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  ArrowRight,
  Upload,
  Plus,
  Activity,
  ShieldCheck,
  Sparkles,
  FileText,
  TrendingUp,
  Cpu,
  Layers,
  Heart
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Background Ambient Grid & Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Brand Navigation */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <NextLink href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wider text-white flex items-center gap-1.5">
              MEDLENS
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20">
                CLINICAL AI
              </span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-tight">Intelligence Platform</span>
          </div>
        </NextLink>

        <div className="flex items-center gap-3">
          <NextLink
            href="/dashboard"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
          >
            Launch Clinical Console
          </NextLink>
          <NextLink
            href="/reports/upload"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-black shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload Document</span>
          </NextLink>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        {/* Left Column: Bold Headline & Call to Action */}
        <div className="flex-1 max-w-2xl space-y-8 text-center lg:text-left">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Clinical Information Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Turn Medical Data Into{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Clinical Intelligence.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
            MedLens transforms patient information and medical reports into a structured, understandable, and reviewable health record.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <NextLink
              href="/patients/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/35 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Patient Record</span>
            </NextLink>

            <NextLink
              href="/reports/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#10131d] hover:bg-[#151a28] border border-cyan-500/30 text-white font-semibold text-sm transition-all hover:border-cyan-400/60 shadow-lg"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Medical Report</span>
            </NextLink>

            <NextLink
              href="/patients/patient-1"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <Activity className="w-4 h-4 stroke-[2.5]" />
              <span>Try Demo Patient</span>
            </NextLink>
          </div>

          {/* Value props strip */}
          <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HIPAA Compliant Data Model</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Continuous Neural Extraction</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Zero Hallucination Guardrails</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Representation of Medical Intelligence (Section 2) */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="relative mx-auto w-full max-w-md space-y-4">
            {/* Ambient Backlight */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-transparent rounded-3xl blur-2xl -z-10" />

            {/* Floating Card 1: Patient Profile & Status */}
            <div className="p-4 rounded-2xl bg-[#0e111a]/90 border border-white/10 shadow-2xl glass-panel transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-black text-xs">
                    EV
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Eleanor Vance</h3>
                    <p className="text-[10px] text-slate-400">62y • Female • Blood Group A+</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active Record
                </span>
              </div>
            </div>

            {/* Floating Card 2: Extracted Lab Results */}
            <div className="p-4 rounded-2xl bg-[#0e111a]/95 border border-cyan-500/30 shadow-2xl glass-panel space-y-2.5 transform translate-x-2 hover:translate-x-0 transition-transform duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CBC & Metabolic Intelligence</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                  AI Processed
                </span>
              </div>

              {/* Lab Values */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div>
                    <span className="text-slate-200 font-medium">Hemoglobin</span>
                    <p className="text-[10px] text-slate-400">Ref: 13.0 - 17.0 g/dL</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white">13.8 g/dL</span>
                    <span className="block text-[10px] text-emerald-400">Normal</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div>
                    <span className="text-slate-200 font-medium">White Blood Cells (WBC)</span>
                    <p className="text-[10px] text-slate-400">Ref: 4,000 - 11,000 /µL</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400">12,400 /µL</span>
                    <span className="block text-[10px] text-amber-400">High Flag</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div>
                    <span className="text-slate-200 font-medium">Platelets</span>
                    <p className="text-[10px] text-slate-400">Ref: 150k - 450k /µL</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white">250,000 /µL</span>
                    <span className="block text-[10px] text-emerald-400">Normal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 3: AI Processing Indicator */}
            <div className="p-3.5 rounded-2xl bg-[#0e111a]/90 border border-white/10 shadow-2xl glass-panel flex items-center justify-between transform -translate-x-2 hover:translate-x-0 transition-transform duration-300">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Neural Extraction Pipeline</p>
                  <p className="text-[10px] text-slate-400">Non-diagnostic clinical structuring</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                100% Validated
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 px-6 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© 2026 MedLens Clinical Technologies. All rights reserved.</p>
        <p className="italic text-[11px]">
          Designed for clinical intelligence, record structuring, and longitudinal trend visibility.
        </p>
      </footer>

      {/* AI Disclaimer */}
      <div className="mt-6 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/30 text-slate-400 text-xs leading-relaxed max-w-2xl mx-auto">
        <strong>Clinical Disclaimer:</strong> MedLens is an information organization and clinical review support tool. It does not provide medical diagnosis or treatment and should not replace advice from a qualified healthcare professional. AI-generated summaries and insights are for organizational purposes only and are based on provided clinical data and standard reference ranges. Always consult a licensed healthcare provider for medical concerns.
      </div>
    </div>
  );
}
