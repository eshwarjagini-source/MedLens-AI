import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = db.getReportById(id);

    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    const patient = db.getPatientById(report.patientId);
    const labResults = db.getLabResults(undefined, id);
    const insights = db.getInsights(undefined, id);

    return NextResponse.json({
      success: true,
      data: {
        report,
        patient,
        labResults,
        insight: insights[0] || null
      }
    });
  } catch (error) {
    console.error('Error fetching report details:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve report details' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = db.deleteReport(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete report' }, { status: 500 });
  }
}
