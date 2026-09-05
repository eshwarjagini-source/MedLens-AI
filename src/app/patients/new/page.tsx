'use client';

import React from 'react';
import NextLink from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PatientFormWizard from '@/components/patient/PatientFormWizard';

export default function NewPatientPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <NextLink
          href="/patients"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patient Directory</span>
        </NextLink>

        <PatientFormWizard />
      </div>
    </AppShell>
  );
}
