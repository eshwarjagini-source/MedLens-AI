'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Users,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Clock,
  Activity,
  AlertCircle,
  FileText
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { Patient, PatientStatus } from '@/types/clinical';

export default function PatientsDirectoryPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(json => {
        if (json.success) setPatients(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'Stable':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Stable
          </span>
        );
      case 'Needs Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Needs Review
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            Critical
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Processing
          </span>
        );
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.conditions.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
      p.bloodGroup.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Patient Directory</h1>
            <p className="text-xs text-slate-400 mt-1">
              Active centralized health records and longitudinal clinical files
            </p>
          </div>

          <NextLink
            href="/patients/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-bold shadow-md shadow-cyan-500/20 transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Patient Record</span>
          </NextLink>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 rounded-2xl bg-[#0e111a] border border-white/5 glass-panel flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, condition, or blood group..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/40"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['All', 'Stable', 'Needs Review', 'Critical'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  statusFilter === f
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Patients Table or Empty State (Section 23) */}
        {filteredPatients.length === 0 && !loading ? (
          <div className="p-12 text-center rounded-2xl bg-[#0e111a] border border-dashed border-white/10 glass-panel space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">No patients found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {search || statusFilter !== 'All'
                  ? 'No patient records match the selected filter criteria.'
                  : 'Create your first patient record to begin organizing clinical information.'}
              </p>
            </div>
            <NextLink
              href="/patients/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Create Patient</span>
            </NextLink>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#0e111a] border border-white/5 overflow-hidden glass-panel">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Patient Name</th>
                    <th className="px-5 py-3.5 font-medium">Demographics</th>
                    <th className="px-5 py-3.5 font-medium">Blood Group</th>
                    <th className="px-5 py-3.5 font-medium">Chronic Conditions</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPatients.map(p => (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-semibold text-white text-xs border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                            {p.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <NextLink
                              href={`/patients/${p.id}`}
                              className="font-medium text-white hover:text-cyan-400 transition-colors block text-sm"
                            >
                              {p.name}
                            </NextLink>
                            <span className="text-[11px] text-slate-500 font-mono">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-300">
                        {p.age} yrs • {p.sex} • {p.height}cm / {p.weight}kg
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                          {p.bloodGroup}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-sm">
                          {p.conditions.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300 text-[11px]"
                            >
                              {c}
                            </span>
                          ))}
                          {p.conditions.length === 0 && (
                            <span className="text-slate-500">None reported</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <NextLink
                          href={`/patients/${p.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-all font-medium"
                        >
                          <span>Open Record</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </NextLink>
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
