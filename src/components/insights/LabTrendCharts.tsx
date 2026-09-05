'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Activity, TrendingUp, TrendingDown, Minus, Sparkles, Filter } from 'lucide-react';

interface TrendMetric {
  metric: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  target?: number;
  dataPoints: Array<{
    date: string;
    value: number;
    patientName: string;
    patientId: string;
    status: string;
  }>;
}

interface LabTrendChartsProps {
  trends: TrendMetric[];
}

export default function LabTrendCharts({ trends }: LabTrendChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>(
    trends.length > 0 ? trends[0].metric : 'Hemoglobin'
  );

  const currentTrend = trends.find(t => t.metric === selectedMetric) || trends[0];

  if (!currentTrend || currentTrend.dataPoints.length === 0) {
    return (
      <div className="p-8 text-center bg-[#0e111a] rounded-2xl border border-white/5 text-slate-500 text-xs">
        No historical trend series available yet. Upload multiple reports over time to generate longitudinal charts.
      </div>
    );
  }

  const sortedPoints = [...currentTrend.dataPoints].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstValue = sortedPoints[0]?.value ?? 0;
  const lastValue = sortedPoints[sortedPoints.length - 1]?.value ?? 0;
  const diff = Number((lastValue - firstValue).toFixed(1));
  const percentChange = firstValue !== 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-xl bg-[#10131d] border border-white/10 shadow-2xl text-xs space-y-1 glass-panel">
          <p className="font-semibold text-white font-mono">{label}</p>
          <p className="text-cyan-400 font-bold font-mono">
            {data.value} {currentTrend.unit}
          </p>
          <p className="text-[11px] text-slate-400">Patient: {data.patientName}</p>
          <p className="text-[10px] text-slate-500">Ref: {currentTrend.normalMin} - {currentTrend.normalMax} {currentTrend.unit}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 md:p-8 glass-panel space-y-6">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Lab Trend Visualization</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Longitudinal progression across sequential medical reports with reference bands
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-xl no-scrollbar">
          {trends.map(t => (
            <button
              key={t.metric}
              onClick={() => setSelectedMetric(t.metric)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedMetric === t.metric
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {t.metric.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div>
          <span className="text-[11px] text-slate-400">Current Parameter</span>
          <p className="text-xs font-bold text-white mt-0.5 truncate">{currentTrend.metric}</p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400">Latest Recorded Value</span>
          <p className="text-base font-bold text-cyan-400 font-mono mt-0.5">
            {lastValue} <span className="text-xs text-slate-400 font-normal">{currentTrend.unit}</span>
          </p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400">Reference Physiological Band</span>
          <p className="text-xs font-mono text-emerald-400 mt-1 font-semibold">
            {currentTrend.normalMin} – {currentTrend.normalMax} {currentTrend.unit}
          </p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400">Longitudinal Shift</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {diff > 0 ? (
              <span className="text-xs font-bold text-amber-400 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{diff} ({percentChange}%)
              </span>
            ) : diff < 0 ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {diff} ({percentChange}%)
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-400 flex items-center">
                <Minus className="w-3.5 h-3.5 mr-0.5" /> Stable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sortedPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Reference range lines */}
            {currentTrend.normalMin && (
              <ReferenceLine
                y={currentTrend.normalMin}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{ value: `Min (${currentTrend.normalMin})`, fill: '#10b981', fontSize: 10, position: 'right' }}
              />
            )}
            {currentTrend.normalMax && (
              <ReferenceLine
                y={currentTrend.normalMax}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: `Max (${currentTrend.normalMax})`, fill: '#f59e0b', fontSize: 10, position: 'right' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00f0ff"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cyanGradient)"
              dot={{ fill: '#00f0ff', r: 4, strokeWidth: 2, stroke: '#08090c' }}
              activeDot={{ r: 6, fill: '#ffffff', stroke: '#00f0ff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-emerald-500" /> Lower Ref Limit
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-amber-500" /> Upper Ref Limit
          </span>
        </div>
        <span className="font-mono">Time Axis: Sequential Specimen Collection</span>
      </div>
    </div>
  );
}
