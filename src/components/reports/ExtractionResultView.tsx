'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileText,
  User,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Download,
  Share2
} from 'lucide-react';
import { ExtractionResult } from '@/lib/ai-engine';
import { LabStatus } from '@/types/clinical';

interface ExtractionResultViewProps {
  extraction: ExtractionResult;
  reportId?: string;
  patientId?: string;
  patientName?: string;
}

export default function ExtractionResultView({
  extraction,
  reportId,
  patientId,
  patientName
}: ExtractionResultViewProps) {
  const getStatusBadge = (status: LabStatus) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Normal
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            High
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Low
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            Critical
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Unknown
          </span>
        );
    }
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extraction, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Extraction_${extraction.reportType.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/50 via-[#0e111a] to-blue-950/40 border border-cyan-500/30 p-6 md:p-8 glass-panel space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Report Analysis Complete</h1>
                {extraction.isDemoMode && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Demo Engine
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Extracted and structured by <span className="text-slate-300 font-medium">{extraction.modelUsed}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={downloadJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            {patientId && (
              <NextLink
                href={`/patients/${patientId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <span>View Patient Record</span>
                <ArrowRight className="w-4 h-4" />
              </NextLink>
            )}
          </div>
        </div>

        {/* Quick Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[11px] text-slate-400">Report Type</span>
            <p className="text-xs font-bold text-white truncate mt-0.5">{extraction.reportType}</p>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[11px] text-slate-400">Patient Associated</span>
            <p className="text-xs font-bold text-cyan-400 truncate mt-0.5">{patientName || 'Clinical Patient'}</p>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[11px] text-slate-400">Values Extracted</span>
            <p className="text-xs font-bold text-white mt-0.5">{extraction.tests.length} tests</p>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[11px] text-slate-400">Abnormal Flags</span>
            <p className={`text-xs font-bold mt-0.5 ${extraction.abnormalValues.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {extraction.abnormalValues.length} identified
            </p>
          </div>
        </div>
      </div>

      {/* Extracted Laboratory Results Table (Section 10) */}
      <div className="rounded-2xl bg-[#0e111a] border border-white/5 overflow-hidden glass-panel">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Extracted Laboratory Results</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured laboratory test values and physiological reference boundaries
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            {extraction.tests.length} Analyzed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Test</th>
                <th className="px-5 py-3 font-medium">Result</th>
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="px-5 py-3 font-medium">Reference Range</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {extraction.tests.map((test, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-white">{test.name}</td>
                  <td className="px-5 py-3.5 font-mono text-sm font-bold text-white">
                    {test.value}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{test.unit}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-400">{test.referenceRange}</td>
                  <td className="px-5 py-3.5">{getStatusBadge(test.status)}</td>
                  <td className="px-5 py-3.5 text-slate-400 max-w-xs truncate">
                    {test.observation || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Clinical Summary (Section 11) */}
      <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 md:p-8 glass-panel space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Clinical Summary</h3>
            <p className="text-xs text-slate-400">Automated key findings and clinical summary from this report</p>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
          {extraction.summary}
        </p>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Key Findings from this Report:
          </h4>
          <div className="space-y-2">
            {extraction.keyFindings.map((finding, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Information Alerts */}
        {extraction.missingInformation && extraction.missingInformation.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Recommended Follow-Up & Missing Data:</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              {extraction.missingInformation.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mandatory Clinical Disclaimer */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400 italic">
          <strong>Clinical Disclaimer:</strong> AI-generated information is for informational and organizational purposes only and is not a medical diagnosis or a substitute for professional medical advice.
        </div>
      </div>
    </div>
  );
}
