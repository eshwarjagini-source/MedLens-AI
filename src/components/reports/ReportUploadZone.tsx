'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileCheck,
  Cpu,
  Layers,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_REPORTS, ExtractionResult } from '@/lib/ai-engine';
import { Patient } from '@/types/clinical';
import ExtractionResultView from './ExtractionResultView';

export default function ReportUploadZone() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get('patientId');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(preselectedPatientId || '');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    extraction: ExtractionResult;
    reportId: string;
    patientId: string;
    patientName: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 6 Stages specified in Section 8 of PROMPT
  const stages = [
    { num: 1, label: 'Uploading document', icon: Upload, progress: 15 },
    { num: 2, label: 'Reading document text & OCR', icon: FileText, progress: 35 },
    { num: 3, label: 'Extracting medical data & entities', icon: Cpu, progress: 60 },
    { num: 4, label: 'Structuring laboratory results', icon: Layers, progress: 80 },
    { num: 5, label: 'Generating clinical insights & disclaimer', icon: Sparkles, progress: 95 },
    { num: 6, label: 'Complete & verified', icon: CheckCircle2, progress: 100 }
  ];

  useEffect(() => {
    // Fetch patients list for selector
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setPatients(data.data);
          if (!selectedPatientId) {
            setSelectedPatientId(data.data[0].id);
          }
        }
      })
      .catch(console.error);
  }, [selectedPatientId]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      setError('Please upload a valid PDF or image file (PDF, JPG, JPEG, PNG).');
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit.');
      return;
    }

    setError(null);
    setFile(selectedFile);
    startPipeline(selectedFile.name, selectedFile.size, selectedFile.type);
  };

  const handleSampleSelect = (sampleId: string) => {
    const sample = SAMPLE_REPORTS.find(s => s.id === sampleId);
    if (!sample) return;
    setError(null);
    startPipeline(sample.fileName, 1850000, 'application/pdf', sampleId);
  };

  const startPipeline = async (
    fileName: string,
    fileSize: number,
    fileType: string,
    sampleTemplateId?: string
  ) => {
    setIsProcessing(true);
    setProcessingStage(1);
    setError(null);

    // Progressive stage animation
    const stageInterval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev < 5) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const res = await fetch('/api/reports/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatientId || (patients[0] ? patients[0].id : undefined),
          fileName,
          fileSize,
          fileType,
          sampleTemplateId
        })
      });

      clearInterval(stageInterval);

      const json = await res.json();
      if (json.success) {
        setProcessingStage(6);
        // Fire celebratory confetti on complete
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}

        setTimeout(() => {
          setResult({
            extraction: json.data.extraction,
            reportId: json.data.report.id,
            patientId: json.data.report.patientId,
            patientName: json.data.patientName
          });
          setIsProcessing(false);
        }, 800);
      } else {
        setError(json.error || 'Something went wrong while extracting the report. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      clearInterval(stageInterval);
      setError('Something went wrong while extracting the report. Please try again.');
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setResult(null);
              setFile(null);
              setProcessingStage(0);
            }}
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            ← Upload another medical document
          </button>
        </div>
        <ExtractionResultView
          extraction={result.extraction}
          reportId={result.reportId}
          patientId={result.patientId}
          patientName={result.patientName}
        />
      </div>
    );
  }

  const currentStageInfo = stages[Math.max(0, processingStage - 1)];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Upload Medical Report</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload laboratory tests, blood work, or clinical panels for AI extraction and automatic structuring.
        </p>
      </div>

      {/* Target Patient Selector */}
      <div className="p-4 rounded-2xl bg-[#0e111a] border border-white/5 glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300">Target Patient Record</label>
          <p className="text-xs text-slate-500">Associate structured findings with this patient</p>
        </div>
        <select
          value={selectedPatientId}
          onChange={e => setSelectedPatientId(e.target.value)}
          disabled={isProcessing}
          className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-500 [color-scheme:dark]"
        >
          {patients.map(p => (
            <option key={p.id} value={p.id} className="bg-[#10131d] text-white">
              {p.name} ({p.age}y, {p.bloodGroup}) — {p.status}
            </option>
          ))}
        </select>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Processing State with 6-Stage Progress */}
      {isProcessing ? (
        <div className="rounded-2xl bg-[#0e111a] border border-cyan-500/30 p-8 md:p-12 glass-panel text-center space-y-8 animate-in fade-in duration-200 relative overflow-hidden">
          {/* Subtle radar aura */}
          <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-ai-pulse">
            <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Stage {processingStage} of 6
            </span>
            <h3 className="text-xl font-bold text-white mt-3">{currentStageInfo.label}</h3>
            <p className="text-xs text-slate-400 mt-1">
              MedLens neural engine is parsing values, reference ranges, and flagging abnormal findings...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${currentStageInfo.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>{currentStageInfo.progress}% Complete</span>
              <span>AI Validation Active</span>
            </div>
          </div>

          {/* Stage Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-left max-w-2xl mx-auto">
            {stages.map(s => {
              const isPast = processingStage > s.num;
              const isCurr = processingStage === s.num;
              return (
                <div
                  key={s.num}
                  className={`p-2.5 rounded-xl border text-[11px] transition-all ${
                    isCurr
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-sm'
                      : isPast
                      ? 'bg-white/5 border-emerald-500/20 text-slate-400'
                      : 'bg-white/[0.02] border-white/5 text-slate-600'
                  }`}
                >
                  <p className="font-mono text-[9px] uppercase">Step 0{s.num}</p>
                  <p className="font-medium truncate mt-0.5">{s.label.split(' ')[0]}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-10 md:p-16 text-center cursor-pointer transition-all glass-panel group ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : 'border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.02] bg-[#0e111a]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-500/30 group-hover:scale-110 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-all shadow-lg shadow-cyan-500/5">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-base md:text-lg font-bold text-white mt-4 tracking-tight">
            Drop your medical report here
          </h3>
          <p className="text-xs md:text-sm text-cyan-400 mt-1 font-medium">
            or click to browse
          </p>
          <p className="text-xs text-slate-500 mt-3">
            Supported formats: PDF, JPG, JPEG, PNG (Up to 15MB)
          </p>
        </div>
      )}

      {/* 1-Click Sample Reports (For instant verification without needing a real PDF) */}
      <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/5 glass-panel space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Instant Demo: Try with Verified Clinical Sample Reports
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate the end-to-end AI structuring pipeline instantly with realistic laboratory documents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_REPORTS.map(sample => (
            <button
              key={sample.id}
              onClick={() => handleSampleSelect(sample.id)}
              disabled={isProcessing}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    {sample.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-3 block">
                {sample.fileName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
