'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import NextLink from 'next/link';
import { ArrowLeft, RefreshCw, AlertTriangle, FileDown } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PatientProfileHeader from '@/components/patient/PatientProfileHeader';
import StructuredRecordView from '@/components/patient/StructuredRecordView';
import { Patient, Medication, Report, LabResult, AIInsight, TimelineEvent } from '@/types/clinical';

export default function PatientProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const initialTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    patient: Patient;
    medications: Medication[];
    reports: Report[];
    labResults: LabResult[];
    insights: AIInsight[];
    timeline: TimelineEvent[];
  } | null>(null);

  const fetchPatientData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/patients/${id}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Patient record not found');
      }
    } catch (err) {
      console.error('Failed to load patient record:', err);
      setError('Unable to load clinical record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Demo Mode Banner */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-200">
            <strong className="font-semibold">Demo Mode:</strong> All patient records, lab results, and AI insights shown here are synthetic sample data created for demonstration purposes. No real patient information is displayed.
          </p>
        </div>

        {/* Top Back Nav */}
        <div className="flex items-center justify-between">
          <NextLink
            href="/patients"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Patients</span>
          </NextLink>

          <button
            onClick={fetchPatientData}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Refresh record"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Demo patient data</span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            title="Open browser print to save as PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export PDF</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && !data ? (
          <div className="space-y-6">
            <div className="h-44 rounded-2xl bg-[#0e111a] animate-pulse border border-white/5" />
            <div className="h-96 rounded-2xl bg-[#0e111a] animate-pulse border border-white/5" />
          </div>
        ) : data ? (
          <>
            <PatientProfileHeader
              patient={data.patient}
              abnormalCount={
                data.labResults.filter(
                  l => l.status === 'High' || l.status === 'Low' || l.status === 'Critical'
                ).length
              }
              reportCount={data.reports.length}
            />

            <StructuredRecordView
              patient={data.patient}
              medications={data.medications}
              reports={data.reports}
              labResults={data.labResults}
              insights={data.insights}
              timeline={data.timeline}
              initialTab={initialTab}
            />
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
