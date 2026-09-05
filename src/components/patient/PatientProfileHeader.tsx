'use client';

import React from 'react';
import NextLink from 'next/link';
import { Upload, FileDown, ShieldAlert, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { Patient, PatientStatus } from '@/types/clinical';

interface PatientProfileHeaderProps {
  patient: Patient;
  abnormalCount: number;
  reportCount: number;
}

export default function PatientProfileHeader({
  patient,
  abnormalCount,
  reportCount
}: PatientProfileHeaderProps) {
  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'Stable':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Stable Record
          </span>
        );
      case 'Needs Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Needs Review
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            Critical Alert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Active Record
          </span>
        );
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patient, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MedLens_${patient.name.replace(/\s+/g, '_')}_Record.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel relative overflow-hidden">
      {/* Background glow gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-cyan-500/20 shrink-0">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{patient.name}</h1>
              {getStatusBadge(patient.status)}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
              <span>{patient.age} years old</span>
              <span>•</span>
              <span>{patient.sex}</span>
              <span>•</span>
              <span className="font-semibold text-cyan-400">Blood Group: {patient.bloodGroup}</span>
              <span>•</span>
              <span>DOB: {patient.dateOfBirth}</span>
              <span>•</span>
              <span>ID: <span className="font-mono text-slate-300">{patient.id}</span></span>
            </div>

            {/* Micro clinical stats */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-300">
                Height: <strong className="text-white font-mono">{patient.height} cm</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-300">
                Weight: <strong className="text-white font-mono">{patient.weight} kg</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-300">
                Reports: <strong className="text-white font-mono">{reportCount}</strong>
              </span>
              {abnormalCount > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-medium">
                  {abnormalCount} Abnormal Lab Values
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-all"
          >
            <FileDown className="w-4 h-4 text-slate-400" />
            <span>Export Record</span>
          </button>
          <NextLink
            href={`/reports/upload?patientId=${patient.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-black shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Report</span>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
