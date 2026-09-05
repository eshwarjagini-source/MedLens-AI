import fs from 'fs';
import path from 'path';
import {
  Patient,
  Medication,
  Report,
  LabResult,
  AIInsight,
  TimelineEvent,
  GlobalSearchResult,
  HistoricalTrend
} from '@/types/clinical';
import {
  INITIAL_PATIENTS,
  INITIAL_MEDICATIONS,
  INITIAL_REPORTS,
  INITIAL_LAB_RESULTS,
  INITIAL_INSIGHTS,
  INITIAL_TIMELINE_EVENTS
} from './seed-data';

interface DatabaseSchema {
  patients: Patient[];
  medications: Medication[];
  reports: Report[];
  labResults: LabResult[];
  insights: AIInsight[];
  timelineEvents: TimelineEvent[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'medlens-db.json');

class ClinicalDatabase {
  private cache: DatabaseSchema | null = null;

  private ensureInitialized(): DatabaseSchema {
    if (this.cache) return this.cache;

    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.cache = JSON.parse(fileContent);
        return this.cache!;
      }
    } catch (err) {
      console.warn('Failed reading DB file, resetting to initial seed', err);
    }

    // Default Seed
    const initialData: DatabaseSchema = {
      patients: INITIAL_PATIENTS,
      medications: INITIAL_MEDICATIONS,
      reports: INITIAL_REPORTS,
      labResults: INITIAL_LAB_RESULTS,
      insights: INITIAL_INSIGHTS,
      timelineEvents: INITIAL_TIMELINE_EVENTS
    };

    this.cache = initialData;
    this.saveToDisk();
    return this.cache;
  }

  private saveToDisk() {
    if (!this.cache) return;
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write clinical database to disk:', err);
    }
  }

  // --- PATIENTS ---
  public getPatients(): Patient[] {
    const db = this.ensureInitialized();
    return [...db.patients].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getPatientById(id: string): Patient | null {
    const db = this.ensureInitialized();
    return db.patients.find(p => p.id === id) || null;
  }

  public createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient {
    const db = this.ensureInitialized();
    const now = new Date().toISOString();
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };

    db.patients.unshift(newPatient);

    // Add initial timeline event
    this.createTimelineEvent({
      patientId: newPatient.id,
      date: now.split('T')[0],
      title: 'Patient Record Created',
      description: `New patient record initialized for ${newPatient.name} with baseline clinical information.`,
      category: 'Consultation',
      severity: 'Normal'
    });

    this.saveToDisk();
    return newPatient;
  }

  public updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const db = this.ensureInitialized();
    const index = db.patients.findIndex(p => p.id === id);
    if (index === -1) return null;

    db.patients[index] = {
      ...db.patients[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveToDisk();
    return db.patients[index];
  }

  public deletePatient(id: string): boolean {
    const db = this.ensureInitialized();
    const initialLen = db.patients.length;
    db.patients = db.patients.filter(p => p.id !== id);
    db.medications = db.medications.filter(m => m.patientId !== id);
    db.reports = db.reports.filter(r => r.patientId !== id);
    db.labResults = db.labResults.filter(l => l.patientId !== id);
    db.insights = db.insights.filter(i => i.patientId !== id);
    db.timelineEvents = db.timelineEvents.filter(t => t.patientId !== id);

    this.saveToDisk();
    return db.patients.length < initialLen;
  }

  // --- MEDICATIONS ---
  public getMedications(patientId?: string): Medication[] {
    const db = this.ensureInitialized();
    if (patientId) {
      return db.medications.filter(m => m.patientId === patientId);
    }
    return db.medications;
  }

  public createMedication(medData: Omit<Medication, 'id'>): Medication {
    const db = this.ensureInitialized();
    const newMed: Medication = {
      ...medData,
      id: `med-${Date.now()}`
    };
    db.medications.push(newMed);

    this.createTimelineEvent({
      patientId: newMed.patientId,
      date: newMed.startDate || new Date().toISOString().split('T')[0],
      title: `Medication Prescribed: ${newMed.name}`,
      description: `${newMed.name} ${newMed.dosage} (${newMed.frequency}) added to current regimen.`,
      category: 'Medication',
      severity: 'Normal'
    });

    this.saveToDisk();
    return newMed;
  }

  public updateMedication(id: string, updates: Partial<Medication>): Medication | null {
    const db = this.ensureInitialized();
    const index = db.medications.findIndex(m => m.id === id);
    if (index === -1) return null;
    db.medications[index] = { ...db.medications[index], ...updates };
    this.saveToDisk();
    return db.medications[index];
  }

  // --- REPORTS ---
  public getReports(filter?: { patientId?: string; status?: string; type?: string }): Report[] {
    const db = this.ensureInitialized();
    let result = [...db.reports];

    if (filter?.patientId) {
      result = result.filter(r => r.patientId === filter.patientId);
    }
    if (filter?.status && filter.status !== 'All') {
      result = result.filter(r => r.processingStatus === filter.status);
    }
    if (filter?.type && filter.type !== 'All') {
      result = result.filter(r => r.reportType.toLowerCase().includes(filter.type!.toLowerCase()));
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getReportById(id: string): Report | null {
    const db = this.ensureInitialized();
    return db.reports.find(r => r.id === id) || null;
  }

  public createReport(reportData: Omit<Report, 'id' | 'createdAt'>): Report {
    const db = this.ensureInitialized();
    const newReport: Report = {
      ...reportData,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.reports.unshift(newReport);
    this.saveToDisk();
    return newReport;
  }

  public updateReport(id: string, updates: Partial<Report>): Report | null {
    const db = this.ensureInitialized();
    const index = db.reports.findIndex(r => r.id === id);
    if (index === -1) return null;
    db.reports[index] = { ...db.reports[index], ...updates };
    this.saveToDisk();
    return db.reports[index];
  }

  public deleteReport(id: string): boolean {
    const db = this.ensureInitialized();
    const initialLen = db.reports.length;
    db.reports = db.reports.filter(r => r.id !== id);
    db.labResults = db.labResults.filter(l => l.reportId !== id);
    db.insights = db.insights.filter(i => i.reportId !== id);
    this.saveToDisk();
    return db.reports.length < initialLen;
  }

  // --- LAB RESULTS ---
  public getLabResults(patientId?: string, reportId?: string): LabResult[] {
    const db = this.ensureInitialized();
    let results = db.labResults;
    if (patientId) {
      results = results.filter(l => l.patientId === patientId);
    }
    if (reportId) {
      results = results.filter(l => l.reportId === reportId);
    }
    return results;
  }

  public createLabResult(item: Omit<LabResult, 'id'>): LabResult {
    const db = this.ensureInitialized();
    const newResult: LabResult = {
      ...item,
      id: `lab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    db.labResults.push(newResult);
    this.saveToDisk();
    return newResult;
  }

  public batchCreateLabResults(items: Omit<LabResult, 'id'>[]): LabResult[] {
    const db = this.ensureInitialized();
    const created = items.map((item, idx) => ({
      ...item,
      id: `lab-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`
    }));
    db.labResults.push(...created);
    this.saveToDisk();
    return created;
  }

  // --- AI INSIGHTS ---
  public getInsights(patientId?: string, reportId?: string): AIInsight[] {
    const db = this.ensureInitialized();
    let insights = db.insights;
    if (patientId) {
      insights = insights.filter(i => i.patientId === patientId);
    }
    if (reportId) {
      insights = insights.filter(i => i.reportId === reportId);
    }
    return insights.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public createInsight(insightData: Omit<AIInsight, 'id' | 'createdAt'>): AIInsight {
    const db = this.ensureInitialized();
    const newInsight: AIInsight = {
      ...insightData,
      id: `ins-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.insights.unshift(newInsight);
    this.saveToDisk();
    return newInsight;
  }

  // --- TIMELINE ---
  public getTimeline(patientId: string): TimelineEvent[] {
    const db = this.ensureInitialized();
    return db.timelineEvents
      .filter(t => t.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public createTimelineEvent(eventData: Omit<TimelineEvent, 'id'>): TimelineEvent {
    const db = this.ensureInitialized();
    const newEvent: TimelineEvent = {
      ...eventData,
      id: `tl-${Date.now()}`
    };
    db.timelineEvents.unshift(newEvent);
    this.saveToDisk();
    return newEvent;
  }

  // --- DASHBOARD STATS ---
  public getDashboardStats() {
    const db = this.ensureInitialized();
    const totalPatients = db.patients.length;
    const totalReports = db.reports.length;
    const processedReports = db.reports.filter(r => r.processingStatus === 'Processed').length;
    const pendingReviews = db.patients.filter(p => p.status === 'Needs Review' || p.status === 'Critical').length;
    const abnormalValuesCount = db.labResults.filter(
      l => l.status === 'High' || l.status === 'Low' || l.status === 'Critical'
    ).length;

    return {
      totalPatients,
      totalReports,
      processedReports,
      pendingReviews,
      abnormalValuesCount,
      processingSuccessRate: totalReports > 0 ? Math.round((processedReports / totalReports) * 100) : 100
    };
  }

  // --- GLOBAL SEARCH ---
  public searchAll(query: string): GlobalSearchResult[] {
    if (!query || query.trim().length === 0) return [];
    const db = this.ensureInitialized();
    const q = query.toLowerCase().trim();
    const results: GlobalSearchResult[] = [];

    // Search Patients
    for (const patient of db.patients) {
      if (
        patient.name.toLowerCase().includes(q) ||
        patient.bloodGroup.toLowerCase().includes(q) ||
        patient.conditions.some(c => c.toLowerCase().includes(q)) ||
        patient.symptoms.some(s => s.toLowerCase().includes(q))
      ) {
        results.push({
          id: patient.id,
          type: 'patient',
          title: patient.name,
          subtitle: `${patient.age}y ${patient.sex} • ${patient.bloodGroup} • Status: ${patient.status}`,
          url: `/patients/${patient.id}`,
          metadata: patient.conditions.join(', ')
        });
      }
    }

    // Search Reports
    for (const report of db.reports) {
      if (
        report.fileName.toLowerCase().includes(q) ||
        report.reportType.toLowerCase().includes(q) ||
        (report.doctorName && report.doctorName.toLowerCase().includes(q))
      ) {
        const patient = db.patients.find(p => p.id === report.patientId);
        results.push({
          id: report.id,
          type: 'report',
          title: report.reportType,
          subtitle: `Patient: ${patient?.name || 'Unknown'} • ${report.reportDate} • ${report.processingStatus}`,
          url: `/reports/${report.id}`,
          metadata: report.fileName
        });
      }
    }

    // Search Lab Tests
    const seenTests = new Set<string>();
    for (const lab of db.labResults) {
      if (lab.testName.toLowerCase().includes(q) && !seenTests.has(lab.testName)) {
        seenTests.add(lab.testName);
        const patient = db.patients.find(p => p.id === lab.patientId);
        results.push({
          id: lab.id,
          type: 'lab',
          title: lab.testName,
          subtitle: `Last value: ${lab.value} ${lab.unit} (${lab.status}) • Patient: ${patient?.name || 'N/A'}`,
          url: `/insights?test=${encodeURIComponent(lab.testName)}`,
          metadata: `Range: ${lab.referenceRange}`
        });
      }
    }

    // Search Medications
    for (const med of db.medications) {
      if (med.name.toLowerCase().includes(q)) {
        const patient = db.patients.find(p => p.id === med.patientId);
        results.push({
          id: med.id,
          type: 'medication',
          title: med.name,
          subtitle: `${med.dosage} (${med.frequency}) • Patient: ${patient?.name || 'N/A'}`,
          url: `/patients/${med.patientId}?tab=medications`,
          metadata: `Status: ${med.status}`
        });
      }
    }

    return results.slice(0, 15);
  }

  // --- RESET TO DEMO DATA ---
  public resetDatabase() {
    this.cache = {
      patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
      medications: JSON.parse(JSON.stringify(INITIAL_MEDICATIONS)),
      reports: JSON.parse(JSON.stringify(INITIAL_REPORTS)),
      labResults: JSON.parse(JSON.stringify(INITIAL_LAB_RESULTS)),
      insights: JSON.parse(JSON.stringify(INITIAL_INSIGHTS)),
      timelineEvents: JSON.parse(JSON.stringify(INITIAL_TIMELINE_EVENTS))
    };
    this.saveToDisk();
    return this.cache;
  }
}

// Global Singleton for Next.js hot reloading
const globalForDb = global as unknown as { clinicalDb?: ClinicalDatabase };
export const db = globalForDb.clinicalDb || new ClinicalDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.clinicalDb = db;
