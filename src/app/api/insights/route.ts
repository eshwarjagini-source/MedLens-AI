import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || undefined;

    const patients = db.getPatients();
    const insights = db.getInsights(patientId);
    const labResults = db.getLabResults(patientId);

    // Aggregate all abnormal values
    const abnormalValues = labResults
      .filter(l => l.status === 'High' || l.status === 'Low' || l.status === 'Critical')
      .map(l => {
        const patient = patients.find(p => p.id === l.patientId);
        return {
          id: l.id,
          patientId: l.patientId,
          patientName: patient?.name || 'Unknown',
          testName: l.testName,
          value: l.value,
          unit: l.unit,
          status: l.status,
          referenceRange: l.referenceRange,
          date: l.testDate,
          observation: l.observation
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Generate trend metrics for key laboratory markers
    const keyMetrics = [
      { name: 'Hemoglobin A1c (HbA1c)', unit: '%', normalMin: 4.0, normalMax: 5.6, target: 7.0 },
      { name: 'Fasting Blood Glucose', unit: 'mg/dL', normalMin: 70, normalMax: 99, target: 100 },
      { name: 'Hemoglobin', unit: 'g/dL', normalMin: 12.0, normalMax: 17.0, target: 14.0 },
      { name: 'LDL Cholesterol (Calculated)', unit: 'mg/dL', normalMin: 50, normalMax: 100, target: 70 },
      { name: 'Total Cholesterol', unit: 'mg/dL', normalMin: 125, normalMax: 200, target: 180 },
      { name: 'White Blood Cell (WBC)', unit: 'cells/µL', normalMin: 4000, normalMax: 11000, target: 7000 },
      { name: 'Platelets', unit: '/µL', normalMin: 150000, normalMax: 450000, target: 250000 }
    ];

    const trends = keyMetrics.map(metric => {
      // Find all matching lab results
      const matchingLabs = labResults
        .filter(l => l.testName.toLowerCase().includes(metric.name.toLowerCase()) ||
                     (metric.name.includes('HbA1c') && l.testName.includes('HbA1c')) ||
                     (metric.name.includes('Glucose') && l.testName.includes('Glucose')) ||
                     (metric.name.includes('LDL') && l.testName.includes('LDL'))
        )
        .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());

      const dataPoints = matchingLabs.map(lab => {
        const patient = patients.find(p => p.id === lab.patientId);
        return {
          date: lab.testDate,
          value: typeof lab.value === 'number' ? lab.value : parseFloat(String(lab.value)) || 0,
          patientName: patient?.name || 'Unknown',
          patientId: lab.patientId,
          status: lab.status
        };
      });

      return {
        metric: metric.name,
        unit: metric.unit,
        normalMin: metric.normalMin,
        normalMax: metric.normalMax,
        target: metric.target,
        dataPoints,
        count: dataPoints.length
      };
    }).filter(t => t.count > 0);

    // Collect all missing information warnings across patients
    const allMissingInfo: Array<{ patientId: string; patientName: string; item: string }> = [];
    insights.forEach(ins => {
      const patient = patients.find(p => p.id === ins.patientId);
      ins.missingInformation.forEach(item => {
        if (!allMissingInfo.some(m => m.item === item && m.patientId === ins.patientId)) {
          allMissingInfo.push({
            patientId: ins.patientId,
            patientName: patient?.name || 'Patient',
            item
          });
        }
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        insights,
        abnormalValues,
        trends,
        missingInformation: allMissingInfo,
        stats: {
          totalAbnormal: abnormalValues.length,
          criticalCount: abnormalValues.filter(a => a.status === 'Critical').length,
          highCount: abnormalValues.filter(a => a.status === 'High').length,
          lowCount: abnormalValues.filter(a => a.status === 'Low').length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching clinical insights:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve insights' }, { status: 500 });
  }
}
