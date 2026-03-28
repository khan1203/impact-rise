import { NextResponse } from 'next/server';
import { getInitiatives } from '@/lib/db';

export async function GET() {
  try {
    const workshops = await getInitiatives('workshop');
    return NextResponse.json(workshops);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
