'use client';

import React from 'react';
import NextLink from 'next/link';
import { Sparkles, Activity, FileSpreadsheet, Pill, AlertTriangle, ArrowRight } from 'lucide-react';

interface ActivityItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  severity?: string;
  patientName: string;
}

interface AIActivityFeedProps {
  activities: ActivityItem[];
}

export default function AIActivityFeed({ activities }: AIActivityFeedProps) {
  const getActivityIcon = (category: string, severity?: string) => {
    if (severity === 'Critical') {
      return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
    switch (category) {
      case 'Report':
        return <FileSpreadsheet className="w-4 h-4 text-cyan-400" />;
      case 'Medication':
        return <Pill className="w-4 h-4 text-purple-400" />;
      case 'Diagnosis':
        return <Activity className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-[#0e111a] border border-white/5 overflow-hidden glass-panel flex flex-col h-full">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">AI Activity</h3>
            <p className="text-xs text-slate-400">Continuous clinical parsing log</p>
          </div>
        </div>
        <NextLink
          href="/insights"
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
        >
          Insights
          <ArrowRight className="w-3.5 h-3.5" />
        </NextLink>
      </div>

      <div className="p-5 space-y-4 flex-1">
        {activities.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-start gap-3 relative group">
            {idx !== activities.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-white/5" />
            )}
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/30 transition-colors z-10">
              {getActivityIcon(item.category, item.severity)}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{item.date}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                  {item.patientName}
                </span>
                {item.severity === 'Critical' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    High Alert
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
