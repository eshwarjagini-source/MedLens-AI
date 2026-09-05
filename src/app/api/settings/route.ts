import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const hasApiKey = Boolean(process.env.OPENAI_API_KEY || process.env.AI_API_KEY);
    return NextResponse.json({
      success: true,
      data: {
        hasApiKey,
        mode: hasApiKey ? 'Live AI Engine' : 'Intelligent Clinical Demo Engine',
        version: '1.0.4 - Clinical Intelligence Suite',
        databaseEngine: 'Persistent Relational Store (JSON/SQLite)',
        hipaaComplianceMode: 'Strict Privacy Sandboxed'
      }
    });
  } catch (error) {
    console.error('Error fetching settings status:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'reset_database') {
      db.resetDatabase();
      return NextResponse.json({
        success: true,
        message: 'Clinical database successfully reset to factory demo records.'
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error executing settings action:', error);
    return NextResponse.json({ success: false, error: 'Action failed' }, { status: 500 });
  }
}
