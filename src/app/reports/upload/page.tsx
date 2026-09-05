'use client';

import React, { Suspense } from 'react';
import NextLink from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ReportUploadZone from '@/components/reports/ReportUploadZone';

export default function ReportUploadPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <NextLink
          href="/reports"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Medical Reports</span>
        </NextLink>

        <Suspense fallback={<div className="h-96 rounded-2xl bg-[#0e111a] animate-pulse" />}>
          <ReportUploadZone />
        </Suspense>
      </div>
    </AppShell>
  );
}
