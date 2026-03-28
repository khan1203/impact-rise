import { NextResponse } from 'next/server';
import { getInitiatives } from '@/lib/db';

export async function GET() {
  try {
    const seminars = await getInitiatives('seminar');
    return NextResponse.json(seminars);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
