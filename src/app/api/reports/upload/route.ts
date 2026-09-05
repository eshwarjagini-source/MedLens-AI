import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processMedicalDocument } from '@/lib/ai-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      patientId,
      fileName,
      fileType = 'application/pdf',
      fileSize = 1024 * 1024,
      fileBase64,
      sampleTemplateId
    } = body;

    // Verify patient exists or use first patient as fallback
    let targetPatientId = patientId;
    const patients = db.getPatients();
    if (!targetPatientId || !patients.some(p => p.id === targetPatientId)) {
      if (patients.length > 0) {
        targetPatientId = patients[0].id;
      } else {
        const newP = db.createPatient({
          name: 'Jane Doe',
          dateOfBirth: '1985-05-12',
          age: 41,
          sex: 'Female',
          bloodGroup: 'O+',
          height: 165,
          weight: 65,
          symptoms: [],
          conditions: [],
          allergies: [],
          medicalHistory: [],
          surgicalHistory: [],
          familyHistory: [],
          lifestyle: {},
          status: 'Processing'
        });
        targetPatientId = newP.id;
      }
    }

    const patient = db.getPatientById(targetPatientId)!;

    // Run AI Extraction Pipeline
    const extraction = await processMedicalDocument(fileName, fileBase64, sampleTemplateId);

    // Create Report record
    const report = db.createReport({
      patientId: targetPatientId,
      fileName: fileName || 'Uploaded_Medical_Report.pdf',
      fileType: fileType,
      fileSize: fileSize,
      reportType: extraction.reportType,
      reportDate: extraction.reportDate || new Date().toISOString().split('T')[0],
      processingStatus: 'Processed',
      doctorName: extraction.doctorName,
      laboratoryName: extraction.laboratoryName
    });

    // Create structured LabResults records
    const labResultsData = extraction.tests.map(test => ({
      reportId: report.id,
      patientId: targetPatientId,
      testName: test.name,
      value: test.value,
      unit: test.unit,
      referenceRange: test.referenceRange,
      status: test.status,
      observation: test.observation,
      testDate: report.reportDate
    }));
    const createdLabs = db.batchCreateLabResults(labResultsData);

    // Create AIInsight record
    const insight = db.createInsight({
      patientId: targetPatientId,
      reportId: report.id,
      summary: extraction.summary,
      keyFindings: extraction.keyFindings,
      abnormalValues: extraction.abnormalValues,
      missingInformation: extraction.missingInformation
    });

    // Add Timeline event
    db.createTimelineEvent({
      patientId: targetPatientId,
      date: report.reportDate,
      title: `${report.reportType} Analyzed`,
      description: `AI synthesized ${createdLabs.length} clinical parameters. ${extraction.abnormalValues.length} abnormal values flagged.`,
      category: 'Report',
      severity: extraction.abnormalValues.some(a => a.flag === 'Critical')
        ? 'Critical'
        : extraction.abnormalValues.length > 0
        ? 'Warning'
        : 'Normal'
    });

    // Update patient status if critical or abnormal values present
    if (extraction.abnormalValues.some(a => a.flag === 'Critical')) {
      db.updatePatient(targetPatientId, { status: 'Critical' });
    } else if (extraction.abnormalValues.length > 0 && patient.status === 'Stable') {
      db.updatePatient(targetPatientId, { status: 'Needs Review' });
    }

    return NextResponse.json({
      success: true,
      data: {
        report,
        labResults: createdLabs,
        insight,
        extraction,
        patientName: patient.name
      }
    });
  } catch (error) {
    console.error('Error in medical report processing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to process this document. Please ensure valid format and try again.'
      },
      { status: 500 }
    );
  }
}
