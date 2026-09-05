import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patient = db.getPatientById(id);

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    const medications = db.getMedications(id);
    const reports = db.getReports({ patientId: id });
    const labResults = db.getLabResults(id);
    const insights = db.getInsights(id);
    const timeline = db.getTimeline(id);

    return NextResponse.json({
      success: true,
      data: {
        patient,
        medications,
        reports,
        labResults,
        insights,
        timeline
      }
    });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve patient details' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = db.updatePatient(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ success: false, error: 'Failed to update patient' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = db.deletePatient(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Patient record deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete patient' }, { status: 500 });
  }
}
