'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  FileText,
  Activity,
  Pill,
  History,
  Sparkles,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import {
  Patient,
  Medication,
  Report,
  LabResult,
  AIInsight,
  TimelineEvent,
  LabStatus
} from '@/types/clinical';
import MedicalTimeline from '../timeline/MedicalTimeline';

interface StructuredRecordViewProps {
  patient: Patient;
  medications: Medication[];
  reports: Report[];
  labResults: LabResult[];
  insights: AIInsight[];
  timeline: TimelineEvent[];
  initialTab?: string;
}

export default function StructuredRecordView({
  patient,
  medications,
  reports,
  labResults,
  insights,
  timeline,
  initialTab = 'overview'
}: StructuredRecordViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [labFilter, setLabFilter] = useState<'All' | 'Abnormal'>('All');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileCheck },
    { id: 'history', label: 'Medical History', icon: History },
    { id: 'labs', label: `Lab Results (${labResults.length})`, icon: Activity },
    { id: 'medications', label: `Medications (${medications.length})`, icon: Pill },
    { id: 'reports', label: `Reports (${reports.length})`, icon: FileText },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  const getLabStatusPill = (status: LabStatus) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Normal
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            High
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Low
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            Critical
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Unknown
          </span>
        );
    }
  };

  const filteredLabs = labResults.filter(l => {
    if (labFilter === 'Abnormal') {
      return l.status === 'High' || l.status === 'Low' || l.status === 'Critical';
    }
    return true;
  });

  const latestInsight = insights[0];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#0b0e16] border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Section 7: Patient Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vitals & Summary Card */}
            <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/5 glass-panel">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Clinical Parameters
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-400 text-xs">Chronological Age</span>
                  <span className="font-semibold text-white">{patient.age} yrs</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-400 text-xs">Assigned Sex</span>
                  <span className="font-semibold text-white">{patient.sex}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-400 text-xs">Blood Group</span>
                  <span className="font-semibold text-cyan-400 font-mono">{patient.bloodGroup}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-400 text-xs">Body Mass Index</span>
                  <span className="font-semibold text-white font-mono">
                    {(patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)} kg/m²
                  </span>
                </div>
              </div>
            </div>

            {/* Active Conditions */}
            <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/5 glass-panel">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Active Diagnoses
              </h3>
              <div className="space-y-2">
                {patient.conditions.map((cond, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center justify-between"
                  >
                    <span>{cond}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
                      Active
                    </span>
                  </div>
                ))}
                {patient.conditions.length === 0 && (
                  <p className="text-xs text-slate-500">No active chronic conditions noted.</p>
                )}
              </div>
            </div>

            {/* Critical Allergies Box (PROMINENT WARNING STYLING) */}
            <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/30 glass-panel">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                  Critical Allergies & Alerts
                </h3>
              </div>
              <div className="space-y-2">
                {patient.allergies.map((allg, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-center gap-2"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{allg}</span>
                  </div>
                ))}
                {patient.allergies.length === 0 && (
                  <p className="text-xs text-slate-400">NKDA (No Known Drug Allergies)</p>
                )}
              </div>
            </div>
          </div>

          {/* AI Clinical Summary Banner (Section 11) */}
          {latestInsight && (
            <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0e111a] to-blue-950/30 border border-cyan-500/20 p-6 glass-panel space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">AI Clinical Summary</h3>
                    <p className="text-xs text-cyan-400/80">Key findings synthesized from latest uploaded records</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Sample Data — 24 Lab Values
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                  Synthesized {latestInsight.createdAt.split('T')[0]}
                </span>
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {latestInsight.summary}
              </p>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-xs font-semibold text-white">Key Findings from Document:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {latestInsight.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 italic">
                <strong>Clinical Disclaimer:</strong> AI-generated information is for informational and organizational purposes only and is not a medical diagnosis or a substitute for professional medical advice.
              </div>
            </div>
          )}

          {/* Quick Medications Table Preview */}
          <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-purple-400" />
                Current Active Medications
              </h3>
              <button
                onClick={() => setActiveTab('medications')}
                className="text-xs font-medium text-cyan-400 hover:underline"
              >
                View Full Regimen →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/5 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Medication</th>
                    <th className="px-4 py-2.5 font-medium">Dosage</th>
                    <th className="px-4 py-2.5 font-medium">Frequency</th>
                    <th className="px-4 py-2.5 font-medium">Started</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {medications.map(med => (
                    <tr key={med.id}>
                      <td className="px-4 py-3 font-medium text-white">{med.name}</td>
                      <td className="px-4 py-3">{med.dosage}</td>
                      <td className="px-4 py-3">{med.frequency}</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{med.startDate}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {med.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MEDICAL HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel">
            <h3 className="text-base font-semibold text-white mb-2">Chronological Medical History</h3>
            <p className="text-xs text-slate-400 mb-6">
              Longitudinal progression of diagnostic events, surgeries, and clinical interventions.
            </p>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {patient.medicalHistory.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 ring-4 ring-[#0e111a]" />
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold mb-1">
                      {item.year}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{item.event}</h4>
                    {item.type && (
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                        Category: {item.type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surgical History */}
          {patient.surgicalHistory.length > 0 && (
            <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel">
              <h3 className="text-base font-semibold text-white mb-4">Past Surgical Interventions</h3>
              <div className="space-y-2">
                {patient.surgicalHistory.map((surg, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{surg.procedure}</p>
                      {surg.hospital && <p className="text-[11px] text-slate-400">{surg.hospital}</p>}
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">{surg.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: LAB RESULTS */}
      {activeTab === 'labs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-[#0e111a] border border-white/5 overflow-hidden glass-panel">
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">Extracted Laboratory Results</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Normalized laboratory tests with reference range evaluation
                </p>
              </div>

              {/* Lab Filter */}
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                {(['All', 'Abnormal'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setLabFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      labFilter === f
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f} Results
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Test Name</th>
                    <th className="px-5 py-3 font-medium">Result</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium">Reference Range</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Observation</th>
                    <th className="px-5 py-3 font-medium">Test Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLabs.map(lab => (
                    <tr key={lab.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-white">{lab.testName}</td>
                      <td className="px-5 py-3.5 font-mono text-sm font-bold text-white">
                        {lab.value}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{lab.unit}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">{lab.referenceRange}</td>
                      <td className="px-5 py-3.5">{getLabStatusPill(lab.status)}</td>
                      <td className="px-5 py-3.5 text-slate-400 max-w-xs truncate">{lab.observation || '—'}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">{lab.testDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MEDICATIONS */}
      {activeTab === 'medications' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel space-y-4">
            <h3 className="text-base font-semibold text-white">Medication Regimen</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/5 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-medium">Medication</th>
                    <th className="px-5 py-3 font-medium">Dosage</th>
                    <th className="px-5 py-3 font-medium">Frequency</th>
                    <th className="px-5 py-3 font-medium">Start Date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {medications.map(med => (
                    <tr key={med.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                        <Pill className="w-3.5 h-3.5 text-purple-400" />
                        {med.name}
                      </td>
                      <td className="px-5 py-3.5 font-mono">{med.dosage}</td>
                      <td className="px-5 py-3.5">{med.frequency}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">{med.startDate}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {med.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Attached Medical Reports</h3>
            <NextLink
              href={`/reports/upload?patientId=${patient.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all"
            >
              Upload Report
            </NextLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(rep => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-[#0e111a] border border-white/5 hover:border-cyan-500/30 transition-all glass-panel group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {rep.reportType}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{rep.fileName}</p>
                      <p className="text-[11px] text-slate-500 mt-2 font-mono">Date: {rep.reportDate}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {rep.processingStatus}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{rep.laboratoryName || 'Clinical Lab'}</span>
                  <NextLink
                    href={`/reports/${rep.id}`}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    View Extraction
                    <ChevronRight className="w-3.5 h-3.5" />
                  </NextLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI INSIGHTS */}
      {activeTab === 'insights' && latestInsight && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/5 glass-panel space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Clinical Synthesis</h3>
                <p className="text-xs text-slate-400">Deep structured overview of all extracted tests and observations</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
              {latestInsight.summary}
            </p>

            {/* Abnormal Values Table */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Identified Abnormal Values
              </h4>
              <div className="space-y-2">
                {latestInsight.abnormalValues.map((ab, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs">{ab.testName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            ab.flag === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ab.flag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{ab.clinicalSignificance}</p>
                    </div>
                    <div className="text-right sm:shrink-0">
                      <span className="text-sm font-bold font-mono text-white">
                        {ab.value} {ab.unit}
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono">Ref: {ab.referenceRange}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Information Alerts */}
            {latestInsight.missingInformation.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Missing Clinical Information & Follow-Up Recommendations</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {latestInsight.missingInformation.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <MedicalTimeline events={timeline} />
        </div>
      )}
    </div>
  );
}
