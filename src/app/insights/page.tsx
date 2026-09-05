'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Sparkles,
  Activity,
  AlertTriangle,
  TrendingUp,
  FileQuestion,
  User,
  CheckCircle2,
  Filter,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import LabTrendCharts from '@/components/insights/LabTrendCharts';

export default function InsightsPage() {
  const [data, setData] = useState<{
    insights: any[];
    abnormalValues: any[];
    trends: any[];
    missingInformation: any[];
    stats: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'High' | 'Low'>('All');

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/insights');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const filteredAbnormalValues = data?.abnormalValues.filter(ab => {
    if (severityFilter === 'All') return true;
    return ab.status === severityFilter;
  }) || [];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Clinical Intelligence Center
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
              AI Clinical Insights & Trend Analytics
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Cross-patient algorithmic surveillance, longitudinal biomarker trajectories, and data audit
            </p>
          </div>

          <button
            onClick={fetchInsights}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Section 13: Lab Trend Visualization Charts */}
        {data && data.trends && (
          <LabTrendCharts trends={data.trends} />
        )}

        {/* Section 12: Split Grid for Key Findings & Abnormal Values */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Findings Across Patients */}
            <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel space-y-4 flex flex-col">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Synthesized Key Findings</h3>
                  <p className="text-xs text-slate-400">High-yield clinical observations extracted across records</p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {data.insights.flatMap(i => i.keyFindings.slice(0, 2)).map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <p className="text-xs text-slate-300 leading-relaxed">{finding}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Abnormal Values Table / List */}
            <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel space-y-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Flagged Abnormal Values</h3>
                    <p className="text-xs text-slate-400">Out-of-range physiological parameters</p>
                  </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
                  {(['All', 'Critical', 'High', 'Low'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSeverityFilter(s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                        severityFilter === s
                          ? 'bg-cyan-500 text-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 flex-1">
                {filteredAbnormalValues.map(ab => (
                  <div
                    key={ab.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs truncate">{ab.testName}</span>
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded font-mono ${
                            ab.status === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ab.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        Patient: <NextLink href={`/patients/${ab.patientId}`} className="text-cyan-400 hover:underline">{ab.patientName}</NextLink> • {ab.date}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-xs text-white">
                        {ab.value} {ab.unit}
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono">Ref: {ab.referenceRange}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 12: Missing Information Audit Cards */}
        {data && data.missingInformation && (
          <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FileQuestion className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Clinical Completeness & Missing Information Audit</h3>
                <p className="text-xs text-slate-400">
                  Data points absent from patient records that are recommended by clinical practice guidelines
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.missingInformation.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Information Gap
                      </span>
                      <NextLink
                        href={`/patients/${item.patientId}`}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>{item.patientName}</span>
                        <ArrowRight className="w-3 h-3" />
                      </NextLink>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {item.item}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-3 block">
                    Flagged by Clinical Intelligence Auditor
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regulatory / Diagnostic Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-400 italic">
          <strong>Clinical Disclaimer:</strong> AI-generated information is for informational and organizational purposes only and is not a medical diagnosis or a substitute for professional medical advice.
        </div>
      </div>
    </AppShell>
  );
}
