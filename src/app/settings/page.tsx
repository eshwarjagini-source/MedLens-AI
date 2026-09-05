'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Cpu,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Key,
  Server
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

export default function SettingsPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json.success) setStatus(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleReset = async () => {
    if (!confirm('This will restore all records to the original 3 realistic demo patients (Eleanor Vance, Marcus Sterling, Dr. Sophia Ramirez). Continue?')) {
      return;
    }

    try {
      setResetting(true);
      setMessage(null);
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_database' })
      });
      const json = await res.json();
      if (json.success) {
        setMessage('Clinical database has been reset to factory demo patients.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to reset database.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure MedLens clinical AI pipelines, database persistence, and regulatory guardrails
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* AI Engine Status Card */}
        <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Intelligence Engine</h3>
              <p className="text-xs text-slate-400">Clinical natural language processing & document vision</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-slate-400">Active Operational Mode</span>
              <p className="text-sm font-semibold text-white">
                {status?.mode || 'Intelligent Clinical Demo Engine'}
              </p>
              <p className="text-[11px] text-slate-500">
                {status?.hasApiKey ? 'OpenAI GPT-4o Vision API key detected' : 'Realistic zero-dependency clinical simulation active'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-slate-400">Environment API Key</span>
              <p className="text-sm font-mono text-cyan-400 font-semibold">
                {status?.hasApiKey ? 'CONFIGURED (Active)' : 'NOT DETECTED (Using Demo Mode)'}
              </p>
              <p className="text-[11px] text-slate-500">
                Set OPENAI_API_KEY to activate cloud LLM vision
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Compliance Card */}
        <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Security & Regulatory Architecture</h3>
              <p className="text-xs text-slate-400">HIPAA, SOC-2, and sensitive health information safeguard controls</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Non-Diagnostic Guardrail</p>
                <p className="text-[11px] text-slate-400">Enforces clinical disclaimer & organizational summaries only</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                ENFORCED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Local Relational Database Persistence</p>
                <p className="text-[11px] text-slate-400">Encrypted atomic storage at data/medlens-db.json</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Database & Demo Management */}
        <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 glass-panel space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Demo Data & Record Management</h3>
              <p className="text-xs text-slate-400">Reset patient records or restore seeded scenarios</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Restore Standard Clinical Demo Dataset</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Restores Eleanor Vance, Marcus Sterling, and Dr. Sophia Ramirez with full test histories and charts.
              </p>
            </div>

            <button
              onClick={handleReset}
              disabled={resetting}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all shrink-0 active:scale-95"
            >
              {resetting ? 'Resetting...' : 'Reset to Demo Data'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
