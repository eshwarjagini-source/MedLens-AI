'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Activity,
  Pill,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Heart
} from 'lucide-react';

interface MedicationInput {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
}

export default function PatientFormWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<number>(35);
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(68);

  // Step 2: Clinical Info
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [conditionInput, setConditionInput] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [pastHistoryInput, setPastHistoryInput] = useState('');
  const [pastHistory, setPastHistory] = useState<Array<{ year: string; event: string }>>([
    { year: '2024', event: 'Annual routine health assessment' }
  ]);
  const [surgicalHistory, setSurgicalHistory] = useState<Array<{ year: string; procedure: string; hospital?: string }>>([]);
  const [newProcedure, setNewProcedure] = useState('');
  const [newProcYear, setNewProcYear] = useState('2022');
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);
  const [familyInput, setFamilyInput] = useState('');

  // Step 3: Medications & Allergies
  const [medications, setMedications] = useState<MedicationInput[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [drugAllergyInput, setDrugAllergyInput] = useState('');
  const [drugAllergies, setDrugAllergies] = useState<string[]>([]);

  // Step 4: Additional Information
  const [smoking, setSmoking] = useState<'Never' | 'Former' | 'Occasional' | 'Regular'>('Never');
  const [alcohol, setAlcohol] = useState<'None' | 'Occasional' | 'Moderate' | 'Heavy'>('None');
  const [activity, setActivity] = useState<'Sedentary' | 'Moderate' | 'Active' | 'Athletic'>('Moderate');
  const [notes, setNotes] = useState('');

  // Calculate BMI
  const bmi = height > 0 && weight > 0 ? (weight / Math.pow(height / 100, 2)).toFixed(1) : '23.5';

  // Compute age from DOB
  const handleDobChange = (val: string) => {
    setDateOfBirth(val);
    try {
      const birth = new Date(val);
      const now = new Date();
      let calculatedAge = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge > 0) setAge(calculatedAge);
    } catch {}
  };

  const addSymptom = () => {
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const addCondition = () => {
    if (conditionInput.trim() && !conditions.includes(conditionInput.trim())) {
      setConditions([...conditions, conditionInput.trim()]);
      setConditionInput('');
    }
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        name: '',
        dosage: '10 mg',
        frequency: 'Once daily',
        startDate: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const updateMedication = (index: number, field: keyof MedicationInput, val: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: val };
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const addAllergy = (isDrug: boolean) => {
    if (isDrug && drugAllergyInput.trim()) {
      setDrugAllergies([...drugAllergies, drugAllergyInput.trim()]);
      setDrugAllergyInput('');
    } else if (!isDrug && allergyInput.trim()) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const addSurgicalItem = () => {
    if (newProcedure.trim()) {
      setSurgicalHistory([...surgicalHistory, { year: newProcYear, procedure: newProcedure.trim() }]);
      setNewProcedure('');
    }
  };

  const addFamilyItem = () => {
    if (familyInput.trim()) {
      setFamilyHistory([...familyHistory, familyInput.trim()]);
      setFamilyInput('');
    }
  };

  const validateStep = (step: number) => {
    setError(null);
    if (step === 1) {
      if (!name.trim()) {
        setError('Please enter the patient full name.');
        return false;
      }
      if (!dateOfBirth) {
        setError('Please select date of birth.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleSave = async () => {
    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    setError(null);

    const allAllergies = [
      ...drugAllergies.map(d => `DRUG: ${d}`),
      ...allergies
    ];

    const payload = {
      name: name.trim(),
      dateOfBirth,
      age: Number(age),
      sex,
      bloodGroup,
      height: Number(height),
      weight: Number(weight),
      symptoms,
      conditions,
      allergies: allAllergies,
      medicalHistory: pastHistory,
      surgicalHistory,
      familyHistory,
      lifestyle: {
        smoking,
        alcohol,
        activity,
        notes
      },
      medications: medications.filter(m => m.name.trim().length > 0),
      status: allAllergies.length > 0 || conditions.length > 1 ? 'Needs Review' : 'Stable'
    };

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/patients/${data.data.id}`);
      } else {
        setError(data.error || 'Failed to save patient record');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Basic Information', icon: User },
    { num: 2, title: 'Clinical History', icon: Activity },
    { num: 3, title: 'Meds & Allergies', icon: Pill },
    { num: 4, title: 'Lifestyle & Notes', icon: FileCheck },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Patient Record</h1>
        <p className="text-sm text-slate-400 mt-1">
          Complete clinical intake to establish a centralized, AI-structured patient health profile.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map(s => {
          const Icon = s.icon;
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;

          return (
            <button
              key={s.num}
              onClick={() => {
                if (validateStep(currentStep)) setCurrentStep(s.num);
              }}
              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                isCurrent
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-lg shadow-cyan-500/10'
                  : isDone
                  ? 'bg-white/5 border-emerald-500/30 text-slate-300'
                  : 'bg-white/[0.02] border-white/5 text-slate-500'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                  isCurrent
                    ? 'bg-cyan-400 text-black'
                    : isDone
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{s.title}</p>
                <p className="text-[10px] text-slate-400">Step {s.num} of 4</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Content Card */}
      <div className="rounded-2xl bg-[#0e111a] border border-white/5 p-6 md:p-8 glass-panel space-y-6">
        {/* STEP 1: BASIC INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Step 1: Basic Information
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Core demographics and physiological baseline parameters</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Patient Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Julian Vance"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Date of Birth <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={e => handleDobChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Sex</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Female', 'Male', 'Other'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                        sex === s
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all [color-scheme:dark]"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg} className="bg-[#10131d] text-white">
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Calculated Clinical Metrics Card */}
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Calculated Body Mass Index (BMI)</span>
                <p className="text-xl font-bold text-cyan-400 mt-0.5">{bmi} kg/m²</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                {Number(bmi) < 18.5 ? 'Underweight' : Number(bmi) < 25 ? 'Normal BMI' : Number(bmi) < 30 ? 'Overweight' : 'Obese'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: CLINICAL INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Step 2: Clinical Information
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Symptoms, active conditions, and medical/surgical background</p>
            </div>

            {/* Current Symptoms */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Current Presenting Symptoms
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Fatigue, Dizziness, Shortness of breath"
                  value={symptomInput}
                  onChange={e => setSymptomInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={addSymptom}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {symptoms.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-xs border border-cyan-500/20"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setSymptoms(symptoms.filter((_, i) => i !== idx))}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Existing Conditions */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Existing / Chronic Conditions
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                  value={conditionInput}
                  onChange={e => setConditionInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={addCondition}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {conditions.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs border border-amber-500/20"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => setConditions(conditions.filter((_, i) => i !== idx))}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Surgical History */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Surgical History
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Year (e.g. 2021)"
                  value={newProcYear}
                  onChange={e => setNewProcYear(e.target.value)}
                  className="w-24 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Procedure (e.g. Appendectomy, Knee Arthroscopy)"
                  value={newProcedure}
                  onChange={e => setNewProcedure(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSurgicalItem())}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={addSurgicalItem}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white"
                >
                  Add Procedure
                </button>
              </div>
              <div className="space-y-1">
                {surgicalHistory.map((sh, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs text-slate-300 border border-white/5"
                  >
                    <span>
                      <strong className="text-cyan-400 font-mono mr-2">{sh.year}</strong>
                      {sh.procedure}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSurgicalHistory(surgicalHistory.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Medical History */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Family Medical History
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Mother: CAD at age 60, Father: Type 2 Diabetes"
                  value={familyInput}
                  onChange={e => setFamilyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFamilyItem())}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={addFamilyItem}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white"
                >
                  Add Family History
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {familyHistory.map((fh, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 text-xs border border-white/5"
                  >
                    {fh}
                    <button
                      type="button"
                      onClick={() => setFamilyHistory(familyHistory.filter((_, i) => i !== idx))}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MEDICATIONS & ALLERGIES */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-cyan-400" />
                Step 3: Medications & Allergies
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Active pharmacological regimen and critical adverse drug reactions</p>
            </div>

            {/* Drug Allergies (HIGH PRIORITY WARNING) */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Known Drug Allergies & Adverse Reactions (High Visibility)</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Penicillin (Anaphylaxis), Aspirin (Severe Gastritis)"
                  value={drugAllergyInput}
                  onChange={e => setDrugAllergyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergy(true))}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-rose-500/30 text-white text-xs outline-none focus:border-rose-400"
                />
                <button
                  type="button"
                  onClick={() => addAllergy(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white transition-colors"
                >
                  Add Drug Allergy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {drugAllergies.map((da, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-200 text-xs border border-rose-500/40 font-medium"
                  >
                    ⚠️ {da}
                    <button
                      type="button"
                      onClick={() => setDrugAllergies(drugAllergies.filter((_, i) => i !== idx))}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Environmental & Food Allergies */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Environmental & Food Allergies
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Peanuts, Shellfish, Latex"
                  value={allergyInput}
                  onChange={e => setAllergyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergy(false))}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => addAllergy(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white"
                >
                  Add Allergy
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allergies.map((a, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs border border-amber-500/20"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => setAllergies(allergies.filter((_, i) => i !== idx))}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Current Medications Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-slate-300">
                  Current Medications & Prescriptions
                </label>
                <button
                  type="button"
                  onClick={addMedication}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Medication
                </button>
              </div>

              {medications.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-white/10 rounded-xl text-slate-500 text-xs">
                  No active medications added yet. Click &ldquo;Add Medication&rdquo; above to record current drugs.
                </div>
              ) : (
                <div className="space-y-2">
                  {medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center"
                    >
                      <input
                        type="text"
                        placeholder="Drug Name (e.g. Lisinopril)"
                        value={med.name}
                        onChange={e => updateMedication(idx, 'name', e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 10 mg)"
                        value={med.dosage}
                        onChange={e => updateMedication(idx, 'dosage', e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (e.g. Once daily)"
                        value={med.frequency}
                        onChange={e => updateMedication(idx, 'frequency', e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-cyan-500"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={med.startDate}
                          onChange={e => updateMedication(idx, 'startDate', e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none [color-scheme:dark]"
                        />
                        <button
                          type="button"
                          onClick={() => removeMedication(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: ADDITIONAL INFORMATION */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                Step 4: Additional Information & Lifestyle
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Lifestyle habits, behavioral patterns, and physician clinical notes</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Smoking Status</label>
                <select
                  value={smoking}
                  onChange={e => setSmoking(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-500 [color-scheme:dark]"
                >
                  <option value="Never" className="bg-[#10131d]">Never smoked</option>
                  <option value="Former" className="bg-[#10131d]">Former smoker</option>
                  <option value="Occasional" className="bg-[#10131d]">Occasional smoker</option>
                  <option value="Regular" className="bg-[#10131d]">Regular daily smoker</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Alcohol Consumption</label>
                <select
                  value={alcohol}
                  onChange={e => setAlcohol(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-500 [color-scheme:dark]"
                >
                  <option value="None" className="bg-[#10131d]">None / Abstinent</option>
                  <option value="Occasional" className="bg-[#10131d]">Occasional / Social</option>
                  <option value="Moderate" className="bg-[#10131d]">Moderate (1-2 drinks/day)</option>
                  <option value="Heavy" className="bg-[#10131d]">Heavy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Physical Activity Level</label>
                <select
                  value={activity}
                  onChange={e => setActivity(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-500 [color-scheme:dark]"
                >
                  <option value="Sedentary" className="bg-[#10131d]">Sedentary (Desk work)</option>
                  <option value="Moderate" className="bg-[#10131d]">Moderate (150 min/wk)</option>
                  <option value="Active" className="bg-[#10131d]">Active (Regular exercise)</option>
                  <option value="Athletic" className="bg-[#10131d]">Athletic / Competitive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Clinical Intake Notes & Additional Observations
              </label>
              <textarea
                rows={4}
                placeholder="Enter any additional clinical findings, dietary specifics, social determinants of health, or physician remarks..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-500 placeholder:text-slate-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Wizard Footer Actions */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <span>Save & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-bold transition-all shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>Save Patient Record</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
