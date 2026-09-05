'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Plus, Upload, Sparkles, RefreshCw, Activity, AlertCircle, Database, RotateCcw } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import StatCards from '@/components/dashboard/StatCards';
import RecentPatientsTable from '@/components/dashboard/RecentPatientsTable';
import RecentReportsList from '@/components/dashboard/RecentReportsList';
import AIActivityFeed from '@/components/dashboard/AIActivityFeed';
import { Patient, Report } from '@/types/clinical';

export default function DashboardPage() {
  const [data, setData] = useState<{
    stats: any;
    recentPatients: Patient[];
    recentReports: Array<Report & { patientName?: string }>;
    recentActivity: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (!confirm('Restore all records to the original demo patients (Eleanor Vance, Marcus Sterling, Dr. Sophia Ramirez)? This will clear any new patients or reports you have created.')) {
      return;
    }
    try {
      setResetting(true);
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_database' })
      });
      const json = await res.json();
      if (json.success) {
        await fetchDashboardData();
      } else {
        alert(json.error || 'Reset failed');
      }
    } catch (err) {
      console.error('Reset failed:', err);
      alert('A network error occurred while resetting the database.');
    } finally {
      setResetting(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Top Section (Section 4) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Clinical Information Overview
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
              Good morning, Dr. Chen
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Continuous intelligence synthesis across active patient files and laboratory reports.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Refresh clinical data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={handleReset}
              disabled={resetting || loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all hover:border-emerald-500/30 disabled:opacity-50"
              title="Restore demo data"
            >
              <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
              <span>{resetting ? 'Restoring...' : 'Reset Demo'}</span>
            </button>
            <NextLink
              href="/patients/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all hover:border-cyan-500/30"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>New Patient</span>
            </NextLink>
            <NextLink
              href="/reports/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-bold shadow-md shadow-cyan-500/20 transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Upload Report</span>
            </NextLink>
          </div>
        </div>

        {/* Demo Quick-Access Card */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-900/20 to-cyan-950/20 border border-amber-500/20 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              Demo Patient Quick-Access
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Jump straight to pre-loaded clinical records for your presentation.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <NextLink href="/patients/patient-1" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/30 transition-colors">Eleanor Vance</NextLink>
            <NextLink href="/patients/patient-2" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/30 transition-colors">Marcus Sterling</NextLink>
            <NextLink href="/patients/patient-3" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/30 transition-colors">Dr. S. Ramirez</NextLink>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        {data ? (
          <StatCards stats={data.stats} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-[#0e111a] animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        {/* Main Content Layout: Recent Patients + Lists */}
        {data && (
          <div className="space-y-8">
            {/* Recent Patients Table */}
            <RecentPatientsTable patients={data.recentPatients} />

            {/* Split Grid: Recent Reports & AI Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentReportsList reports={data.recentReports} />
              <AIActivityFeed activities={data.recentActivity} />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
