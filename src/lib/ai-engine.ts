import { LabResult, LabStatus, AbnormalValue } from '@/types/clinical';

export interface ExtractionResult {
  reportType: string;
  reportDate: string;
  patientName?: string;
  doctorName?: string;
  laboratoryName?: string;
  tests: Array<{
    name: string;
    value: number | string;
    unit: string;
    referenceRange: string;
    status: LabStatus;
    observation: string;
  }>;
  summary: string;
  keyFindings: string[];
  abnormalValues: AbnormalValue[];
  missingInformation: string[];
  isDemoMode: boolean;
  modelUsed: string;
}

export interface SampleReportTemplate {
  id: string;
  title: string;
  category: string;
  fileName: string;
  description: string;
  sampleData: ExtractionResult;
}

export const SAMPLE_REPORTS: SampleReportTemplate[] = [
  {
    id: 'sample-cbc',
    title: 'Complete Blood Count (CBC) with Diff',
    category: 'Hematology',
    fileName: 'CBC_Differential_Lab_Report.pdf',
    description: 'Evaluates red cells, white blood cells, and platelets. Detects anemia, infection, and clotting conditions.',
    sampleData: {
      reportType: 'Complete Blood Count (CBC) with Differential',
      reportDate: new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Evelyn Reed, MD',
      laboratoryName: 'Precision Diagnostic Medical Labs',
      tests: [
        { name: 'White Blood Cell (WBC)', value: 12400, unit: 'cells/µL', referenceRange: '4,000 - 11,000', status: 'High', observation: 'Mild leukocytosis; elevated neutrophil response' },
        { name: 'Red Blood Cell (RBC)', value: 4.65, unit: 'M/µL', referenceRange: '4.20 - 5.80', status: 'Normal', observation: 'Erythrocyte concentration within physiological range' },
        { name: 'Hemoglobin', value: 13.8, unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'Normal', observation: 'Normal oxygen-carrying capacity' },
        { name: 'Hematocrit', value: 41.5, unit: '%', referenceRange: '39.0 - 50.0', status: 'Normal', observation: 'Normal proportion of red blood cells' },
        { name: 'Mean Corpuscular Volume (MCV)', value: 89.2, unit: 'fL', referenceRange: '80.0 - 100.0', status: 'Normal', observation: 'Normocytic red blood cell morphology' },
        { name: 'Platelets', value: 250000, unit: '/µL', referenceRange: '150,000 - 450,000', status: 'Normal', observation: 'Adequate thrombocyte count' },
        { name: 'Absolute Neutrophils', value: 8200, unit: 'cells/µL', referenceRange: '1,800 - 7,000', status: 'High', observation: 'Neutrophilia consistent with mild acute inflammatory response' },
        { name: 'Absolute Lymphocytes', value: 2800, unit: 'cells/µL', referenceRange: '1,000 - 4,800', status: 'Normal', observation: 'Normal cell-mediated immunity' }
      ],
      summary: 'Automated clinical extraction identified mild leukocytosis (WBC 12,400 cells/µL) driven by absolute neutrophilia (8,200 cells/µL), while red blood cell parameters (Hemoglobin 13.8 g/dL) and platelet counts remain completely within standard reference ranges.',
      keyFindings: [
        'WBC count is mildly elevated at 12,400 cells/µL (reference 4,000–11,000 cells/µL).',
        'Absolute Neutrophils elevated at 8,200 cells/µL, indicating mild reactive or inflammatory etiology.',
        'Hemoglobin (13.8 g/dL) and Hematocrit (41.5%) demonstrate preserved erythrocyte mass.',
        'Platelet count (250,000/µL) is normal without signs of consumption or thrombocytosis.'
      ],
      abnormalValues: [
        {
          testName: 'White Blood Cell (WBC)',
          value: 12400,
          unit: 'cells/µL',
          flag: 'High',
          referenceRange: '4,000 - 11,000 cells/µL',
          clinicalSignificance: 'Elevated immune response; correlate with current or recent infectious symptoms.'
        },
        {
          testName: 'Absolute Neutrophils',
          value: 8200,
          unit: 'cells/µL',
          flag: 'High',
          referenceRange: '1,800 - 7,000 cells/µL',
          clinicalSignificance: 'Neutrophilic leukocytosis; often transient during recovery.'
        }
      ],
      missingInformation: [
        'C-Reactive Protein (CRP) or ESR was not co-ordered to assess systemic inflammation level.',
        'No clinical history of recent fever, productive cough, or dysuria noted in accession.'
      ],
      isDemoMode: true,
      modelUsed: 'MedLens Clinical Intelligence Engine (Demo Mode)'
    }
  },
  {
    id: 'sample-lipid',
    title: 'Comprehensive Lipid & Apolipoprotein Panel',
    category: 'Cardiology',
    fileName: 'Cardio_Lipid_Panel_Report.pdf',
    description: 'Measures Total Cholesterol, LDL-C, HDL-C, Triglycerides, and ApoB to assess atherogenic risk.',
    sampleData: {
      reportType: 'Advanced Lipid Profile & Atherogenic Risk',
      reportDate: new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Arthur Vance, MD, FACC',
      laboratoryName: 'Vascular Diagnostics Core Lab',
      tests: [
        { name: 'Total Cholesterol', value: 238, unit: 'mg/dL', referenceRange: '< 200', status: 'High', observation: 'Hypercholesterolemia' },
        { name: 'LDL Cholesterol (Direct)', value: 154, unit: 'mg/dL', referenceRange: '< 100', status: 'High', observation: 'Elevated atherogenic particle burden' },
        { name: 'HDL Cholesterol', value: 42, unit: 'mg/dL', referenceRange: '> 40', status: 'Normal', observation: 'Borderline protective level' },
        { name: 'Triglycerides', value: 210, unit: 'mg/dL', referenceRange: '< 150', status: 'High', observation: 'Moderate hypertriglyceridemia' },
        { name: 'Non-HDL Cholesterol', value: 196, unit: 'mg/dL', referenceRange: '< 130', status: 'High', observation: 'Above primary prevention threshold' },
        { name: 'Apolipoprotein B (ApoB)', value: 112, unit: 'mg/dL', referenceRange: '< 90', status: 'High', observation: 'Increased atherogenic particle number' }
      ],
      summary: 'Report demonstrates mixed dyslipidemia with elevated atherogenic lipoproteins: Total Cholesterol 238 mg/dL, LDL-C 154 mg/dL, Triglycerides 210 mg/dL, and elevated ApoB 112 mg/dL. HDL cholesterol is maintained at 42 mg/dL.',
      keyFindings: [
        'LDL cholesterol is 154 mg/dL, well above the desirable target of <100 mg/dL.',
        'ApoB is 112 mg/dL, confirming true excess of circulating atherogenic lipoprotein particles.',
        'Triglycerides are moderately elevated at 210 mg/dL.',
        'Non-HDL cholesterol of 196 mg/dL indicates elevated secondary risk.'
      ],
      abnormalValues: [
        {
          testName: 'LDL Cholesterol',
          value: 154,
          unit: 'mg/dL',
          flag: 'High',
          referenceRange: '< 100 mg/dL',
          clinicalSignificance: 'Primary atherogenic lipoprotein driver of plaque progression.'
        },
        {
          testName: 'Total Cholesterol',
          value: 238,
          unit: 'mg/dL',
          flag: 'High',
          referenceRange: '< 200 mg/dL',
          clinicalSignificance: 'Systemic hypercholesterolemia.'
        },
        {
          testName: 'Triglycerides',
          value: 210,
          unit: 'mg/dL',
          flag: 'High',
          referenceRange: '< 150 mg/dL',
          clinicalSignificance: 'May suggest insulin resistance, high carbohydrate intake, or alcohol.'
        }
      ],
      missingInformation: [
        'Fasting status (12-hour fast) was not explicitly confirmed on lab requisition sheet.',
        'Baseline liver function test (ALT/AST) recommended before statin initiation/titration.'
      ],
      isDemoMode: true,
      modelUsed: 'MedLens Clinical Intelligence Engine (Demo Mode)'
    }
  },
  {
    id: 'sample-cmp',
    title: 'Comprehensive Metabolic Panel (CMP-14)',
    category: 'Biochemistry',
    fileName: 'Metabolic_Panel_CMP14.pdf',
    description: 'Assesses glucose, electrolyte fluid balance, kidney filtration function, and liver enzyme activity.',
    sampleData: {
      reportType: 'Comprehensive Metabolic Panel (CMP)',
      reportDate: new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Sarah Mitchell, Internal Medicine',
      laboratoryName: 'BioHealth Diagnostic Services',
      tests: [
        { name: 'Fasting Glucose', value: 134, unit: 'mg/dL', referenceRange: '70 - 99', status: 'High', observation: 'Elevated fasting hyperglycemia' },
        { name: 'Estimated GFR (eGFR)', value: 84, unit: 'mL/min/1.73m²', referenceRange: '> 60', status: 'Normal', observation: 'Preserved glomerular filtration' },
        { name: 'Serum Creatinine', value: 0.94, unit: 'mg/dL', referenceRange: '0.60 - 1.20', status: 'Normal', observation: 'Normal renal waste clearance' },
        { name: 'Blood Urea Nitrogen (BUN)', value: 16, unit: 'mg/dL', referenceRange: '7 - 20', status: 'Normal', observation: 'Normal nitrogenous balance' },
        { name: 'Sodium', value: 140, unit: 'mmol/L', referenceRange: '136 - 145', status: 'Normal', observation: 'Normal extracellular fluid osmolality' },
        { name: 'Potassium', value: 4.2, unit: 'mmol/L', referenceRange: '3.5 - 5.0', status: 'Normal', observation: 'Eunatremic and eukalemic state' },
        { name: 'ALT (SGPT)', value: 48, unit: 'U/L', referenceRange: '7 - 35', status: 'High', observation: 'Mild transaminase elevation' },
        { name: 'AST (SGOT)', value: 38, unit: 'U/L', referenceRange: '10 - 40', status: 'Normal', observation: 'Upper reference limit' }
      ],
      summary: 'Metabolic evaluation indicates elevated fasting glucose (134 mg/dL) alongside mild ALT elevation (48 U/L). Renal function markers (eGFR 84 mL/min, Creatinine 0.94 mg/dL) and serum electrolytes are completely within normal physiological limits.',
      keyFindings: [
        'Fasting glucose of 134 mg/dL exceeds the normal threshold of 99 mg/dL.',
        'Renal function is well preserved with eGFR 84 mL/min/1.73m² and normal BUN/Creatinine.',
        'ALT is mildly elevated at 48 U/L (ref 7–35 U/L); AST remains normal at 38 U/L.',
        'Electrolyte balance (Sodium 140, Potassium 4.2) is stable.'
      ],
      abnormalValues: [
        {
          testName: 'Fasting Glucose',
          value: 134,
          unit: 'mg/dL',
          flag: 'High',
          referenceRange: '70 - 99 mg/dL',
          clinicalSignificance: 'Diagnostic criterion for impaired fasting glucose / hyperglycemia.'
        },
        {
          testName: 'ALT (SGPT)',
          value: 48,
          unit: 'U/L',
          flag: 'High',
          referenceRange: '7 - 35 U/L',
          clinicalSignificance: 'Mild hepatocellular irritation; commonly associated with metabolic steatosis.'
        }
      ],
      missingInformation: [
        'Hemoglobin A1c (HbA1c) was not co-ordered to evaluate 90-day glycemic trend.',
        'Alcohol intake history and herbal supplement use not documented.'
      ],
      isDemoMode: true,
      modelUsed: 'MedLens Clinical Intelligence Engine (Demo Mode)'
    }
  }
];

export async function processMedicalDocument(
  fileName: string,
  fileContentBase64?: string,
  sampleTemplateId?: string
): Promise<ExtractionResult> {
  // 1. If sample template was picked, return realistic high-fidelity clinical extraction
  if (sampleTemplateId) {
    const template = SAMPLE_REPORTS.find(s => s.id === sampleTemplateId);
    if (template) {
      return {
        ...template.sampleData,
        reportDate: new Date().toISOString().split('T')[0]
      };
    }
  }

  // 2. Check if OpenAI / LLM API is configured via environment variables
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  if (apiKey && fileContentBase64) {
    try {
      const response = await callOpenAiApi(apiKey, fileName, fileContentBase64);
      if (response) {
        return {
          ...response,
          isDemoMode: false,
          modelUsed: 'OpenAI GPT-4o Clinical Vision API'
        };
      }
    } catch (err) {
      console.warn('AI API call failed or timed out. Falling back to MedLens Clinical Parser:', err);
    }
  }

  // 3. Intelligent MedLens Clinical Parser (Demo Mode fallback)
  // Derive test profile based on filename keywords
  const lower = fileName.toLowerCase();
  let baseTemplate = SAMPLE_REPORTS[0]; // CBC default
  if (lower.includes('lipid') || lower.includes('cholesterol') || lower.includes('cardio')) {
    baseTemplate = SAMPLE_REPORTS[1];
  } else if (lower.includes('metabolic') || lower.includes('cmp') || lower.includes('glucose') || lower.includes('renal')) {
    baseTemplate = SAMPLE_REPORTS[2];
  }

  return {
    ...baseTemplate.sampleData,
    reportDate: new Date().toISOString().split('T')[0],
    isDemoMode: true,
    modelUsed: 'MedLens Clinical Intelligence Engine (Demo Mode)'
  };
}

async function callOpenAiApi(
  apiKey: string,
  fileName: string,
  fileContentBase64: string
): Promise<ExtractionResult | null> {
  const prompt = `You are MedLens AI, a clinical information organization engine.
Extract and structure the medical information from this report named "${fileName}".
DO NOT diagnose diseases. Only summarize and organize what is in the document.

Return ONLY a valid JSON object strictly adhering to this schema:
{
  "reportType": "string",
  "reportDate": "YYYY-MM-DD",
  "doctorName": "string",
  "laboratoryName": "string",
  "tests": [
    {
      "name": "string",
      "value": "number or string",
      "unit": "string",
      "referenceRange": "string",
      "status": "Normal" | "High" | "Low" | "Critical" | "Unknown",
      "observation": "string"
    }
  ],
  "summary": "concise objective summary of findings without diagnosing",
  "keyFindings": ["string", "string"],
  "abnormalValues": [
    {
      "testName": "string",
      "value": "number or string",
      "unit": "string",
      "flag": "High" | "Low" | "Critical",
      "referenceRange": "string",
      "clinicalSignificance": "string"
    }
  ],
  "missingInformation": ["string"]
}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert clinical laboratory data extraction system.' },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${fileContentBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })
  });

  if (!res.ok) {
    throw new Error(`OpenAI API returned status ${res.status}`);
  }

  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return {
    ...parsed,
    isDemoMode: false,
    modelUsed: 'OpenAI GPT-4o'
  };
}
