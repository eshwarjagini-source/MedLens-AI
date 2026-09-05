'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, FileText, Activity, Pill, AlertTriangle, X, ArrowRight } from 'lucide-react';
import { GlobalSearchResult } from '@/types/clinical';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: GlobalSearchResult) => {
    onClose();
    router.push(result.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'patient':
        return <User className="w-4 h-4 text-cyan-400" />;
      case 'report':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'lab':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'medication':
        return <Pill className="w-4 h-4 text-purple-400" />;
      case 'condition':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#0e111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patients, reports, lab tests, medications..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm md:text-base outline-none focus:ring-0"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              <p>Type to search across all clinical records</p>
              <div className="flex justify-center gap-2 mt-3 text-xs text-slate-400">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">Eleanor Vance</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">Hemoglobin</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">Lipid Panel</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">Metformin</span>
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <p>No matching clinical records found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Try searching by patient name, medication, or lab test.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={`${res.type}-${res.id}-${index}`}
                    onClick={() => handleSelect(res)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-white'
                        : 'hover:bg-white/5 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 shrink-0">
                        {getIcon(res.type)}
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">{res.title}</span>
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                            {res.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{res.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">↵</kbd> to open</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">ESC</kbd> to dismiss</span>
          </div>
          <span className="text-cyan-400/80 font-mono">MedLens Omnisearch</span>
        </div>
      </div>
    </div>
  );
}
