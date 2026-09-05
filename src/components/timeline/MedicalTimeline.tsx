'use client';

import React from 'react';
import { FileSpreadsheet, Pill, Activity, Stethoscope, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { TimelineEvent } from '@/types/clinical';

interface MedicalTimelineProps {
  events: TimelineEvent[];
}

export default function MedicalTimeline({ events }: MedicalTimelineProps) {
  const getCategoryIcon = (cat: string, severity?: string) => {
    if (severity === 'Critical') {
      return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
    switch (cat) {
      case 'Report':
        return <FileSpreadsheet className="w-4 h-4 text-cyan-400" />;
      case 'Medication':
        return <Pill className="w-4 h-4 text-purple-400" />;
      case 'Diagnosis':
        return <Activity className="w-4 h-4 text-amber-400" />;
      case 'Surgery':
        return <Stethoscope className="w-4 h-4 text-rose-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getSeverityBadge = (severity?: string) => {
    if (severity === 'Critical') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          Critical
        </span>
      );
    }
    if (severity === 'Warning') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Attention
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white/5 text-slate-400 border border-white/5">
        Routine
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 md:p-8 glass-panel space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white">Chronological Medical Timeline</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Unified clinical events trace: document uploads, therapeutic adjustments, and diagnostic flags
        </p>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500/30 before:to-transparent">
        {events.map((event, idx) => (
          <div key={`${event.id}-${idx}`} className="relative group">
            {/* Timeline Pin Node */}
            <div className="absolute -left-[27px] top-1.5 w-6 h-6 rounded-xl bg-[#10131d] border border-cyan-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-cyan-400 transition-all">
              {getCategoryIcon(event.category, event.severity)}
            </div>

            {/* Event Card */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group-hover:translate-x-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">{event.title}</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    {event.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(event.severity)}
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.date}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                {event.description}
              </p>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            No chronological timeline events logged for this patient yet.
          </div>
        )}
      </div>
    </div>
  );
}
