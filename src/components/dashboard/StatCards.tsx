'use client';

import React from 'react';
import { Users, FileText, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatCardsProps {
  stats: {
    totalPatients: number;
    totalReports: number;
    processedReports: number;
    pendingReviews: number;
    abnormalValuesCount: number;
    processingSuccessRate: number;
  };
}

export default function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      subtitle: 'Active clinical records',
      icon: Users,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
      badge: '+12% this month',
      badgeColor: 'text-cyan-300 bg-cyan-500/10'
    },
    {
      title: 'Medical Reports',
      value: stats.totalReports,
      subtitle: 'Uploaded clinical files',
      icon: FileText,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      badge: 'All parsed',
      badgeColor: 'text-blue-300 bg-blue-500/10'
    },
    {
      title: 'Reports Processed',
      value: `${stats.processingSuccessRate}%`,
      subtitle: `${stats.processedReports} documents structured`,
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      badge: 'AI Validated',
      badgeColor: 'text-emerald-300 bg-emerald-500/10'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      subtitle: `${stats.abnormalValuesCount} out-of-range values`,
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      badge: 'Action Required',
      badgeColor: 'text-amber-300 bg-amber-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0e111a] border border-white/5 hover:border-white/10 transition-all hover:translate-y-[-2px] shadow-lg group relative overflow-hidden glass-panel"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">{card.title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-white mt-2 tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
              </div>
              <div className={`p-3 rounded-xl border ${card.iconBg}`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border border-transparent ${card.badgeColor}`}>
                {card.badge}
              </span>
              <span className="text-[11px] text-slate-500">Live Sync</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
