import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const results = db.searchAll(query);
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Error during global search:', error);
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
  }
}
