import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || undefined;
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;

    const reports = db.getReports({ patientId, status, type });
    const patients = db.getPatients();
    const patientMap = new Map(patients.map(p => [p.id, p]));

    const enrichedReports = reports.map(r => {
      const patient = patientMap.get(r.patientId);
      const labCount = db.getLabResults(undefined, r.id).length;
      return {
        ...r,
        patientName: patient ? patient.name : 'Unknown Patient',
        patientAge: patient?.age,
        patientSex: patient?.sex,
        labResultsCount: labCount
      };
    });

    return NextResponse.json({ success: true, data: enrichedReports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve reports' }, { status: 500 });
  }
}
