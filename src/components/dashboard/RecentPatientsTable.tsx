'use client';

import React from 'react';
import NextLink from 'next/link';
import { ChevronRight, User, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Patient, PatientStatus } from '@/types/clinical';

interface RecentPatientsTableProps {
  patients: Patient[];
}

export default function RecentPatientsTable({ patients }: RecentPatientsTableProps) {
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
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-spin" />
            Processing
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="rounded-2xl bg-[#0e111a] border border-white/5 overflow-hidden glass-panel">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Recent Patients</h3>
          <p className="text-xs text-slate-400 mt-0.5">Actively monitored clinical records</p>
        </div>
        <NextLink
          href="/patients"
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
        >
          View All Patients
          <ChevronRight className="w-3.5 h-3.5" />
        </NextLink>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Demographics</th>
              <th className="px-5 py-3 font-medium">Conditions</th>
              <th className="px-5 py-3 font-medium">Last Updated</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {patients.map(patient => (
              <tr
                key={patient.id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-semibold text-white text-xs border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <NextLink
                        href={`/patients/${patient.id}`}
                        className="font-medium text-white hover:text-cyan-400 transition-colors block"
                      >
                        {patient.name}
                      </NextLink>
                      <span className="text-xs text-slate-400 font-mono">ID: {patient.id.slice(-6)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-300">
                  <span>{patient.age} yrs</span> • <span>{patient.sex}</span> • <span className="font-semibold text-cyan-400">{patient.bloodGroup}</span>
                </td>
                <td className="px-5 py-4 text-xs">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {patient.conditions.slice(0, 2).map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300 text-[11px] truncate"
                      >
                        {c}
                      </span>
                    ))}
                    {patient.conditions.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400">
                        +{patient.conditions.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDate(patient.updatedAt)}</span>
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {getStatusBadge(patient.status)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right text-xs">
                  <NextLink
                    href={`/patients/${patient.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-all"
                  >
                    <span>Record</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </NextLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
