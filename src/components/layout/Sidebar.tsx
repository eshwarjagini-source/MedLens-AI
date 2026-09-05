'use client';

import React from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FolderHeart,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Activity,
  X
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Patients', href: '/patients', icon: Users },
    { label: 'Reports', href: '/reports', icon: FileSpreadsheet },
    { label: 'Medical Records', href: '/patients/patient-1', icon: FolderHeart },
    { label: 'AI Insights', href: '/insights', icon: Sparkles, badge: 'Active' },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-45 flex flex-col bg-[#090b10] border-r border-white/5 transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <NextLink href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-black stroke-[2.5]" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090b10]" />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-wider text-white flex items-center gap-1.5">
                  MEDLENS
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20">
                    AI
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-tight">Clinical Intelligence</span>
              </div>
            )}
          </NextLink>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <NextLink
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {(!isCollapsed || mobileOpen) && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {(!isCollapsed || mobileOpen) && item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </NextLink>
            );
          })}
        </nav>

        {/* Collapse Toggle Button (Desktop Only) */}
        <div className="hidden lg:flex px-3 py-2 border-t border-white/5 justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Section: Profile & Status */}
        <div className="p-3 border-t border-white/5 space-y-2 bg-black/20">
          {/* Status Pill */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] ${isCollapsed && !mobileOpen ? 'justify-center' : ''}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            {(!isCollapsed || mobileOpen) && (
              <span className="text-slate-300 truncate">AI Engine: Online</span>
            )}
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner">
              SC
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="min-w-0 flex-1 truncate">
                <p className="text-xs font-semibold text-white truncate">Dr. Sarah Chen, MD</p>
                <p className="text-[10px] text-slate-400 truncate">Chief Medical Officer</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
