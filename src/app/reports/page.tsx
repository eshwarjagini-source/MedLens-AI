'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  FileText,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Eye,
  Download,
  Calendar,
  User,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { Report } from '@/types/clinical';

export default function ReportsLibraryPage() {
  const [reports, setReports] = useState<Array<Report & { patientName?: string; labResultsCount?: number }>>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports');
      const json = await res.json();
      if (json.success) setReports(json.data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this medical report and its structured records?')) return;

    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setReports(reports.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch =
      r.reportType.toLowerCase().includes(search.toLowerCase()) ||
      r.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (r.patientName && r.patientName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || r.processingStatus === statusFilter;
    const matchesType = typeFilter === 'All' || r.reportType.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Medical Reports</h1>
            <p className="text-xs text-slate-400 mt-1">
              Centralized repository of clinical documents, laboratory panels, and extracted datasets
            </p>
          </div>

          <NextLink
            href="/reports/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-bold shadow-md shadow-cyan-500/20 transition-all active:scale-95 self-start sm:self-auto"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Medical Report</span>
          </NextLink>
        </div>

        {/* Filters and Search Bar (Section 15) */}
        <div className="p-3 rounded-2xl bg-[#0e111a] border border-white/5 glass-panel flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by title, patient, or file name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Type:
            </span>
            {['All', 'Blood', 'Lipid', 'Metabolic'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  typeFilter === t
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State (Section 23) */}
        {filteredReports.length === 0 && !loading ? (
          <div className="p-12 text-center rounded-2xl bg-[#0e111a] border border-dashed border-white/10 glass-panel space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">No medical reports uploaded yet.</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Upload laboratory results or clinical records to trigger instant automated structuring.
              </p>
            </div>
            <NextLink
              href="/reports/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Upload Report</span>
            </NextLink>
          </div>
        ) : (
          /* Reports Grid / Table */
          <div className="rounded-2xl bg-[#0e111a] border border-white/5 overflow-hidden glass-panel">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Report Title</th>
                    <th className="px-5 py-3.5 font-medium">Patient</th>
                    <th className="px-5 py-3.5 font-medium">Report Type</th>
                    <th className="px-5 py-3.5 font-medium">Date</th>
                    <th className="px-5 py-3.5 font-medium">Extracted Labs</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredReports.map(report => (
                    <tr
                      key={report.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <NextLink
                              href={`/reports/${report.id}`}
                              className="font-semibold text-white hover:text-cyan-400 transition-colors block text-sm"
                            >
                              {report.reportType}
                            </NextLink>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {report.fileName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <NextLink
                          href={`/patients/${report.patientId}`}
                          className="font-medium text-cyan-400 hover:underline flex items-center gap-1.5"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>{report.patientName}</span>
                        </NextLink>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-300">
                        {report.reportType}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-400 font-mono">
                        {report.reportDate}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono text-[11px]">
                          {report.labResultsCount || 6} tests
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Processed
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <NextLink
                            href={`/reports/${report.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="View Extraction"
                          >
                            <Eye className="w-4 h-4" />
                          </NextLink>
                          <button
                            onClick={e => handleDelete(report.id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                            title="Delete Report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
