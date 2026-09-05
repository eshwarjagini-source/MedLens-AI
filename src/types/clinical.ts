export type PatientStatus = 'Stable' | 'Needs Review' | 'Critical' | 'Processing';

export interface MedicalHistoryItem {
  year: string;
  event: string;
  type?: 'Diagnosis' | 'Medication' | 'Consultation' | 'Surgery' | 'Lifestyle';
}

export interface SurgicalHistoryItem {
  year: string;
  procedure: string;
  hospital?: string;
}

export interface PatientLifestyle {
  smoking?: 'Never' | 'Former' | 'Occasional' | 'Regular';
  alcohol?: 'None' | 'Occasional' | 'Moderate' | 'Heavy';
  activity?: 'Sedentary' | 'Moderate' | 'Active' | 'Athletic';
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  height: number; // in cm
  weight: number; // in kg
  symptoms: string[];
  conditions: string[];
  allergies: string[];
  medicalHistory: MedicalHistoryItem[];
  surgicalHistory: SurgicalHistoryItem[];
  familyHistory: string[];
  lifestyle: PatientLifestyle;
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Discontinued' | 'Paused';
}

export interface Report {
  id: string;
  patientId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
  reportType: string;
  reportDate: string;
  processingStatus: 'Pending' | 'Uploading' | 'Analyzing' | 'Processed' | 'Failed';
  doctorName?: string;
  laboratoryName?: string;
  createdAt: string;
}

export type LabStatus = 'Normal' | 'High' | 'Low' | 'Critical' | 'Unknown';

export interface LabResult {
  id: string;
  reportId: string;
  patientId: string;
  testName: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: LabStatus;
  observation: string;
  testDate: string;
}

export interface AbnormalValue {
  testName: string;
  value: number | string;
  unit: string;
  flag: 'High' | 'Low' | 'Critical';
  referenceRange: string;
  clinicalSignificance?: string;
}

export interface HistoricalTrend {
  metric: string;
  unit: string;
  normalRange: string;
  points: Array<{
    date: string;
    value: number;
    reportId?: string;
  }>;
  status: 'Improving' | 'Worsening' | 'Stable' | 'Attention';
  insight: string;
}

export interface AIInsight {
  id: string;
  patientId: string;
  reportId?: string;
  summary: string;
  keyFindings: string[];
  abnormalValues: AbnormalValue[];
  missingInformation: string[];
  trends?: HistoricalTrend[];
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string;
  title: string;
  description: string;
  category: 'Report' | 'Medication' | 'Diagnosis' | 'Consultation' | 'Surgery';
  severity?: 'Normal' | 'Warning' | 'Critical';
}

export interface GlobalSearchResult {
  id: string;
  type: 'patient' | 'report' | 'condition' | 'medication' | 'lab';
  title: string;
  subtitle: string;
  url: string;
  metadata?: string;
}
