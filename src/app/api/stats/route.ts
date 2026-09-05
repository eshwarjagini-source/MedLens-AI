import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const stats = db.getDashboardStats();
    const patients = db.getPatients();
    const reports = db.getReports();
    const patientMap = new Map(patients.map(p => [p.id, p]));

    const recentPatients = patients.slice(0, 5);

    const recentReports = reports.slice(0, 5).map(r => ({
      ...r,
      patientName: patientMap.get(r.patientId)?.name || 'Unknown Patient'
    }));

    // Generate AI activity feed from recent events across all patients
    const allTimeline = patients.flatMap(p => db.getTimeline(p.id));
    const recentActivity = allTimeline
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .map(ev => {
        const patient = patientMap.get(ev.patientId);
        return {
          id: ev.id,
          date: ev.date,
          title: ev.title,
          description: ev.description,
          category: ev.category,
          severity: ev.severity,
          patientName: patient?.name || 'Patient'
        };
      });

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentPatients,
        recentReports,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve stats' }, { status: 500 });
  }
}
