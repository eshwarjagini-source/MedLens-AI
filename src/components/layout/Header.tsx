'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  Search,
  Plus,
  Upload,
  Menu,
  Bell,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
}

export default function Header({ onOpenMobileNav, onOpenSearch }: HeaderProps) {
  const [role, setRole] = useState<'Attending Physician' | 'Chief Medical Officer' | 'Clinical Fellow'>('Attending Physician');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#08090d]/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Global Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-slate-200 text-xs md:text-sm transition-all group shadow-inner"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="truncate">Search patients, tests, medications...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-white/10 rounded border border-white/10">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions & Clinical Role */}
      <div className="flex items-center gap-2.5">
        {/* Quick Actions */}
        <NextLink
          href="/patients/new"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all hover:border-cyan-500/30"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>New Patient</span>
        </NextLink>

        <NextLink
          href="/reports/upload"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-black shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all active:scale-95"
        >
          <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Upload Report</span>
        </NextLink>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors relative"
            title="Clinical Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#08090d]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#10131d] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 glass-panel">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                <span className="text-xs font-semibold text-white">Clinical Alerts</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">2 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Critical Lab Flagged</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Sophia Ramirez: Serum Ferritin critically low at 8 ng/mL.
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Review Overdue</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Eleanor Vance: Annual dilated retinal exam not yet documented.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clinical Role Switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium text-white">{role}</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#10131d] border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 glass-panel">
              <div className="px-2.5 py-1 text-[10px] text-slate-400 uppercase font-semibold">Active Role</div>
              {(['Attending Physician', 'Chief Medical Officer', 'Clinical Fellow'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    role === r ? 'bg-cyan-500/10 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
