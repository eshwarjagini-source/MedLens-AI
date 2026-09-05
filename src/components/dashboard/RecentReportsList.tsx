'use client';

import React from 'react';
import NextLink from 'next/link';
import { FileText, ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Report } from '@/types/clinical';

interface RecentReportsListProps {
  reports: Array<Report & { patientName?: string }>;
}

export default function RecentReportsList({ reports }: RecentReportsListProps) {
  return (
    <div className="rounded-2xl bg-[#0e111a] border border-white/5 overflow-hidden glass-panel flex flex-col h-full">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Recent Reports</h3>
          <p className="text-xs text-slate-400 mt-0.5">Uploaded clinical documents</p>
        </div>
        <NextLink
          href="/reports"
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
        >
          View Library
          <ChevronRight className="w-3.5 h-3.5" />
        </NextLink>
      </div>

      <div className="divide-y divide-white/5 flex-1">
        {reports.map(report => (
          <NextLink
            key={report.id}
            href={`/reports/${report.id}`}
            className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group block"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors truncate">
                  {report.reportType}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  Patient: <span className="text-slate-300">{report.patientName}</span> • {report.reportDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Processed
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </NextLink>
        ))}

        {reports.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">
            No medical reports uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
