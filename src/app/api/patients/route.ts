import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const patients = db.getPatients();
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'Patient name is required' }, { status: 400 });
    }
    if (!body.dateOfBirth) {
      return NextResponse.json({ success: false, error: 'Date of birth is required' }, { status: 400 });
    }

    const patient = db.createPatient({
      name: body.name.trim(),
      dateOfBirth: body.dateOfBirth,
      age: Number(body.age) || 30,
      sex: body.sex || 'Female',
      bloodGroup: body.bloodGroup || 'O+',
      height: Number(body.height) || 170,
      weight: Number(body.weight) || 70,
      symptoms: Array.isArray(body.symptoms) ? body.symptoms : [],
      conditions: Array.isArray(body.conditions) ? body.conditions : [],
      allergies: Array.isArray(body.allergies) ? body.allergies : [],
      medicalHistory: Array.isArray(body.medicalHistory) ? body.medicalHistory : [],
      surgicalHistory: Array.isArray(body.surgicalHistory) ? body.surgicalHistory : [],
      familyHistory: Array.isArray(body.familyHistory) ? body.familyHistory : [],
      lifestyle: body.lifestyle || {},
      status: body.status || 'Stable'
    });

    // If medications were passed during creation, store them
    if (Array.isArray(body.medications)) {
      for (const med of body.medications) {
        if (med.name && med.name.trim()) {
          db.createMedication({
            patientId: patient.id,
            name: med.name.trim(),
            dosage: med.dosage || 'Standard dose',
            frequency: med.frequency || 'Once daily',
            startDate: med.startDate || new Date().toISOString().split('T')[0],
            status: 'Active'
          });
        }
      }
    }

    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ success: false, error: 'Failed to create patient record' }, { status: 500 });
  }
}
