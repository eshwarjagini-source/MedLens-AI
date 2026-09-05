'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NextLink from 'next/link';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ExtractionResultView from '@/components/reports/ExtractionResultView';
import { Report, Patient, LabResult, AIInsight } from '@/types/clinical';
import { ExtractionResult } from '@/lib/ai-engine';

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    report: Report;
    patient: Patient | null;
    labResults: LabResult[];
    insight: AIInsight | null;
  } | null>(null);

  const fetchReport = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/reports/${id}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Report not found');
      }
    } catch (err) {
      console.error('Failed to load report:', err);
      setError('Unable to load report details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  // Construct ExtractionResult format from stored report, labs, and insight
  const extractionData: ExtractionResult | null = data
    ? {
        reportType: data.report.reportType,
        reportDate: data.report.reportDate,
        doctorName: data.report.doctorName,
        laboratoryName: data.report.laboratoryName,
        tests: data.labResults.map(l => ({
          name: l.testName,
          value: l.value,
          unit: l.unit,
          referenceRange: l.referenceRange,
          status: l.status,
          observation: l.observation
        })),
        summary:
          data.insight?.summary ||
          `Medical laboratory extraction completed for ${data.report.reportType} with ${data.labResults.length} clinical parameters analyzed.`,
        keyFindings: data.insight?.keyFindings || [
          `${data.labResults.length} laboratory tests normalized against standard physiological intervals.`
        ],
        abnormalValues:
          data.insight?.abnormalValues ||
          data.labResults
            .filter(l => l.status === 'High' || l.status === 'Low' || l.status === 'Critical')
            .map(l => ({
              testName: l.testName,
              value: l.value,
              unit: l.unit,
              flag: l.status as any,
              referenceRange: l.referenceRange,
              clinicalSignificance: l.observation
            })),
        missingInformation: data.insight?.missingInformation || [],
        isDemoMode: true,
        modelUsed: 'MedLens Clinical Intelligence Engine'
      }
    : null;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <NextLink
            href="/reports"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Medical Reports</span>
          </NextLink>

          <button
            onClick={fetchReport}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
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
        ) : data && extractionData ? (
          <ExtractionResultView
            extraction={extractionData}
            reportId={data.report.id}
            patientId={data.patient?.id}
            patientName={data.patient?.name}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
